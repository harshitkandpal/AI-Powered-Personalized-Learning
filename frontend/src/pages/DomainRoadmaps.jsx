// import React, { useState } from 'react';
// import { Loader, BookOpen, ExternalLink } from 'lucide-react';
// import Navbar from "../components/Navbar";
// import FileUpload from "../components/fileupload"; 
// import ThemeToggle from "../components/ThemeToggle";

// const StudyPlanner = () => {
//   const [syllabusPdf, setSyllabusPdf] = useState(null);
//   const [generatedPlan, setGeneratedPlan] = useState(null);
//   const [resources, setResources] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
  
//   const handlePdfChange = (file) => {
//     setSyllabusPdf(file);
//   };

//   const parseTable = (text) => {
//     const rows = text.trim().split('\n').map(row => row.split('|').map(cell => cell.trim()));
  
//     return (
//       <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg overflow-hidden">
//         <tbody>
//           {rows.map((cells, i) => (
//             <tr key={i} className={`border-b border-gray-300 dark:border-gray-700 ${
//               i % 2 === 0 
//                 ? 'bg-blue-50 dark:bg-gray-800' 
//                 : 'bg-white dark:bg-gray-900'
//             }`}>
//               {cells.map((cell, j) => (
//                 <td key={j} className="border-r border-gray-300 dark:border-gray-700 px-4 py-3 text-left">
//                   {cell}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   };
  
//   const formatGeneratedPlan = (text) => {
//     return text.includes("|") ? (
//       parseTable(text)
//     ) : (
//       <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-sans">{text}</pre>
//     );
//   };
  
//   const handleGeneratePlan = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     if (!syllabusPdf) {
//       alert('Please upload a syllabus PDF file.');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('syllabus_pdf', syllabusPdf);

//       const response = await fetch("http://127.0.0.1:5000/generate_study_plan", {
//         method: "POST",
//         body: formData
//       });

//       const data = await response.json();

//       if (data.status === 'success') {
//         setGeneratedPlan(data.study_plan);
//         setResources(data.resources || {});
//       } else {
//         alert('Failed to generate study plan.');
//       }
//     } catch (error) {
//       console.error('Error generating study plan:', error);
//       alert('Failed to generate study plan. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
//       <Navbar />
      
//       <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
//         <header className="text-center mb-12 relative">
//           <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-4">AI Study Planner</h1>
//           <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
//             Generate intelligent, personalized study plans tailored to your syllabus
//           </p>
//         </header>
        
//         <div className="grid md:grid-cols-5 gap-8">
//           <div className="md:col-span-2">
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-blue-100 dark:border-gray-700">
//               <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-5">
//                 <h2 className="text-xl font-semibold text-white flex items-center">
//                   <BookOpen size={20} className="mr-2" />
//                   Generate Study Plan
//                 </h2>
//               </div>
              
//               <form onSubmit={handleGeneratePlan} className="p-6 space-y-6">            
//                 <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500 dark:border-blue-400">
//                   <p className="text-sm text-blue-800 dark:text-blue-300">
//                     Upload your course syllabus to generate a personalized study schedule
//                   </p>
//                 </div>
                
//                 <FileUpload onFileChange={handlePdfChange} />
                
//                 <button 
//                   type="submit" 
//                   className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader className="animate-spin mr-2" size={20} />
//                       Generating Plan...
//                     </>
//                   ) : (
//                     'Generate Study Plan'
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
          
//           <div className="md:col-span-3">
//             {generatedPlan ? (
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700">
//                 <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-5 flex justify-between items-center">
//                   <h2 className="text-xl font-semibold text-white">Your Generated Study Plan</h2>
//                 </div>
//                 <div className="p-6">
//                   <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg overflow-auto max-h-96 border border-gray-200 dark:border-gray-700 shadow-inner">
//                     {formatGeneratedPlan(generatedPlan)}
//                   </div>
                  
