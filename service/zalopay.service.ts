import { IPayment } from "./payment";
import axios from 'axios';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';
import { IItem, IOrder, Order, OrderStatus } from "../models/order.model";
import crypto from 'crypto';
import { Types } from "mongoose";
import makeDbConnection from "../makeDbConnection";


export default class ZaloPay implements IPayment {
  readonly endpoint: string = process.env.ZALOPAY_ENDPOINT;

  async makeOrder(payload: IOrder): Promise<string> {
    const items = JSON.stringify(payload.items);
    const embedData = JSON.stringify({
      redirecturl: process.env.PAYMENT_REDIRECT_URI,
      orderId: payload.id
    });

    const date = format(new Date(), 'yyMMdd', { locale: vi });
    const currentTimestamp = Date.now();

    try {
      const request = await axios.post(`${this.endpoint}/create`, {
        app_id: parseInt(process.env.ZALOPAY_APP_ID),
        app_user: payload.userName,
        app_trans_id: `${date}_${payload.id}`,
        app_time: currentTimestamp,
        amount: payload.total,
        item: items,
        description: `EC04-01 DEMO - #${payload.id}`,
        embed_data: embedData,
        callback_url: process.env.ZALOPAY_HOOK_URI,
        mac: this.createSignature(
          process.env.ZALOPAY_APP_ID,
          `${date}_${payload.id}`,
          payload.userName,
          payload.total,
          currentTimestamp, embedData, items)
      })

      console.log(request.data)
      return request.data.order_url;
    } catch (error) {
      console.log(error)
    }

  }

  async processCallback(payload: any): Promise<any> {
    if (!this.verifySignature(payload.mac, payload.data)) {
      return {
        return_code: 2,
        return_message: 'Signature invalid!'
      }
    }

    try {
      const data = JSON.parse(payload.data);
      console.log(data)
      const embed_data = JSON.parse(data.embed_data)
      console.log(embed_data);
      await makeDbConnection();
      await Order.updateOne({ _id: embed_data.orderId }, { status: OrderStatus.PAYMENT_SUCCEEDED }).exec();
      return {
        return_code: 1,
        return_message: 'Success!'
      }
    } catch (error) {
      console.error(error);
      return {
        return_code: -1,
        return_message: 'Something wrong!'
      }
    }
  }

  createSignature(app_id: string, app_trans_id: string, app_user, amount: number, app_time: number, embed_data: string, item: string): string {
    return crypto.createHmac('sha256', process.env.ZALOPAY_KEY1)
      .update(`${app_id}|${app_trans_id}|${app_user}|${amount}|${app_time}|${embed_data}|${item}`).digest('hex')
  }

  verifySignature(mac: string, data: string): boolean {
    return crypto.createHmac('sha256', process.env.ZALOPAY_KEY2)
      .update(data).digest('hex') == mac;
  }
}