import { Controller, Get, Post, Delete, Put, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { pool } from './pool';
import { Response } from 'express';

const DB_NAME: string = 'contract';

@Controller(DB_NAME)
export class ContractController {
  
    @Get()
    findAll(@Res() response: Response) {
        let query: string = `SELECT * FROM ${DB_NAME};`;
        console.log(query);
        pool.query(query, (err, res) => {
            if (err) {
                console.log(err);
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            } else {
                console.log(`GET ${DB_NAME} OK`);
                response.status(HttpStatus.OK).json(res.rows);
            }
        });
    }

    @Post()
    create(@Body() values: any, @Res() response: Response) {
        console.log(values);
        if (values.name && typeof(values.name) == "string") {
            let query: string = `INSERT INTO ${DB_NAME} (name) values ('${values.name}');`;
            console.log(query);
            pool.query(query, (err, res) => {
                if (err) {
                    console.log(err);
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
                } else {
                    console.log(`GET ${DB_NAME} OK`);
                    response.status(HttpStatus.OK).send(`${DB_NAME} added`);
                }
            });
        } else {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(`ERROR: values = \n${values}`);
        }
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Res() response: Response) {
        let query: string = `DELETE FROM ${DB_NAME} WHERE name = '${id}';`;
        console.log(query);
        pool.query(query, (err, res) => {
            if (err) {
                console.log(err);
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            } else {
                console.log(`DELETE ${id} from ${DB_NAME} OK`);
                response.status(HttpStatus.OK).send(`${id} deleted`);
            }
        });
    }

    @Put(':id')
    update(@Param('id') id: string, @Res() response: Response, @Body() values: any) {
        let query: string = `UPDATE ${DB_NAME} SET name = '${values.name}' WHERE name = '${id}';`;
        console.log(query);
        pool.query(query, (err, res) => {
            if (err) {
                console.log(err);
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            } else {
                console.log(`DELETE ${id} from ${DB_NAME} OK`);
                response.status(HttpStatus.OK).send(`${id} updated`);
            }
        });
    }

}