// // import React, { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
// // import { db } from "../firebase";
// // import { doc, getDoc, updateDoc } from "firebase/firestore";
// // import { useAuth } from "../AuthContext";
// // import TestComponent from "../components/TestComponent"

// // const CourseContent = () => {
// //   const { course_id } = useParams(); // Extract course_id from URL
// //   const { currentUser } = useAuth(); // Get current user's email
// //   const [course, setCourse] = useState(null);
// //   const [progress, setProgress] = useState(0);
// //   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
// //   const navigate = useNavigate(); // Hook for navigation

// //   useEffect(() => {
// //     const fetchCourse = async () => {
// //       const courseRef = doc(db, "courses", course_id);
// //       const courseSnapshot = await getDoc(courseRef);

// //       if (courseSnapshot.exists()) {
// //         setCourse(courseSnapshot.data());
// //       }
// //     };

// //     const fetchProgress = async () => {
// //       if (currentUser) {
// //         const studentRef = doc(db, "students", currentUser.email); // Use currentUser's email as document ID
// //         const studentSnapshot = await getDoc(studentRef);

// //         if (studentSnapshot.exists()) {
// //           const studentData = studentSnapshot.data();
// //           console.log(studentData);

// //           // Find the progress for the current course
// //           const courseProgress = studentData.progress?.[course_id];
// //           setProgress(courseProgress ? courseProgress.completion_percentage : 0);
// //         }
// //       }
// //     };

// //     fetchCourse();
// //     fetchProgress();
// //   }, [course_id, currentUser]);

// //   const handleTestCompleted = async (lss, strengths) => {
// //     const newProgress = Math.min(100, progress + 10); // Increment by 10% for each test passed
// //     setProgress(newProgress);
  
// //     if (currentUser) {
// //       const studentRef = doc(db, "students", currentUser.email);
// //       const studentSnapshot = await getDoc(studentRef);
// //       const studentData = studentSnapshot.data();
  
// //       // Find the specific progress entry for the course
// //       const progressIndex = studentData.progress.findIndex(
// //         (item) => item.course_id === course_id
// //       );
  
// //       if (progressIndex !== -1) {
// //         // Update the progress in the array for the current course
// //         studentData.progress[progressIndex].completion_percentage = newProgress;
// //         studentData.progress[progressIndex].last_accessed = new Date();
// //         studentData.progress[progressIndex].LSS = { LSS: lss }; // Update LSS
// //         studentData.strengths = strengths; // Update strengths
// //       } else {
// //         // If progress entry doesn't exist, create a new one
// //         studentData.progress.push({
// //           course_id,
// //           completion_percentage: newProgress,
// //           last_accessed: new Date(),
// //           LSS: { LSS: lss },
// //         });
// //         studentData.strengths = strengths; // Set strengths
// //       }
  
// //       try {
// //         await updateDoc(studentRef, {
// //           progress: studentData.progress,
// //           strengths: studentData.strengths,
// //         });
// //         console.log("Student progress, LSS, and strengths updated successfully!");
// //       } catch (error) {
// //         console.error("Error updating student progress:", error);
// //       }
// //     }
  
// //     // Move to next video after test completion
// //     if (currentVideoIndex < course.content.videos.length - 1) {
// //       setCurrentVideoIndex(currentVideoIndex + 1);
// //     } else {
// //       alert("All videos completed! Congratulations!");
// //     }
  
// //     alert(`Test completed. Progress: ${newProgress}%`);
// //   };
  

// //   if (!course) {
// //     return <p>Loading course content...</p>;
// //   }

// //   return (
// //     <div className="course-content-page p-6 px-36">
// //       <div className="course-header mb-6">
// //         <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
// //         <p>Progress: {progress}%</p>
// //       </div>

