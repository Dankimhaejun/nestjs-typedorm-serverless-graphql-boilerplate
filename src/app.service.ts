import { Injectable } from '@nestjs/common';
import { entityManager } from './main';

@Injectable()
export class AppService {
  constructor() {
    console.log(entityManager);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
