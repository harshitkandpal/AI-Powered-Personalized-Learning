// import React, { useState, useEffect } from "react";
// import { db } from "../firebase.js";
// import { useParams} from "react-router-dom"; 
// import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
// import { useAuth } from "../AuthContext.jsx";

// const SummativeTest = ({ onTestCompleted = () => {} }) => { 
//   const { currentUser } = useAuth(); // Get the current user
//   const studentEmail = currentUser?.email; // Extract the email from the authenticated user
//   const { course_id } = useParams();
//   const [questions, setQuestions] = useState([]);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [testSubmitted, setTestSubmitted] = useState(false);
//   const [testScore, setTestScore] = useState({
//     accuracy: 0,
//     improvement: 0,
//     time_taken: 0,
//     difficulty: 0,
//   });

//   useEffect(() => {
//     const summativeQuestions = [
//       {
//         id: 1,
//         question: "What is the time complexity of binary search?",
//         options: ["O(log n)", "O(n)", "O(n log n)", "O(n^2)"],
//         correctAnswer: "O(log n)",
//       },
//       {
//         id: 2,
//         question: "Which data structure uses LIFO (Last In, First Out)?",
//         options: ["Queue", "Stack", "Array", "Linked List"],
//         correctAnswer: "Stack",
//       },
//       {
//         id: 3,
//         question: "Which sorting algorithm has the best average case time complexity?",
//         options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
//         correctAnswer: "Merge Sort",
//       },
//       {
//         id: 4,
//         question: "Which of the following is a self-balancing binary search tree?",
//         options: ["Binary Search Tree", "AVL Tree", "Graph", "Hash Table"],
//         correctAnswer: "AVL Tree",
//       },
//       {
//         id: 5,
//         question: "What is the space complexity of the depth-first search algorithm?",
//         options: ["O(n)", "O(log n)", "O(1)", "O(V + E)"],
//         correctAnswer: "O(V + E)",
//       },
//       {
//         id: 6,
//         question: "Which graph traversal algorithm uses a queue?",
//         options: ["Depth-First Search", "Breadth-First Search", "Dijkstra's Algorithm", "A* Algorithm"],
//         correctAnswer: "Breadth-First Search",
//       },
//       {
//         id: 7,
//         question: "What is the time complexity of finding an element in a hash table with a good hash function?",
//         options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
//         correctAnswer: "O(1)",
//       },
//       {
//         id: 8,
//         question: "What is the in-order traversal of a binary search tree?",
//         options: ["Left, Root, Right", "Root, Left, Right", "Right, Root, Left", "Left, Right, Root"],
//         correctAnswer: "Left, Root, Right",
//       },
//       {
//         id: 9,
//         question: "Which of the following algorithms is not stable?",
//         options: ["Merge Sort", "Bubble Sort", "Heap Sort", "Insertion Sort"],
//         correctAnswer: "Heap Sort",
//       },
//       {
//         id: 10,
//         question: "What is the time complexity of inserting an element into a max heap?",
//         options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
//         correctAnswer: "O(log n)",
//       },
//     ];    
//     setQuestions(summativeQuestions);
//   }, []);

//   const handleAnswerChange = (questionId, answer) => {
//     setUserAnswers({ ...userAnswers, [questionId]: answer });
//   };

//   const calculateScore = () => {
//     let correctAnswersCount = 0;
//     questions.forEach((question) => {
//       if (userAnswers[question.id] === question.correctAnswer) {
//         correctAnswersCount++;
//       }
//     });
//     const totalQuestions = questions.length;
//     const accuracy = (correctAnswersCount / totalQuestions) * 100;
//     const improvement = Math.floor(Math.random() * 11);
//     const time_taken = Math.floor(Math.random() * 300);
//     const difficulty = Math.floor(Math.random() * 5) + 1;

//     return {
//       accuracy,
//       improvement,
//       time_taken,
//       difficulty,
//     };
//   };

//   const handleSubmitTest = async () => {
//     if (!studentEmail) {
//       console.error("Student email is undefined.");
//       return;
//     }
  
//     // Calculate the test score
//     const { accuracy, improvement, time_taken, difficulty } = calculateScore();
//     setTestScore({ accuracy, improvement, time_taken, difficulty });
  
//     try {
//       // Send test data to the backend and receive the learning speed score (lss)
//       const response = await fetch("http://127.0.0.1:5000/track-learning-speed", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           accuracy,
//           improvement,
//           time_taken,
//           difficulty,
//         }),
//       });
  
//       const lss = await response.json();
//       const strengths = ["Algorithms", "Databases", "CSS", "React"]; // Example strengths
  
//       if (!lss) {
//         console.error("Received undefined LSS from backend.");
//         return;
//       }
  
//       if (onTestCompleted) {
//         onTestCompleted(lss, strengths);
//       } else {
//         console.error("onTestCompleted function not passed as a prop.");
//       }
  
