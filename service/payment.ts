import { IOrder, PaymentMethod } from "../models/order.model";
import ZaloPay from "./zalopay.service";

export interface IPayment {
  readonly endpoint: string;

  makeOrder(payload: IOrder): Promise<string>

  processCallback(payload: any): Promise<any>
}

export function getPaymentInstance(type: PaymentMethod): IPayment {
  switch (type) {
    case 'zalopay':
      return new ZaloPay();

    default:
      throw new Error('Payment service not found!')
  }
}