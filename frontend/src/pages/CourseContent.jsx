import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase"; // Assuming firebase is set up
import { doc, getDoc } from "firebase/firestore"; // Firebase methods

const CourseContent = () => {
  const { course_id } = useParams();
  const [course, setCourse] = useState(null);

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

    fetchCourse();
  }, [course_id]);

  if (!course) {
    return <p>Loading course content...</p>;
  }
  return (
    <div className="course-content-page p-6">
      {/* Course Header */}
      <div className="course-header mb-6">
        <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
      </div>

      {/* Sequential Video Player */}
      <div className="course-videos">
        <h2 className="text-2xl font-bold mb-4">Course Videos</h2>
        {course.content?.videos?.length > 0 ? (
          <div className="video-list">
            {course.content.videos.map((video, index) => {
              const videoUrl = video;
              const embedUrl = videoUrl?.includes("youtube.com/watch?v=")
                ? videoUrl.replace("watch?v=", "embed/")
                : videoUrl;

              return (
                <div key={index} className="video-item mb-8">
                  <h3 className="text-xl font-semibold mb-2">
                    {index + 1}. {video.title}
                  </h3>
                  {embedUrl ? (
                    <iframe
                      width="100%"
                      height="450"
                      src={embedUrl}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  ) : (
                    <p>Invalid video URL</p>
                  )}
                  <p className="text-gray-600 mt-2">{video.duration} minutes</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No videos available.</p>
        )}
      </div>
    </div>
  );
};

export default CourseContent;
