
// export default Homepage;
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CourseSlider from "../components/CourseSlider";
import Navbar from "../components/Navbar";
import Chatbot from "../components/ChatBot"; // Import Chatbot

const Homepage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, "courses");
      const courseSnapshot = await getDocs(coursesCollection);
      const courseList = courseSnapshot.docs.map((doc) => doc.data());
      const groupedCourses = courseList.reduce((acc, course) => {
        const { category } = course;
        if (!acc[category]) acc[category] = [];
        acc[category].push(course);
        return acc;
      }, {});
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
          <h2 className="category-title text-xl font-bold mb-4 m-6 mx-10">{category.name}</h2>
          <CourseSlider courses={category.courses} />
        </div>
      ))}
      <Chatbot /> {/* Add Chatbot Here */}
    </div>
  );
};

export default Homepage;
