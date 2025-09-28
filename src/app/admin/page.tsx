import NavBar from "./components/navbar";
import KpiCards from "./components/dashboard/KpiCards";
import DailyActivityChart from "./components/dashboard/DailyActivityChart";
import TopBooksChart from "./components/dashboard/TopBooksChart";
import { DashboardService } from "@/src/services/dashboardService";

export default async function Dashboard() {
  // Buscar dados reais do banco de dados
  const [kpiData, dailyActivityData, topBooksData] = await Promise.all([
    DashboardService.getKpiData(),
    DashboardService.getDailyActivityData(),
    DashboardService.getTopBooksData()
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Dashboard de Administração
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Visão geral das estatísticas de acesso à Bíblia
          </p>
        </div>

        {/* KPI Cards */}
        <KpiCards data={kpiData} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <DailyActivityChart data={dailyActivityData} />
          <TopBooksChart data={topBooksData} />
        </div>
      </main>
    </div>
  )
}
