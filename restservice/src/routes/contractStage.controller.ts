import { Controller, Get, Post, Delete, Put, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { pool } from './pool';
import { Response } from 'express';
import { getInsertQuery, checkQuery, findPosition } from './functions';

const DB_TABLE_NAME: string = 'contractstage';
const DB_TABLE_FIELDS: string[] = [
    'Name',
    'StageDateBegin',
    'StageDateEnd',
    'Unit',
    'Ammount',
    'Quantity',
    'filepath'
];

@Controller(DB_TABLE_NAME)
export class ContractStageController {
  
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
        findPosition(DB_TABLE_NAME, [], 'Name', `'${id}'`)
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
        let data = {
            id_contract: 0,
            id_contract_stage: 0
        };
        findPosition ('Contract', ['id'], 'ContractNumber', `'${values.contractNumber}'`)
        .then(res => {
            if (res.rows == undefined || res.rows.length == 0 || res.rows[0].id == undefined) {
                throw `ContractNumber = ${values.contractNumber} not found`;
            }
            data.id_contract = res.rows[0].id;
            values.contractNumber = null;
            if (!checkQuery(values, DB_TABLE_FIELDS)) {
                throw values;
            }
            // console.log(getInsertQuery(values, DB_TABLE_NAME));
            return pool.query(getInsertQuery(values, DB_TABLE_NAME));
        })
        .then(res => {
            return findPosition ('ContractStage', ['id'], 'Name', `'${values.Name}'`)
        })
        .then(res => {
            if (res.rows == undefined || res.rows.length == 0 || res.rows[0].id == undefined) {
                throw `Name = ${values.Name} not found`;
            }
            data.id_contract_stage = res.rows[0].id;
            return pool.query(getInsertQuery(data, 'MAP_Contract_ContractStage'));
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
        let id_contract_stage: number = 0;
        findPosition ('ContractStage', ['id'], 'Name', `'${id}'`)
        .then(res => {
            if (res.rows == undefined || res.rows.length == 0 || res.rows[0].id == undefined) {
                throw `Name = ${id} not found`;
            }
            id_contract_stage = res.rows[0].id;
            let query: string = `DELETE FROM MAP_Contract_ContractStage WHERE id_contract_stage = '${id_contract_stage}';`;
            console.log(query);
            return pool.query(query);
        })
        .then(res => {
            return pool.query(`DELETE FROM ${DB_TABLE_NAME} WHERE id = '${id_contract_stage}';`);
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
        let query: string = `UPDATE ${DB_TABLE_NAME} SET ${values.fieldName} = '${values.fieldValue}' WHERE Name = '${id}';`;
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