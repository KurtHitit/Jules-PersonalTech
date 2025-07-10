// backend/src/controllers/reportController.ts
import { Request, Response } from 'express';
import * as reportService from '../services/reportService';

export const createReport = async (req: Request, res: Response): Promise<void> => {
  const { reportedEntityType, reportedEntityId, reason } = req.body;
  const reporterId = req.user!.id;

  try {
    const report = await reportService.createReport(reporterId, reportedEntityType, reportedEntityId, reason);
    res.status(201).json(report);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error creating report', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error creating report', error: 'Unknown error' });
    }
  }
};

export const getReports = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.query;

  try {
    const reports = await reportService.getReports(status as any);
    res.status(200).json(reports);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting reports', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting reports', error: 'Unknown error' });
    }
  }
};

export const updateReportStatus = async (req: Request, res: Response): Promise<void> => {
  const { reportId } = req.params;
  const { status, notes } = req.body;

  try {
    const report = await reportService.updateReportStatus(reportId, status, notes);
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error updating report status', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error updating report status', error: 'Unknown error' });
    }
  }
};
