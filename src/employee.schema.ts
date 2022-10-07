import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type employeeDocument = employee & Document;

@Schema()
export class employee {
  @Prop()
  name: string;

  @Prop()
  email: string;
}

export const employeeSchema = SchemaFactory.createForClass(employee);
