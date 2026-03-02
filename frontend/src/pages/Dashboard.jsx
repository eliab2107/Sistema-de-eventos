import { useEffect, useState } from 'react';
import { Sidebar } from '../components/SideBar';
import { StatCard } from '../components/StatCards';
import { Calendar, Users, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ eventos: 0, participantes: 0, checkins: 0 });

  useEffect(() => {
    async function loadData() {
      try {
        // Exemplo: buscando dados reais do seu backend
        const [resEventos, resParticipantes] = await Promise.all([
          api.get('/eventos'),
          api.get('/participantes')
        ]); 
        console.log(resEventos.data);
        setStats({
          totalEventos: resEventos.data.length,
          eventos: resEventos.data,
          totalParticipantes: resParticipantes.data.length,
          checkins: 0 // Você implementará a lógica de check-in depois
        });
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Bem-vindo ao sistema de gestão de eventos.</p>
        </header>
          {/* Grid de Estatísticas Responsivo */}
        {/* Grid de Estatísticas + Próximos Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard 
          title="Total de Eventos" 
          value={stats.totalEventos} 
          icon={Calendar} 
          colorClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Participantes" 
          value={stats.totalParticipantes} 
          icon={Users} 
          colorClass="bg-purple-100 text-purple-600" 
        />

        {/* Aqui entra o novo card com a lista real de eventos  */}
       <EventsCard events={stats.eventos} />
        
      </div>
       {/* Área de ações rápidas centralizada */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 w-full sm:w-auto">
              + Cadastrar Novo Evento
            </button>
            <button className="bg-white border-2 border-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 w-full sm:w-auto">
              Ver Todos os Participantes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}