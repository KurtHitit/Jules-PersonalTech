// backend/src/services/paymentService.ts
// import Stripe from 'stripe';
import Order, { IOrder } from '../models/Order';
import Listing, { IListing, PopulatedListing } from '../models/Listing';
import { IUser } from '../models/User';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-06-30.basil',
// });

export const createPaymentIntent = async (listingId: string, buyerId: string): Promise<{ clientSecret: string; orderId: string }> => {
  console.warn("Stripe API is disabled. Returning mock payment intent.");
  return { clientSecret: "mock_client_secret", orderId: "mock_order_id" };
};

export const confirmPayment = async (paymentIntentId: string): Promise<IOrder> => {
  console.warn("Stripe API is disabled. Returning mock order confirmation.");
  // You would typically fetch the order by paymentIntentId and update its status
  const mockOrder: Partial<IOrder> = {
    _id: "mock_order_id" as any,
    listing: "mock_listing_id" as any,
    buyer: "mock_buyer_id" as any,
    seller: "mock_seller_id" as any,
    amount: 0,
    currency: "USD",
    status: "completed",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return mockOrder as IOrder;
};
