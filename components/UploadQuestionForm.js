'use client'
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default  function UploadQuestionForm() {
  const searchParams = useSearchParams();
  const query = searchParams.get('exam');
  const [errormessage, setErrormessage] = useState()
  const [formData, setFormData] = useState({
    question: '',
    topic: '',
    subject: '',
    level: 'simple',
    type: 'mcq',
    options: { a: '', b: '', c: '', d: '', answer: '' },
    para: '',
    solution: '',
    examName : query
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (['a', 'b', 'c', 'd', 'answer'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        options: { ...prev.options, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Question added successfully!');
      setFormData({
        question: '',
        topic: '',
        subject: '',
        level: 'simple',
        type: 'mcq',
        options: { a: '', b: '', c: '', d: '', answer: '' },
        solution : '',
        para: '',
        examName : query
      });
    } else if (response.status === 409) {
      setErrormessage("Question Already Exist in Database. Try Adding Other Question")
    } else if (response.status === 410){
      setErrormessage("Limit of the Question Paper Completed You can not add more questions")
    }else if (response.status === 411){
      setErrormessage("Exam Name is Missing You Have not selected the Exam Properly")
    }
    else {
      alert('Error adding question');
    }
  }  

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Question</h2>
        <p className='text-red-700 text-m' >{errormessage}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Question</label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Subject</label>
            <select
  name="subject"
  value={formData.subject}
  onChange={handleInputChange}
  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
  required
>
  <option value="">Select a Subject</option>
  <option value="Language Comprehension">Language Comprehension</option>
  <option value="Quantitative Techniques and Data Interpretation">Quantitative Techniques and Data Interpretation</option>
  <option value="Logical Reasoning">Logical Reasoning</option>
  <option value="Innovation & Entrepreneurship">Innovation & Entrepreneurship</option>
  <option value="General Awareness">General Awareness</option>
</select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            >
              <option value="simple">Simple</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            >
              <option value="mcq">MCQ</option>
              <option value="para">Paragraph</option>
              <option value="tita">TITA</option>
            </select>
          </div>

          {formData.type === 'mcq' && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Option A</label>
                <input
                  type="text"
                  name="a"
                  value={formData.options.a}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Option B</label>
                <input
                  type="text"
                  name="b"
                  value={formData.options.b}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Option C</label>
                <input
                  type="text"
                  name="c"
                  value={formData.options.c}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Option D</label>
                <input
                  type="text"
                  name="d"
                  value={formData.options.d}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Correct Answer</label>
                <input
                  type="text"
                  name="answer"
                  value={formData.options.answer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {formData.type === 'para' && (
            <>
            <div>
                <label className="block text-gray-700 font-medium mb-2">Option A</label>
                <input
                  type="text"
                  name="a"
                  value={formData.options.a}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Option B</label>
                <input
                  type="text"
                  name="b"
                  value={formData.options.b}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Option C</label>
                <input
                  type="text"
                  name="c"
                  value={formData.options.c}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Option D</label>
                <input
                  type="text"
                  name="d"
                  value={formData.options.d}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Correct Answer</label>
                <input
                  type="text"
                  name="answer"
                  value={formData.options.answer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Paragraph</label>
              <textarea
                name="para"
                value={formData.para}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              ></textarea>
            </div>
            </>
          )}
             <div>
              <label className="block text-gray-700 font-medium mb-2">Solution</label>
              <textarea
                name="solution"
                value={formData.solution}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              ></textarea>
            </div>
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
