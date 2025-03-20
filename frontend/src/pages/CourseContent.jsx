import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import TestComponent from "../components/TestComponent"; // Import TestComponent

const CourseContent = () => {
  const { course_id } = useParams(); // Extract course_id from URL
  const { currentUser } = useAuth(); // Get current user's email
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

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
        const studentRef = doc(db, "students", currentUser.email); // Use currentUser's email as document ID
        const studentSnapshot = await getDoc(studentRef);

        if (studentSnapshot.exists()) {
          const studentData = studentSnapshot.data();
          console.log(studentData);

          // Find the progress for the current course in the array
          const courseProgress = studentData.progress.find(
            (item) => item.course_id === course_id
          );

          // Set the progress value if found, otherwise set to 0
          setProgress(courseProgress ? courseProgress.completion_percentage : 0);
        }
      }
    };

    fetchCourse();
    fetchProgress();
  }, [course_id, currentUser]);

  // Update progress after passing test
  const handleTestCompleted = async (lss, strengths) => {
    const newProgress = Math.min(100, progress + 10); // Increment by 10% for each test passed

    // Ensure that lss and strengths are valid before updating Firebase
    if (lss === undefined || strengths === undefined) {
      console.error("LSS or strengths are undefined. Skipping LSS/strengths update.");
      return;
    }

    setProgress(newProgress);

    if (currentUser) {
      const studentRef = doc(db, "students", currentUser.email);
      const studentSnapshot = await getDoc(studentRef);
      const studentData = studentSnapshot.data();

      // Find the specific progress entry for the course
      const progressIndex = studentData.progress.findIndex(
        (item) => item.course_id === course_id
      );

      if (progressIndex !== -1) {
        // Update the progress in the array for the current course
        studentData.progress[progressIndex].completion_percentage = newProgress;
        studentData.progress[progressIndex].last_accessed = new Date();
        studentData.progress[progressIndex].LSS = { LSS: lss }; // Update LSS
        studentData.strengths = strengths; // Update strengths
      } else {
        // If progress entry doesn't exist, create a new one
        studentData.progress.push({
          course_id,
          completion_percentage: newProgress,
          last_accessed: new Date(),
          LSS: { LSS: lss },
        });
        studentData.strengths = strengths; // Set strengths
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

    // Move to next video after test completion
    if (currentVideoIndex < course.content.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }

    // Show result to the user
    alert(`Test completed. Progress: ${newProgress}%`);
  };

  if (!course) {
    return <p>Loading course content...</p>;
  }

  return (
    <div className="course-content-page p-6 px-36">
      <div className="course-header mb-6">
        <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
        <p>Progress: {progress}%</p>
      </div>

      {/* Sequential Video Player */}
      <div className="course-videos">
        <h2 className="text-2xl font-bold mb-4">Course Videos</h2>
        {course.content?.videos?.length > 0 ? (
          <div className="video-list">
            <div className="video-item mb-8">
              <h3 className="text-xl font-semibold mb-2">
                {currentVideoIndex + 1}. {course.content.videos[currentVideoIndex].title}
              </h3>
              <iframe
                width="100%"
                height="650"
                src={
                  course.content.videos[currentVideoIndex].includes("youtube.com/watch?v=")
                    ? course.content.videos[currentVideoIndex].replace("watch?v=", "embed/")
                    : course.content.videos[currentVideoIndex]
                }
                title={course.content.videos[currentVideoIndex].title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        ) : (
          <p>No videos available.</p>
        )}
      </div>

      {/* Test Section */}
      <TestComponent
        onTestCompleted={handleTestCompleted} // Pass the handleTestCompleted function
        studentEmail={currentUser?.email}     // Pass the current user's email as studentEmail
        courseId={course_id}                 // Pass courseId
      />
    </div>
  );
};

export default CourseContent;
