"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CrescimentoChartProps {
  data: {
    labels: string[];
    data: number[];
  };
}

export default function CrescimentoChart({ data }: CrescimentoChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Acessos Mensais",
        data: data.data,
        borderColor: "rgba(168, 85, 247, 1)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Crescimento Mensal",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        title: {
          display: true,
          text: "Mês/Ano",
        },
      },
    },
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
