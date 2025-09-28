import NavBar from "./components/navbar";
import KpiCards from "./components/dashboard/KpiCards";
import DailyActivityChart from "./components/dashboard/DailyActivityChart";
import TopBooksChart from "./components/dashboard/TopBooksChart";
import CapitulosPopularesChart from "./components/dashboard/CapitulosPopularesChart";
import HorariosPicoChart from "./components/dashboard/HorariosPicoChart";
import CrescimentoChart from "./components/dashboard/CrescimentoChart";
import TopVersiculosComentariosChart from "./components/dashboard/TopVersiculosComentariosChart";
import TopVersiculosReferenciasChart from "./components/dashboard/TopVersiculosReferenciasChart";
import PesquisaAdmin from "./components/PesquisaAdmin";
import { DashboardService } from "@/src/services/dashboardService";

export default async function Dashboard() {
  // Buscar dados reais do banco de dados
  const [kpiData, dailyActivityData, topBooksData, capitulosPopularesData, horariosPicoData, crescimentoData, topVersiculosComentariosData, topVersiculosReferenciasData] = await Promise.all([
    DashboardService.getKpiData(),
    DashboardService.getDailyActivityData(),
    DashboardService.getTopBooksData(),
    DashboardService.getCapitulosPopularesData(),
    DashboardService.getHorariosPicoData(),
    DashboardService.getCrescimentoData(),
    DashboardService.getTopVersiculosComentariosData(),
    DashboardService.getTopVersiculosReferenciasData()
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">

        {/* Pesquisa Admin */}
        <div className="mb-8">
          <PesquisaAdmin />
        </div>

        {/* KPI Cards */}
        <KpiCards data={kpiData} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <DailyActivityChart data={dailyActivityData} />
          <TopBooksChart data={topBooksData} />
        </div>

        {/* Novos Gráficos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <CapitulosPopularesChart data={capitulosPopularesData} />
          <HorariosPicoChart data={horariosPicoData} />
        </div>

        {/* Gráfico de Crescimento */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <CrescimentoChart data={crescimentoData} />
        </div>

        {/* Novos Gráficos de Versículos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TopVersiculosComentariosChart data={topVersiculosComentariosData} />
          <TopVersiculosReferenciasChart data={topVersiculosReferenciasData} />
        </div>
      </main>
    </div>
  )
}
