// backend/src/controllers/diagnosticController.ts
import { Request, Response } from 'express';
import * as diagnosticService from '../services/diagnosticService';

// @desc    Get diagnostic suggestions for an item
// @route   POST /api/diagnostics
// @access  Private (requires authentication)
export const getDiagnosticSuggestions = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a real application, you might want to validate req.body more thoroughly
    const { itemCategory, problemDescription } = req.body;

    if (!itemCategory || !problemDescription) {
      res.status(400).json({ message: 'Item category and problem description are required.' });
      return;
    }

    const suggestions = diagnosticService.getDiagnosticSuggestions({
      itemCategory,
      problemDescription,
    });

    res.status(200).json({
      message: 'Diagnostic suggestions retrieved successfully',
      suggestions,
    });
  } catch (error) {
    console.error('Error getting diagnostic suggestions:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error getting diagnostic suggestions', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error getting diagnostic suggestions', error: 'Unknown error' });
    }
  }
};

// @desc    Submit feedback for diagnostic suggestions
// @route   POST /api/diagnostics/feedback
// @access  Private (requires authentication)
export const submitDiagnosticFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, suggestions, isHelpful, fixedProblem, feedbackText } = req.body;

    if (!query || !suggestions || typeof isHelpful !== 'boolean') {
      res.status(400).json({ message: 'Query, suggestions, and isHelpful are required for feedback.' });
      return;
    }

    await diagnosticService.submitDiagnosticFeedback({
      query,
      suggestions,
      isHelpful,
      fixedProblem,
      feedbackText,
    });

    res.status(200).json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    console.error('Error submitting diagnostic feedback:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error submitting feedback', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error submitting feedback', error: 'Unknown error' });
    }
  }
};