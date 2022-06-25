import { NextApiRequest, NextApiResponse } from "next";
import { getPaymentInstance } from "../../service/payment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':

      const paymentEngine = getPaymentInstance('zalopay')
      const data = await paymentEngine.processCallback(req.body);

      return res.status(200).json(data)
    default:
      return res.status(404).json({ error: 'ROUTE NOT FOUND' });
  }
}