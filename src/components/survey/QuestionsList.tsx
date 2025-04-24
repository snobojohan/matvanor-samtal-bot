
import React from 'react';
import { SurveyData } from '@/types/survey';
import AddQuestionButton from './AddQuestionButton';

interface QuestionsListProps {
  questions: SurveyData;
  selectedQuestion: string | null;
  onSelectQuestion: (id: string) => void;
  onAddQuestion: () => void;
}

const QuestionsList = ({
  questions,
  selectedQuestion,
  onSelectQuestion,
  onAddQuestion,
}: QuestionsListProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="font-bold mb-4">Questions</h2>
      <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
        {Object.entries(questions).map(([questionId, question]) => (
          <div
            key={questionId}
            className={`p-3 rounded-md cursor-pointer transition-colors ${
              selectedQuestion === questionId
                ? 'bg-[#2D9CDB] text-white'
                : 'bg-white hover:bg-gray-100'
            }`}
            onClick={() => onSelectQuestion(questionId)}
          >
            <div className="font-medium">{questionId}</div>
            <div className="text-sm truncate">
              {question.message.substring(0, 60)}
              {question.message.length > 60 ? '...' : ''}
            </div>
            <div className="flex mt-1 text-xs">
              {question.options ? (
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                  Options
                </span>
              ) : (
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  {question.type || 'Text'}
                </span>
              )}
              {question.end && (
                <span className="ml-2 px-2 py-1 rounded-full bg-red-100 text-red-800">
                  End
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <AddQuestionButton onAdd={onAddQuestion} />
    </div>
  );
};

export default QuestionsList;