// //       {/* Sequential Video Player */}
// //       <div className="course-videos">
// //         <h2 className="text-2xl font-bold mb-4">Course Videos</h2>
// //         {course.content?.videos?.length > 0 ? (
// //           <div className="video-list">
// //             <div className="video-item mb-8">
// //               <h3 className="text-xl font-semibold mb-2">
// //                 {currentVideoIndex + 1}. {course.content.videos[currentVideoIndex].title}
// //               </h3>
// //               <iframe
// //                 width="100%"
// //                 height="650"
// //                 src={
// //                   course.content.videos[currentVideoIndex].includes("youtube.com/watch?v=")
// //                     ? course.content.videos[currentVideoIndex].replace("watch?v=", "embed/")
// //                     : course.content.videos[currentVideoIndex]
// //                 }
// //                 title={course.content.videos[currentVideoIndex].title}
// //                 frameBorder="0"
// //                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
// //                 allowFullScreen
// //               ></iframe>
// //             </div>
// //           </div>
// //         ) : (
// //           <p>No videos available for this course.</p>
// //         )}
// //          {/* Test Section */}
// //       <TestComponent
// //   onTestCompleted={handleTestCompleted}
// //   studentEmail={currentUser?.email}
// //   courseId={course_id}
// //   videoId={currentVideoIndex + 1} // Ensure videoId is passed
// // />
// //       </div>

// //       {/* Button to Navigate to Summative Test */}
// //       <div className="summative-test-button mt-8">
// //         <button
// //           onClick={() => navigate(`/courses/${course_id}/summative-test`)}
// //           className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
// //         >
// //           Take Summative Test
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CourseContent;


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db } from "../firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { useAuth } from "../AuthContext";
// import TestComponent from "../components/TestComponent";

