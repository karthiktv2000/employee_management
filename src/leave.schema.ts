import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { Date, Document, now } from 'mongoose';
import { employee } from './employee.schema'

export type leaveDocument = leave & Document;

@Schema()
export class leave {

  @Prop()
  email: string;

  @Prop({type: Date,required:true})
  // @Transform(x => new Date(x))
  leave_date: Date;

  @Prop({required:true,default: 'Approved'})
  status: string;
  
}

export const leaveSchema = SchemaFactory.createForClass(leave);
