// mobile/src/services/reportService.ts
import apiClient from './apiClient';
import { IReport } from '../../../backend/src/models/Report';

export type Report = IReport;

export const createReport = async (reportedEntityType: IReport['reportedEntityType'], reportedEntityId: string, reason: string): Promise<Report> => {
  const response = await apiClient.post('/reports', { reportedEntityType, reportedEntityId, reason });
  return response.data;
};
