import { useState, useEffect } from 'react';
import { Edit3, Plus, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { EventoModal } from '../components/EventoModal';
import { CreateEventModal } from '../components/CreateEventModal';
import { Sidebar } from '../components/SideBar';

interface Evento {
  id: string;
  nome: string;
  data: string;
  horario?: string;
  local?: string;
  status: string;
  inscricoes?: any[];
  regras?: any[];
}

export default function Eventos() {
  const { user } = useAuth();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'ativo' | 'encerrado'>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [isEventoModalOpen, setIsEventoModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    loadEventos();
  }, [filter]);

  const loadEventos = async (nome?: string) => {
    try {
      setLoading(true);
      const params: any = {};
      if (nome) params.nome = nome;
      if (filter && filter !== 'all') params.status = filter === 'ativo' ? 'Ativo' : 'Encerrado';
      const response = await api.get('/eventos', { params });
      const sorted = (response.data || []).sort((a: Evento, b: Evento) => new Date(a.data).getTime() - new Date(b.data).getTime());
      setEventos(sorted);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEventos = eventos.filter(evento => {
    if (filter === 'all') return true;
    return evento.status === (filter === 'ativo' ? 'Ativo' : 'Encerrado');
  });

  const handleEditEvento = (evento: Evento) => {
    setSelectedEvento(evento);
    setIsEventoModalOpen(true);
  };

  const handleRefresh = () => {
    loadEventos(search);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleSearch = () => {
    loadEventos(search);
  };

  const handleClearSearch = () => {
    setSearch('');
    loadEventos();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-8 border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Meus Eventos</h1>
            <p className="text-gray-600">Gerencie todos os seus eventos em um único lugar</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                  className="flex items-center gap-2 w-full sm:w-[520px]"
                >
                  <input
                    type="text"
                    placeholder="Buscar por nome do evento..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >Buscar</button>
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >Limpar</button>
                </form>

                <div className="ml-2 hidden sm:flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                  {['all', 'ativo', 'encerrado'].map(option => (
                    <button
                      key={option}
                      onClick={() => { setFilter(option as any); loadEventos(search); }}
                      className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${
                        filter === option
                          ? 'bg-blue-600 text-white'
                          : 'bg-transparent text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {option === 'all' && 'Todos'}
                      {option === 'ativo' && 'Ativos'}
                      {option === 'encerrado' && 'Encerrados'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl disabled:bg-gray-400"
              >
                <Plus size={20} />
                Novo Evento
              </button>
            </div>

            {/* Events Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader size={40} className="text-blue-600 animate-spin" />
              </div>
            ) : filteredEventos.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <p className="text-gray-600 text-lg mb-4">
                  {eventos.length === 0
                    ? 'Você não tem eventos ainda'
                    : 'Nenhum evento nesta categoria'}
                </p>
                {eventos.length === 0 && (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus size={18} />
                    Criar seu primeiro evento
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEventos.map(evento => (
                  <div
                    key={evento.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                  >
                    {/* Card Header with Status */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">{evento.nome}</h3>
                          <p className="text-blue-100 text-sm">{formatDate(evento.data)}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            evento.status === 'Ativo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {evento.status}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="px-6 py-4 space-y-3">
                      {/* Time */}
                      {evento.horario && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-sm font-medium">🕐 {evento.horario}</span>
                        </div>
                      )}

                      {/* Location */}
                      {evento.local && (
                        <div className="flex items-start gap-2 text-gray-700">
                          <span className="text-lg mt-0.5">📍</span>
                          <span className="text-sm">{evento.local}</span>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex gap-4 pt-3 border-t border-gray-100">
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">Inscritos</p>
                          <p className="text-lg font-bold text-gray-900">
                            {evento.inscricoes?.length || 0}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">Regras</p>
                          <p className="text-lg font-bold text-gray-900">
                            {evento.regras?.length || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <button
                        onClick={() => handleEditEvento(evento)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                      >
                        <Edit3 size={16} />
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <EventoModal
        isOpen={isEventoModalOpen}
        onClose={() => setIsEventoModalOpen(false)}
        evento={selectedEvento}
        onSuccess={handleRefresh}
      />

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
}