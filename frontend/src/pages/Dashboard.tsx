import { useEffect, useState } from 'react';
import { Sidebar } from '../components/SideBar';
import { StatCard } from '../components/StatCards';
import { Calendar, Users, CheckCircle, Plus, ArrowRight } from 'lucide-react';
import { EventsCard } from '../components/EventsCard';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../constants/theme';

interface EventoSummary { id: string; nome: string; data: string; local: string; status: string; inscricoes?: any[]; regras?: any[] }
interface DashboardStats {
  totalEventos: number;
  totalParticipantes: number;
  checkins: number;
  eventos: EventoSummary[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ totalEventos: 0, totalParticipantes: 0, checkins: 0, eventos: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [resEventos, resParticipantes] = await Promise.all([
          api.get('/eventos'),
          api.get('/participantes')
        ]);
        
        setStats({
          totalEventos: resEventos.data.length,
          eventos: resEventos.data,
          totalParticipantes: resParticipantes.data.length,
          checkins: 0
        });
      } catch (err) {
        setError('Erro ao carregar dados do dashboard');
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-6 md:p-8 lg:p-10">
        {/* Header com Saudação */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {getGreeting()}, {user?.nome || 'Usuário'}!
              </h1>
              <p className="text-gray-600 mt-2">Aqui está um resumo de suas atividades</p>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-500">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Seção de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total de Eventos" 
            value={loading ? '-' : stats.totalEventos} 
            icon={Calendar} 
            colorClass="bg-blue-100 text-blue-600" 
          />
          <StatCard 
            title="Participantes" 
            value={loading ? '-' : stats.totalParticipantes} 
            icon={Users} 
            colorClass="bg-purple-100 text-purple-600" 
          />
          <StatCard 
            title="Check-ins" 
            value={loading ? '-' : stats.checkins} 
            icon={CheckCircle} 
            colorClass="bg-green-100 text-green-600" 
          />
        </div>

        {/* Grid Principal: Eventos e Ações */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Eventos Recentes (2/3 da tela) */}
          <div className="lg:col-span-2">
            <EventsCard events={stats.eventos} isLoading={loading} />
          </div>

          {/* Painel Lateral: Ações Rápidas e Informações */}
          <div className="space-y-6">
            {/* Card de Ações Rápidas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-md hover:shadow-lg">
                  <span className="flex items-center gap-2">
                    <Plus size={20} />
                    Novo Evento
                  </span>
                  <ArrowRight size={18} />
                </button>
                <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all active:scale-95">
                  <span className="flex items-center gap-2">
                    <Users size={20} />
                    Participantes
                  </span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Card de Informações */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Status da Conta</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">E-mail</span>
                  <span className="text-sm font-semibold text-gray-900">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Eventos Ativos</span>
                  <span className="text-sm font-semibold text-blue-600">{stats.totalEventos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Membro desde</span>
                  <span className="text-sm font-semibold text-gray-900">2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}