import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type employeeDocument = employee & Document;

@Schema()
export class employee {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: number;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  salary: number;

  @Prop({ required: true })
  role: string;

  @Prop({ default: false })
  leave: boolean;
}

export const employeeSchema = SchemaFactory.createForClass(employee);