//                   {Object.keys(resources).length > 0 && (
//                     <div className="mt-8">
//                       <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
//                         <BookOpen className="mr-2 text-blue-600 dark:text-blue-400" size={18} />
//                         Recommended Resources
//                       </h3>
//                       <div className="space-y-4">
//                         {Object.entries(resources).map(([topic, links]) => (
//                           <div key={topic} className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-blue-400 dark:border-blue-500">
//                             <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{topic}</h4>
//                             <ul className="space-y-3">
//                               {links.map((resource, index) => (
//                                 <li key={index} className="flex items-start group">
//                                   <ExternalLink size={16} className="text-blue-500 dark:text-blue-400 mt-1 mr-2 flex-shrink-0 group-hover:text-blue-700 dark:group-hover:text-blue-300" />
//                                   <a 
//                                     href={resource.link} 
//                                     target="_blank" 
//                                     rel="noopener noreferrer"
//                                     className="text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 group-hover:underline"
//                                   >
//                                     {resource.title}
//                                   </a>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 h-full flex flex-col items-center justify-center text-center border border-blue-100 dark:border-gray-700">
//                 <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-full mb-6">
//                   <BookOpen size={64} className="text-blue-500 dark:text-blue-400" />
//                 </div>
//                 <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">No Study Plan Generated Yet</h3>
//                 <p className="text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
//                   Upload your syllabus PDF and click the "Generate Study Plan" button to create your personalized study plan.
//                 </p>
//                 <div className="mt-6 w-full max-w-sm">
//                   <div className="bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
//                     <div className="bg-blue-500 dark:bg-blue-400 h-2 w-0 rounded-full"></div>
//                   </div>
//                   <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
//                     <span>Upload File</span>
//                     <span>Review Plan</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudyPlanner;
import React, { useState } from 'react';
import { Loader, BookOpen, ExternalLink } from 'lucide-react';
import Navbar from "../components/Navbar";
import FileUpload from "../components/fileupload"; 
import ThemeToggle from "../components/ThemeToggle";

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
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg overflow-hidden">
          <tbody>
            {rows.map((cells, i) => (
              <tr key={i} className={`border-b border-gray-300 dark:border-gray-700 ${
                i % 2 === 0 
                  ? 'bg-blue-50 dark:bg-gray-800' 
                  : 'bg-white dark:bg-gray-900'
              }`}>
                {cells.map((cell, j) => (
                  <td key={j} className="border-r border-gray-300 dark:border-gray-700 px-4 py-3 text-left">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const formatGeneratedPlan = (text) => {
    return text.includes("|") ? (
      parseTable(text)
    ) : (
      <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-sans">{text}</pre>
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar />
      
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400">AI Study Planner</h1>
          <ThemeToggle />
        </header>
        
        <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
          {/* Left Panel - Always visible */}
          <div className="md:w-1/4 lg:w-1/5 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-blue-100 dark:border-gray-700 sticky top-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <BookOpen size={20} className="mr-2" />
                  Generate Plan
                </h2>
              </div>
              
              <form onSubmit={handleGeneratePlan} className="p-5 space-y-5">            
                <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-3 border-l-4 border-blue-500 dark:border-blue-400">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Upload your course syllabus to generate a personalized study schedule
                  </p>
                </div>
                
                <FileUpload onFileChange={handlePdfChange} />
                
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin mr-2" size={20} />
                      Generating...
                    </>
                  ) : (
                    'Generate Study Plan'
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Right Panel - Main Content */}
          <div className="md:w-3/4 lg:w-4/5">
            {generatedPlan ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700 h-full">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Your Generated Study Plan</h2>
                </div>
                <div className="p-5">
                  <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg overflow-auto border border-gray-200 dark:border-gray-700 shadow-inner" style={{ maxHeight: 'calc(100vh - 280px)', minHeight: '400px' }}>
                    {formatGeneratedPlan(generatedPlan)}
                  </div>
                  
                  {Object.keys(resources).length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                        <BookOpen className="mr-2 text-blue-600 dark:text-blue-400" size={18} />
                        Recommended Resources
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(resources).map(([topic, links]) => (
                          <div key={topic} className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-blue-400 dark:border-blue-500">
                            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{topic}</h4>
                            <ul className="space-y-2">
                              {links.map((resource, index) => (
                                <li key={index} className="flex items-start group">
                                  <ExternalLink size={16} className="text-blue-500 dark:text-blue-400 mt-1 mr-2 flex-shrink-0 group-hover:text-blue-700 dark:group-hover:text-blue-300" />
                                  <a 
                                    href={resource.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 group-hover:underline"
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 h-full flex flex-col items-center justify-center text-center border border-blue-100 dark:border-gray-700 min-h-[500px]">
                <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-full mb-6">
                  <BookOpen size={64} className="text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">No Study Plan Generated Yet</h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
                  Upload your syllabus PDF and click the "Generate Study Plan" button to create your personalized study plan.
                </p>
                <div className="mt-6 w-full max-w-sm">
                  <div className="bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 dark:bg-blue-400 h-2 w-0 rounded-full"></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>Upload File</span>
                    <span>Review Plan</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;