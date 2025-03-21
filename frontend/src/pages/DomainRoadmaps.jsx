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




// import React, { useState } from 'react';
// import { Loader, BookOpen, ExternalLink, Download } from 'lucide-react';
// import Navbar from "../components/Navbar";
// import FileUpload from "../components/fileupload"; 
// import ThemeToggle from "../components/ThemeToggle";
// // Import only jsPDF for client-side PDF generation
// import { jsPDF } from "jspdf";

// const StudyPlanner = () => {
//   const [syllabusPdf, setSyllabusPdf] = useState(null);
//   const [weeklyTimetable, setWeeklyTimetable] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);
  
//   const handlePdfChange = (file) => {
//     setSyllabusPdf(file);
//   };

//   // Weekly Plan Table Display - Modified to handle duplicate headers
//   const parseTable = (text) => {
//     // Remove any asterisks that might be in the text
//     const cleanedText = text.replace(/\*/g, '');
    
//     // Parse the rows and cells
//     const rows = cleanedText.trim().split('\n').map(row => 
//       row.split('|')
//         .map(cell => cell.trim())
//         .filter(cell => cell.length > 0) // Remove empty cells
//     );

//     // We'll use the second header row (rows[1]) as our header
//     // This fixes the duplicate header issue
//     const headerRow = rows[1] || rows[0]; // Fallback to first row if second doesn't exist

