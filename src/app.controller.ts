import { Body, Controller, Get, Post, Put, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { registrationDTO } from './dto/employee.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getemployee() {
    return this.appService.getemployee();
  }
  @Post()
  public async postemployee(
    @Body() empdetails: registrationDTO,
    @Res() res: Response,
  ) {
    return await this.appService.postemployee(empdetails, res);
  }
  @Post('login')
  public async login(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.appService.login(body, req, res);
  }
  @Get('dashboard')
  public async dashboard(@Req() req: Request, @Res() res: Response) {
    this.appService.dashboard(req, res);
  }
  @Get('logout')
  public async logout(@Req() req: Request, @Res() res: Response) {
    this.appService.logout(req, res);
  }
  @Put('leave')
  public async leave(@Req() req: Request, @Res() res: Response) {
    this.appService.leave(req, res);
  }
}
