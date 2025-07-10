// backend/src/services/groupService.ts
import Group, { IGroup } from '../models/Group';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

export const createGroup = async (name: string, description: string, creatorId: string): Promise<IGroup> => {
  const group = new Group({
    name,
    description,
    creator: creatorId,
    members: [creatorId],
  });
  await group.save();
  return group;
};

export const findGroupById = async (groupId: string): Promise<IGroup | null> => {
  return Group.findById(groupId).populate('creator members', 'firstName lastName email');
};

export const searchGroups = async (query: string): Promise<IGroup[]> => {
  return Group.find({ $text: { $search: query } }).populate('creator', 'firstName lastName');
};

export const joinGroup = async (groupId: string, userId: string): Promise<IGroup | null> => {
  const group = await Group.findById(groupId);
  if (group && !group.members.includes(new mongoose.Types.ObjectId(userId))) {
    group.members.push(new mongoose.Types.ObjectId(userId));
    await group.save();
  }
  return group;
};

export const leaveGroup = async (groupId: string, userId: string): Promise<IGroup | null> => {
  const group = await Group.findById(groupId);
  if (group) {
    group.members = group.members.filter(memberId => (memberId as any).toString() !== userId);
    await group.save();
  }
  return group;
};
