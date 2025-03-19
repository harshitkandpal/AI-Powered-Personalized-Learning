import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase"; // Assuming you have firebase configured
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; // Firebase methods
import { useAuth } from "../AuthContext"; // Assuming you have an AuthContext for user

const CourseDetail = () => {
  const { course_id } = useParams(); // Extract course_id from URL
  const { currentUser } = useAuth(); // Get the current authenticated user
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [studentProgress, setStudentProgress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      const courseRef = doc(db, "courses", course_id); // Fetch course by course_id
      const courseSnapshot = await getDoc(courseRef);
      
      if (courseSnapshot.exists()) {
        setCourse(courseSnapshot.data());
      } else {
        console.log("Course not found!");
      }
    };

    const checkEnrollment = async () => {
      if (currentUser) {
        const studentRef = doc(db, "students", currentUser.email); // Fetch student by email
        const studentSnapshot = await getDoc(studentRef);

        if (studentSnapshot.exists()) {
          const studentData = studentSnapshot.data();
          const enrolled = studentData.enrolled_courses.some((course) => course.course_id === course_id);
          setIsEnrolled(enrolled);

          if (enrolled) {
            // Fetch progress for the specific course
            const progressData = studentData.progress.find((p) => p.course_id === course_id);
            setStudentProgress(progressData);
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

    // Update the student's enrolled_courses and progress
    await updateDoc(studentRef, {
      enrolled_courses: arrayUnion({ course_id }),
      progress: arrayUnion({
        course_id,
        completion_percentage: 0,
        last_accessed: new Date(),
      }),
    });

    setIsEnrolled(true);
    setStudentProgress({
      completion_percentage: 0,
      last_accessed: new Date(),
    });
  };

  if (!course) {
    return <p>Loading...</p>; // Display a loading state while fetching data
  }

  return (
    <div className="course-detail-container p-6">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="text-gray-600 mt-2">{course.description}</p>
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
