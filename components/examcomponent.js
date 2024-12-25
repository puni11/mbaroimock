"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExamComponent() {
  const [questions, setQuestions] = useState([]);
  const router = useRouter();
  const [mock, setMock] = useState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(1 * 60); // 1 minute in seconds
  const [isTimerExpired, setIsTimerExpired] = useState(false); // Track if timer has expired

  const loadProgress = () => {
    const savedProgress = JSON.parse(localStorage.getItem("examProgress"));
    if (savedProgress) {
      setAnswers(savedProgress.answers || {});
      setMarkedForReview(savedProgress.markedForReview || []);
      setCurrentQuestionIndex(savedProgress.currentQuestionIndex || 0);
      setTimeLeft(savedProgress.timeLeft || 1 * 60);
      return true;
    }
    return false;
  };

  useEffect(() => {
    const hasSavedProgress = loadProgress();

    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/mine");
        if (!response.ok) {
          console.error(`Error fetching questions: ${response.statusText}`);
          return;
        }
        const data = await response.json();
        setQuestions(data.questions);
        setMock(data.mockId);

        if (!hasSavedProgress) {
          setCurrentQuestionIndex(0);
          setAnswers({});
          setMarkedForReview([]);
          setTimeLeft(1 * 60); // Reset timer to initial value
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimerExpired(true); // Set timer expired flag
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  const handleSubmit = async () => {
    if (!mock || Object.keys(answers).length === 0) {
      alert("Please answer at least one question before submitting.");
      return;
    }

    try {
      const payload = { mock, answers };
      console.log("Submitting payload:", payload);

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from API:", errorData);
        alert(`Error submitting answers: ${errorData.message || "Unknown error"}`);
        return;
      }

      localStorage.removeItem("examProgress");
      setCurrentQuestionIndex(0);
      setAnswers({});
      setMarkedForReview([]);
      setTimeLeft(1 * 60); // Reset timer after submission
      alert("Answers submitted successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("An unexpected error occurred while submitting answers.");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (loading) return <div>Loading questions...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-4">
      {/* Timer */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold text-red-600">
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>

      {/* Questions Section */}
      <div className="flex gap-40 h-full">
        <div className="flex gap-2 mb-4">
          {questions.map((_, index) => {
            let circleColor = "bg-gray-800";
            if (index === currentQuestionIndex) circleColor = "bg-red-700";
            else if (answers[questions[index]._id]) circleColor = "bg-green-500";
            else if (markedForReview.includes(questions[index]._id)) circleColor = "bg-purple-500";

            return (
              <div
                key={index}
                className={`w-12 h-12 rounded-full flex items-center text-white justify-center ${circleColor} cursor-pointer`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
        <div className="border-2 p-12 rounded">
          {currentQuestion && (
            <div className="mb-4">
              <h2 className="text-lg mb-2">
                {currentQuestionIndex + 1}. {currentQuestion.questionText}
              </h2>
              <div>
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <label>
                      <input
                        type="radio"
                        name={`question-${currentQuestion.questionId}`}
                        value={key}
                        checked={answers[currentQuestion.questionId] === key}
                        onChange={() =>
                          setAnswers({ ...answers, [currentQuestion.questionId]: key })
                        }
                        disabled={isTimerExpired} // Disable if timer expired
                      />
                      <span className="ml-2">{value}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0 || isTimerExpired} // Disable if timer expired
            >
              Previous Question
            </button>
            <button
              className={`px-4 py-2 ${
                markedForReview.includes(currentQuestion?._id)
                  ? "bg-purple-500"
                  : "bg-yellow-500"
              } text-white rounded`}
              onClick={() =>
                setMarkedForReview((prevMarkedForReview) =>
                  prevMarkedForReview.includes(currentQuestion._id)
                    ? prevMarkedForReview.filter((id) => id !== currentQuestion._id)
                    : [...prevMarkedForReview, currentQuestion._id]
                )
              }
              disabled={isTimerExpired} // Disable if timer expired
            >
              {markedForReview.includes(currentQuestion?._id)
                ? "Unmark for Review"
                : "Mark for Review"}
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === questions.length - 1 || isTimerExpired} // Disable if timer expired
            >
              Next Question
            </button>
          </div>
        </div>
      </div>

      {/* Popup for Timer Expiry */}
      {isTimerExpired && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Time's Up!</h2>
            <p className="mb-4">Submit your answers now.</p>
            <button
              className="px-6 py-3 bg-green-500 text-white text-lg rounded"
              onClick={handleSubmit}
            >
              Submit Answers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}