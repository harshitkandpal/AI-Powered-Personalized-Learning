import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard"; // Assuming the CourseCard component is in the components folder
import { db } from "../firebase"; // Assuming firebase is set up
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../AuthContext"; // Assuming you're using AuthContext to get current user

const MyLearning = () => {
  const { currentUser } = useAuth(); // Get the current user
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (currentUser) {
        try {
          // Fetch the student document
          const studentRef = doc(db, "students", currentUser.email);
          const studentSnapshot = await getDoc(studentRef);
          
          if (studentSnapshot.exists()) {
            const studentData = studentSnapshot.data();
            console.log(studentData.enrolled_courses);

            // Get array of course IDs
            const enrolledCourseIds = studentData.enrolled_courses.map(course => course.course_id);

            // Now, fetch details of each course using the enrolled course IDs
            const coursePromises = enrolledCourseIds.map(async (courseId) => {
              const courseRef = doc(db, "courses", courseId);
              const courseSnapshot = await getDoc(courseRef);
              return courseSnapshot.exists() ? courseSnapshot.data() : null;
            });

            const courses = await Promise.all(coursePromises);
            // Filter out any null values (in case a course no longer exists)
            setEnrolledCourses(courses.filter(course => course !== null));
          }
        } catch (error) {
          console.error("Error fetching enrolled courses: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEnrolledCourses();
  }, [currentUser]);

  if (loading) {
    return <p>Loading your courses...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="my-learning-page p-6">
        <h1 className="text-3xl font-bold mb-6">My Learning</h1>
        {enrolledCourses.length > 0 ? (
          <div className="course-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>
        ) : (
          <p>You are not enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyLearning;
