import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ContractController } from './contract/contract.controller';

@Module({
  imports: [],
  controllers: [AppController, ContractController],
  providers: [AppService],
})
export class AppModule {};