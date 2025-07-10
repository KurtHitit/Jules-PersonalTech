// backend/src/services/reportService.ts
import Report, { IReport } from '../models/Report';

export const createReport = async (reporterId: string, reportedEntityType: IReport['reportedEntityType'], reportedEntityId: string, reason: string): Promise<IReport> => {
  const report = new Report({
    reporter: reporterId,
    reportedEntityType,
    reportedEntityId,
    reason,
  });
  await report.save();
  return report;
};

export const getReports = async (status?: IReport['status']): Promise<IReport[]> => {
  const query: any = {};
  if (status) {
    query.status = status;
  }
  return Report.find(query).populate('reporter', 'firstName lastName');
};

export const updateReportStatus = async (reportId: string, status: IReport['status'], notes?: string): Promise<IReport | null> => {
  return Report.findByIdAndUpdate(reportId, { status, notes }, { new: true });
};
