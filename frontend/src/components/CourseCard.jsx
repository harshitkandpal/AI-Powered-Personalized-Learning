// CourseCard.jsx
import React from "react";

const CourseCard = ({ course }) => {
  return (
    <div className="course-card bg-white shadow-lg rounded-lg p-4 min-w-[250px]">
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-40 object-cover rounded-lg"
      />
      <h3 className="course-title text-lg font-bold mt-2">{course.title}</h3>
      <p className="course-rating text-sm text-gray-500">Rating: {course.rating}</p>
      <p className="course-price font-bold text-green-500">{course.price}</p>
    </div>
  );
};

export default CourseCard;
