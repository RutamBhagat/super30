import { createOrderSchema } from '@/schema/order';
import { buyOrder, cancelOrder, sellOrder } from '@/services/order-services';
import { createHandler } from '@/utils/create';

export const handleSellOrder = createHandler(createOrderSchema, async (req, res) => {
  const { userId, stockSymbol, quantity, price, stockType } = req.body;
  await sellOrder({ userId, stockSymbol, quantity, price, stockType });
  res.status(200).json({ message: `Sell order placed for ${quantity} '${stockType}' options at price ${price}.` });
});

export const handleBuyOrder = createHandler(createOrderSchema, async (req, res) => {
  const { userId, stockSymbol, quantity, price, stockType } = req.body;
  await buyOrder({ userId, stockSymbol, quantity, price, stockType });
  res.status(200).json({ message: 'Buy order placed and trade executed' });
});

export const handleCancelOrder = createHandler(createOrderSchema, async (req, res) => {
  const { userId, stockSymbol, quantity, price, stockType } = req.body;
  await cancelOrder({ userId, stockSymbol, quantity, price, stockType });
  res.status(200).json({ message: 'Sell order canceled' });
});
