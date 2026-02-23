import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Backend Live - v1.1 (CORS Optimized)';
  }
}
