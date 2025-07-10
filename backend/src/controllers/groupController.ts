// backend/src/controllers/groupController.ts
import { Request, Response } from 'express';
import * as groupService from '../services/groupService';

export const createGroup = async (req: Request, res: Response): Promise<void> => {
  const { name, description } = req.body;
  const creatorId = req.user!.id;

  try {
    const group = await groupService.createGroup(name, description, creatorId);
    res.status(201).json(group);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error creating group', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error creating group', error: 'Unknown error' });
    }
  }
};

export const searchGroups = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;

  try {
    const groups = await groupService.searchGroups(query as string);
    res.status(200).json(groups);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error searching groups', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error searching groups', error: 'Unknown error' });
    }
  }
};

export const joinGroup = async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.params;
  const userId = req.user!.id;

  try {
    const group = await groupService.joinGroup(groupId, userId);
    if (group) {
      res.status(200).json(group);
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error joining group', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error joining group', error: 'Unknown error' });
    }
  }
};

export const leaveGroup = async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.params;
  const userId = req.user!.id;

  try {
    const group = await groupService.leaveGroup(groupId, userId);
    if (group) {
      res.status(200).json(group);
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error leaving group', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error leaving group', error: 'Unknown error' });
    }
  }
};
