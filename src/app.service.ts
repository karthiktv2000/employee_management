import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { employee, employeeDocument } from './employee.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(employee.name) private employeeModel: Model<employeeDocument>,
  ) {}
  public async getemployee() {
    const emp = await this.employeeModel.find().exec();
    return emp;
  }
  public async postemployee(newemp: {
    readonly name: string;
    readonly email: string;
  }) {
    const emp = await new this.employeeModel(newemp);
    return emp.save();
  }
}
