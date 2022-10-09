import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { employee, employeeDocument } from './employee.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(employee.name) private employeeModel: Model<employeeDocument>,
    private readonly jwtService: JwtService,
  ) {}
  public async getemployee() {
    const emp = await this.employeeModel.find().exec();
    return emp;
  }

  public async postemployee(
    newemp: {
      readonly name: string;
      readonly email: string;
    },
    res,
  ) {
    const emp = await new this.employeeModel(newemp);
    const user = this.employeeModel.findOne(
      { email: emp.email },
      async (err, data) => {
        if (data == null) {
          emp.password = bcrypt.hashSync(emp.password, 10);
          emp.save();
          res.send('Employee added sucessfuly');
        } else {
          // console.log(data);
          res.send(`${emp.email} is already present please login`);
        }
      },
    );
  }
  public async login(body, req, res) {
    this.employeeModel.find({ email: req.body.email }, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        bcrypt.compare(req.body.password, data[0].password, (err, result) => {
          if (result) {
            const payload = { email: req.body.email, name: req.body.name };
            const token = this.jwtService.sign(payload, { expiresIn: '1h' });

            res.cookie('logout_cookie', token);
            res.send(`${data[0].name} logged in sucessfuly`);
          } else {
            res.send('invalid password');
          }
        });
      }
    });
  }
  public async dashboard(req, res) {
    try {
      const ver = this.jwtService.verify(req.cookies.logout_cookie);
      if (!ver) {
        res.status(403).end('Unauthorized access ');
      }
      const user = await this.employeeModel.findOne({ email: ver.email });
      res.send(user);
    } catch (error) {
      res.status(403).end('Unauthorized access ');
    }
  }
  public async leave(req,res){
    try{
      const ver = this.jwtService.verify(req.cookies.logout_cookie);
      if (!ver) {
        res.status(403).end('Unauthorized access ');
      }
      this.employeeModel.findOneAndUpdate({email: ver.email},{$set:{leave:true}},{new:true},(err,result)=>{
        if (err){console.log(err)}
        else{console.log(result)}
      })
      res.status(200).end("request sent to admin")
    }catch(error){
      console.log(error);
    }
  }

  public async logout(req, res) {
    res.clearCookie('logout_cookie');
    res.end('User logged out sucessfuly');
  }
}




