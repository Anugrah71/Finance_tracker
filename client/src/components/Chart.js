import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({ income, expense }) => {
  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#4CAF50", "#F44336"],
      },
    ],
  };

  return (
  <div style={{ width: 300, height: 300 }}>
    <Pie data={data} />
  </div>
);
};

export default Chart;
