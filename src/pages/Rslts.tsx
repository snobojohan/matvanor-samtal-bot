import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileJson, FileSpreadsheet } from 'lucide-react';
import { surveyQuestions as surveyQuestionsV1 } from '@/data/allSurveyQuestions';
import { surveyQuestions as surveyQuestionsV2 } from '@/data/allSurveyQuestionsV2';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SurveyResponse {
  session_id: string;
  [key: string]: string | undefined;
}

const Rslts = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allUniqueQuestionIds, setAllUniqueQuestionIds] = useState<string[]>([]);
  
  // Combine both versions of survey questions for reference
  const combinedSurveyQuestions = {
    ...surveyQuestionsV1,
    ...surveyQuestionsV2
  };
  
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
          // Extract all unique question IDs from responses
          const uniqueQuestionIds = new Set<string>();
          data.forEach(item => {
            uniqueQuestionIds.add(item.questionid);
          });
          
          setAllUniqueQuestionIds(Array.from(uniqueQuestionIds)
            .filter(qid => qid !== 'early_exit' && qid !== 'thank_you')
            .sort());
          
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
      } catch (err: unknown) {
        console.error('Error fetching responses:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResponses();
  }, []);
  
  const downloadJSON = () => {
    try {
      // Create a JSON string from the responses
      const jsonData = JSON.stringify(responses, null, 2);
      
      // Create a Blob with the JSON data
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `survey-results-${new Date().toISOString().split('T')[0]}.json`;
      
      // Append the link to the body, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Revoke the URL to free up memory
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Download complete',
        description: 'JSON file has been downloaded successfully.',
      });
    } catch (err) {
      console.error('Error downloading JSON:', err);
      toast({
        title: 'Download failed',
        description: 'There was an error downloading the JSON file.',
        variant: 'destructive',
      });
    }
  };
  
  const downloadCSV = () => {
    try {
      // Create the CSV headers using all unique question IDs from the database
      const headers = ['session_id', ...allUniqueQuestionIds];
      
      // Map the responses to CSV rows
      const rows = responses.map(response => {
        return headers.map(header => {
          // Handle special characters in CSV (escape quotes)
          const value = response[header] || '';
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',');
      });
      
      // Combine headers and rows into a CSV string
      const csvData = [headers.join(','), ...rows].join('\n');
      
      // Create a Blob with the CSV data
      const blob = new Blob([csvData], { type: 'text/csv' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `survey-results-${new Date().toISOString().split('T')[0]}.csv`;
      
      // Append the link to the body, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Revoke the URL to free up memory
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Download complete',
        description: 'CSV file has been downloaded successfully.',
      });
    } catch (err) {
      console.error('Error downloading CSV:', err);
      toast({
        title: 'Download failed',
        description: 'There was an error downloading the CSV file.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Survey Results</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={downloadJSON} 
            disabled={loading || responses.length === 0}
            className="flex items-center gap-2"
          >
            <FileJson />
            Download JSON
          </Button>
          <Button 
            variant="outline" 
            onClick={downloadCSV} 
            disabled={loading || responses.length === 0}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet />
            Download CSV
          </Button>
        </div>
      </div>
      
      {loading && <p>Loading survey results...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {!loading && !error && responses.length === 0 && (
        <Card className="p-6 text-center">
          <p>No survey responses found.</p>
        </Card>
      )}
      
      {!loading && !error && responses.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10 whitespace-nowrap">Session ID</TableHead>
                {allUniqueQuestionIds.map((questionId) => (
                  <TableHead key={questionId} className="whitespace-nowrap">
                    {questionId} {combinedSurveyQuestions[questionId]?.message ? 
                      <span className="text-gray-500 text-xs block">
                        ({combinedSurveyQuestions[questionId].message.substring(0, 30)}...)
                      </span> : 
                      <span className="text-amber-500 text-xs block">(Question removed or renamed)</span>}
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
                  {allUniqueQuestionIds.map((questionId) => (
                    <TableCell key={`${response.session_id}-${questionId}`} className="whitespace-nowrap">
                      {response[questionId] || '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Rslts;
