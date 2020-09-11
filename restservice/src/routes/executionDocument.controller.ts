import { Controller, Get, Post, Delete, Put, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { pool } from './pool';
import { Response } from 'express';
import { getInsertQuery, checkQuery, findPosition } from './functions';

const DB_TABLE_NAME: string = 'ExecutionDocument';
const DB_TABLE_FIELDS: string[] = [
    'Number',
    'DocDate',
    'DocType',
    'ExecCurrency',
    'filepath'
];

@Controller(DB_TABLE_NAME)
export class ExecutionDocumentController {
  
    @Get()
    findAll(@Res() response: Response) {
        findPosition(DB_TABLE_NAME)
        .then(res => {
            console.log(`GET ${DB_TABLE_NAME} OK`);
            response.status(HttpStatus.OK).json(res.rows);
        })
        .catch(err => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            console.log(err);
        });
    }

    @Get(':id')
    find(@Param('id') id: string, @Res() response: Response) {
        findPosition(DB_TABLE_NAME, [], 'Number', `'${id}'`)
        .then(res => {
            console.log(`GET ${DB_TABLE_NAME} OK`);
            response.status(HttpStatus.OK).json(res.rows);
        })
        .catch(err => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            console.log(err);
        });
    }

    @Post()
    create(@Body() values: any, @Res() response: Response) {
        if (!checkQuery(values, DB_TABLE_FIELDS)) {
            throw values;
        }
        pool.query(getInsertQuery(values, DB_TABLE_NAME))
        .then(res => {
            response.status(HttpStatus.OK).send(`${DB_TABLE_NAME} added`);
        })
        .catch(err => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            console.log(err);
        })
    }

    @Post(':id')
    createRelations(@Param('id') id: string, @Body() values: any, @Res() response: Response) {
        let data: any = {
            id_invoice: '',
            id_execution_document: ''
        }
        if (!values.invoicePosition) {
            throw 'ERROR: expected values.invoicePosition';
        }
        findPosition(DB_TABLE_NAME, [], 'Number', `'${id}'`)
        // pool.query(getInsertQuery(values, DB_TABLE_NAME))
        .then(res => {
            if (res.rows == undefined || res.rows.length == 0 || res.rows[0].id == undefined) {
                throw `Number = ${id} not found`;
            }
            data.id_execution_document = res.rows[0].id;
            return findPosition('Invoice', [], 'InvoicePosition', `'${values.invoicePosition}'`);
        })
        .then(res => {
            if (res.rows == undefined || res.rows.length == 0 || res.rows[0].id == undefined) {
                throw `invoicePosition = ${values.invoicePosition} not found`;
            }
            data.id_invoice = res.rows[0].id;
            return pool.query(getInsertQuery(data, 'MAP_Invoice_ExecutionDocument'));
        })
        .then(res => {
            response.status(HttpStatus.OK).send(`${DB_TABLE_NAME} added`);
        })
        .catch(err => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            console.log(err);
        })
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Res() response: Response) {
        let id_execdoc: string;
        let query: string = `DELETE FROM ${DB_TABLE_NAME} WHERE Number = '${id}';`;
        console.log(query);
        findPosition(DB_TABLE_NAME, [], 'Number', `'${id}'`)
        .then(res => {
            if (res.rows == undefined || res.rows.length == 0 || res.rows[0].id == undefined) {
                throw `Number = ${id} not found`;
            }
            id_execdoc = res.rows[0].id;
            return pool.query(`DELETE FROM MAP_Invoice_ExecutionDocument WHERE id_execution_document = '${id_execdoc}';`);
        })        
        .then(res => {
            return pool.query(query);
        })        
        .then(res => {
            console.log(`DELETE ${id} from ${DB_TABLE_NAME} OK`);
            response.status(HttpStatus.OK).send(`${id} deleted`);
        })
        .catch(err => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            console.log(err);
        });
    }

    @Put(':id')
    update(@Param('id') id: string, @Res() response: Response, @Body() values: any) {
        if (!values.fieldName || !values.fieldValue) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('ERROR: please set fieldName & fieldValue params');
            return;
        }
        let query: string = `UPDATE ${DB_TABLE_NAME} SET ${values.fieldName} = '${values.fieldValue}' WHERE Number = '${id}';`;
        console.log(query);
        pool.query(query) 
        .then(res => {
            console.log(`UPDATE ${id} from ${DB_TABLE_NAME} OK`);
            response.status(HttpStatus.OK).send(`${id} updated`);
        })
        .catch(err => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            console.log(err);
        });
    }
    
}