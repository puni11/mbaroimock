"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function MockTests() {
  const [mocks, setMocks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMocks = async () => {
      try {
        const response = await fetch("/api/fetchmocks"); // API route for fetching mocks
        if (!response.ok) {
          throw new Error("Failed to fetch mock test details");
        }
        const data = await response.json();
        console.log(data)
        setMocks(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMocks();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  if (!mocks || mocks.length === 0) {
    return <p>No mock tests available.</p>;
  }

  return (
    <div className="container flex flex-wrap gap-6 items-center justify-center bg-black text-white rounded-lg p-8 md:p-12 shadow-lg lg:mt-24">
      {mocks.map((mock) => (
        <div
          key={mock._id}
          className="w-full sm:w-1/4 p-4 backdrop-blur-[23px] backdrop-saturate-[127%] bg-[rgba(48,46,46,0.71)] rounded-[12px] border border-[rgba(209,213,219,0.3)] overflow-hidden"
        >
          <h5 className="text-lg font-semibold text-white">{mock.examName}</h5>
          <div className="border-t border-dotted border-gray-400 my-3"></div>
          <p className="text-sm text-gray-300 break-words">{mock.description}</p>
          <p className="text-sm text-gray-300 break-words mt-2">
            <strong>Questions:</strong> {mock.limit} 
          </p>
          <Link href ={`\exam?mock=${mock._id}`}><button className="w-full bg-red-600 mt-4 p-2 rounded">Start Exam</button></Link>
        </div>
      ))}
    </div>
  );
}
