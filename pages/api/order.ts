import { NextApiRequest, NextApiResponse } from "next";
import makeDbConnection from "../../makeDbConnection";
import { IItem, IOrder, Order } from "../../models/order.model";
import { getPaymentInstance } from "../../service/payment";

const shippingPrice = 10000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      await makeDbConnection();

      const { items, paymentMethod }: Partial<IOrder> = req.body;

      const itemsPrice = items.reduce((sum: number, val: IItem) => sum + (val.price * val.quantity), 0);
      const order = await Order.create({
        ...(req.body as IOrder),
        shipping: shippingPrice,
        total: itemsPrice + shippingPrice,
      });

      const paymentEngine = getPaymentInstance(paymentMethod);

      const paymentResponse = await paymentEngine.makeOrder(order);

      return res.status(200).json({ payUrl: paymentResponse });
    default:
      return res.status(404).json({ error: 'ROUTE NOT FOUND' });
  }
}