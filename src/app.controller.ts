import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getemployee() {
    return this.appService.getemployee();
  }
  @Post()
  public async postemployee(
    @Body() empdetails: { readonly name: string; readonly email: string },
  ) {
    return await this.appService.postemployee(empdetails);
  }
}

///first edit
///second edit
