import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore"; // To fetch courses from Firestore
import { db } from "../firebase"; // Your Firebase config file
import CourseSlider from "../components/CourseSlider";
import Navbar from "../components/Navbar";

const Homepage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, "courses"); // Fetching from 'courses' collection in Firestore
      const courseSnapshot = await getDocs(coursesCollection);
      const courseList = courseSnapshot.docs.map((doc) => doc.data()); // Getting data for each course

      // Group courses by category
      const groupedCourses = courseList.reduce((acc, course) => {
        const { category } = course;

        // If the category doesn't exist in accumulator, create it
        if (!acc[category]) {
          acc[category] = [];
        }

        // Push the course into the corresponding category array
        acc[category].push(course);

        return acc;
      }, {});

      // Convert the grouped courses object into an array for easier mapping
      const categoryArray = Object.keys(groupedCourses).map((category) => ({
        name: category,
        courses: groupedCourses[category],
      }));

      setCategories(categoryArray);
    };

    fetchCourses();
  }, []);

  return (
    <div className="homepage-container">
      <Navbar />
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
