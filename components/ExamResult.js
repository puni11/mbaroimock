"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ExamResultComponent() {
  const searchParams = useSearchParams();
  const exam = searchParams.get("exam");
  const [result, setResult] = useState([]); // Initialize as an empty array

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/exam-result?exam=${exam}`);
        if (!response.ok) {
          console.error(`Error fetching results: ${response.statusText}`);
          return;
        }
        const data = await response.json();
        console.log("Fetched data:", data); // Debug log
        setResult(data.data || []); // Fallback to an empty array
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    if (exam) fetchResult();
  }, [exam]);

  console.log("Result in render:", result); // Debug log in render

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">Exam Results</h1>
      {Array.isArray(result) && result.length > 0 ? ( // Safely check if result is an array
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Question</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Your Answer</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Correct Answer</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Marks</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr
                  key={item.questionIds} // Use a unique identifier
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.questionText}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.userAnswer}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.correctAnswer}</td>
                  <td
                    className={`border border-gray-300 px-4 py-2 ${
                      item.correct ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.correct ? "Correct" : "Wrong"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}
