// export default StudyPlanner;
import React, { useState } from 'react';
import { Loader, BookOpen, ExternalLink } from 'lucide-react';
import Navbar from "../components/Navbar";
import FileUpload from "../components/fileupload"; 

const StudyPlanner = () => {
  const [syllabusPdf, setSyllabusPdf] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [resources, setResources] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePdfChange = (file) => {
    setSyllabusPdf(file);
  };

  const parseTable = (text) => {
    const rows = text.trim().split('\n').map(row => row.split('|').map(cell => cell.trim()));
  
    return (
      <table className="min-w-full border-collapse border border-gray-800 text-black">
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border border-gray-800">
              {cells.map((cell, j) => (
                <td key={j} className="border border-gray-800 px-4 py-2 text-left">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  const formatGeneratedPlan = (text) => {
    return text.includes("|") ? (
      parseTable(text)
    ) : (
      <pre className="whitespace-pre-wrap text-black">{text}</pre>
    );
  };
  

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!syllabusPdf) {
      alert('Please upload a syllabus PDF file.');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('syllabus_pdf', syllabusPdf);

      const response = await fetch("http://127.0.0.1:5000/generate_study_plan", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.status === 'success') {
        setGeneratedPlan(data.study_plan);
        setResources(data.resources || {});
      } else {
        alert('Failed to generate study plan.');
      }
    } catch (error) {
      console.error('Error generating study plan:', error);
      alert('Failed to generate study plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-3">AI Study Planner</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Generate intelligent, personalized study plans tailored to your syllabus</p>
        </header>
        
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <BookOpen size={20} className="mr-2" />
                  Generate Study Plan
                </h2>
              </div>
              
              <form onSubmit={handleGeneratePlan} className="p-6">            
                <FileUpload onFileChange={handlePdfChange} />
                
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin mr-2" size={20} />
                      Generating Plan...
                    </>
                  ) : (
                    'Generate Study Plan'
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div className="md:col-span-3">
            {generatedPlan ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Your Generated Study Plan</h2>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 p-5 rounded-lg overflow-auto max-h-[600px]">
                    {formatGeneratedPlan(generatedPlan)}
                  </div>
                  
                  {Object.keys(resources).length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Resources</h3>
                      <div className="space-y-4">
                        {Object.entries(resources).map(([topic, links]) => (
                          <div key={topic} className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">{topic}</h4>
                            <ul className="space-y-2">
                              {links.map((resource, index) => (
                                <li key={index} className="flex items-start">
                                  <ExternalLink size={16} className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                                  <a 
                                    href={resource.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    {resource.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 h-full flex flex-col items-center justify-center text-center">
                <img src="/api/placeholder/400/320" alt="Study plan illustration" className="max-w-xs mb-6" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">No Study Plan Generated Yet</h3>
                <p className="text-gray-600 max-w-md">
                  Upload your syllabus PDF and click the "Generate Study Plan" button to create your personalized study plan.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;