import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  public async getemployee(em) {
    return await this.employeeModel.find({ _id: em }).exec();
  }
  public async postemployee(
    newemp: {
      readonly name: string;
      readonly email: string;
    },
    res,
  ) {
    const emp = await new this.employeeModel(newemp);
    this.employeeModel.findOne({ email: emp.email }, async (err, data) => {
      if (data == null) {
        emp.password = bcrypt.hashSync(emp.password, 10);
        emp.save();
        res.send('Employee added sucessfuly');
      } else {
        res.send(`${emp.email} is already present please login`);
      }
    });
  }
  public async login(body, req, res) {
    this.employeeModel.find({ email: req.body.email }, (error, data) => {
      try {
        if (error) {
          res.send(error);
        } else {
          bcrypt.compare(req.body.password, data[0].password, (err, result) => {
            if (err) {
              res.send(err.message);
            } else if (result) {
              const payload = { email: req.body.email, name: req.body.name };
              const token = this.jwtService.sign(payload, { expiresIn: '1h' });
              res.cookie('logout_cookie', token);
              res.send(`${req.body.email} logged in sucessfuly`);
            } else {
              throw new HttpException(
                `Invalid password try again`,
                HttpStatus.NOT_FOUND,
              );
            }
          });
        }
      } catch (error) {
        res.end('login again');
      }
    });
  }
  public async dashboard(req, res) {
    try {
      const ver = this.jwtService.verify(req.cookies.logout_cookie);
      console.log(ver);
      if (!ver) {
        //res.status(403).end('Unautherized access');
        //throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        res
          .status(HttpStatus.UNAUTHORIZED)
          .send('Unauthorized please login again');
      }
      const user = await this.employeeModel.findOne({ email: ver.email });
      res.send(user);
    } catch (error) {
      //res.status(403).end(error.message);
      // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      //res.status(HttpStatus.FORBIDDEN).send('You are not allowed to do that');
      res.end('please login again');
    }
  }
  public async leave(req, res) {
    try {
      const ver = this.jwtService.verify(req.cookies.logout_cookie);
      if (!ver) {
        res.status(403).end('Unautherized access');
      }
      this.employeeModel.findOneAndUpdate(
        { email: ver.email },
        { $set: { leave: true } },
        { new: true },
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        },
      );
      res.status(200).end('request sent to admin please wait for the approval');
    } catch (error) {
      console.log(error);
    }
  }
  public async logout(req, res) {
    res.clearCookie('logout_cookie');
    res.end('User logged out sucessfuly');
  }
}
