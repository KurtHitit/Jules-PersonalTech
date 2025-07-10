// backend/src/controllers/orderController.ts
import { Request, Response } from 'express';
import Order from '../models/Order';

export const getBuyerOrders = async (req: Request, res: Response): Promise<void> => {
  const buyerId = req.user!.id;
  try {
    const orders = await Order.find({ buyer: buyerId }).populate('listing').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting buyer orders', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting buyer orders', error: 'Unknown error' });
    }
  }
};

export const getSellerOrders = async (req: Request, res: Response): Promise<void> => {
  const sellerId = req.user!.id;
  try {
    const orders = await Order.find({ seller: sellerId }).populate('listing').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting seller orders', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting seller orders', error: 'Unknown error' });
    }
  }
};
