// backend/src/services/forumService.ts
import ForumThread, { IForumThread } from '../models/ForumThread';
import ForumPost, { IForumPost } from '../models/ForumPost';
import { createNotification } from './notificationService';
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_BASE_URL = process.env.OPENROUTER_API_BASE_URL || 'https://openrouter.ai/api/v1';

export const createThread = async (title: string, content: string, authorId: string, groupId?: string): Promise<IForumThread> => {
  const thread = new ForumThread({ title, content, author: authorId, group: groupId });
  await thread.save();
  return thread;
};

export const getThreads = async (groupId?: string): Promise<IForumThread[]> => {
  const query = groupId ? { group: groupId } : {};
  return ForumThread.find(query).populate('author', 'firstName lastName').sort({ lastReplyAt: -1 });
};

export const getThreadById = async (threadId: string): Promise<IForumThread | null> => {
  return ForumThread.findById(threadId).populate('author', 'firstName lastName');
};

const extractMentions = (content: string): string[] => {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g; // Matches @username
  const mentions: string[] = [];
  let match;
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  return mentions;
};

export const addReply = async (threadId: string, content: string, authorId: string, images?: string[]): Promise<IForumPost> => {
  const mentionedUsernames = extractMentions(content);
  const mentionedUserIds: mongoose.Types.ObjectId[] = [];

  // Find IDs for mentioned usernames
  if (mentionedUsernames.length > 0) {
    const users = await mongoose.model('User').find({ firstName: { $in: mentionedUsernames } }, '_id');
    users.forEach(user => mentionedUserIds.push(user._id));
  }

  const post = new ForumPost({ thread: threadId, content, author: authorId, mentions: mentionedUserIds, images });
  await post.save();

  const thread = await ForumThread.findByIdAndUpdate(threadId, { lastReplyAt: new Date() }, { new: true }).populate('author');

  if (thread && (thread.author as any)._id.toString() !== authorId) {
    // Notify thread author of new reply
    await createNotification(
      (thread.author as any)._id.toString(),
      'reply',
      `"${(await mongoose.model('User').findById(authorId))?.firstName}" replied to your thread "${thread.title}"`,
      `/forums/${threadId}`,
      threadId
    );
  }

  // Notify mentioned users
  for (const mentionedUserId of mentionedUserIds) {
    if (mentionedUserId.toString() !== authorId) { // Don't notify if user mentions themselves
      await createNotification(
        mentionedUserId.toString(),
        'mention',
        `You were mentioned in a post in thread "${thread?.title}"`,
        `/forums/${threadId}`,
        threadId
      );
    }
  }

  return post;
};

export const getPostsForThread = async (threadId: string): Promise<IForumPost[]> => {
  return ForumPost.find({ thread: threadId }).populate('author', 'firstName lastName').sort({ createdAt: 1 });
};

export const upvotePost = async (postId: string): Promise<IForumPost | null> => {
  return ForumPost.findByIdAndUpdate(postId, { $inc: { upvotes: 1 } }, { new: true });
};

export const acceptAnswer = async (threadId: string, postId: string): Promise<IForumPost | null> => {
  // First, unmark any existing accepted answer for this thread
  await ForumPost.updateMany({ thread: threadId, isAcceptedAnswer: true }, { isAcceptedAnswer: false });
  // Then, mark the new post as the accepted answer
  return ForumPost.findByIdAndUpdate(postId, { isAcceptedAnswer: true }, { new: true });
};

export const summarizeThread = async (threadId: string): Promise<string> => {
    const thread = await getThreadById(threadId);
    if (!thread) {
        throw new Error('Thread not found');
    }

    const posts = await getPostsForThread(threadId);
    const textToSummarize = thread.content + '\n' + posts.map(p => p.content).join('\n');

    try {
        const response = await axios.post(
            `${OPENROUTER_API_BASE_URL}/chat/completions`,
            {
                model: "openai/gpt-3.5-turbo", // You can specify other models available on OpenRouter
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that summarizes forum threads."
                    },
                    {
                        role: "user",
                        content: `Summarize the following forum thread:\n\n${textToSummarize}`
                    }
                ],
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.choices[0].message.content ?? "";
    } catch (error: any) {
        console.error('Error summarizing thread with OpenRouter:', error.response?.data || error.message);
        throw new Error(`Failed to summarize thread: ${error.response?.data?.message || error.message}`);
    }
}