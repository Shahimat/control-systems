import { Controller, Get } from '@nestjs/common';

@Controller('contract')
export class ContractController {
  @Get()
  findAll(): string {
    return 'CONTRACT GET';
  }
}