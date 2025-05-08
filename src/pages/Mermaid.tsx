import React, { useEffect, useState } from 'react';
import { surveyQuestions } from '@/data/allSurveyQuestions';
import { surveyQuestions as surveyQuestionsV2 } from '@/data/allSurveyQuestionsV2';
import { getUrlParameter } from '@/utils/urlParams';
import { SurveyData, SurveyQuestion } from '@/types/survey';

// Function to generate Mermaid flowchart syntax
function generateMermaidFlowchart(
  surveyData: SurveyData, 
  options: {
    showNodeIds: boolean;
    compactMode: boolean;
    showLegend: boolean;
  }
) {
  // Use top-down direction for the flowchart
  let chart = "flowchart TD\n";
  chart += "    classDef welcomeClass fill:#d4f1f9,stroke:#05728f,stroke-width:2px\n";
  chart += "    classDef endClass fill:#ffe6e6,stroke:#ff0000,stroke-width:2px\n";
  chart += "    classDef defaultClass fill:#f9f9f9,stroke:#333,stroke-width:1px\n";
  chart += "    classDef multiPathClass fill:#e6ffe6,stroke:#006600,stroke-width:1px\n";
  chart += "    classDef missingNextClass fill:#fff2cc,stroke:#ff9900,stroke-width:2px\n";
  chart += "    classDef invalidPathClass fill:#ffcccc,stroke:#cc0000,stroke-width:2px\n";
  chart += "    classDef skipLinkClass stroke:#800080,stroke-width:2px,stroke-dasharray: 5 5\n";
  
  // First identify any issues
  const questions = Object.keys(surveyData);
  const questionIssues = new Map<string, string>();
  
  questions.forEach(questionId => {
    const question = surveyData[questionId];
    
    // Check for missing navigation
    const hasNextProperties = Object.keys(question).some(key => 
      key === 'next' || key.startsWith('next_')
    );
    
    if (!question.end && !hasNextProperties) {
      questionIssues.set(questionId, 'missing');
    }
    
    // Check for invalid targets
    if (question.next && !questions.includes(question.next)) {
      questionIssues.set(questionId, 'invalid');
    }
    
    Object.keys(question).forEach(key => {
      if (key.startsWith('next_') && !questions.includes(question[key] as string)) {
        questionIssues.set(questionId, 'invalid');
      }
    });
  });
  
  // Add legend at the top if enabled - separate from main diagram
  if (options.showLegend) {
    chart += "\n    %% Legend as a separate part above\n";
    chart += "    subgraph LegendSection[\"Legend\"]\n";
    chart += "    legend_welcome[\"Welcome question\"]:::welcomeClass\n";
    chart += "    legend_multi[\"Multiple paths\"]:::multiPathClass\n";
    chart += "    legend_end[\"End question\"]:::endClass\n";
    chart += "    legend_normal[\"Normal question\"]:::defaultClass\n";
    chart += "    legend_missing[\"Missing next\"]:::missingNextClass\n";
    chart += "    legend_invalid[\"Invalid path\"]:::invalidPathClass\n";
    chart += "    legend_skip[\"Skip condition\"]-.->|skip|legend_normal\n";
    chart += "    class legend_skip skipLinkClass\n";
    chart += "    end\n\n";
    
    // Add an invisible connection to force the legend to be above
    chart += "    %% Invisible connection to force layout\n";
    chart += "    LegendSection ~~~ MainFlow\n\n";
    
    // Start the main flowchart
    chart += "    subgraph MainFlow[\"Survey Flow\"]\n";
  }
  
  // Add nodes
  Object.keys(surveyData).forEach(questionId => {
    const question = surveyData[questionId];
    const hasMultiplePaths = Object.keys(question).some(key => key.startsWith('next_'));
    
    // Format the label to make it more readable
    const messageLength = options.compactMode ? 20 : 40;
    let label = question.message.substring(0, messageLength);
    if (question.message.length > messageLength) label += "...";
    
    // Format label nicely with question type
    let nodeLabel = "";
    if (options.showNodeIds) {
      const typeInfo = question.type ? ` (${question.type})` : '';
      nodeLabel = `${questionId}${typeInfo}<br/>${label}`;
    } else {
      nodeLabel = label;
    }
    
    chart += `    ${questionId}["${nodeLabel}"]\n`;
    
    // Apply class based on question type and issues
    if (questionIssues.has(questionId)) {
      const issueType = questionIssues.get(questionId);
      if (issueType === 'missing') {
        chart += `    class ${questionId} missingNextClass\n`;
      } else if (issueType === 'invalid') {
        chart += `    class ${questionId} invalidPathClass\n`;
      }
    } else if (questionId === 'welcome') {
      chart += `    class ${questionId} welcomeClass\n`;
    } else if (question.end) {
      chart += `    class ${questionId} endClass\n`;
    } else if (hasMultiplePaths) {
      chart += `    class ${questionId} multiPathClass\n`;
    } else {
      chart += `    class ${questionId} defaultClass\n`;
    }
  });
  
  // Add END node for final states
  chart += "    END((End))\n";
  chart += "    class END endClass\n";
  
  // Add connections
  Object.keys(surveyData).forEach(questionId => {
    const question = surveyData[questionId];
    
    // Handle standard next property
    if (question.next && !question.end) {
      // Check if next points to a valid question
      const isValid = questions.includes(question.next);
      chart += `    ${questionId} --> ${isValid ? question.next : `MISSING:${question.next}`}\n`;
    }
    
    // Handle conditional next properties (next_*)
    Object.keys(question).forEach(key => {
      if (key.startsWith('next_') && key !== 'next') {
        // Format the option label for better readability
        const optionKey = key.replace('next_', '');
        const labelLength = options.compactMode ? 10 : 15;
        const optionLabel = optionKey.replace(/_/g, ' ').substring(0, labelLength);
        const targetId = question[key] as string;
        const isValid = questions.includes(targetId);
        chart += `    ${questionId} -->|${optionLabel}| ${isValid ? targetId : `MISSING:${targetId}`}\n`;
      }
    });
    
    // Handle skipToIf conditions
    if (question.skipToIf && Array.isArray(question.skipToIf)) {
      question.skipToIf.forEach(condition => {
        const targetId = condition.to;
        const isValid = questions.includes(targetId);
        
        // Create descriptive label based on condition type
        let conditionLabel = '';
        if (condition.equals !== undefined) {
          conditionLabel = `if ${condition.question}=${condition.equals}`;
        } else if (condition.not_equals !== undefined) {
          conditionLabel = `if ${condition.question}≠${condition.not_equals}`;
        }
        
        // Add the skipToIf connection with a dotted line and special class
        chart += `    ${questionId} -.->|${conditionLabel}| ${isValid ? targetId : `MISSING:${targetId}`}\n`;
        chart += `    class ${questionId}_${targetId}_skipLink skipLinkClass\n`;
      });
    }
    
    // Handle end states
    if (question.end) {
      chart += `    ${questionId} --> END\n`;
    }
  });
  
  // Close the main flow subgraph if legend is shown
  if (options.showLegend) {
    chart += "    end\n";
  }
  
  return chart;
}

