// backend/src/services/disputeService.ts
import Dispute, { IDispute } from '../models/Dispute';
import mongoose from 'mongoose';

export interface CreateDisputeDTO {
  orderId: string;
  reason: string;
  description?: string;
}

export interface UpdateDisputeDTO {
  status?: 'open' | 'under_review' | 'resolved_buyer' | 'resolved_seller' | 'closed';
  resolutionNotes?: string;
}

export const createDispute = async (initiatorId: string, data: CreateDisputeDTO): Promise<IDispute> => {
  const newDispute = new Dispute({
    order: new mongoose.Types.ObjectId(data.orderId),
    initiator: new mongoose.Types.ObjectId(initiatorId),
    reason: data.reason,
    description: data.description,
  });
  await newDispute.save();
  return newDispute;
};

export const getDisputeById = async (disputeId: string): Promise<IDispute | null> => {
  return Dispute.findById(disputeId).populate('order initiator');
};

export const getUserDisputes = async (userId: string): Promise<IDispute[]> => {
  return Dispute.find({ initiator: userId }).populate('order').sort({ createdAt: -1 });
};

export const getAllDisputes = async (status?: IDispute['status']): Promise<IDispute[]> => {
  const query: any = {};
  if (status) {
    query.status = status;
  }
  return Dispute.find(query).populate('order initiator').sort({ createdAt: -1 });
};

export const updateDispute = async (disputeId: string, updates: UpdateDisputeDTO): Promise<IDispute | null> => {
  return Dispute.findByIdAndUpdate(disputeId, { $set: updates }, { new: true, runValidators: true });
};
