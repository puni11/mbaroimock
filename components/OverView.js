import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OverView({ data }) {
  const total = data.length;
  const correctCount = data.filter((item) => item.correct === true).length;
  const wrongCount = data.filter((item) => item.correct === false).length;
  const sucessrate = Math.round(correctCount*100/total)
  const unattemptedCount = data.filter(
    (item) => item.correct === "" || item.correct === undefined
  ).length;

  // Data for the donut chart
  const chartData = {
    datasets: [
      {
        data: [correctCount, wrongCount, unattemptedCount],
        backgroundColor: ["#1694f7", "#59B0F6", "#90CBF9"], // Green, Red, Orange
        hoverBackgroundColor: ["#2d57f3", "#E57373", "#43e31f"],
      },
    ],
  };

 

  return (
    <div
      className="mt-5 mb-6 p-6 border rounded items-center bg-gray-100"
    >
      <h2 className="text-xl mt-2 bg-gray-800 py-2 text-white rounded font-semibold text-center">
        Performance Overview
      </h2>
      <div className="flex mt-4 gap-3">
      <div style={{ height: 300, width: 300 }}>
      <Doughnut
        data={chartData}
        height={300}
        width={300}
        className="text-center"
      />
      </div>
      <div class="w-full mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="border-b border-gray-200">
        <th class="py-2 px-4">Details</th>
        <th class="py-2 px-4">Count</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-gray-200">
        <td class="py-2 px-4 flex items-center">
          <span class="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Correct Answer
        </td>
        <td class="py-2 px-7">{correctCount}</td>
      </tr>
      <tr class="border-b border-gray-200">
        <td class="py-2 px-4 flex items-center">
          <span class="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
          Wrong Answer
        </td>
        <td class="py-2 px-7">{wrongCount}</td>
      </tr>
      <tr class="border-b border-gray-200">
        <td class="py-2 px-4 flex items-center">
          <span class="w-3 h-3 bg-blue-300 rounded-full mr-2"></span>
          Unattempted
        </td>
        <td class="py-2 px-7">{unattemptedCount}</td>
      </tr>
      <tr class="border-b border-gray-200">
        <td class="py-2 px-4 flex items-center font-bold">
          Total
        </td>
        <td class="py-2 px-7 font-bold">{data.length}</td>
      </tr>
    </tbody>
  
  </table>
</div>
</div>
      <div className="flex justify-between px-8 items-center mt-5 p-3 gap-4">
        <div className="p-4 text-center bg-gray-800 rounded w-1/2">
              <p className="text-white text-4xl font-bold">{sucessrate}%</p>
              <p className="text-white">Success Rate</p>
        </div>
        <div className="p-4 text-center bg-gray-800 rounded w-1/2">
              <p className="text-white text-4xl font-bold">2nd</p>
              <p className="text-white">Rank in Leadeboard</p>
        </div>
      </div>
    </div>
  );
}
