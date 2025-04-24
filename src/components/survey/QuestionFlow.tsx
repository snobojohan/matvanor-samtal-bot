
import React from 'react';
import { SurveyData } from '@/types/survey';
import { ChevronRight } from 'lucide-react';

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
        <div key={`${questionId}-${level}-loop`} className="ml-4 py-1">
          <div className="text-amber-700 text-sm flex items-center gap-1">
            <ChevronRight className="h-4 w-4" />
            loops to: {questionId}
          </div>
        </div>
      );
    }

    const question = questions[questionId];
    if (!question) return null;

    const newVisited = new Set(visited);
    newVisited.add(questionId);

    // Get all next paths with their corresponding options
    const nextPaths = question.options 
      ? question.options.map(option => {
          const key = option.toLowerCase().replace(/[.,!?]/g, '').split(' ')[0];
          const nextId = question[`next_${key}`] as string || question.next;
          return { option, nextId };
        })
      : question.next 
        ? [{ option: 'Next', nextId: question.next }] 
        : [];

    return (
      <div key={`${questionId}-${level}`} className="relative">
        <div
          className={`inline-flex items-center rounded px-2 py-1 text-sm cursor-pointer transition-colors ${
            selectedQuestion === questionId
              ? 'bg-[#2D9CDB] text-white'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => onSelectQuestion(questionId)}
        >
          <span className="font-medium">{questionId}</span>
          {question.end && (
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
              End
            </span>
          )}
        </div>

        {nextPaths.length > 0 && (
          <div className="ml-8 mt-1 space-y-2 relative before:absolute before:left-[-12px] before:top-0 before:h-full before:w-[2px] before:bg-gray-200">
            {nextPaths.map(({ option, nextId }, index) => (
              <div key={`${questionId}-${nextId}-${index}`} className="relative">
                <div className="absolute left-[-12px] top-3 h-[2px] w-3 bg-gray-200" />
                <div className="pt-1">
                  <span className="text-xs text-gray-500 block mb-1">{option}</span>
                  {renderQuestionFlow(nextId, level + 1, newVisited)}
                </div>
              </div>
            ))}
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
