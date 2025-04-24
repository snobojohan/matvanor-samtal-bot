
import { useState } from 'react';
import { SurveyQuestion } from '@/types/survey';

interface UseSurveyQuestionProps {
  questionId: string;
  question: SurveyQuestion;
  onUpdate: (question: SurveyQuestion) => void;
  onQuestionIdChange?: (oldId: string, newId: string) => void;
}

export const useSurveyQuestion = ({
  questionId,
  question,
  onUpdate,
  onQuestionIdChange,
}: UseSurveyQuestionProps) => {
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

  return {
    handleIdChange,
    handleMessageChange,
    handleOptionChange,
    handleAddOption,
    handleRemoveOption,
    handleNextPathChange,
    handleTypeChange,
    getNextPath,
    toggleEndQuestion,
  };
};

