import { IOrder } from "../models/order.model";
import ZaloPay from "./zalopay.service";

export interface IPayment {
  readonly endpoint: string;

  makeOrder(payload: IOrder): Promise<string>

}

export function getPaymentInstance(type: string): IPayment {
  switch (type) {
    case 'zalopay':
      return new ZaloPay();

    default:
      throw new Error('Payment service not found!')
  }
}