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

interface HorariosPicoChartProps {
  data: {
    labels: string[];
    data: number[];
  };
}

export default function HorariosPicoChart({ data }: HorariosPicoChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Acessos por Hora",
        data: data.data,
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
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
        text: "Horários de Pico de Acesso",
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
          text: "Horário do Dia",
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
