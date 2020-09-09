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

}