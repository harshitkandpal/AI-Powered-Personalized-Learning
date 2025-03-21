// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db } from "../firebase"; // Assuming you have firebase configured
// import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; // Firebase methods
// import { useAuth } from "../AuthContext"; // Assuming you have an AuthContext for user

// import { Timestamp } from "firebase/firestore"; // Add this to convert Firebase Timestamp

// const CourseDetail = () => {
//   const { course_id } = useParams(); // Extract course_id from URL
//   const { currentUser } = useAuth(); // Get the current authenticated user
//   const [course, setCourse] = useState(null);
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [studentProgress, setStudentProgress] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCourse = async () => {
//       const courseRef = doc(db, "courses", course_id);
//       const courseSnapshot = await getDoc(courseRef);
    
//       if (courseSnapshot.exists()) {
//         setCourse(courseSnapshot.data());
//       } else {
//         console.log("Course not found!");
//       }
//     };
  
//     const checkEnrollment = async () => {
//       if (currentUser) {
//         const studentRef = doc(db, "students", currentUser.email);
//         const studentSnapshot = await getDoc(studentRef);
    
//         if (studentSnapshot.exists()) {
//           const studentData = studentSnapshot.data();
    
//           // Check if the student is enrolled in the course by checking enrolled_courses array
//           const enrolled = studentData.enrolled_courses.includes(course_id);
//           setIsEnrolled(enrolled);
    
//           if (enrolled) {
//             // Access the student's progress in this course
//             const courseProgress = studentData.progress[course_id];
    
//             if (courseProgress) {
//               // Format progress for display
//               const formattedProgress = {
//                 ...courseProgress,
//                 last_accessed: courseProgress.last_accessed instanceof Timestamp
//                   ? courseProgress.last_accessed.toDate().toLocaleString()
//                   : courseProgress.last_accessed,
//               };
    
//               console.log("Formatted progress:", formattedProgress); // Debugging
//               setStudentProgress(formattedProgress);
//             } else {
//               console.log("No progress found for this course");
//               setStudentProgress({ completion_percentage: 0 });
//             }
//           }
//         }
//       }
//     };
  
//     fetchCourse();
//     checkEnrollment();
//   }, [course_id, currentUser]);
  
//   const handleEnrollNow = async () => {
//     if (!currentUser) {
//       navigate("/login"); // Redirect to login if not authenticated
//       return;
//     }
  
//     const studentRef = doc(db, "students", currentUser.email);
  
//     // Update the student's enrolled_courses and set the progress for this course
//     await updateDoc(studentRef, {
//       enrolled_courses: arrayUnion(course_id),
//       [`progress.${course_id}`]: {
//         completion_percentage: 0,
//         last_accessed: new Date(),
//         // Add other progress data fields as needed
//         accuracy: 0,
//         improvement: 0,
//         time_taken: 0,
//         difficulty: 'beginner', // Default values, can be updated later
//       },
//     });
  
//     setIsEnrolled(true);
//     setStudentProgress({
//       completion_percentage: 0,
//       last_accessed: new Date().toLocaleString(),
//     });
//   };

//   if (!course) {
//     return <p>Loading...</p>; // Display a loading state while fetching data
//   }

//   return (
//     <div className="course-detail-container p-6 px-36">
//       {/* Course Header */}
//       <div className="course-header mb-6">
//         <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
//         <img
//           src={course.image}
//           alt={course.title}
//           className="w-full h-64 object-cover rounded-lg mb-4"
//         />
//         <p className="text-gray-700 text-lg mb-4">{course.description}</p>
//         <div className="course-meta text-gray-600">
//           <p>Category: {course.category}</p>
//           <p>Difficulty Level: {course.difficulty_level}</p>
//           <p>Estimated Duration: {course.duration} hours</p>
//         </div>
//       </div>
//       <p className="text-lg font-bold text-green-500 mt-2">Price: {course.price}</p>
//       <p className="text-gray-500">Category: {course.category}</p>
//       <p className="text-gray-500">Difficulty: {course.difficulty_level}</p>
//       <p className="text-gray-500">Estimated Duration: {course.duration} hours</p>

//       {isEnrolled ? (
//         <button
//           onClick={() => navigate(`/course/${course_id}/learn`)} // Redirect to course learning page
//           className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
//         >
//           Continue Learning {studentProgress?.completion_percentage}% Completed
//         </button>
//       ) : (
//         <button
//           onClick={handleEnrollNow}
//           className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
//         >
//           Enroll Now
//         </button>
//       )}
//     </div>
//   );
// };

// export default CourseDetail;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase"; // Assuming you have firebase configured
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; // Firebase methods
import { useAuth } from "../AuthContext"; // Assuming you have an AuthContext for user
import { Timestamp } from "firebase/firestore"; // Add this to convert Firebase Timestamp

const CourseDetail = () => {
  const { course_id } = useParams(); // Extract course_id from URL
  const { currentUser } = useAuth(); // Get the current authenticated user
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [studentProgress, setStudentProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseRef = doc(db, "courses", course_id);
        const courseSnapshot = await getDoc(courseRef);
      
        if (courseSnapshot.exists()) {
          setCourse(courseSnapshot.data());
        } else {
          console.log("Course not found!");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const checkEnrollment = async () => {
      if (currentUser) {
        try {
          const studentRef = doc(db, "students", currentUser.email);
          const studentSnapshot = await getDoc(studentRef);
      
          if (studentSnapshot.exists()) {
            const studentData = studentSnapshot.data();
      
            // Check if the student is enrolled in the course by checking enrolled_courses array
            const enrolled = studentData.enrolled_courses?.includes(course_id) || false;
            setIsEnrolled(enrolled);
      
            if (enrolled) {
              // Access the student's progress in this course
              const courseProgress = studentData.progress?.[course_id];
      
              if (courseProgress) {
                // Format progress for display
                const formattedProgress = {
                  ...courseProgress,
                  last_accessed: courseProgress.last_accessed instanceof Timestamp
                    ? courseProgress.last_accessed.toDate().toLocaleString()
                    : courseProgress.last_accessed,
                };
      
                setStudentProgress(formattedProgress);
              } else {
                setStudentProgress({ completion_percentage: 0 });
              }
            }
          }
        } catch (error) {
          console.error("Error checking enrollment:", error);
        }
      }
    };
  
    fetchCourse();
    checkEnrollment();
  }, [course_id, currentUser]);
  
  const handleEnrollNow = async () => {
    if (!currentUser) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }
  
    try {
      const studentRef = doc(db, "students", currentUser.email);
    
      // Update the student's enrolled_courses and set the progress for this course
      await updateDoc(studentRef, {
        enrolled_courses: arrayUnion(course_id),
        [`progress.${course_id}`]: {
          completion_percentage: 0,
          last_accessed: new Date(),
          // Add other progress data fields as needed
          accuracy: 0,
          improvement: 0,
          time_taken: 0,
          difficulty: 'beginner', // Default values, can be updated later
        },
      });
    
      setIsEnrolled(true);
      setStudentProgress({
        completion_percentage: 0,
        last_accessed: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700">Course not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition duration-300"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Course Header Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="relative">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-72 sm:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Course category badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {course.category}
            </span>
          </div>
          
          {/* Course difficulty badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              course.difficulty_level === 'beginner' ? 'bg-green-500 text-white' :
              course.difficulty_level === 'intermediate' ? 'bg-yellow-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              {course.difficulty_level}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{course.duration} hours</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{course.modules?.length || 0} modules</span>
            </div>
            
            <div className="flex items-center text-green-600 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{course.price === "Free" ? "Free" : `$${course.price}`}</span>
            </div>
          </div>
          
          <p className="text-gray-700 text-lg mb-8">{course.description}</p>
          
          {isEnrolled ? (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Course Progress</span>
                  <span className="text-blue-600 font-semibold">{studentProgress?.completion_percentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${studentProgress?.completion_percentage || 0}%` }}
                  ></div>
                </div>
                {studentProgress?.last_accessed && (
                  <p className="text-sm text-gray-500 mt-2">Last accessed: {studentProgress.last_accessed}</p>
                )}
              </div>
              
              <button
                onClick={() => navigate(`/course/${course_id}/learn`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Continue Learning
              </button>
            </div>
          ) : (
            <button
              onClick={handleEnrollNow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Enroll Now
            </button>
          )}
        </div>
      </div>
      
      {/* What You'll Learn Section - Optional addition */}
      {course.what_youll_learn && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.what_youll_learn.map((item, index) => (
              <li key={index} className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
