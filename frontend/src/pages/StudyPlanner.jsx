// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { ChevronDown, ChevronUp, Calendar, Clock, BookOpen, Video, Monitor, Upload, Loader } from 'lucide-react';
// import Navbar from "../components/Navbar";

// const StudyPlanner = () => {
//   const [activeSubject, setActiveSubject] = useState(null);
//   const [activeVideo, setActiveVideo] = useState(null);
//   const [showTimetable, setShowTimetable] = useState(false);
//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');
//   const [lss, setLss] = useState(50);
//   const [strengths, setStrengths] = useState('');
//   const [syllabusText, setSyllabusText] = useState('');
//   const [syllabusPdf, setSyllabusPdf] = useState(null);
//   const [generatedPlan, setGeneratedPlan] = useState(null);
//   const [resources, setResources] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [userPlans, setUserPlans] = useState([]);
//   const [activeTab, setActiveTab] = useState('generate'); // 'generate' or 'view'
  
//   // Subject data will be populated from the backend response
//   const [subjectData, setSubjectData] = useState({});
//   const [timetableData, setTimetableData] = useState([]);

//   useEffect(() => {
//     // If email is provided, fetch user's previous study plans
//     if (email) {
//       fetchUserPlans();
//     }
//   }, [email]);

//   const fetchUserPlans = async () => {
//     try {
//       const response = await axios.get(`/api/study_plans/email/${email}`);
//       if (response.data.status === 'success') {
//         setUserPlans(response.data.plans);
//       }
//     } catch (error) {
//       console.error('Error fetching user plans:', error);
//     }
//   };

//   const handlePdfChange = (e) => {
//     if (e.target.files[0]) {
//       setSyllabusPdf(e.target.files[0]);
//     }
//   };

//   const handleGeneratePlan = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append('email', email);
//       formData.append('name', name);
//       formData.append('lss', lss);
//       formData.append('strengths', strengths);
      
//       if (syllabusPdf) {
//         formData.append('syllabus_pdf', syllabusPdf);
//       } else if (syllabusText) {
//         formData.append('syllabus_text', syllabusText);
//       }

//       const response = await axios.post('/api/generate_study_plan', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       if (response.data.status === 'success') {
//         setGeneratedPlan(response.data.study_plan);
//         setResources(response.data.resources || {});
        
//         // Parse the plan to extract subjects and timetable
//         parseStudyPlan(response.data.study_plan, response.data.resources);
        
//         // Fetch updated plans
//         if (email) {
//           fetchUserPlans();
//         }
//       }
//     } catch (error) {
//       console.error('Error generating study plan:', error);
//       alert('Failed to generate study plan. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleViewPlan = async (planId) => {
//     try {
//       const response = await axios.get(`/api/study_plans/${planId}`);
//       if (response.data.status === 'success') {
//         setGeneratedPlan(response.data.plan.plan_content);
//         setResources(response.data.plan.resources || {});
        
//         // Parse the plan to extract subjects and timetable
//         parseStudyPlan(response.data.plan.plan_content, response.data.plan.resources);
//       }
//     } catch (error) {
//       console.error('Error fetching plan details:', error);
//     }
//   };

//   // Function to parse the generated study plan and extract structured data
//   const parseStudyPlan = (planText, resources) => {
//     // This is a simplified parser - in a real app, you might need more sophisticated parsing
    
//     // Example parsing logic - extract subject names from the plan text
//     const subjectMatches = planText.match(/(?:Week \d+|Day \d+).*?:.*?([A-Za-z& ]+)/g) || [];
    
//     // Create structured subject data
//     const extractedSubjects = {};
    
//     // Add subjects and resources based on the parsed text
//     Object.keys(resources).forEach(topic => {
//       const topicName = topic.trim();
//       if (topicName) {
//         extractedSubjects[topicName] = {
//           title: topicName,
//           description: `Study materials for ${topicName}`,
//           subtopics: [],
//           videos: resources[topic].map(resource => ({
//             link: resource.link,
//             title: resource.title
//           }))
//         };
//       }
//     });
    
