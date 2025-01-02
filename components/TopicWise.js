export default function TopicWise({ data }) {
    const groupedItems = data.reduce((acc, item) => {
      if (!acc[item.subject]) {
        acc[item.subject] = []; // Initialize the array for this subject
      }
      acc[item.subject].push(item); // Add the item to the appropriate group
      return acc;
    }, {});
    const answeredquetion = data.filter((item)=>item.userAnswer !=='').length
    const corretanstrue = data.filter((item)=>item.correct ===true).length
    const falsecorretanstrue = data.filter((item)=>item.correct ===false).length
    // Create a summary for each subject
    const subjectSummaries = Object.keys(groupedItems).map((subject) => {
      const questions = groupedItems[subject].length;
      const answered = groupedItems[subject].filter(
        (item) => item.correct !== undefined && item.correct !== ''
      ).length;
      const unattempted = groupedItems[subject].filter(
        (item) => item.correct === '' || item.correct === undefined
      ).length;
      const right = groupedItems[subject].filter((item) => item.correct === true).length;
      const wrong = groupedItems[subject].filter((item) => item.correct === false).length;
      const marks = groupedItems[subject].filter((item) => item.correct === true).reduce((sum, item) => sum + (item.mark || 0), 0); 
      const negmarks = groupedItems[subject].filter((item) => item.correct === false).reduce((sum, item) => sum + (item.mark || 0), 0); 
      const totalmark = marks-negmarks
      return {
        subject,
        questions,
        answered,
        unattempted,
        right,
        wrong,
        totalmark,
      };
    });
  
    return (
      <div className="p-4 mt-5 mb-6 border rounded items-center bg-gray-100">
  <h1 className="text-xl mt-2 bg-gray-800 py-2 text-white rounded font-semibold text-center">Subject-Wise Performance</h1>
  <div className="overflow-x-auto">
    <table className="border border-gray-500 w-full">
      <thead>
        <tr className="bg-gray-500 text-white">
          <th className="border px-4 py-2">Subject</th>
          <th className="border px-4 py-2">Questions</th>
          <th className="border px-4 py-2">Answered</th>
          <th className="border px-4 py-2">Unattempted</th>
          <th className="border px-4 py-2">Right</th>
          <th className="border px-4 py-2">Wrong</th>
          <th className="border px-4 py-2">Marks</th>
        </tr>
      </thead>
      <tbody>
        {subjectSummaries.map((summary, index) => (
          <tr key={index} className="text-center">
            <td className="border px-4 font-bold py-2">{summary.subject}</td>
            <td className="border px-4 py-2">{summary.questions}</td>
            <td className="border px-4 py-2">{summary.answered}</td>
            <td className="border px-4 py-2">{summary.unattempted}</td>
            <td className="border px-4 py-2">{summary.right}</td>
            <td className="border px-4 py-2">{summary.wrong}</td>
            <td className="border px-4 py-2">{summary.totalmark}</td>
          </tr>
        ))}
      </tbody>
      <tfoot className="text-center bg-gray-500 text-white">
        <tr>
          <td className="border px-4 font-bold py-2">Total</td>
          <td className="border px-4 py-2">{data.length}</td>
          <td className="border px-4 py-2">{answeredquetion}</td>
          <td className="border px-4 py-2">{data.length - answeredquetion}</td>
          <td className="border px-4 py-2">{corretanstrue}</td>
          <td className="border px-4 py-2">{falsecorretanstrue}</td>
          <td className="border px-4 py-2">{corretanstrue * 4 - falsecorretanstrue * 1}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>

    );
  }
  