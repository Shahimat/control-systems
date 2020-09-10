import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ContractController }      from './routes/contract.controller';
import { PersonController }        from './routes/person.controller';
import { ContractStageController } from './routes/contractStage.controller';

@Module({
  imports: [],
  controllers: [
    AppController, 
    ContractController, 
    PersonController,
    ContractStageController
  ],
  providers: [AppService],
})
export class AppModule {};
