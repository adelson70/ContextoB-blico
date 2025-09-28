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
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "rgba(99, 102, 241, 1)",
        pointHoverBorderColor: "#FFFFFF",
        pointHoverBorderWidth: 3
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: '#FFFFFF',
          font: {
            size: 14,
            weight: '600' as const
          }
        }
      },
      title: {
        display: true,
        text: "Crescimento Mensal",
        color: '#FFFFFF',
        font: {
          size: 16,
          weight: '700' as const
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#FFFFFF',
          font: {
            size: 12,
            weight: '500' as const
          },
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#FFFFFF',
          font: {
            size: 12,
            weight: '600' as const
          }
        },
        title: {
          display: true,
          text: "Mês/Ano",
          color: '#FFFFFF',
          font: {
            size: 14,
            weight: '600' as const
          }
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
