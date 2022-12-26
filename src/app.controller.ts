import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Organization } from 'src/entities/organization.entity';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
