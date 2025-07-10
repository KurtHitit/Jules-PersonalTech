// backend/src/controllers/forumController.ts
import { Request, Response } from 'express';
import * as forumService from '../services/forumService';

export const createThread = async (req: Request, res: Response): Promise<void> => {
  const { title, content, groupId } = req.body;
  const authorId = req.user!.id;

  try {
    const thread = await forumService.createThread(title, content, authorId, groupId);
    res.status(201).json(thread);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error creating thread', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error creating thread', error: 'Unknown error' });
    }
  }
};

export const getThreads = async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.query;
  try {
    const threads = await forumService.getThreads(groupId as string);
    res.status(200).json(threads);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting threads', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting threads', error: 'Unknown error' });
    }
  }
};

export const getThreadById = async (req: Request, res: Response): Promise<void> => {
  const { threadId } = req.params;
  try {
    const thread = await forumService.getThreadById(threadId);
    if (thread) {
      const posts = await forumService.getPostsForThread(threadId);
      res.status(200).json({ thread, posts });
    } else {
      res.status(404).json({ message: 'Thread not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting thread', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting thread', error: 'Unknown error' });
    }
  }
};

export const addReply = async (req: Request, res: Response): Promise<void> => {
  const { threadId } = req.params;
  const { content, images } = req.body;
  const authorId = req.user!.id;

  try {
    const post = await forumService.addReply(threadId, content, authorId, images);
    res.status(201).json(post);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error adding reply', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error adding reply', error: 'Unknown error' });
    }
  }
};

export const upvotePost = async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;
  try {
    const post = await forumService.upvotePost(postId);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error upvoting post', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error upvoting post', error: 'Unknown error' });
    }
  }
};

export const acceptAnswer = async (req: Request, res: Response): Promise<void> => {
  const { threadId, postId } = req.params;
  try {
    const post = await forumService.acceptAnswer(threadId, postId);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found or not part of this thread' });
    }
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error accepting answer', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error accepting answer', error: 'Unknown error' });
    }
  }
};

export const summarizeThread = async (req: Request, res: Response): Promise<void> => {
    const { threadId } = req.params;
    try {
        const summary = await forumService.summarizeThread(threadId);
        res.status(200).json({ summary });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Server error summarizing thread', error: error.message });
        } else {
            res.status(500).json({ message: 'Server error summarizing thread', error: 'Unknown error' });
        }
    }
}
