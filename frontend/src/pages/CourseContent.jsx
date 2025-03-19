import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase"; // Assuming firebase is set up
import { doc, getDoc } from "firebase/firestore"; // Firebase methods

const CourseContent = () => {
  const { course_id } = useParams();
  const [courseContent, setCourseContent] = useState(null);

  useEffect(() => {
    const fetchCourseContent = async () => {
      const courseRef = doc(db, "courses", course_id);
      const courseSnapshot = await getDoc(courseRef);

      if (courseSnapshot.exists()) {
        setCourseContent(courseSnapshot.data().content);
      } else {
        console.log("Course not found!");
      }
    };

    fetchCourseContent();
  }, [course_id]);

  if (!courseContent) {
    return <p>Loading course content...</p>;
  }

  return (
    <div className="course-content-page p-6">
      <h1 className="text-3xl font-bold mb-4">Course Content</h1>

      {/* Display Videos */}
      <div className="course-videos mb-6">
        <h2 className="text-2xl font-bold">Videos</h2>
        {courseContent.videos?.length > 0 ? (
          <ul className="list-disc ml-6">
            {courseContent.videos.map((video, index) => (
              <li key={index}>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  {video.title} - {video.duration} minutes
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No videos available.</p>
        )}
      </div>

      {/* Display PDFs */}
      <div className="course-pdfs mb-6">
        <h2 className="text-2xl font-bold">PDFs</h2>
        {courseContent.pdfs?.length > 0 ? (
          <ul className="list-disc ml-6">
            {courseContent.pdfs.map((pdf, index) => (
              <li key={index}>
                <a
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  {pdf.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No PDFs available.</p>
        )}
      </div>

      {/* Display External Resources */}
      <div className="course-links mb-6">
        <h2 className="text-2xl font-bold">External Resources</h2>
        {courseContent.hyperlinks?.length > 0 ? (
          <ul className="list-disc ml-6">
            {courseContent.hyperlinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No external resources available.</p>
        )}
      </div>
    </div>
  );
};

export default CourseContent;
