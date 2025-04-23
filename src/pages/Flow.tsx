
import React, { useState } from 'react';
import { surveyQuestions } from '@/data/surveyQuestions';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface QuestionNode {
  id: string;
  type: 'question' | 'end';
  hasOptions: boolean;
  connections: string[];
}

const Visualization = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  
  // Process questions into a format suitable for visualization
  const buildQuestionGraph = (): Record<string, QuestionNode> => {
    const graph: Record<string, QuestionNode> = {};
    
    // First pass: create nodes
    Object.entries(surveyQuestions).forEach(([id, question]) => {
      graph[id] = {
        id,
        type: question.end ? 'end' : 'question',
        hasOptions: Boolean(question.options),
        connections: [],
      };
    });
    
    // Second pass: establish connections
    Object.entries(surveyQuestions).forEach(([id, question]) => {
      // Check for default next
      if (question.next) {
        graph[id].connections.push(question.next);
      }
      
      // Check for conditional next paths
      Object.entries(question).forEach(([key, value]) => {
        if (key.startsWith('next_') && typeof value === 'string') {
          graph[id].connections.push(value);
        }
      });
    });
    
    return graph;
  };
  
  const questionGraph = buildQuestionGraph();
  
  // Get question details for the selected question
  const getQuestionDetails = (id: string) => {
    const question = surveyQuestions[id];
    if (!question) return null;

    const nextPaths: Record<string, string> = {};
    
    // Extract all next paths
    Object.entries(question).forEach(([key, value]) => {
      if (key === 'next' && typeof value === 'string') {
        nextPaths['default'] = value;
      } else if (key.startsWith('next_') && typeof value === 'string') {
        nextPaths[key.replace('next_', '')] = value;
      }
    });
    
    return {
      message: question.message,
      options: question.options || [],
      type: question.type || (question.options ? 'options' : 'text'),
      isEnd: question.end || false,
      nextPaths
    };
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Link to="/" className="mr-4 flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Survey
        </Link>
        <h1 className="text-3xl font-bold">Survey Flow Visualization</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel: Question list */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-bold mb-4">Questions</h2>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
            {Object.keys(surveyQuestions).map((questionId) => (
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
                  {surveyQuestions[questionId].message.substring(0, 60)}
                  {surveyQuestions[questionId].message.length > 60 ? '...' : ''}
                </div>
                <div className="flex mt-1 text-xs">
                  {surveyQuestions[questionId].options ? (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Options
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {surveyQuestions[questionId].type || 'Text'}
                    </span>
                  )}
                  {surveyQuestions[questionId].end && (
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
                <h3 className="font-bold text-lg mb-2">Question ID: {selectedQuestion}</h3>
                {getQuestionDetails(selectedQuestion) && (
                  <>
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-1">Message:</div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        {getQuestionDetails(selectedQuestion)?.message}
                      </div>
                    </div>
                    
                    {getQuestionDetails(selectedQuestion)?.options?.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-1">Options:</div>
                        <div className="grid grid-cols-2 gap-2">
                          {getQuestionDetails(selectedQuestion)?.options.map((option: string) => (
                            <div key={option} className="p-2 bg-gray-50 rounded-md text-sm">{option}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Next Paths:</div>
                      {Object.entries(getQuestionDetails(selectedQuestion)?.nextPaths || {}).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(getQuestionDetails(selectedQuestion)?.nextPaths || {}).map(([key, value]) => (
                            <div key={key} className="flex justify-between p-2 bg-gray-50 rounded-md">
                              <div className="text-sm font-medium">{key}:</div>
                              <div 
                                className="text-[#2D9CDB] cursor-pointer hover:underline"
                                onClick={() => setSelectedQuestion(value as string)}
                              >
                                {value}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 bg-gray-50 rounded-md text-sm">No next paths defined</div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg p-8">
              <p className="text-gray-500">Select a question to see details</p>
            </div>
          )}
        </div>
        
        {/* Right panel: Flow visualization */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-bold mb-4">Question Flow</h2>
          <div className="bg-white p-4 rounded-md">
            <FlowVisualization 
              questionGraph={questionGraph} 
              selectedQuestion={selectedQuestion}
              onSelectQuestion={setSelectedQuestion}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface FlowVisualizationProps {
  questionGraph: Record<string, QuestionNode>;
  selectedQuestion: string | null;
  onSelectQuestion: (id: string) => void;
}

const FlowVisualization: React.FC<FlowVisualizationProps> = ({ 
  questionGraph, 
  selectedQuestion,
  onSelectQuestion
}) => {
  // Start from welcome question
  const startId = 'welcome';
  
  // Recursively display question flow starting from welcome
  const renderQuestionFlow = (questionId: string, level: number = 0, visited: Set<string> = new Set()) => {
    if (visited.has(questionId)) {
      return (
        <div key={`${questionId}-${level}-loop`} className="my-2 ml-6 p-2 border border-amber-200 bg-amber-50 rounded-md">
          <div className="text-amber-700 text-sm">Loop back to: {questionId}</div>
        </div>
      );
    }
    
    const question = questionGraph[questionId];
    if (!question) return null;
    
    const newVisited = new Set(visited);
    newVisited.add(questionId);
    
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
            {question.type === 'end' && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">End</span>
            )}
          </div>
        </div>
        
        {question.connections.length > 0 && (
          <div className="pl-6 border-l border-gray-300">
            {question.connections.map((nextId) => 
              renderQuestionFlow(nextId, level + 1, newVisited)
            )}
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

export default Visualization;
