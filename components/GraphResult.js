import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function GraphResult({ data }) {
  const groupedItems = data.reduce((acc, item) => {
    if (!acc[item.topics]) {
      acc[item.topics] = [];
    }
    acc[item.topics].push(item);
    return acc;
  }, {});

  const TopicSummaries = Object.keys(groupedItems).map((topic) => {
    const questions = groupedItems[topic].length;
    const answered = groupedItems[topic].filter(
      (item) => item.correct !== undefined && item.correct !== ''
    ).length;
    const marks = groupedItems[topic]
  .reduce((sum, item) => {
    if (item.correct === true) {
      return sum + (item.mark || 0); // Add marks if correct
    } else if (item.correct === false) {
      return sum - 1; // Subtract 1 if incorrect
    }
    return sum; // No change if correct is undefined or ''
  }, 0);


    return {
      topic,
      questions,
      answered,
      marks,
    };
  });

  const chartData = {
    labels: TopicSummaries.map((summary) => summary.topic), // Corrected key
    datasets: [
      {
        type: 'line',
        label: 'Questions',
        data: TopicSummaries.map((summary) => summary.questions),
        backgroundColor: '#1694f7',
        borderColor: '#1694f7',
        borderWidth: 1,
      },
      {
        type: 'line',
        label: 'Answered',
        data: TopicSummaries.map((summary) => summary.answered),
        borderColor: '#59B0F6',
        backgroundColor: '#59B0F6',
        borderColor: '#1694f7',
        borderWidth: 1,
      },
      {
        type: 'line',
        label: 'Marks',
        data: TopicSummaries.map((summary) => summary.marks),
        borderColor: '#90CBF9',
        backgroundColor: '#90CBF9',
        borderColor: '#1694f7',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Ensures the chart adjusts to the container's aspect ratio
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count / Marks',
        },
      },
    },
  };

  return (
    <div
      className="p-4 bg-gray-100 rounded mb-4"
      style={{ height: 'auto', width: '100%' }}
    >
      <h2 className="text-xl mt-2 mb-4 bg-gray-800 py-2 text-white rounded font-semibold text-center">
        Topic-Wise Performance
      </h2>
      <div style={{ height: '360px', width: '100%' }}>
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
