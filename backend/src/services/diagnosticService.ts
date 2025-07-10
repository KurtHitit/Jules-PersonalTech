// backend/src/services/diagnosticService.ts

// A simple, hardcoded map for MVP diagnostic suggestions.
// In a real application, this would be a more sophisticated system, possibly involving a database or a real AI/LLM call.
const diagnosticKnowledgeBase = new Map<string, Map<string, string[]>>();

// --- Knowledge for Laptops ---
const laptopSolutions = new Map<string, string[]>();
laptopSolutions.set('wont_turn_on', [
  "1. Ensure the laptop is plugged into a working power outlet.",
  "2. Check if the charging light indicator is on.",
  "3. Press and hold the power button for 15-30 seconds to perform a hard reset.",
  "4. Try a different power adapter if available.",
]);
laptopSolutions.set('slow_performance', [
  "1. Restart the laptop to clear temporary files.",
  "2. Close unnecessary applications running in the background.",
  "3. Check for and install any pending operating system updates.",
  "4. Run a virus and malware scan.",
]);
diagnosticKnowledgeBase.set('laptop', laptopSolutions);

// --- Knowledge for Refrigerators ---
const refrigeratorSolutions = new Map<string, string[]>();
refrigeratorSolutions.set('not_cooling', [
  "1. Check if the refrigerator is properly plugged in and has power.",
  "2. Ensure the thermostat is set to the correct temperature.",
  "3. Make sure the condenser coils are clean and free of dust/debris.",
  "4. Check that the door seals are clean and creating a tight seal.",
]);
diagnosticKnowledgeBase.set('refrigerator', refrigeratorSolutions);


export interface DiagnosticQuery {
  itemCategory: string;
  problemDescription: string; // For now, we'll use keywords from this.
}

/**
 * Provides simple, actionable troubleshooting steps based on item category and problem description.
 * @param query The diagnostic query containing category and problem description.
 * @returns A list of troubleshooting steps.
 */
export const getDiagnosticSuggestions = (query: DiagnosticQuery): string[] => {
  const { itemCategory, problemDescription } = query;
  console.log(`[DiagnosticService] Received query for category: ${itemCategory}`);

  const categoryKey = itemCategory.toLowerCase();
  const problemKey = problemDescription.toLowerCase().includes('power') || problemDescription.toLowerCase().includes('on')
    ? 'wont_turn_on'
    : problemDescription.toLowerCase().includes('slow')
    ? 'slow_performance'
    : problemDescription.toLowerCase().includes('cool')
    ? 'not_cooling'
    : 'general';

  const solutions = diagnosticKnowledgeBase.get(categoryKey);

  if (solutions && solutions.has(problemKey)) {
    return solutions.get(problemKey)!;
  }

  return ["We couldn't find a specific solution for your problem. Please check the manufacturer's manual or contact a technician."];
};

export interface DiagnosticFeedback {
  query: DiagnosticQuery;
  suggestions: string[];
  isHelpful: boolean;
  fixedProblem?: boolean;
  feedbackText?: string;
}

export const submitDiagnosticFeedback = async (feedback: DiagnosticFeedback): Promise<void> => {
  console.log('[DiagnosticService] Received diagnostic feedback:', feedback);
  // In a real application, this data would be stored in a database
  // For now, we'll just log it.
  console.log('Feedback recorded successfully.');
};
