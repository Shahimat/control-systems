import { Controller, Get, Post, Delete, Put, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { pool } from './pool';
import { Response } from 'express';
import { getInsertQuery, checkQuery, findPosition } from './functions';

const DB_TABLE_NAME: string = 'contract';
const DB_TABLE_FIELDS: string[] = [
    'ContractNumber',
    'ContractDate',
    'ContractType',
    'id_provider',
    'id_payer',
    'currency',
    'filepath'
];

@Controller(DB_TABLE_NAME)
export class ContractController {
  
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
        findPosition(DB_TABLE_NAME, [], 'ContractNumber', `'${id}'`)
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
        findPosition ('Person', ['id'], 'Name', `'${values.provider}'`)
        .then(res => {
            if (res.rows == undefined || res.rows.length == 0 || res.rows[0].id == undefined) {
                throw `provider = ${values.provider} not found`;
            }
            values.id_provider = res.rows[0].id;
            values.provider    = null;
            return findPosition ('Person', ['id'], 'Name', `'${values.payer}'`);
        })
        .then(res => {
            if (res.rows == undefined || res.rows.length == 0 || res.rows[0].id == undefined) {
                throw `payer = ${values.payer} not found`;
            }
            values.id_payer = res.rows[0].id;
            values.payer    = null;
            if (!checkQuery(values, DB_TABLE_FIELDS)) {
                throw values;
            }
            return pool.query(getInsertQuery(values, DB_TABLE_NAME));
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
        let query: string = `DELETE FROM ${DB_TABLE_NAME} WHERE ContractNumber = '${id}';`;
        console.log(query);
        pool.query(query) 
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
        let query: string = `UPDATE ${DB_TABLE_NAME} SET ${values.fieldName} = '${values.fieldValue}' WHERE ContractNumber = '${id}';`;
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