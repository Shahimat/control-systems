import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { pool } from './../pool';
import { Response } from 'express';

@Controller('person')
export class PersonController {
  
    @Get()
    findAll(@Res() response: Response) {
        let query: string = `SELECT * FROM person;`;
        console.log(query);
        pool.query(query, (err, res) => {
            if (err) {
                console.log(err);
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            } else {
                console.log('GET person OK');
                response.status(HttpStatus.OK).json(res.rows);
            }
        });
    }

    @Post()
    create(@Body() values: any, @Res() response: Response) {
        console.log(values);
        if (values.name && typeof(values.name) == "string") {
            let query: string = `INSERT INTO person (name) values ('${values.name}');`;
            console.log(query);
            pool.query(query, (err, res) => {
                if (err) {
                    console.log(err);
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
                } else {
                    console.log('GET person OK');
                    response.status(HttpStatus.OK).send('person added');
                }
            });
        } else {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(`ERROR: values.name = ${values.name}`);
        }
    }

}