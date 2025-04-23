
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { surveyQuestions } from '@/data/surveyQuestions';
import SurveyQuestionCard from '@/components/survey/SurveyQuestionCard';
import { SurveyQuestion } from '@/types/survey';

const EditSurvey = () => {
  const [questions, setQuestions] = useState(surveyQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Link to="/" className="mr-4 flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Survey
        </Link>
        <h1 className="text-3xl font-bold">Edit Survey Questions</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel: Question list */}
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
                onClick={() => setSelectedQuestion(questionId)}
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
        </div>

        {/* Middle panel: Question details */}
        <div>
          {selectedQuestion ? (
            <Card>
              <CardContent className="pt-6">
                <SurveyQuestionCard
                  questionId={selectedQuestion}
                  question={questions[selectedQuestion]}
                  onUpdate={(updatedQuestion) => {
                    setQuestions((prev) => ({
                      ...prev,
                      [selectedQuestion]: updatedQuestion,
                    }));
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg p-8">
              <p className="text-gray-500">Select a question to edit</p>
            </div>
          )}
        </div>

        {/* Right panel: Question flow */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-bold mb-4">Question Flow</h2>
          <div className="bg-white p-4 rounded-md">
            <QuestionFlow
              questions={questions}
              selectedQuestion={selectedQuestion}
              onSelectQuestion={setSelectedQuestion}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSurvey;
