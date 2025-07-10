// mobile/src/services/groupService.ts
import apiClient from './apiClient';
import { IGroup } from '../../../backend/src/models/Group';

export type Group = IGroup;

export const createGroup = async (name: string, description: string): Promise<Group> => {
  const response = await apiClient.post('/groups', { name, description });
  return response.data;
};

export const searchGroups = async (query: string): Promise<Group[]> => {
  const response = await apiClient.get('/groups/search', { params: { query } });
  return response.data;
};

export const joinGroup = async (groupId: string): Promise<Group> => {
  const response = await apiClient.post(`/groups/${groupId}/join`);
  return response.data;
};

export const leaveGroup = async (groupId: string): Promise<Group> => {
  const response = await apiClient.post(`/groups/${groupId}/leave`);
  return response.data;
};
