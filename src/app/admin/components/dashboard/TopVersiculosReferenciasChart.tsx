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

interface TopVersiculosReferenciasData {
  labels: string[];
  data: number[];
}

interface TopVersiculosReferenciasChartProps {
  data: TopVersiculosReferenciasData;
}

export default function TopVersiculosReferenciasChart({ data }: TopVersiculosReferenciasChartProps) {
  const colors = [
    'rgba(99, 102, 241, 0.8)',   // Indigo
    'rgba(139, 92, 246, 0.8)',   // Purple
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(16, 185, 129, 0.8)',   // Emerald
    'rgba(245, 158, 11, 0.8)',   // Amber
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(34, 197, 94, 0.8)',    // Green
    'rgba(168, 85, 247, 0.8)',   // Violet
    'rgba(6, 182, 212, 0.8)'     // Cyan
  ];

  const borderColors = [
    '#6366F1',
    '#8B5CF6',
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#EC4899',
    '#22C55E',
    '#A855F7',
    '#06B6D4'
  ];

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Total de Referências',
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
        borderColor: 'rgba(168, 85, 247, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context: any) {
            return `Versículo: ${context[0].label}`;
          },
          label: function(context: any) {
            return `Total de referências: ${context.parsed.x.toLocaleString('pt-BR')}`;
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
          color: '#FFFFFF',
          font: {
            size: 12,
            weight: '500' as const
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
          color: '#FFFFFF',
          font: {
            size: 12,
            weight: '600' as const
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
          Versículos com Mais Referências
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Ranking dos 10 versículos com mais referências bíblicas
        </p>
      </div>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
