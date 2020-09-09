import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { pool } from './../pool';
import { Response } from 'express';

@Controller('contract')
export class ContractController {
  
  @Get()
  findAll(@Res() response: Response) {
    let query: string = `SELECT * FROM contract;`;
    console.log(query);
    pool.query(query, (err, res) => {
      if (err) {
        console.log(err);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      } else {
        console.log('GET contract OK');
        response.status(HttpStatus.OK).json(res.rows);
      }
    });
  }
}