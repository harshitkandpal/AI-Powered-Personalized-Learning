import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase"; // Assuming firebase is set up
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firebase methods
import { useAuth } from "../AuthContext"; // Assuming you're using AuthContext to get current user

const CourseContent = () => {
  const { course_id } = useParams();
  const { currentUser } = useAuth(); // Get the current user
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0); // Track course progress
  const [testPassed, setTestPassed] = useState(false); // Track test completion

  useEffect(() => {
    // Fetch course content
    const fetchCourse = async () => {
      const courseRef = doc(db, "courses", course_id);
      const courseSnapshot = await getDoc(courseRef);

      if (courseSnapshot.exists()) {
        setCourse(courseSnapshot.data());
      } else {
        console.log("Course not found!");
      }
    };

    // Fetch student's progress
    const fetchProgress = async () => {
      if (currentUser) {
        const studentRef = doc(db, "students", currentUser.email);
        const studentSnapshot = await getDoc(studentRef);

        if (studentSnapshot.exists()) {
          const studentData = studentSnapshot.data();
          const courseProgress = studentData.progress?.[course_id];
          setProgress(courseProgress?.completion_percentage || 0);
        }
      }
    };

    fetchCourse();
    fetchProgress();
  }, [course_id, currentUser]);

  // Update progress in Firestore after test completion
  const updateProgress = async (newProgress) => {
    if (currentUser) {
      try {
        const studentRef = doc(db, "students", currentUser.email);
        await updateDoc(studentRef, {
          [`progress.${course_id}`]: {
            completion_percentage: newProgress,
            last_accessed: new Date(),
          },
        });
      } catch (error) {
        console.error("Error updating progress: ", error);
      }
    }
  };

  // Simulate test completion
  const handleTestCompletion = () => {
    setTestPassed(true);
    const newProgress = progress + 10; // Increase progress by 10% after passing a test
    setProgress(newProgress);
    updateProgress(newProgress);
  };

  if (!course) {
    return <p>Loading course content...</p>;
  }

  return (
    <div className="course-content-page p-6">
      {/* Course Header */}
      <div className="course-header mb-6">
        <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
        <p>Progress: {progress}%</p>
      </div>

      {/* Sequential Video Player */}
      <div className="course-videos">
        <h2 className="text-2xl font-bold mb-4">Course Videos</h2>
        {course.content?.videos?.length > 0 ? (
          <div className="video-list">
            {course.content.videos.map((video, index) => (
              <div key={index} className="video-item mb-8">
                <h3 className="text-xl font-semibold mb-2">
                  {index + 1}. {video.title}
                </h3>
                <iframe
                  width="100%"
                  height="450"
                  src={video.includes("youtube.com/watch?v=") ? video.replace("watch?v=", "embed/") : video}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            ))}
          </div>
        ) : (
          <p>No videos available.</p>
        )}
      </div>

      {/* Test Section */}
      <div className="test-section mt-6">
        <h2 className="text-2xl font-bold mb-4">Course Test</h2>
        {!testPassed ? (
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={handleTestCompletion}
          >
            Take Test to Move Forward
          </button>
        ) : (
          <p>Congratulations! You passed the test and your progress has been updated.</p>
        )}
      </div>
    </div>
  );
};

export default CourseContent;
