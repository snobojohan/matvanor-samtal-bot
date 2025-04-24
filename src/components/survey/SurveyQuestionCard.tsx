
import React from 'react';
import { SurveyQuestion } from '@/types/survey';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import QuestionSettings from './QuestionSettings';
import QuestionMessage from './QuestionMessage';
import QuestionOptions from './QuestionOptions';
import NextQuestionSelect from './NextQuestionSelect';
import { useSurveyQuestion } from '@/hooks/useSurveyQuestion';

interface SurveyQuestionCardProps {
  questionId: string;
  question: SurveyQuestion;
  onUpdate: (question: SurveyQuestion) => void;
  availableQuestions: string[];
  onQuestionIdChange?: (oldId: string, newId: string) => void;
}

const SurveyQuestionCard: React.FC<SurveyQuestionCardProps> = ({
  questionId,
  question,
  onUpdate,
  availableQuestions,
  onQuestionIdChange,
}) => {
  const {
    handleIdChange,
    handleMessageChange,
    handleOptionChange,
    handleAddOption,
    handleRemoveOption,
    handleNextPathChange,
    handleTypeChange,
    getNextPath,
    toggleEndQuestion,
  } = useSurveyQuestion({
    questionId,
    question,
    onUpdate,
    onQuestionIdChange,
  });

  return (
    <div className="space-y-4">
      <QuestionSettings
        questionId={questionId}
        hasOptions={!!question.options}
        onIdChange={handleIdChange}
        onTypeChange={handleTypeChange}
      />

      <QuestionMessage
        message={question.message}
        onChange={handleMessageChange}
      />

      {question.options ? (
        <QuestionOptions
          options={question.options}
          onOptionChange={handleOptionChange}
          onOptionRemove={handleRemoveOption}
          onOptionAdd={handleAddOption}
          availableQuestions={availableQuestions}
          onNextPathChange={handleNextPathChange}
          getNextPath={getNextPath}
        />
      ) : (
        <NextQuestionSelect
          nextQuestionId={question.next || ''}
          availableQuestions={availableQuestions}
          onNextQuestionChange={(nextId) => handleNextPathChange('', nextId)}
        />
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="end-question"
          checked={question.end || false}
          onCheckedChange={toggleEndQuestion}
        />
        <Label htmlFor="end-question">End Question</Label>
      </div>
    </div>
  );
};

export default SurveyQuestionCard;

