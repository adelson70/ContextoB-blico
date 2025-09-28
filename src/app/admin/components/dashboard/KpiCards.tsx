"use client";

import { BookOpen, Users, TrendingUp, Target } from "lucide-react";

interface KpiData {
  leiturasHoje: number;
  usuariosAtivosHoje: number;
  livroMaisLidoHoje: string;
  capituloMaisLidoHoje: string;
}

interface KpiCardsProps {
  data: KpiData;
}

export default function KpiCards({ data }: KpiCardsProps) {
  const kpis = [
    {
      label: "Leituras Hoje",
      value: data.leiturasHoje.toLocaleString("pt-BR"),
      icon: BookOpen,
      color: "bg-[#38BDF8]",
      bgColor: "bg-slate-50 dark:bg-slate-800/50",
      iconColor: "text-[#38BDF8]"
    },
    {
      label: "Usuários Ativos Hoje",
      value: data.usuariosAtivosHoje.toLocaleString("pt-BR"),
      icon: Users,
      color: "bg-[#FACC15]",
      bgColor: "bg-slate-50 dark:bg-slate-800/50",
      iconColor: "text-[#FACC15]"
    },
    {
      label: "Livro Mais Lido Hoje",
      value: data.livroMaisLidoHoje || "N/A",
      icon: TrendingUp,
      color: "bg-[#38BDF8]",
      bgColor: "bg-slate-50 dark:bg-slate-800/50",
      iconColor: "text-[#38BDF8]"
    },
    {
      label: "Capítulo Mais Lido Hoje",
      value: data.capituloMaisLidoHoje || "N/A",
      icon: Target,
      color: "bg-[#FACC15]",
      bgColor: "bg-slate-50 dark:bg-slate-800/50",
      iconColor: "text-[#FACC15]"
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Visão Geral de Hoje</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <div
              key={index}
              className={`${kpi.bgColor} rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {kpi.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {kpi.value}
                  </p>
                </div>
                <div className={`${kpi.color} p-3 rounded-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