//     return (
//       <div className="overflow-x-auto w-full">
//         <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg overflow-hidden">
//           <thead>
//             <tr className="bg-blue-600 text-white">
//               {headerRow.map((header, index) => (
//                 <th key={index} className="px-4 py-3 text-left border-r border-blue-500">
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {rows.slice(2).map((cells, i) => (
//               <tr key={i} className={`border-b border-gray-300 dark:border-gray-700 ${
//                 i % 2 === 0 
//                   ? 'bg-blue-50 dark:bg-gray-800' 
//                   : 'bg-white dark:bg-gray-900'
//               }`}>
//                 {cells.map((cell, j) => (
//                   <td key={j} className="border-r border-gray-300 dark:border-gray-700 px-4 py-3 text-left">
//                     {cell}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   // Extract only the weekly timetable from the generated study plan
//   const extractWeeklyTimetable = (fullPlan) => {
//     // Check if the plan contains a table
//     if (!fullPlan || !fullPlan.includes('|')) {
//       return null;
//     }

//     // Find the timetable section - look for lines containing table formatting
//     try {
//       // Extract all lines with pipes (table rows)
//       const tableLines = fullPlan.split('\n').filter(line => line.includes('|'));
      
//       if (tableLines.length === 0) return null;
      
//       // Keep all table rows including both header rows
//       let formattedTable = '| Week | Focus | Daily Hours | Resources | Key Activities |\n';
      
//       // Add all table rows, cleaning any problematic formatting
//       tableLines.forEach(line => {
//         // Clean up line - remove asterisks and fix dashes
//         const cleanedLine = line
//           .replace(/\*/g, '')
//           .replace(/^-+/, '| ') // Replace leading dashes with a proper cell start
//           .trim();
          
//         // Only add if it's a data row (contains actual content)
//         if (cleanedLine && !cleanedLine.includes('----')) {
//           formattedTable += cleanedLine + '\n';
//         }
//       });
      
//       return formattedTable;
//     } catch (error) {
//       console.error('Error extracting timetable:', error);
//       return null;
//     }
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
//         // Extract only the weekly timetable from the full plan
//         const timetable = extractWeeklyTimetable(data.study_plan);
//         setWeeklyTimetable(timetable);
        
//         if (!timetable) {
//           alert('Could not extract weekly timetable from the study plan. Please try again.');
//         }
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

//   const handleDownloadPdf = () => {
//     if (!weeklyTimetable) return;
//     setIsDownloading(true);
    
//     try {
//       // Create a new PDF document
//       const doc = new jsPDF();
      
//       // Set font styles for title
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(20);
//       doc.setTextColor(25, 25, 112); // Dark blue color
      
//       // Add title
//       doc.text("Weekly Study Schedule", 105, 20, { align: "center" });
      
//       // Add separator line
//       doc.setDrawColor(25, 25, 112);
//       doc.setLineWidth(0.5);
//       doc.line(20, 25, 190, 25);
      
//       // Reset y position for content
//       let yPos = 35;
      
//       // Extract the table rows - first clean up any asterisks
//       const cleanedTable = weeklyTimetable.replace(/\*/g, '');
//       const tableLines = cleanedTable.split('\n');
      
//       // Filter out separator lines and empty lines
//       const tableRows = tableLines.filter(line => 
//         line.trim() && !line.includes('----')
//       ).map(line => 
//         line.split('|')
//           .map(cell => cell.trim())
//           .filter(cell => cell)
//       );
      
//       if (tableRows.length > 0) {
//         // We'll use the second header row
//         const headerRow = tableRows[1] || tableRows[0]; // Fallback to first row if second doesn't exist
        
//         // Define column widths - adjust as needed based on your table content
//         const columnWidths = headerRow.map(header => {
//           // Assign widths based on column content type
//           if (header === 'Week' || header === 'Day') return 20;
//           if (header === 'Hours') return 15;
//           if (header === 'Topic') return 35;
//           if (header === 'Activities' || header === 'Resources') return 45;
//           if (header === 'Notes') return 30;
//           return 30; // Default width
//         });
        
//         // Calculate total table width
//         const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
//         const tableStartX = (210 - totalWidth) / 2; // Center table on page
        
//         // Draw table header background
//         doc.setFillColor(70, 130, 180);
//         doc.rect(tableStartX, yPos - 5, totalWidth, 10, 'F');
        
//         // Draw header text (using second row as the header)
//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(10);
//         doc.setTextColor(255, 255, 255);
        
//         let currentX = tableStartX;
//         for (let j = 0; j < headerRow.length; j++) {
//           const colWidth = columnWidths[j < columnWidths.length ? j : columnWidths.length - 1];
//           doc.text(headerRow[j], currentX + 2, yPos);
//           currentX += colWidth;
//         }
        
//         yPos += 10;
        
//         // Process data rows (start from row after the header)
//         for (let i = 2; i < tableRows.length; i++) {
//           // Check if we need a new page
//           if (yPos > 270) {
//             doc.addPage();
//             yPos = 20;
            
//             // Redraw the header on the new page
//             doc.setFillColor(70, 130, 180);
//             doc.rect(tableStartX, yPos - 5, totalWidth, 10, 'F');
            
//             doc.setFont("helvetica", "bold");
//             doc.setFontSize(10);
//             doc.setTextColor(255, 255, 255);
            
//             currentX = tableStartX;
//             for (let j = 0; j < headerRow.length; j++) {
//               const colWidth = columnWidths[j < columnWidths.length ? j : columnWidths.length - 1];
//               doc.text(headerRow[j], currentX + 2, yPos);
//               currentX += colWidth;
//             }
            
//             yPos += 10;
//           }
          
//           // Add alternating row background for better readability
//           if (i % 2 === 0) {
//             doc.setFillColor(240, 248, 255); // Light blue for even rows
//             doc.rect(tableStartX, yPos - 5, totalWidth, 10, 'F');
//           }
          
//           // Draw row content
//           doc.setFont("helvetica", "normal");
//           doc.setFontSize(9);
//           doc.setTextColor(60, 60, 60);
          
//           currentX = tableStartX;
//           for (let j = 0; j < Math.min(headerRow.length, tableRows[i].length); j++) {
//             // For longer text in cells, split text if needed
//             const colWidth = columnWidths[j < columnWidths.length ? j : columnWidths.length - 1];
//             if (colWidth > 30) {
//               const cellText = tableRows[i][j] || '';
//               const splitCellText = doc.splitTextToSize(cellText, colWidth - 4);
//               doc.text(splitCellText, currentX + 2, yPos);
              
//               // Adjust row height if cell contains multiple lines
//               if (splitCellText.length > 1) {
//                 const extraLines = splitCellText.length - 1;
//                 yPos += extraLines * 5; // Add 5 points for each extra line
//               }
//             } else {
//               doc.text(tableRows[i][j] || '', currentX + 2, yPos);
//             }
//             currentX += colWidth;
//           }
          
//           // Draw horizontal line between rows
//           doc.setDrawColor(200, 200, 200);
//           doc.setLineWidth(0.1);
//           doc.line(tableStartX, yPos + 2, tableStartX + totalWidth, yPos + 2);
          
//           yPos += 8; // Move to next row
//         }
//       }
      
//       // Add footer with date
//       const today = new Date();
//       doc.setFont("helvetica", "italic");
//       doc.setFontSize(8);
//       doc.setTextColor(150, 150, 150);
//       doc.text(`Generated on ${today.toLocaleDateString()}`, 105, 290, { align: "center" });
      
//       // Save the PDF
//       doc.save("weekly_study_schedule.pdf");
      
//     } catch (error) {
//       console.error('Error creating PDF:', error);
//       alert('Failed to create the weekly timetable PDF. Please try again.');
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
//       <Navbar />
      
//       <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
//         <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
//           <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400">Weekly Study Schedule</h1>
//           <ThemeToggle />
//         </header>
        
//         <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
//           {/* Left Panel - Always visible */}
//           <div className="md:w-1/4 lg:w-1/5 flex-shrink-0">
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-blue-100 dark:border-gray-700 sticky top-6">
//               <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-4">
//                 <h2 className="text-xl font-semibold text-white flex items-center">
//                   <BookOpen size={20} className="mr-2" />
//                   Generate Schedule
//                 </h2>
//               </div>
              
//               <form onSubmit={handleGeneratePlan} className="p-5 space-y-5">            
//                 <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-3 border-l-4 border-blue-500 dark:border-blue-400">
//                   <p className="text-sm text-blue-800 dark:text-blue-300">
//                     Upload your course syllabus to generate a weekly study schedule
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
//                       Generating...
//                     </>
//                   ) : (
//                     'Generate Schedule'
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
          
//           {/* Right Panel - Main Content */}
//           <div className="md:w-3/4 lg:w-4/5">
//             {weeklyTimetable ? (
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700 h-full">
//                 <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-4 flex justify-between items-center">
//                   <h2 className="text-xl font-semibold text-white">Your Weekly Study Schedule</h2>
                  
//                   {/* PDF Download Button */}
//                   <button
//                     onClick={handleDownloadPdf}
//                     disabled={isDownloading}
//                     className="flex items-center bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm"
//                   >
//                     {isDownloading ? (
//                       <>
//                         <Loader size={16} className="animate-spin mr-2" />
//                         Downloading...
//                       </>
//                     ) : (
//                       <>
//                         <Download size={16} className="mr-2" />
//                         Download PDF
//                       </>
//                     )}
//                   </button>
//                 </div>
//                 <div className="p-5">
//                   <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg overflow-auto border border-gray-200 dark:border-gray-700 shadow-inner" style={{ maxHeight: 'calc(100vh - 280px)', minHeight: '400px' }}>
//                     {weeklyTimetable ? parseTable(weeklyTimetable) : (
//                       <p className="text-center text-gray-500 dark:text-gray-400">No timetable generated yet</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 h-full flex flex-col items-center justify-center text-center border border-blue-100 dark:border-gray-700 min-h-[500px]">
//                 <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-full mb-6">
//                   <BookOpen size={64} className="text-blue-500 dark:text-blue-400" />
//                 </div>
//                 <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">No Weekly Schedule Generated Yet</h3>
//                 <p className="text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
//                   Upload your syllabus PDF and click the "Generate Schedule" button to create your personalized weekly study timetable.
//                 </p>
//                 <div className="mt-6 w-full max-w-sm">
//                   <div className="bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
//                     <div className="bg-blue-500 dark:bg-blue-400 h-2 w-0 rounded-full"></div>
//                   </div>
//                   <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
//                     <span>Upload File</span>
//                     <span>View Schedule</span>
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
import { Loader, BookOpen, ExternalLink, Download } from 'lucide-react';
import Navbar from "../components/Navbar";
import FileUpload from "../components/fileupload"; 
import ThemeToggle from "../components/ThemeToggle";
import { jsPDF } from "jspdf";

const StudyPlanner = () => {
  const [syllabusPdf, setSyllabusPdf] = useState(null);
  const [weeklyTimetable, setWeeklyTimetable] = useState(null);
  const [resources, setResources] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handlePdfChange = (file) => {
    setSyllabusPdf(file);
  };

  // Weekly Plan Table Display - Modified to handle duplicate headers
  const parseTable = (text) => {
    // Remove any asterisks that might be in the text
    const cleanedText = text.replace(/\*/g, '');
    
    // Parse the rows and cells
    const rows = cleanedText.trim().split('\n').map(row => 
      row.split('|')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0) // Remove empty cells
    );

    // We'll use the second header row (rows[1]) as our header
    // This fixes the duplicate header issue
    const headerRow = rows[1] || rows[0]; // Fallback to first row if second doesn't exist

    return (
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white">
              {headerRow.map((header, index) => (
                <th key={index} className="px-4 py-3 text-left border-r border-blue-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(2).map((cells, i) => (
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

  // Extract only the weekly timetable from the generated study plan
  const extractWeeklyTimetable = (fullPlan) => {
    // Check if the plan contains a table
    if (!fullPlan || !fullPlan.includes('|')) {
      return null;
    }

    // Find the timetable section - look for lines containing table formatting
    try {
      // Extract all lines with pipes (table rows)
      const tableLines = fullPlan.split('\n').filter(line => line.includes('|'));
      
      if (tableLines.length === 0) return null;
      
      // Keep all table rows including both header rows
      let formattedTable = '| Week | Focus | Daily Hours | Resources | Key Activities |\n';
      
      // Add all table rows, cleaning any problematic formatting
      tableLines.forEach(line => {
        // Clean up line - remove asterisks and fix dashes
        const cleanedLine = line
          .replace(/\*/g, '')
          .replace(/^-+/, '| ') // Replace leading dashes with a proper cell start
          .trim();
          
        // Only add if it's a data row (contains actual content)
        if (cleanedLine && !cleanedLine.includes('----')) {
          formattedTable += cleanedLine + '\n';
        }
      });
      
      return formattedTable;
    } catch (error) {
      console.error('Error extracting timetable:', error);
      return null;
    }
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
        // Extract only the weekly timetable from the full plan
        const timetable = extractWeeklyTimetable(data.study_plan);
        setWeeklyTimetable(timetable);
        
        // Set resources (this was missing in the current code)
        setResources(data.resources || {});
        
        if (!timetable) {
          alert('Could not extract weekly timetable from the study plan. Please try again.');
        }
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

  const handleDownloadPdf = () => {
    if (!weeklyTimetable) return;
    setIsDownloading(true);
    
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Set font styles for title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(25, 25, 112); // Dark blue color
      
      // Add title
      doc.text("Weekly Study Schedule", 105, 20, { align: "center" });
      
      // Add separator line
      doc.setDrawColor(25, 25, 112);
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);
      
      // Reset y position for content
      let yPos = 35;
      
      // Extract the table rows - first clean up any asterisks
      const cleanedTable = weeklyTimetable.replace(/\*/g, '');
      const tableLines = cleanedTable.split('\n');
      
      // Filter out separator lines and empty lines
      const tableRows = tableLines.filter(line => 
        line.trim() && !line.includes('----')
      ).map(line => 
        line.split('|')
          .map(cell => cell.trim())
          .filter(cell => cell)
      );
      
      if (tableRows.length > 0) {
        // We'll use the second header row
        const headerRow = tableRows[1] || tableRows[0]; // Fallback to first row if second doesn't exist
        
        // Define column widths based on content type and available space
        // Adjust these values to prevent text overlap
        const columnWidths = [
          25,  // Week
          35,  // Focus
          25,  // Daily Hours
          45,  // Resources
          50   // Key Activities
        ];
        
        // Calculate total table width
        const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
        const tableStartX = (210 - totalWidth) / 2; // Center table on page
        
        // Draw table header background
        doc.setFillColor(70, 130, 180);
        doc.rect(tableStartX, yPos - 5, totalWidth, 10, 'F');
        
        // Draw header text
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        
        let currentX = tableStartX;
        for (let j = 0; j < headerRow.length && j < columnWidths.length; j++) {
          doc.text(headerRow[j], currentX + 2, yPos);
          currentX += columnWidths[j];
        }
        
        yPos += 10;
        
        // Draw table cell borders for all cells
        const drawCellBorders = (startX, startY, widths, height) => {
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.1);
          
          let x = startX;
          // Vertical lines
          for (let i = 0; i <= widths.length; i++) {
            doc.line(x, startY - 5, x, startY + height);
            if (i < widths.length) x += widths[i];
          }
          
          // Horizontal lines
          doc.line(startX, startY - 5, startX + totalWidth, startY - 5);
          doc.line(startX, startY + height, startX + totalWidth, startY + height);
        };
        
        // Process data rows (start from row after the header)
        for (let i = 2; i < tableRows.length; i++) {
          // Check if we need a new page
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
            
            // Redraw the header on the new page
            doc.setFillColor(70, 130, 180);
            doc.rect(tableStartX, yPos - 5, totalWidth, 10, 'F');
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            
            currentX = tableStartX;
            for (let j = 0; j < headerRow.length && j < columnWidths.length; j++) {
              doc.text(headerRow[j], currentX + 2, yPos);
              currentX += columnWidths[j];
            }
            
            yPos += 10;
          }
          
          // Add alternating row background for better readability
          if (i % 2 === 0) {
            doc.setFillColor(240, 248, 255); // Light blue for even rows
            doc.rect(tableStartX, yPos - 5, totalWidth, 10, 'F');
          }
          
          // Maximum row height tracking (for multi-line cells)
          let maxRowHeight = 5;
          
          // First pass: calculate required height for each cell
          const cellHeights = [];
          currentX = tableStartX;
          
          for (let j = 0; j < Math.min(headerRow.length, tableRows[i].length, columnWidths.length); j++) {
            const cellText = tableRows[i][j] || '';
            const colWidth = columnWidths[j];
            const splitCellText = doc.splitTextToSize(cellText, colWidth - 4);
            
            const cellHeight = splitCellText.length * 5; // 5 points per line
            cellHeights.push(cellHeight);
            if (cellHeight > maxRowHeight) maxRowHeight = cellHeight;
          }
          
          // Draw row content
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(60, 60, 60);
          
          currentX = tableStartX;
          for (let j = 0; j < Math.min(headerRow.length, tableRows[i].length, columnWidths.length); j++) {
            const cellText = tableRows[i][j] || '';
            const colWidth = columnWidths[j];
            const splitCellText = doc.splitTextToSize(cellText, colWidth - 4);
            
            // Vertical align text in the middle of the row
            const textYPos = yPos + (maxRowHeight - cellHeights[j]) / 2;
            doc.text(splitCellText, currentX + 2, textYPos);
            
            currentX += colWidth;
          }
          
          // Draw cell borders
          drawCellBorders(tableStartX, yPos, columnWidths, maxRowHeight);
          
          // Move to next row
          yPos += maxRowHeight + 5;
        }
      }
      
      // Add footer with date
      const today = new Date();
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated on ${today.toLocaleDateString()}`, 105, 290, { align: "center" });
      
      // Save the PDF
      doc.save("weekly_study_schedule.pdf");
      
    } catch (error) {
      console.error('Error creating PDF:', error);
      alert('Failed to create the weekly timetable PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Render course resource recommendations
  const renderResourceRecommendations = () => {
    if (Object.keys(resources).length === 0) {
      return null;
    }

    return (
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
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar />
      
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400">Weekly Study Schedule</h1>
          <ThemeToggle />
        </header>
        
        <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
          {/* Left Panel - Always visible */}
          <div className="md:w-1/4 lg:w-1/5 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-blue-100 dark:border-gray-700 sticky top-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <BookOpen size={20} className="mr-2" />
                  Generate Schedule
                </h2>
              </div>
              
              <form onSubmit={handleGeneratePlan} className="p-5 space-y-5">            
                <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-3 border-l-4 border-blue-500 dark:border-blue-400">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Upload your course syllabus to generate a weekly study schedule
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
                    'Generate Schedule'
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Right Panel - Main Content */}
          <div className="md:w-3/4 lg:w-4/5">
            {weeklyTimetable ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700 h-full">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Your Weekly Study Schedule</h2>
                  
                  {/* PDF Download Button */}
                  <button
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="flex items-center bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm"
                  >
                    {isDownloading ? (
                      <>
                        <Loader size={16} className="animate-spin mr-2" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download size={16} className="mr-2" />
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
                <div className="p-5">
                  <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg overflow-auto border border-gray-200 dark:border-gray-700 shadow-inner" style={{ maxHeight: 'calc(100vh - 280px)', minHeight: '400px' }}>
                    {weeklyTimetable ? parseTable(weeklyTimetable) : (
                      <p className="text-center text-gray-500 dark:text-gray-400">No timetable generated yet</p>
                    )}
                  </div>
                  
                  {/* Recommended Resources Section */}
                  {renderResourceRecommendations()}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 h-full flex flex-col items-center justify-center text-center border border-blue-100 dark:border-gray-700 min-h-[500px]">
                <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-full mb-6">
                  <BookOpen size={64} className="text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">No Weekly Schedule Generated Yet</h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
                  Upload your syllabus PDF and click the "Generate Schedule" button to create your personalized weekly study timetable.
                </p>
                <div className="mt-6 w-full max-w-sm">
                  <div className="bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 dark:bg-blue-400 h-2 w-0 rounded-full"></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>Upload File</span>
                    <span>View Schedule</span>
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