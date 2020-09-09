import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ContractController } from './routes/contract.controller';
import { PersonController } from './routes/person.controller';

@Module({
  imports: [],
  controllers: [
    AppController, 
    ContractController, 
    PersonController
  ],
  providers: [AppService],
})
export class AppModule {};
