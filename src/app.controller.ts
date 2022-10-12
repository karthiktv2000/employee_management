import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { registrationDTO } from './dto/employee.dto';
import { leaveService } from './leave.service';
import { Request, Response} from 'express';
import { leaveDto } from './dto/leave.dto';

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
  
  @Get('leaves')
  public async leaves(@Req() req: Request, @Res() res: Response) {
    try{
      return this.leaveService.getAll(req,res);
  } catch(err){
    return (err)
  }}

  @Post('leaves/Apply')
  public async leavesApply(
    @Body() newLeave: leaveDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try{
      return this.leaveService.applyLeave(newLeave,req,res);
  } catch(err){
    return (err)
  }
      
  @Post('logout')
  public async logout(@Req() req: Request, @Res() res: Response) {
    this.appService.logout(req, res);
  }
}

///first edit
