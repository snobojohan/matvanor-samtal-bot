
import React from 'react';
import { SurveyData } from '@/types/survey';

interface QuestionFlowProps {
  questions: SurveyData;
  selectedQuestion: string | null;
  onSelectQuestion: (id: string) => void;
}

const QuestionFlow: React.FC<QuestionFlowProps> = ({
  questions,
  selectedQuestion,
  onSelectQuestion,
}) => {
  const startId = 'welcome';

  const renderQuestionFlow = (questionId: string, level: number = 0, visited: Set<string> = new Set()) => {
    if (visited.has(questionId)) {
      return (
        <div key={`${questionId}-${level}-loop`} className="my-2 ml-6 p-2 border border-amber-200 bg-amber-50 rounded-md">
          <div className="text-amber-700 text-sm">Loop back to: {questionId}</div>
        </div>
      );
    }

    const question = questions[questionId];
    if (!question) return null;

    const newVisited = new Set(visited);
    newVisited.add(questionId);

    // Get all next paths
    const nextPaths = Object.entries(question)
      .filter(([key]) => key.startsWith('next'))
      .map(([_, value]) => value as string);

    return (
      <div key={`${questionId}-${level}`} className="mb-2">
        <div
          className={`p-3 border rounded-md ${
            selectedQuestion === questionId
              ? 'border-[#2D9CDB] bg-[#2D9CDB]/10'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => onSelectQuestion(questionId)}
        >
          <div className="flex justify-between">
            <span className="font-medium text-sm">{questionId}</span>
            {question.end && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">End</span>
            )}
          </div>
        </div>

        {nextPaths.length > 0 && (
          <div className="pl-6 border-l border-gray-300">
            {nextPaths.map((nextId) => renderQuestionFlow(nextId, level + 1, newVisited))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto pr-2">
      {renderQuestionFlow(startId)}
    </div>
  );
};

export default QuestionFlow;
