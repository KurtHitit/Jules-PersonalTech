// backend/src/controllers/paymentController.ts
import { Request, Response } from 'express';
import * as paymentService from '../services/paymentService';

export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  const buyerId = req.user!.id;
  const { listingId } = req.body;

  try {
    const { clientSecret, orderId } = await paymentService.createPaymentIntent(listingId, buyerId);
    res.status(200).json({ clientSecret, orderId });
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error creating payment intent', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error creating payment intent', error: 'Unknown error' });
    }
  }
};

export const confirmPayment = async (req: Request, res: Response): Promise<void> => {
  const { paymentIntentId } = req.body;

  try {
    const order = await paymentService.confirmPayment(paymentIntentId);
    res.status(200).json({ message: 'Payment confirmed successfully', order });
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error confirming payment', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error confirming payment', error: 'Unknown error' });
    }
  }
};
