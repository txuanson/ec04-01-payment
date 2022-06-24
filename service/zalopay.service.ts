import { IPayment } from "./payment";
import axios from 'axios';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';
import { IItem, IOrder } from "../models/order.model";
import crypto from 'crypto';

const date = format(new Date(), 'yyMMdd', { locale: vi })

export default class ZaloPay implements IPayment {
  readonly endpoint: string = process.env.ZALOPAY_ENDPOINT;

  async makeOrder(payload: IOrder): Promise<string> {
    const items = JSON.stringify(payload.items);
    const embedData = JSON.stringify({
      redirecturl: ''
    });
    
    try {
      const request = await axios.post(`${this.endpoint}/create`, {
        app_id: parseInt(process.env.ZALOPAY_APP_ID),
        app_user: process.env.ZALOPAY_APP_USER,
        app_trans_id: `${date}_${payload.id}`,
        app_time: payload.createdAt.getTime(),
        amount: payload.total,
        item: items,
        description: `EC04-01 DEMO - #${payload.id}`,
        embed_data: embedData,
        mac: this.createSignature(
          process.env.ZALOPAY_APP_ID,
          `${date}_${payload.id}`,
          process.env.ZALOPAY_APP_USER,
          payload.total,
          payload.createdAt.getTime(), embedData, items)
      })

      console.log(request.data)
      return request.data.order_url;
    } catch (error) {
      console.log(error)
    }

  }

  createSignature(app_id: string, app_trans_id: string, app_user, amount: number, app_time: number, embed_data: string, item: string): string {
    return crypto.createHmac('sha256', process.env.ZALOPAY_KEY1)
      .update(`${app_id}|${app_trans_id}|${app_user}|${amount}|${app_time}|${embed_data}|${item}`).digest('hex')
  }
}