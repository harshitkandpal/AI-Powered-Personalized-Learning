import React, { useState, useEffect } from "react";
import { db } from "../firebase.js"; // Ensure you have Firebase initialized
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore"; // Import Firestore methods

const TestComponent = ({ onTestCompleted, studentEmail, courseId, videoId }) => {
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
    // Load questions from q.json for the current test
    fetch("/q.json")
      .then((response) => response.json())
      .then((data) => {
        const testForVideo = data.tests.find((test) => test.testId === videoId); // Load test for the current video
        console.log(testForVideo)
        console.log(videoId)
        if (testForVideo) {
          setQuestions(testForVideo.questions);
        }
      });
  }, [videoId]); // Only reload when videoId changes (new test for new video)

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers({ ...userAnswers, [questionId]: answer });
  };

  const calculateScore = () => {
    let correctAnswersCount = 0;

    // Calculate accuracy
    questions.forEach((question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswersCount++;
      }
    });

    const totalQuestions = questions.length;
    const accuracy = (correctAnswersCount / totalQuestions) * 100;

    // Simulating improvement and difficulty
    const improvement = Math.floor(Math.random() * 11); // Random improvement between 0-10
    const time_taken = Math.floor(Math.random() * 300); // Random time_taken (in seconds)
    const difficulty = Math.floor(Math.random() * 5) + 1; // Random difficulty (1-5)

    return {
      accuracy,
      improvement,
      time_taken,
      difficulty,
    };
  };

  const handleSubmitTest = async () => {
    const { accuracy, improvement, time_taken, difficulty } = calculateScore();
    setTestScore({ accuracy, improvement, time_taken, difficulty });

    try {
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

      const lss = await response.json(); // Get learning speed score (LSS)
      const strengths = ["Tensorflow", "Machine Learning"]; // Sample strengths

      onTestCompleted(lss, strengths); // Pass LSS and strengths to parent
      setTestSubmitted(true);

      // Update Firebase progress field
      const studentRef = doc(db, "students", studentEmail); // Use email as document ID

      await updateDoc(studentRef, {
        [`progress.${courseId}`]: {
          course_id: courseId,
          LSS: arrayUnion({
            score: lss, // Learning Speed Score for this test
            date: Timestamp.now(),
            accuracy, // Store accuracy
            improvement, // Store improvement
            time_taken, // Time taken for the test
            difficulty, // Test difficulty
          }),
          strengths: arrayUnion(...strengths), // Append strengths to array
          completion_percentage: (videoId / 2) * 100, // Assume completion after each test
          last_accessed: Timestamp.now(), // Record last access time
        },
      });

      console.log("Student progress updated successfully!");
    } catch (error) {
      console.error("Error updating student progress:", error);
    }
  };

  if (testSubmitted) {
    return <p>Test completed! Your progress has been updated. Next video unlocked.</p>;
  }

  return (
    <div className="test-section mt-6">
      <h2 className="text-2xl font-bold mb-4">Test for this Video</h2>
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
        className="bg-blue-500 text-white p-2 rounded"
      >
        Submit Test
      </button>
    </div>
  );
};

export default TestComponent;
