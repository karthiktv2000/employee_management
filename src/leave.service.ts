import { HttpException, HttpStatus, Injectable, Res, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { leaveDto } from "./dto/leave.dto";
import { employee, employeeDocument } from "./employee.schema";
import { leave, leaveDocument } from "./leave.schema";

@Injectable()
export class leaveService {

    constructor(
    @InjectModel(leave.name) private leaveModel: Model<leaveDocument>,
    @InjectModel(employee.name) private employeeModel: Model<employeeDocument>,
    private readonly jwtService: JwtService,
  ) {}
    
     async getAll(req,res){
      try{
        const ver = this.jwtService.verify(req.cookies.logout_cookie);
        if (!ver) {
          throw new UnauthorizedException();
        }
        res.send(await this.leaveModel.find({email:ver.email}));

      } catch(err) {
        res.send(err)
      }}
    

     async applyLeave(
      newLeave,req, res){
      try{
        const ver = this.jwtService.verify(req.cookies.logout_cookie);
        if (!ver) {
        throw new UnauthorizedException();
        }
        const emp = await this.employeeModel.findOne({email: ver.email})
        if(emp.availableLeaves<1){
          throw new HttpException({
            error: 'No available leaves',
          }, HttpStatus.BAD_REQUEST);
          
        }
        const dat = new Date(newLeave.leave_date)
        if(dat.getTime()<Date.now()){
          throw new HttpException({
            error: "Cannot apply leave for older dates"
          }, HttpStatus.BAD_REQUEST)
          
        }
        const lev = await new this.leaveModel({email:ver.email, ...newLeave})
        await lev.save()
        emp.availableLeaves= emp.availableLeaves-1
        emp.save()
        res.send(lev)
      }catch(err){
        res.status(400).send(err)
      }
    }

}