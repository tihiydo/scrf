import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Sanya 14.08.2024 :)';
  }
}