const MermaidPage: React.FC = () => {
  const [chartCode, setChartCode] = useState<string>('');
  const [version, setVersion] = useState<string>('2');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showNodeIds, setShowNodeIds] = useState<boolean>(true);
  const [compactMode, setCompactMode] = useState<boolean>(false);
  const [showLegend, setShowLegend] = useState<boolean>(true);

  // Function to validate survey paths
  function validateSurveyPaths(surveyData: SurveyData) {
    const questions = Object.keys(surveyData);
    const issues: string[] = [];
    
    questions.forEach(questionId => {
      const question = surveyData[questionId];
      
      // Check if a question has no navigation paths (neither next nor next_*)
      const hasNextProperties = Object.keys(question).some(key => 
        key === 'next' || key.startsWith('next_')
      );
      
      // If it has no end flag and no navigation options, it's an error
      if (!question.end && !hasNextProperties) {
        issues.push(`Question "${questionId}" has no navigation paths (neither next nor next_*)`);
      }
      
      // Check if next points to a valid question
      if (question.next && !questions.includes(question.next)) {
        issues.push(`Question "${questionId}" has invalid next target: ${question.next}`);
      }
      
      // Check conditional next properties
      Object.keys(question).forEach(key => {
        if (key.startsWith('next_') && !questions.includes(question[key] as string)) {
          issues.push(`Question "${questionId}" has invalid ${key} target: ${question[key]}`);
        }
      });
    });
    
    return issues;
  }

  // Function to regenerate chart with current options
  const generateChart = () => {
    // Get version from URL params
    const urlVersion = getUrlParameter('version', '2');
    setVersion(urlVersion);
    
    // Select the right survey data based on version
    const data = urlVersion === '1' ? surveyQuestions : surveyQuestionsV2;
    
    // Generate chart code with current options
    const chart = generateMermaidFlowchart(data, {
      showNodeIds,
      compactMode,
      showLegend
    });
    setChartCode(chart);
    
    // Validate survey paths
    const errors = validateSurveyPaths(data);
    setValidationErrors(errors);
    
    // Re-render mermaid diagram
    setTimeout(() => {
      // @ts-expect-error Mermaid is loaded dynamically
      if (window.mermaid) {
        try {
          // Clear any previous processing
          const mermaidElement = document.querySelector('.mermaid');
          if (mermaidElement) {
            mermaidElement.removeAttribute('data-processed');
            // @ts-expect-error Mermaid is loaded dynamically
            window.mermaid.init(undefined, mermaidElement);
          }
        } catch (error) {
          console.error('Error rendering mermaid diagram:', error);
        }
      }
    }, 200);
  };

  useEffect(() => {
    // Load mermaid library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js'; // Use specific version for stability
    script.async = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      try {
        // @ts-expect-error Mermaid is loaded dynamically
        window.mermaid.initialize({ 
          startOnLoad: false, // Disable automatic processing
          theme: 'default',
          flowchart: {
            useMaxWidth: false,
            htmlLabels: true,
            curve: 'linear'
          },
          securityLevel: 'loose'
        });
        
        // Generate initial chart
        generateChart();
      } catch (error) {
        console.error('Error initializing mermaid:', error);
      }
    };
    
    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Update chart when options change
  useEffect(() => {
    if (chartCode) {
      generateChart();
      
      // Re-render mermaid diagram after a short delay to ensure DOM updates
      setTimeout(() => {
        // @ts-expect-error Mermaid is loaded dynamically
        if (window.mermaid) {
          try {
            // @ts-expect-error Mermaid is loaded dynamically
            window.mermaid.init(undefined, document.querySelector('.mermaid'));
          } catch (error) {
            console.error('Failed to render mermaid diagram:', error);
          }
        }
      }, 200);
    }
  }, [showNodeIds, compactMode, showLegend]);

  // Generate chart on version change
  const handleVersionChange = (newVersion: string) => {
    window.location.href = newVersion === '1' 
      ? '/mermaid' 
      : `/mermaid?version=${newVersion}`;
  };
  
  // Handle display option changes
  const handleOptionChange = (option: 'showNodeIds' | 'compactMode' | 'showLegend') => {
    // First update the state
    if (option === 'showNodeIds') {
      setShowNodeIds(prev => !prev);
    } else if (option === 'compactMode') {
      setCompactMode(prev => !prev);
    } else if (option === 'showLegend') {
      setShowLegend(prev => !prev);
    }
    
    // Wait for next render cycle before regenerating chart
    setTimeout(() => {
      try {
        // Force clean up the existing diagram first
        const mermaidElement = document.querySelector('.mermaid');
        if (mermaidElement) {
          mermaidElement.removeAttribute('data-processed');
          // Clear existing content
          mermaidElement.innerHTML = '';
        }
        
        // Generate new chart
        const urlVersion = getUrlParameter('version', '2');
        const data = urlVersion === '1' ? surveyQuestions : surveyQuestionsV2;
        
        // Get the current state by referencing state directly here
        const currentShowNodeIds = option === 'showNodeIds' ? !showNodeIds : showNodeIds;
        const currentCompactMode = option === 'compactMode' ? !compactMode : compactMode;
        const currentShowLegend = option === 'showLegend' ? !showLegend : showLegend;
        
        const chart = generateMermaidFlowchart(data, {
          showNodeIds: currentShowNodeIds,
          compactMode: currentCompactMode,
          showLegend: currentShowLegend
        });
        
        // Update chart code
        setChartCode(chart);
        
        // Re-render after ensuring DOM has updated
        setTimeout(() => {
          if (mermaidElement) {
            mermaidElement.innerHTML = chart;
            // @ts-expect-error Mermaid is loaded dynamically
            if (window.mermaid) {
              try {
                // @ts-expect-error Mermaid is loaded dynamically
                window.mermaid.init(undefined, mermaidElement);
              } catch (error) {
                console.error('Error re-rendering mermaid chart:', error);
              }
            }
          }
        }, 100);
      } catch (error) {
        console.error('Error handling option change:', error);
      }
    }, 10);
  };

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Survey Flow Diagram</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="font-bold mb-2">Version</h2>
          <select 
            value={version} 
            onChange={(e) => handleVersionChange(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="1">Version 1</option>
            <option value="2">Version 2</option>
          </select>
        </div>
        
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="font-bold mb-2">Display Options</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={showNodeIds} 
                onChange={() => handleOptionChange('showNodeIds')}
                className="mr-2"
              />
              Show Question IDs
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={compactMode} 
                onChange={() => handleOptionChange('compactMode')}
                className="mr-2"
              />
              Compact Mode
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={showLegend} 
                onChange={() => handleOptionChange('showLegend')}
                className="mr-2"
              />
              Show Legend
            </label>
          </div>
        </div>
      </div>
      
      {validationErrors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold">Flow Validation Errors:</h3>
          <ul className="list-disc pl-5">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="bg-white p-4 rounded shadow-lg overflow-auto">
        <pre className="mermaid">{chartCode}</pre>
      </div>
      
      <div className="mt-4">
        <h3 className="font-bold mb-2">Mermaid Chart Code:</h3>
        <textarea 
          className="w-full h-40 p-2 border rounded font-mono text-sm"
          value={chartCode}
          readOnly
        />
      </div>
    </div>
  );
};

export default MermaidPage; 