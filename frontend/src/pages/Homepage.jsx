// Homepage.jsx
import React from "react";
import CourseSlider from "../components/CourseSlider";

const Homepage = () => {
  const categories = [
    {
        name: "Featured Courses",
        courses: [
          { id: 3, title: "Python for Data Science", image: "python-course.jpg", rating: 4.6, price: "$29.99" },
          { id: 4, title: "Machine Learning A-Z", image: "ml-course.jpg", rating: 4.8, price: "$34.99" },
          { id: 2, title: "Node.js Mastery", image: "node-course.jpg", rating: 4.7, price: "$24.99" },
          { id: 6, title: "Machine Learning A-Z", image: "ml-course.jpg", rating: 4.8, price: "$34.99" },
          { id: 1, title: "React for Beginners", image: "react-course.jpg", rating: 4.5, price: "$19.99" },
          { id: 5, title: "Python for Data Science", image: "python-course.jpg", rating: 4.6, price: "$29.99" },
        ],
      },
    {
      name: "Web Development",
      courses: [
        { id: 1, title: "React for Beginners", image: "react-course.jpg", rating: 4.5, price: "$19.99" },
        { id: 2, title: "Node.js Mastery", image: "node-course.jpg", rating: 4.7, price: "$24.99" },
      ],
    },
    {
      name: "Data Science",
      courses: [
        { id: 3, title: "Python for Data Science", image: "python-course.jpg", rating: 4.6, price: "$29.99" },
        { id: 4, title: "Machine Learning A-Z", image: "ml-course.jpg", rating: 4.8, price: "$34.99" },
      ],
    },
    {
        name: "AI/ML",
        courses: [
          { id: 5, title: "Python for Data Science", image: "python-course.jpg", rating: 4.6, price: "$29.99" },
          { id: 6, title: "Machine Learning A-Z", image: "ml-course.jpg", rating: 4.8, price: "$34.99" },
        ],
      },
  ];

  return (
    <div className="homepage-container">
      {categories.map((category, idx) => (
        <div key={idx} className="category-section">
          <h2 className="category-title text-xl font-bold mb-4">{category.name}</h2>
          <CourseSlider courses={category.courses} />
        </div>
      ))}
    </div>
  );
};

export default Homepage;