//     // If no subjects were found, create a default structure
//     if (Object.keys(extractedSubjects).length === 0) {
//       extractedSubjects['General Studies'] = {
//         title: 'General Studies',
//         description: 'Generated Study Plan',
//         subtopics: ['General Topics'],
//         videos: []
//       };
//     }
    
//     setSubjectData(extractedSubjects);
    
//     // Parse timetable from the generated plan
//     const weekMatches = planText.match(/Week \d+[\s\S]*?(?=Week \d+|$)/g) || [];
//     const parsedTimetable = [];
    
//     weekMatches.forEach((weekText, index) => {
//       const weekNumber = index + 1;
//       const dayMatches = weekText.match(/Day \d+.*?:.*?$/gm) || [];
      
//       dayMatches.forEach(dayText => {
//         const dayMatch = dayText.match(/Day (\d+).*?:(.*)$/);
//         if (dayMatch) {
//           const dayNumber = parseInt(dayMatch[1]);
//           const dayContent = dayMatch[2].trim();
          
//           // Create a day entry for the timetable
//           parsedTimetable.push({
//             day: `Week ${weekNumber} - Day ${dayNumber}`,
//             slots: [
//               { 
//                 time: "9:00 - 11:00 AM", 
//                 subject: Object.keys(extractedSubjects)[0] || "Study Session", 
//                 topic: dayContent 
//               }
//             ]
//           });
//         }
//       });
//     });
    
//     // If no timetable was found, create a default structure
//     if (parsedTimetable.length === 0) {
//       const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//       const parsedTimetable = days.map(day => ({
//         day,
//         slots: [
//           { time: "9:00 - 11:00 AM", subject: "Study Session", topic: "Review Materials" }
//         ]
//       }));
//       setTimetableData(parsedTimetable);
//     } else {
//       setTimetableData(parsedTimetable);
//     }
//   };

//   const handleSubjectClick = (subject) => {
//     setActiveSubject(activeSubject === subject ? null : subject);
//     setActiveVideo(null);
//   };

//   const handleSubtopicClick = (subject, subtopic) => {
//     setActiveVideo({ subject, subtopic, videos: subjectData[subject].videos });
//   };

//   const getEmbedUrl = (videoUrl) => {
//     if (videoUrl.includes('youtube.com/watch')) {
//       const videoId = new URL(videoUrl).searchParams.get('v');
//       return `https://www.youtube.com/embed/${videoId}`;
//     } else if (videoUrl.includes('youtube.com/playlist')) {
//       const listId = new URL(videoUrl).searchParams.get('list');
//       return `https://www.youtube.com/embed/videoseries?list=${listId}`;
//     }
//     return videoUrl;
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
//           <Navbar />
//       <header className="mb-8">
//         <h1 className="text-3xl font-bold text-blue-800 mb-2">AI Study Planner</h1>
//         <p className="text-gray-600">Generate personalized study plans based on your syllabus</p>
        
//         <div className="mt-4 border-b border-gray-200">
//           <div className="flex">
//             <button 
//               className={`py-2 px-4 border-b-2 ${activeTab === 'generate' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}
//               onClick={() => setActiveTab('generate')}
//             >
//               Generate New Plan
//             </button>
//             <button 
//               className={`py-2 px-4 border-b-2 ${activeTab === 'view' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}
//               onClick={() => setActiveTab('view')}
//             >
//               View Previous Plans
//             </button>
//           </div>
//         </div>
//       </header>

//       {activeTab === 'generate' && (
//         <div className="mb-8 bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">Generate Study Plan</h2>
          
