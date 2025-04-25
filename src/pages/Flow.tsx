
import React, { useState } from 'react';
import { surveyQuestions } from '@/data/surveyQuestions';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Visualization = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  
  const renderQuestionFlow = (questionId: string, level: number = 0, visited: Set<string> = new Set()) => {
    if (visited.has(questionId)) {
      return (
        <div key={`${questionId}-${level}-loop`} className="my-2 ml-6 p-2 border border-amber-200 bg-amber-50 rounded-md">
          <div className="text-amber-700 text-sm">Loop back to: {questionId}</div>
        </div>
      );
    }
    
    const question = surveyQuestions[questionId];
    if (!question) return null;
    
    const newVisited = new Set(visited);
    newVisited.add(questionId);

    // Get all next paths
    const nextPaths = [];
    
    // Add paths from options if they exist
    if (question.options) {
      question.options.forEach(option => {
        const key = option.toLowerCase().replace(/[^a-z0-9]/g, '');
        const nextKey = `next_${key}`;
        const nextId = question[nextKey] as string || question.next;
        if (nextId) {
          nextPaths.push(nextId);
        }
      });
    } 
    // If no options but has next, add default next
    else if (question.next) {
      nextPaths.push(question.next);
    }
    
    // Add any additional next paths not covered by options
    Object.entries(question).forEach(([key, value]) => {
      if (key.startsWith('next_') && typeof value === 'string' && !nextPaths.includes(value)) {
        nextPaths.push(value);
      }
    });
    
    return (
      <div key={`${questionId}-${level}`} className="mb-2">
        <div 
          className={`p-3 border rounded-md cursor-pointer transition-colors ${
            selectedQuestion === questionId 
              ? 'border-[#2D9CDB] bg-[#2D9CDB]/10' 
              : 'border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setSelectedQuestion(questionId)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-600">{questionId}</div>
              <div className="text-sm truncate text-gray-900">{question.message}</div>
            </div>
            {question.end && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 shrink-0">End</span>
            )}
          </div>
        </div>
        
        {nextPaths.length > 0 && (
          <div className="pl-6 border-l border-gray-300">
            {nextPaths.map((nextId, index) => 
              renderQuestionFlow(nextId, level + 1, newVisited)
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Link to="/" className="mr-4 flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Survey
        </Link>
        <h1 className="text-3xl font-bold">Survey Flow</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="max-h-[80vh] overflow-y-auto pr-4">
          {renderQuestionFlow('welcome')}
        </div>
      </div>
    </div>
  );
};

export default Visualization;

