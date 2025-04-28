
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { surveyQuestions } from '@/data/survey';
import { supabase } from '@/integrations/supabase/client';

interface SurveyResponse {
  session_id: string;
  [key: string]: any;
}

const Rslts = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get all question IDs from the survey data
  const allQuestionIds = Object.keys(surveyQuestions).filter(key => key !== 'early_exit' && key !== 'thank_you');
  
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        
        // Fetch all survey responses
        const { data, error } = await supabase
          .from('survey_responses')
          .select('*')
          .order('session_id');
          
        if (error) throw error;
        
        if (data) {
          // Group responses by session_id
          const groupedResponses = data.reduce((acc: { [key: string]: SurveyResponse }, item) => {
            if (!acc[item.session_id]) {
              acc[item.session_id] = { session_id: item.session_id };
            }
            
            acc[item.session_id][item.questionid] = item.answer;
            return acc;
          }, {});
          
          // Convert grouped responses to array
          const responsesArray = Object.values(groupedResponses);
          setResponses(responsesArray);
        }
      } catch (err: any) {
        console.error('Error fetching responses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResponses();
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Survey Results</h1>
      
      {loading && <p>Loading survey results...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {!loading && !error && (
        <Card className="overflow-hidden">
          <ScrollArea className="h-[calc(100vh-200px)] w-full">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-background z-10 whitespace-nowrap">Session ID</TableHead>
                    {allQuestionIds.map((questionId) => (
                      <TableHead key={questionId} className="whitespace-nowrap">
                        {questionId} {surveyQuestions[questionId]?.message ? 
                          <span className="text-gray-500 text-xs block">
                            ({surveyQuestions[questionId].message.substring(0, 30)}...)
                          </span> : null}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map((response) => (
                    <TableRow key={response.session_id}>
                      <TableCell className="sticky left-0 bg-background z-10 whitespace-nowrap font-medium">
                        {response.session_id.substring(0, 8)}...
                      </TableCell>
                      {allQuestionIds.map((questionId) => (
                        <TableCell key={`${response.session_id}-${questionId}`} className="whitespace-nowrap">
                          {response[questionId] || '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

export default Rslts;
