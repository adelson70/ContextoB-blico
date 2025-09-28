"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopBooksData {
  labels: string[];
  data: number[];
}

interface TopBooksChartProps {
  data: TopBooksData;
}

export default function TopBooksChart({ data }: TopBooksChartProps) {
  const colors = [
    'rgba(56, 189, 248, 0.8)',   // Primary Blue
    'rgba(250, 204, 21, 0.8)',   // Primary Yellow
    'rgba(56, 189, 248, 0.6)',   // Light Blue
    'rgba(250, 204, 21, 0.6)',   // Light Yellow
    'rgba(56, 189, 248, 0.8)',   // Primary Blue
    'rgba(250, 204, 21, 0.8)',   // Primary Yellow
    'rgba(56, 189, 248, 0.6)',   // Light Blue
    'rgba(250, 204, 21, 0.6)',   // Light Yellow
    'rgba(56, 189, 248, 0.8)',   // Primary Blue
    'rgba(250, 204, 21, 0.8)'    // Primary Yellow
  ];

  const borderColors = [
    '#38BDF8',
    '#FACC15',
    '#38BDF8',
    '#FACC15',
    '#38BDF8',
    '#FACC15',
    '#38BDF8',
    '#FACC15',
    '#38BDF8',
    '#FACC15'
  ];

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Total de Leituras',
        data: data.data,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(56, 189, 248, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context: any) {
            return `Livro: ${context[0].label}`;
          },
          label: function(context: any) {
            return `Total de leituras: ${context.parsed.x.toLocaleString('pt-BR')}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          },
          callback: function(value: any) {
            return value.toLocaleString('pt-BR');
          }
        }
      },
      y: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#374151',
          font: {
            size: 12,
            weight: '500' as const
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Livros Mais Populares
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Ranking dos 10 livros mais lidos no total
        </p>
      </div>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