// const CourseContent = () => {
//   const { course_id } = useParams();
//   const { currentUser } = useAuth();
//   const [course, setCourse] = useState(null);
//   const [progress, setProgress] = useState(0);
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCourse = async () => {
//       const courseRef = doc(db, "courses", course_id);
//       const courseSnapshot = await getDoc(courseRef);

//       if (courseSnapshot.exists()) {
//         setCourse(courseSnapshot.data());
//       }
//     };

//     const fetchProgress = async () => {
//       if (currentUser) {
//         const studentRef = doc(db, "students", currentUser.email);
//         const studentSnapshot = await getDoc(studentRef);

//         if (studentSnapshot.exists()) {
//           const studentData = studentSnapshot.data();
//           const courseProgress = studentData.progress?.[course_id];
//           setProgress(courseProgress ? courseProgress.completion_percentage : 0);
//         }
//       }
//     };

//     fetchCourse();
//     fetchProgress();
//   }, [course_id, currentUser]);

//   const handleTestCompleted = async (lss, strengths) => {
//     const newProgress = Math.min(100, progress + 10);
//     setProgress(newProgress);

//     if (currentUser) {
//       const studentRef = doc(db, "students", currentUser.email);
//       const studentSnapshot = await getDoc(studentRef);
//       const studentData = studentSnapshot.data();

//       const progressIndex = studentData.progress.findIndex(
//         (item) => item.course_id === course_id
//       );

//       if (progressIndex !== -1) {
//         studentData.progress[progressIndex].completion_percentage = newProgress;
//         studentData.progress[progressIndex].last_accessed = new Date();
//         studentData.progress[progressIndex].LSS = { LSS: lss };
//         studentData.strengths = strengths;
//       } else {
//         studentData.progress.push({
//           course_id,
//           completion_percentage: newProgress,
//           last_accessed: new Date(),
//           LSS: { LSS: lss },
//         });
//         studentData.strengths = strengths;
//       }

//       try {
//         await updateDoc(studentRef, {
//           progress: studentData.progress,
//           strengths: studentData.strengths,
//         });
//         console.log("Student progress, LSS, and strengths updated successfully!");
//       } catch (error) {
//         console.error("Error updating student progress:", error);
//       }
//     }

//     if (currentVideoIndex < course.content.videos.length - 1) {
//       setCurrentVideoIndex(currentVideoIndex + 1);
//     } else {
//       alert("All videos completed! Congratulations!");
//     }

//     alert(`Test completed. Progress: ${newProgress}%`);
//   };

//   const handleNextVideo = () => {
//     if (currentVideoIndex < course.content.videos.length - 1) {
//       setCurrentVideoIndex(currentVideoIndex + 1); // Update video index and reload the test component with new videoId

//       window.scrollTo({
//         top: 0,
//         behavior: 'smooth' // For smooth scrolling
//       });
//     } else {
//       alert("All videos are completed!");
//     }
//   };

//   if (!course) {
//     return <p>Loading course content...</p>;
//   }

//   return (
//     <div className="course-content-page bg-gray-50 min-h-screen p-6 lg:px-36 md:px-20 sm:px-10">
//   <div className="course-header mb-8 border-b pb-4">
//     <h1 className="text-4xl font-bold mb-3 text-gray-800">{course.title}</h1>
//     <div className="w-full bg-gray-200 rounded-full h-2.5">
//       <div 
//         className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
//         style={{ width: `${progress}%` }}
//       ></div>
//     </div>
//     <p className="text-sm text-gray-600 mt-2">Progress: {progress}%</p>
//   </div>

//   <div className="course-videos bg-white rounded-lg shadow-md p-6">
//     <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Course Videos</h2>
//     {course.content?.videos?.length > 0 ? (
//       <div className="video-list">
//         <div className="video-item mb-8">
//           <h3 className="text-xl font-semibold mb-3 text-gray-700 flex items-center">
//             <span className="bg-blue-600 text-white rounded-full w-7 h-7 inline-flex items-center justify-center mr-2 text-sm">
//               {currentVideoIndex + 1}
//             </span>
//             {course.content.videos[currentVideoIndex].title}
//           </h3>
//           <div className="video-container relative pt-0 overflow-hidden rounded-lg shadow-lg">
//             <iframe
//               className="w-full aspect-video"
//               src={
//                 course.content.videos[currentVideoIndex].includes("youtube.com/watch?v=")
//                   ? course.content.videos[currentVideoIndex].replace("watch?v=", "embed/")
//                   : course.content.videos[currentVideoIndex]
//               }
//               title={course.content.videos[currentVideoIndex].title}
//               frameBorder="0"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//             ></iframe>
//           </div>
//         </div>
//       </div>
//     ) : (
//       <p className="text-gray-500 italic p-4 bg-gray-50 rounded">No videos available for this course.</p>
//     )}

//     {/* Test Section */}
//     <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
//       <TestComponent
//         onTestCompleted={handleTestCompleted}
//         studentEmail={currentUser?.email}
//         courseId={course_id}
//         videoId={currentVideoIndex + 1}
//         key={currentVideoIndex}
//       />
//     </div>

//     {/* Next Video Button */}
//     <div className="next-video-button mt-8 flex justify-end">
//       {currentVideoIndex < course.content.videos.length - 1 && (
//         <button
//           onClick={handleNextVideo}
//           className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2 shadow-md"
//         >
//           <span>Next Video</span>
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//           </svg>
//         </button>
//       )}
//     </div>
//   </div>

//   {/* Button to Navigate to Summative Test */}
//   <div className="summative-test-button mt-10 mb-8 flex justify-center">
//     <button
//       onClick={() => navigate(`/courses/${course_id}/summative-test`)}
//       className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-lg flex items-center space-x-2 transform hover:scale-105"
//     >
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//       </svg>
//       <span>Take Summative Test</span>
//     </button>
//   </div>
// </div>
//   );
// };

// export default CourseContent;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import TestComponent from "../components/TestComponent";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../components/ThemeContext";

const CourseContent = () => {
  const { course_id } = useParams();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchCourse = async () => {
      const courseRef = doc(db, "courses", course_id);
      const courseSnapshot = await getDoc(courseRef);

      if (courseSnapshot.exists()) {
        setCourse(courseSnapshot.data());
      }
    };

    const fetchProgress = async () => {
      if (currentUser) {
        const studentRef = doc(db, "students", currentUser.email);
        const studentSnapshot = await getDoc(studentRef);

        if (studentSnapshot.exists()) {
          const studentData = studentSnapshot.data();
          const courseProgress = studentData.progress?.[course_id];
          setProgress(courseProgress ? courseProgress.completion_percentage : 0);
        }
      }
    };

    fetchCourse();
    fetchProgress();
  }, [course_id, currentUser]);

  const handleTestCompleted = async (lss, strengths) => {
    const newProgress = Math.min(100, progress + 10);
    setProgress(newProgress);

    if (currentUser) {
      const studentRef = doc(db, "students", currentUser.email);
      const studentSnapshot = await getDoc(studentRef);
      const studentData = studentSnapshot.data();

      const progressIndex = studentData.progress.findIndex(
        (item) => item.course_id === course_id
      );

      if (progressIndex !== -1) {
        studentData.progress[progressIndex].completion_percentage = newProgress;
        studentData.progress[progressIndex].last_accessed = new Date();
        studentData.progress[progressIndex].LSS = { LSS: lss };
        studentData.strengths = strengths;
      } else {
        studentData.progress.push({
          course_id,
          completion_percentage: newProgress,
          last_accessed: new Date(),
          LSS: { LSS: lss },
        });
        studentData.strengths = strengths;
      }

      try {
        await updateDoc(studentRef, {
          progress: studentData.progress,
          strengths: studentData.strengths,
        });
        console.log("Student progress, LSS, and strengths updated successfully!");
      } catch (error) {
        console.error("Error updating student progress:", error);
      }
    }

    if (currentVideoIndex < course.content.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      alert("All videos completed! Congratulations!");
    }

    alert(`Test completed. Progress: ${newProgress}%`);
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < course.content.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      alert("All videos are completed!");
    }
  };

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900 dark:text-white">
        <p>Loading course content...</p>
      </div>
    );
  }

  return (
    <div className={`course-content-page min-h-screen p-6 lg:px-36 md:px-20 sm:px-10 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <FaSun className="text-yellow-500 w-5 h-5" />
          ) : (
            <FaMoon className="text-gray-500 w-5 h-5" />
          )}
        </button>
      </div>
      
      <div className={`course-header mb-8 border-b pb-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <h1 className={`text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{course.title}</h1>
        <div className={`w-full rounded-full h-2.5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Progress: {progress}%</p>
      </div>

      <div className={`course-videos rounded-lg shadow-md p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-6 border-b pb-2 ${theme === 'dark' ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}`}>Course Videos</h2>
        {course.content?.videos?.length > 0 ? (
          <div className="video-list">
            <div className="video-item mb-8">
              <h3 className={`text-xl font-semibold mb-3 flex items-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                <span className="bg-blue-600 text-white rounded-full w-7 h-7 inline-flex items-center justify-center mr-2 text-sm">
                  {currentVideoIndex + 1}
                </span>
                {course.content.videos[currentVideoIndex].title}
              </h3>
              <div className="video-container relative pt-0 overflow-hidden rounded-lg shadow-lg">
                <iframe
                  className="w-full aspect-video"
                  src={
                    course.content.videos[currentVideoIndex].includes("youtube.com/watch?v=")
                      ? course.content.videos[currentVideoIndex].replace("watch?v=", "embed/")
                      : course.content.videos[currentVideoIndex]
                  }
                  title={course.content.videos[currentVideoIndex].title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        ) : (
          <p className={`italic p-4 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>No videos available for this course.</p>
        )}

        {/* Test Section */}
        <div className={`mt-10 p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <TestComponent
            onTestCompleted={handleTestCompleted}
            studentEmail={currentUser?.email}
            courseId={course_id}
            videoId={currentVideoIndex + 1}
            key={currentVideoIndex}
          />
        </div>

        {/* Next Video Button */}
        <div className="next-video-button mt-8 flex justify-end">
          {currentVideoIndex < course.content.videos.length - 1 && (
            <button
              onClick={handleNextVideo}
              className={`py-2 px-6 rounded-lg transition-colors duration-300 flex items-center space-x-2 shadow-md ${
                theme === 'dark' 
                  ? 'bg-blue-700 hover:bg-blue-800 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <span>Next Video</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Button to Navigate to Summative Test */}
      <div className="summative-test-button mt-10 mb-8 flex justify-center">
        <button
          onClick={() => navigate(`/courses/${course_id}/summative-test`)}
          className={`py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg flex items-center space-x-2 transform hover:scale-105 ${
            theme === 'dark' 
              ? 'bg-green-700 hover:bg-green-800 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Take Summative Test</span>
        </button>
      </div>
    </div>
  );
};

export default CourseContent;
