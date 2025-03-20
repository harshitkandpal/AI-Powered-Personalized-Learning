import React, { useState, useEffect } from "react";
import { db } from "../firebase.js";
import { useParams} from "react-router-dom"; 
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { useAuth } from "../AuthContext.jsx";

const SummativeTest = ({ onTestCompleted = () => {} }) => { 
  const { currentUser } = useAuth(); // Get the current user
  const studentEmail = currentUser?.email; // Extract the email from the authenticated user
  const { course_id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState({
    accuracy: 0,
    improvement: 0,
    time_taken: 0,
    difficulty: 0,
  });

  useEffect(() => {
    const summativeQuestions = [
      {
        id: 1,
        question: "What is the time complexity of binary search?",
        options: ["O(log n)", "O(n)", "O(n log n)", "O(n^2)"],
        correctAnswer: "O(log n)",
      },
      {
        id: 2,
        question: "Which data structure uses LIFO (Last In, First Out)?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: "Stack",
      },
      {
        id: 3,
        question: "Which sorting algorithm has the best average case time complexity?",
        options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
        correctAnswer: "Merge Sort",
      },
      {
        id: 4,
        question: "Which of the following is a self-balancing binary search tree?",
        options: ["Binary Search Tree", "AVL Tree", "Graph", "Hash Table"],
        correctAnswer: "AVL Tree",
      },
      {
        id: 5,
        question: "What is the space complexity of the depth-first search algorithm?",
        options: ["O(n)", "O(log n)", "O(1)", "O(V + E)"],
        correctAnswer: "O(V + E)",
      },
      {
        id: 6,
        question: "Which graph traversal algorithm uses a queue?",
        options: ["Depth-First Search", "Breadth-First Search", "Dijkstra's Algorithm", "A* Algorithm"],
        correctAnswer: "Breadth-First Search",
      },
      {
        id: 7,
        question: "What is the time complexity of finding an element in a hash table with a good hash function?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correctAnswer: "O(1)",
      },
      {
        id: 8,
        question: "What is the in-order traversal of a binary search tree?",
        options: ["Left, Root, Right", "Root, Left, Right", "Right, Root, Left", "Left, Right, Root"],
        correctAnswer: "Left, Root, Right",
      },
      {
        id: 9,
        question: "Which of the following algorithms is not stable?",
        options: ["Merge Sort", "Bubble Sort", "Heap Sort", "Insertion Sort"],
        correctAnswer: "Heap Sort",
      },
      {
        id: 10,
        question: "What is the time complexity of inserting an element into a max heap?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correctAnswer: "O(log n)",
      },
    ];    
    setQuestions(summativeQuestions);
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers({ ...userAnswers, [questionId]: answer });
  };

  const calculateScore = () => {
    let correctAnswersCount = 0;
    questions.forEach((question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswersCount++;
      }
    });
    const totalQuestions = questions.length;
    const accuracy = (correctAnswersCount / totalQuestions) * 100;
    const improvement = Math.floor(Math.random() * 11);
    const time_taken = Math.floor(Math.random() * 300);
    const difficulty = Math.floor(Math.random() * 5) + 1;

    return {
      accuracy,
      improvement,
      time_taken,
      difficulty,
    };
  };

  const handleSubmitTest = async () => {
    if (!studentEmail) {
      console.error("Student email is undefined.");
      return;
    }
  
    // Calculate the test score
    const { accuracy, improvement, time_taken, difficulty } = calculateScore();
    setTestScore({ accuracy, improvement, time_taken, difficulty });
  
    try {
      // Send test data to the backend and receive the learning speed score (lss)
      const response = await fetch("http://127.0.0.1:5000/track-learning-speed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accuracy,
          improvement,
          time_taken,
          difficulty,
        }),
      });
  
      const lss = await response.json();
      const strengths = ["Algorithms", "Databases", "CSS", "React"]; // Example strengths
  
      if (!lss) {
        console.error("Received undefined LSS from backend.");
        return;
      }
  
      if (onTestCompleted) {
        onTestCompleted(lss, strengths);
      } else {
        console.error("onTestCompleted function not passed as a prop.");
      }
  
      setTestSubmitted(true);
  
      // Ensure courseId is defined and has a valid value before proceeding
      if (!course_id) {
        console.error("Course ID is undefined.");
        return;
      }
  
      // Structure of the progress object with nested LSS array
      const progressData = {
        course_id: course_id || "default_course_id",  // Ensure courseId is valid
        LSS: arrayUnion({  // Append the new LSS data as part of an array
          score: lss || 0,  // Learning Speed Score (fallback to 0 if undefined)
          date: Timestamp.now(),  // Store the timestamp of the summative test completion
          accuracy,  // Include the test accuracy
          improvement,  // Include improvement score
          time_taken,  // Include time taken for the test
          difficulty,  // Include difficulty level
        }),
        strengths: strengths.length ? strengths : ["No strengths"],  // Ensure strengths array is not empty
        completion_percentage: 100,  // Mark course as fully completed
        last_accessed: Timestamp.now(),  // Store the timestamp of the last access
      };
  
      console.log("Updating progress with data:", progressData);
  
      // Update the student's progress in Firestore with nested LSS array
      const studentRef = doc(db, "students", studentEmail); 
      await updateDoc(studentRef, {
        [`progress.${course_id}`]: progressData,  // Update progress for the specific course
      });
  
    } catch (error) {
      console.error("Error updating student progress:", error);
    }
  };
  

  if (testSubmitted) {
    return <p>Test completed! Your progress has been updated.</p>;
  }

  return (
    <div className="test-section mt-6">
      <h2 className="text-2xl font-bold mb-4">Summative Test</h2>
      <div className="test-form mb-4">
        {questions.map((question) => (
          <div key={question.id} className="question-item mb-6">
            <h3 className="text-lg font-bold mb-2">{question.question}</h3>
            {question.options.map((option, index) => (
              <label key={index} className="block mb-2">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  onChange={() => handleAnswerChange(question.id, option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmitTest}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Submit Test
      </button>
    </div>
  );
};

export default SummativeTest;
