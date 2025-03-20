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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      const courseRef = doc(db, "courses", course_id);
      const courseSnapshot = await getDoc(courseRef);
    
      if (courseSnapshot.exists()) {
        setCourse(courseSnapshot.data());
      } else {
        console.log("Course not found!");
      }
    };
  
    const checkEnrollment = async () => {
      if (currentUser) {
        const studentRef = doc(db, "students", currentUser.email);
        const studentSnapshot = await getDoc(studentRef);
    
        if (studentSnapshot.exists()) {
          const studentData = studentSnapshot.data();
    
          // Check if the student is enrolled in the course
          const enrolled = studentData.enrolled_courses.some(
            (enrolledCourse) => enrolledCourse.course_id === course_id
          );
          setIsEnrolled(enrolled);
    
          if (enrolled) {
            // Access the progress array
            const progressArray = studentData.progress || [];
    
            // Find the specific course progress in the array using the course_id
            const courseProgress = progressArray.find(
              (progressEntry) => progressEntry.course_id === course_id
            );
    
            if (courseProgress) {
              // Format progress for display
              const formattedProgress = {
                ...courseProgress,
                last_accessed: courseProgress.last_accessed instanceof Timestamp
                  ? courseProgress.last_accessed.toDate().toLocaleString()
                  : courseProgress.last_accessed,
              };
    
              console.log("Formatted progress:", formattedProgress); // Debugging
              setStudentProgress(formattedProgress);
            } else {
              console.log("No progress found for this course");
              setStudentProgress({ completion_percentage: 0 });
            }
          }
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
  
    const studentRef = doc(db, "students", currentUser.email);
  
    // Update the student's enrolled_courses and set the progress for this course
    await updateDoc(studentRef, {
      enrolled_courses: arrayUnion({ course_id }),
      [`progress.${course_id}`]: {
        completion_percentage: 0,
        last_accessed: new Date(),
      },
    });
  
    setIsEnrolled(true);
    setStudentProgress({
      completion_percentage: 0,
      last_accessed: new Date().toLocaleString(),
    });
  };
  

  if (!course) {
    return <p>Loading...</p>; // Display a loading state while fetching data
  }

  return (
    <div className="course-detail-container p-6 px-36">
      {/* Course Header */}
      <div className="course-header mb-6">
        <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-gray-700 text-lg mb-4">{course.description}</p>
        <div className="course-meta text-gray-600">
          <p>Category: {course.category}</p>
          <p>Difficulty Level: {course.difficulty_level}</p>
          <p>Estimated Duration: {course.duration} hours</p>
        </div>
      </div>
      <p className="text-lg font-bold text-green-500 mt-2">Price: {course.price}</p>
      <p className="text-gray-500">Category: {course.category}</p>
      <p className="text-gray-500">Difficulty: {course.difficulty_level}</p>
      <p className="text-gray-500">Estimated Duration: {course.duration} hours</p>

      {isEnrolled ? (
        <button
          onClick={() => navigate(`/course/${course_id}/learn`)} // Redirect to course learning page
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
        >
          Continue Learning {studentProgress?.completion_percentage}% Completed
        </button>
      ) : (
        <button
          onClick={handleEnrollNow}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Enroll Now
        </button>
      )}
    </div>
  );
};

export default CourseDetail;
