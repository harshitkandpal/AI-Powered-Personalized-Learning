import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  // Truncate description to 10-12 words
  const truncateDescription = (desc) => {
    const words = desc.split(" ");
    return words.slice(0, 12).join(" ") + (words.length > 12 ? "..." : "");
  };

  return (
    <Link
      to={`/course/${course.course_id}`}
      className="course-card-link block bg-white shadow-lg rounded-lg p-4 min-w-[250px] hover:shadow-xl transition-shadow duration-300 max-w-[350px]"
    >
      <div>
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-40 object-cover rounded-lg"
        />
        <h3 className="course-title text-lg font-bold mt-2">{course.title}</h3>
        
        {/* Truncated Description */}
        <p className="course-description text-gray-600">
          {truncateDescription(course.description)}
        </p>

        {/* Price and Duration in the same row */}
        <div className="course-info flex justify-between items-center mt-2">
          <p className="course-duration text-gray-500">
            {course.duration} hours
          </p>
          <p className="course-price font-bold text-green-500">
            $ {course.price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
