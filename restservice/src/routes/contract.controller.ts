import { Controller, Get, Post, Delete, Put, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { pool } from './pool';
import { Response } from 'express';

const DB_TABLE_NAME: string = 'contract';

function getQuery (oValue: any): string {
    let names: string = '';
    let values: string = '';
    for (let key in oValue) {
        if (oValue[key] != undefined && oValue[key] != null) {
            if (oValue[key][0] == '@') {
                oValue[key] = oValue[key].slice(1).replace(/(\d+).(\d+).(\d+)/g,'$3-$2-$1');
            }
            names  += `${key},`;
            values += `'${oValue[key]}',`;
        }
    }
    return `INSERT INTO ${DB_TABLE_NAME} (${
        names.slice(0,names.length - 1)
    }) VALUES (${
        values.slice(0,values.length - 1)
    });`;
}

function checkQuery (oValue: any): boolean {
    return oValue.ContractNumber &&
    oValue.ContractDate          &&
    oValue.ContractType          &&
    oValue.id_provider           &&
    oValue.id_payer              &&  
    oValue.currency              &&
    oValue.filepath
}

async function findPosition (sTableName, sFindFieldName, sFieldName, sFieldValue: string) {
    if (!sTableName || !sFindFieldName || !sFieldName || !sFieldValue) {
        throw 'Field undefined';
    }
    let query: string = `SELECT ${sTableName}.${sFindFieldName} FROM ${sTableName} WHERE ${sFieldName} = '${sFieldValue}';`;
    console.log(query);
    return await pool.query(query);
}

@Controller(DB_TABLE_NAME)
export class ContractController {
  
    @Get()
    findAll(@Res() response: Response) {
        let query: string = `SELECT * FROM ${DB_TABLE_NAME};`;
        console.log(query);
        pool.query(query, (err, res) => {
            if (err) {
                console.log(err);
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            } else {
                console.log(`GET ${DB_TABLE_NAME} OK`);
                response.status(HttpStatus.OK).json(res.rows);
            }
        });
    }

    @Get(':id')
    find(@Param('id') id: string, @Res() response: Response) {
        let query: string = `SELECT * FROM ${DB_TABLE_NAME} WHERE ContractNumber = '${id}';`;
        console.log(query);
        pool.query(query, (err, res) => {
            if (err) {
                console.log(err);
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            } else {
                console.log(`GET ${DB_TABLE_NAME} OK`);
                response.status(HttpStatus.OK).json(res.rows);
            }
        });
    }

    @Post()
    create(@Body() values: any, @Res() response: Response) {
        findPosition ('Person', 'id', 'Name', values.provider)
        .then(res => {
            if (res.rows == undefined || res.rows.length == 0 || res.rows[0].id == undefined) {
                throw `provider = ${values.provider} not found`;
            }
            values.id_provider = res.rows[0].id;
            values.provider    = null;
            return findPosition ('Person', 'id', 'Name', values.payer);
        })
        .then(res => {
            if (res.rows == undefined || res.rows.length == 0 || res.rows[0].id == undefined) {
                throw `payer = ${values.payer} not found`;
            }
            values.id_payer = res.rows[0].id;
            values.payer    = null;
            if (checkQuery(values)) {
                console.log(values)
                return pool.query(getQuery(values));
            } else {
                throw values;
            }
        })
        .then(res => {
            response.status(HttpStatus.OK).send(`${DB_TABLE_NAME} added`);
        })
        .catch(function(e) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
            console.log(e);
        })
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Res() response: Response) {
        let query: string = `DELETE FROM ${DB_TABLE_NAME} WHERE ContractNumber = '${id}';`;
        console.log(query);
        pool.query(query, (err, res) => {
            if (err) {
                console.log(err);
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            } else {
                console.log(`DELETE ${id} from ${DB_TABLE_NAME} OK`);
                response.status(HttpStatus.OK).send(`${id} deleted`);
            }
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
        pool.query(query, (err, res) => {
            if (err) {
                console.log(err);
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            } else {
                console.log(`DELETE ${id} from ${DB_TABLE_NAME} OK`);
                response.status(HttpStatus.OK).send(`${id} updated`);
            }
        });
    }
    
}