
import React from 'react';
import { SurveyQuestion } from '@/types/survey';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import QuestionSettings from './QuestionSettings';
import QuestionMessage from './QuestionMessage';
import QuestionOptions from './QuestionOptions';
import NextQuestionSelect from './NextQuestionSelect';

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
  const formatQuestionId = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = formatQuestionId(e.target.value);
    if (onQuestionIdChange && newId !== questionId) {
      onQuestionIdChange(questionId, newId);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...question, message: e.target.value });
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!question.options) return;
    const newOptions = [...question.options];
    newOptions[index] = value;
    onUpdate({ ...question, options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...(question.options || []), ''];
    onUpdate({ ...question, options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = question.options?.filter((_, i) => i !== index);
    const updatedQuestion = { ...question, options: newOptions };
    const optionKey = `next_${question.options?.[index]?.toLowerCase()}`;
    delete updatedQuestion[optionKey];
    onUpdate(updatedQuestion);
  };

  const handleNextPathChange = (option: string, nextQuestionId: string) => {
    const nextKey = option ? `next_${option.toLowerCase()}` : 'next';
    onUpdate({ ...question, [nextKey]: nextQuestionId });
  };

  const handleTypeChange = (type: "text" | "options") => {
    if (type === "text") {
      onUpdate({ ...question, type: "text", options: undefined });
    } else {
      onUpdate({ ...question, type: undefined, options: [''] });
    }
  };

  const getNextPath = (option: string) => {
    const nextKey = `next_${option.toLowerCase()}`;
    return question[nextKey] as string;
  };

  const toggleEndQuestion = () => {
    onUpdate({ ...question, end: !question.end });
  };

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
