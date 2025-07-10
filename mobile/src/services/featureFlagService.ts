// mobile/src/services/featureFlagService.ts
import apiClient from './apiClient';

interface FeatureFlag {
  _id: string;
  name: string;
  isEnabled: boolean;
  description?: string;
}

export const getFeatureFlag = async (name: string): Promise<boolean> => {
  const response = await apiClient.get<{ name: string; isEnabled: boolean }>(`/feature-flags/${name}`);
  return response.data.isEnabled;
};

export const setFeatureFlag = async (name: string, isEnabled: boolean, description?: string): Promise<FeatureFlag> => {
  const response = await apiClient.put<{
    message: string;
    flag: FeatureFlag;
  }>(`/feature-flags/${name}`, { isEnabled, description });
  return response.data.flag;
};

export const getAllFeatureFlags = async (): Promise<FeatureFlag[]> => {
  const response = await apiClient.get<FeatureFlag[]>('/feature-flags');
  return response.data;
};
