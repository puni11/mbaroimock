"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ExamSelect() {
  const [examName, setExamName] = useState("");
  const [customExamName, setCustomExamName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedExam = customExamName || examName; // Use custom name if provided, otherwise dropdown selection

    if (!selectedExam) {
      alert("Please select or enter an exam name.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examName: selectedExam }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Exam data saved successfully!");
        setExamName("");
        setCustomExamName("");
        router.push(`/upload-questions?exam=${encodeURIComponent(selectedExam)}`);
      } else if (response.status === 409) {
        alert(data.message); // Mock exam with the same name already exists
      } else {
        alert("Something went wrong: " + data.message); // Handle other errors
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the data.");
    } finally {
      setLoading(false);
    }
  };

  const examOptions = ["CAT", "XAT", "CMAT", "SNAP"]; // Example exam names

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Select or Enter Exam</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Select Exam</label>
            <select
              name="examName"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            >
              <option value="">Select an Exam</option>
              {examOptions.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Enter Exam Name</label>
            <input
              type="text"
              name="customExamName"
              value={customExamName}
              onChange={(e) => setCustomExamName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              placeholder="Enter custom exam name"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200"
              disabled={loading}
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
