import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import * as mongoose from 'mongoose';

export const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  orders: { type: [String], required: true },
  amount: { type: Number, required: true },
});

export interface Order extends mongoose.Document {
  customerName: string;
  orders: string[];
  amount: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  customerName: string;

  @IsNotEmpty()
  @IsArray()
  orders: string[];

  @IsNumber()
  amount: number;
}
