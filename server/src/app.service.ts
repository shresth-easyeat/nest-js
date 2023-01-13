import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! I am back';
  }

  getOwner(): string {
    return 'Shresth is the owner of this local page.';
  }
}
