import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ContractController }          from './routes/contract.controller';
import { PersonController }            from './routes/person.controller';
import { ContractStageController }     from './routes/contractStage.controller';
import { InvoiceController }           from './routes/invoice.controller';
import { ExecutionDocumentController } from './routes/executionDOcument.controller';

@Module({
  imports: [],
  controllers: [
    AppController, 
    ContractController, 
    PersonController,
    ContractStageController,
    InvoiceController,
    ExecutionDocumentController
  ],
  providers: [AppService],
})
export class AppModule {};
