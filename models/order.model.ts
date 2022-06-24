import mongoose, { Document } from 'mongoose';

export const OrderStatus = {
  PROCESSING: 'PROCESSING',
  PAYMENT_SUCCEEDED: 'PAYMENT_SCCEEDED',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
  ERRORED: 'ERRORED',
}

export interface IItem {
  name: string, photo: string, price: number, quantity: number
}

const OrderSchema = new mongoose.Schema({
  total: Number,
  userName: String,
  paymentMethod: String,
  status: { type: String, default: OrderStatus.PROCESSING },
  items: [{
    name: String,
    quantity: Number,
    photo: String,
    price: Number
  }],
  itemsPrice: Number,
  shipping: Number,
  address: String
}, { timestamps: true, versionKey: false });

export interface IOrder extends Document {
  paymentMethod: string;
  userName: string;
  status: string;
  items: IItem[],
  itemsPrice: number;
  shipping: number;
  total: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Order = mongoose.model<IOrder>('order', OrderSchema, 'order');