//           <form onSubmit={handleGeneratePlan}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input 
//                   type="email" 
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="your@email.com"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                 <input 
//                   type="text" 
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Your Name"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Learning Speed Score (1-100)
//                 </label>
//                 <input 
//                   type="number" 
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   value={lss}
//                   onChange={(e) => setLss(e.target.value)}
//                   min="1"
//                   max="100"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Strengths (comma separated)
//                 </label>
//                 <input 
//                   type="text" 
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   value={strengths}
//                   onChange={(e) => setStrengths(e.target.value)}
//                   placeholder="Math, Science, Programming"
//                 />
//               </div>
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Upload Syllabus (PDF)
//               </label>
//               <div className="flex items-center justify-center w-full">
//                 <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                     <Upload className="w-8 h-8 mb-2 text-gray-500" />
//                     <p className="mb-2 text-sm text-gray-500">
//                       <span className="font-semibold">Click to upload</span> or drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500">PDF files only</p>
//                   </div>
//                   <input 
//                     type="file" 
//                     className="hidden" 
//                     accept=".pdf"
//                     onChange={handlePdfChange}
//                   />
//                 </label>
//               </div>
//               {syllabusPdf && (
//                 <p className="mt-2 text-sm text-green-600">
//                   Selected file: {syllabusPdf.name}
//                 </p>
//               )}
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Or Enter Syllabus Text
//               </label>
//               <textarea 
//                 className="w-full p-2 border border-gray-300 rounded-md h-32"
//                 value={syllabusText}
//                 onChange={(e) => setSyllabusText(e.target.value)}
//                 placeholder="Enter your syllabus text here..."
//               ></textarea>
//             </div>
            
//             <button 
//               type="submit" 
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader className="animate-spin mr-2" size={20} />
//                   Generating Plan...
//                 </>
//               ) : (
//                 'Generate Study Plan'
//               )}
//             </button>
//           </form>
//         </div>
//       )}
      
//       {activeTab === 'view' && (
//         <div className="mb-8 bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">Previous Study Plans</h2>
          
//           {userPlans.length > 0 ? (
//             <div className="space-y-3">
//               {userPlans.map((plan) => (
//                 <div key={plan.id} className="border border-gray-200 rounded-md p-3">
//                   <p className="text-sm text-gray-500">
//                     Created: {plan.created_at ? new Date(plan.created_at.seconds * 1000).toLocaleString() : 'N/A'}
//                   </p>
//                   <button
//                     onClick={() => handleViewPlan(plan.id)}
//                     className="mt-2 text-sm text-blue-600 hover:underline"
//                   >
//                     View Plan
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500">No previous plans found. Please enter your email to view your plans.</p>
//           )}
          
