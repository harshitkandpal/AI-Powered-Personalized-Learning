// CourseSlider.jsx
import React from "react";
import CourseCard from "./CourseCard";

const CourseSlider = ({ courses }) => {
  return (
    <div className="course-slider flex overflow-x-scroll p-4 space-x-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseSlider;
