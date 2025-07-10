// mobile/src/services/forumService.ts
import apiClient from './apiClient';
import { IForumThread } from '../../../backend/src/models/ForumThread';
import { IForumPost } from '../../../backend/src/models/ForumPost';

export type ForumThread = IForumThread;
export type ForumPost = IForumPost;

export const createThread = async (title: string, content: string, groupId?: string): Promise<ForumThread> => {
  const response = await apiClient.post('/forums', { title, content, groupId });
  return response.data;
};

export const getThreads = async (groupId?: string): Promise<ForumThread[]> => {
  const response = await apiClient.get('/forums', { params: { groupId } });
  return response.data;
};

export const getThreadById = async (threadId: string): Promise<{ thread: ForumThread; posts: ForumPost[] }> => {
  const response = await apiClient.get(`/forums/${threadId}`);
  return response.data;
};

export const addReply = async (threadId: string, content: string, images?: string[]): Promise<ForumPost> => {
  const response = await apiClient.post(`/forums/${threadId}/replies`, { content, images });
  return response.data;
};

export const upvotePost = async (postId: string): Promise<ForumPost> => {
  const response = await apiClient.post(`/forums/posts/${postId}/upvote`);
  return response.data;
};

export const acceptAnswer = async (threadId: string, postId: string): Promise<ForumPost> => {
  const response = await apiClient.post(`/forums/${threadId}/posts/${postId}/accept-answer`);
  return response.data;
};

export const summarizeThread = async (threadId: string): Promise<{ summary: string }> => {
    const response = await apiClient.get(`/forums/${threadId}/summarize`);
    return response.data;
};
