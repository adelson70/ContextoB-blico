"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CapitulosPopularesChartProps {
  data: {
    labels: string[];
    data: number[];
  };
}

export default function CapitulosPopularesChart({ data }: CapitulosPopularesChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Acessos",
        data: data.data,
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
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
        text: "Capítulos Mais Populares",
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
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