//           <div className="mt-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <div className="flex">
//               <input 
//                 type="email" 
//                 className="flex-1 p-2 border border-gray-300 rounded-l-md"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="your@email.com"
//               />
//               <button 
//                 onClick={fetchUserPlans}
//                 className="bg-blue-600 text-white py-2 px-4 rounded-r-md hover:bg-blue-700"
//               >
//                 Search
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {generatedPlan && (
//         <>
//           <div className="mb-8 bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Your Generated Study Plan</h2>
//             <div className="prose max-w-none">
//               {generatedPlan.split('\n').map((line, index) => (
//                 line.trim() ? (
//                   <p key={index}>{line}</p>
//                 ) : (
//                   <br key={index} />
//                 )
//               ))}
//             </div>
//           </div>
          
//           <div className="flex flex-col lg:flex-row gap-6">
//             <div className="lg:w-1/2">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold flex items-center">
//                   <BookOpen className="mr-2" size={20} />
//                   Subjects and Resources
//                 </h2>
//                 <button 
//                   onClick={() => setShowTimetable(!showTimetable)}
//                   className="lg:hidden px-3 py-1 bg-blue-600 text-white rounded-md flex items-center"
//                 >
//                   <Calendar className="mr-1" size={16} />
//                   {showTimetable ? 'Hide' : 'Show'} Timetable
//                 </button>
//               </div>

//               <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                 {Object.keys(subjectData).map((subject) => (
//                   <div key={subject} className="border-b border-gray-200 last:border-b-0">
//                     <button
//                       className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
//                       onClick={() => handleSubjectClick(subject)}
//                     >
//                       <div>
//                         <h3 className="font-medium text-blue-700">{subjectData[subject].title}</h3>
//                         <p className="text-sm text-gray-600">{subjectData[subject].description}</p>
//                       </div>
//                       {activeSubject === subject ? 
//                         <ChevronUp className="text-gray-400" size={20} /> : 
//                         <ChevronDown className="text-gray-400" size={20} />
//                       }
//                     </button>
                    
//                     {activeSubject === subject && (
//                       <div className="bg-gray-50 px-4 py-2">
//                         {subjectData[subject].subtopics && subjectData[subject].subtopics.length > 0 && (
//                           <>
//                             <h4 className="text-sm font-medium text-gray-500 mb-2">Subtopics:</h4>
//                             <ul className="space-y-1 mb-3">
//                               {subjectData[subject].subtopics.map((subtopic) => (
//                                 <li key={subtopic}>
//                                   <button
//                                     className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-100 text-sm flex items-center"
//                                     onClick={() => handleSubtopicClick(subject, subtopic)}
//                                   >
//                                     <Monitor className="mr-2 text-blue-500" size={16} />
//                                     {subtopic}
//                                   </button>
//                                 </li>
//                               ))}
//                             </ul>
//                           </>
//                         )}

//                         {subjectData[subject].videos && subjectData[subject].videos.length > 0 && (
//                           <div className="mt-3">
//                             <h4 className="text-sm font-medium text-gray-500 mb-2">Available Resources:</h4>
//                             <ul className="space-y-1 pl-3">
//                               {subjectData[subject].videos.map((video, index) => (
//                                 <li key={index} className="text-sm text-blue-600 truncate">
//                                   <a href={video.link} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
//                                     <Video className="mr-1 flex-shrink-0" size={14} />
//                                     {video.title}
//                                   </a>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {activeVideo && activeVideo.videos && activeVideo.videos.length > 0 && (
//                 <div className="mt-6 bg-white rounded-lg shadow-md p-4">
//                   <h3 className="text-lg font-semibold text-blue-800 mb-2">
//                     {activeVideo.subject} - {activeVideo.subtopic}
//                   </h3>
                  
//                   <div>
//                     <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
//                       <iframe
//                         className="w-full h-64 rounded-md"
//                         src={getEmbedUrl(activeVideo.videos[0].link)}
//                         title={activeVideo.videos[0].title}
//                         allowFullScreen
//                       ></iframe>
//                     </div>
                    
//                     {activeVideo.videos.length > 1 && (
//                       <div className="mt-4">
//                         <h4 className="text-sm font-medium text-gray-500 mb-2">More Videos:</h4>
//                         <ul className="space-y-2">
//                           {activeVideo.videos.slice(1).map((video, index) => (
//                             <li key={index} className="text-sm">
//                               <a 
//                                 href={video.link} 
//                                 target="_blank" 
//                                 rel="noopener noreferrer"
//                                 className="flex items-center text-blue-600 hover:underline"
//                               >
//                                 <Video className="mr-2" size={16} />
//                                 {video.title}
//                               </a>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className={`lg:w-1/2 ${!showTimetable && 'hidden lg:block'}`}>
//               <div className="flex items-center mb-4">
//                 <h2 className="text-xl font-semibold flex items-center">
//                   <Calendar className="mr-2" size={20} />
//                   Study Timetable
//                 </h2>
//               </div>

//               <div className="bg-white rounded-lg shadow-md p-4">
//                 {timetableData.map((day) => (
//                   <div key={day.day} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
//                     <h3 className="font-medium text-blue-700 mb-2">{day.day}</h3>
//                     <ul className="space-y-2">
//                       {day.slots.map((slot, index) => (
//                         <li 
//                           key={index}
//                           className="bg-blue-50 rounded-md p-3 text-sm"
//                         >
//                           <div className="flex items-center text-gray-600 mb-1">
//                             <Clock className="mr-1" size={14} />
//                             {slot.time}
//                           </div>
//                           <div className="font-medium">{slot.subject}</div>
//                           <div className="text-gray-600 text-sm">{slot.topic}</div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

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