//       setTestSubmitted(true);
  
//       // Ensure courseId is defined and has a valid value before proceeding
//       if (!course_id) {
//         console.error("Course ID is undefined.");
//         return;
//       }
  
//       // Structure of the progress object with nested LSS array
//       const progressData = {
//         course_id: course_id || "default_course_id",  // Ensure courseId is valid
//         LSS: arrayUnion({  // Append the new LSS data as part of an array
//           score: lss || 0,  // Learning Speed Score (fallback to 0 if undefined)
//           date: Timestamp.now(),  // Store the timestamp of the summative test completion
//           accuracy,  // Include the test accuracy
//           improvement,  // Include improvement score
//           time_taken,  // Include time taken for the test
//           difficulty,  // Include difficulty level
//         }),
//         strengths: strengths.length ? strengths : ["No strengths"],  // Ensure strengths array is not empty
//         completion_percentage: 100,  // Mark course as fully completed
//         last_accessed: Timestamp.now(),  // Store the timestamp of the last access
//       };
  
//       console.log("Updating progress with data:", progressData);
  
//       // Update the student's progress in Firestore with nested LSS array
//       const studentRef = doc(db, "students", studentEmail); 
//       await updateDoc(studentRef, {
//         [`progress.${course_id}`]: progressData,  // Update progress for the specific course
//       });
  
//     } catch (error) {
//       console.error("Error updating student progress:", error);
//     }
//   };
  

//   if (testSubmitted) {
//     return <p>Test completed! Your progress has been updated.</p>;
//   }

//   return (
//     <div className="test-section mt-8 bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
//   <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Summative Test</h2>
//   <div className="test-form space-y-8">
//     {questions.map((question) => (
//       <div key={question.id} className="question-item bg-gray-50 p-5 rounded-lg border border-gray-200">
//         <h3 className="text-lg font-semibold mb-3 text-gray-700">{question.question}</h3>
//         <div className="space-y-3">
//           {question.options.map((option, index) => (
//             <label 
//               key={index} 
//               className="flex items-start p-3 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
//             >
//               <input
//                 type="radio"
//                 name={`question-${question.id}`}
//                 value={option}
//                 onChange={() => handleAnswerChange(question.id, option)}
//                 className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
//               />
//               <span className="text-gray-700">{option}</span>
//             </label>
//           ))}
//         </div>
//       </div>
//     ))}
//   </div>
//   <button
//     onClick={handleSubmitTest}
//     className="mt-8 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//   >
//     Submit Test
//   </button>
// </div>
//   );
// };

// export default SummativeTest;
import React, { useState, useEffect } from "react";
import { db } from "../firebase.js";
import { useParams } from "react-router-dom"; 
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { useAuth } from "../AuthContext.jsx";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../components/ThemeContext";

const SummativeTest = ({ onTestCompleted = () => {} }) => { 
  const { currentUser } = useAuth();
  const studentEmail = currentUser?.email;
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
  const { theme, toggleTheme } = useTheme();

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
        course_id: course_id || "default_course_id",
        LSS: arrayUnion({
          score: lss || 0,
          date: Timestamp.now(),
          accuracy,
          improvement,
          time_taken,
          difficulty,
        }),
        strengths: strengths.length ? strengths : ["No strengths"],
        completion_percentage: 100,
        last_accessed: Timestamp.now(),
      };
  
      console.log("Updating progress with data:", progressData);
  
      // Update the student's progress in Firestore with nested LSS array
      const studentRef = doc(db, "students", studentEmail); 
      await updateDoc(studentRef, {
        [`progress.${course_id}`]: progressData,
      });
  
    } catch (error) {
      console.error("Error updating student progress:", error);
    }
  };
  
  if (testSubmitted) {
    return (
      <div className={`min-h-screen p-6 flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className={`max-w-xl p-8 rounded-lg shadow-md text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-medium">Test completed! Your progress has been updated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <FaSun className="text-yellow-500 w-5 h-5" />
          ) : (
            <FaMoon className="text-gray-500 w-5 h-5" />
          )}
        </button>
      </div>
      
      <div className={`test-section mt-8 rounded-lg shadow-md p-6 max-w-3xl mx-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-6 border-b pb-3 ${theme === 'dark' ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}`}>Summative Test</h2>
        <div className="test-form space-y-8">
          {questions.map((question) => (
            <div 
              key={question.id} 
              className={`question-item p-5 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>{question.question}</h3>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label 
                    key={index} 
                    className={`flex items-start p-3 rounded-md transition-colors cursor-pointer ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      onChange={() => handleAnswerChange(question.id, option)}
                      className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmitTest}
          className={`mt-8 py-2 px-6 rounded-md font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            theme === 'dark' 
              ? 'bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-700' 
              : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
          }`}
        >
          Submit Test
        </button>
      </div>
    </div>
  );
};

export default SummativeTest;
