import { useState, useEffect, ChangeEvent } from 'react';
import { Trash2, Plus, X } from 'lucide-react';
import api from '../services/api';

interface Participante {
  id: string;
  nome: string;
  email: string;
}

interface Inscricao {
  id: string;
  participante?: Participante;
}

interface Regra {
  id: string;
  nome: string;
  minutosAntes: number;
  minutosDepois: number;
  obrigatorio: boolean;
  ativa: boolean;
  criadoEm?: string;
}

interface Evento {
  id: string;
  nome: string;
  data: string;
  horario?: string;
  local?: string;
  status: string;
}

interface EventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  evento: Evento | null;
  onSuccess?: () => void;
}

export function EventoModal({ isOpen, onClose, evento, onSuccess }: EventoModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'participantes' | 'regras'>('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Info Tab State
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    horario: '',
    local: '',
    status: 'Ativo',
  });

  // Participants Tab State
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [selectedParticipante, setSelectedParticipante] = useState('');
  const [loadingParticipantes, setLoadingParticipantes] = useState(false);

  // Rules Tab State
  const [regras, setRegras] = useState<Regra[]>([]);
  const [ruleForm, setRuleForm] = useState({
    nome: '',
    minutosAntes: 0,
    minutosDepois: 0,
    obrigatorio: false,
    ativa: true,
  });
  const [loadingRegras, setLoadingRegras] = useState(false);

  useEffect(() => {
    if (isOpen && evento) {
      loadEventoData();
    }
  }, [isOpen, evento]);

  const loadEventoData = async () => {
    try {
      setLoading(true);
      setError('');

      const resp = await api.get(`/eventos/${evento?.id}/completo`);
      const eventoData = resp.data.evento;
      const participantesResp: Participante[] = resp.data.participantes || [];
      const regrasResp: Regra[] = resp.data.regras || [];

      setFormData({
        nome: eventoData.nome,
        data: eventoData.data.split('T')[0],
        horario: eventoData.horario || '',
        local: eventoData.local || '',
        status: eventoData.status,
      });

      const inscricoesMapped: Inscricao[] = participantesResp.map(p => ({
        id: `${evento?.id}-${p.id}`,
        participante: { id: p.id, nome: p.nome, email: p.email },
      }));

      setInscricoes(inscricoesMapped);
      setRegras(regrasResp);

      await loadParticipantes();
    } catch (err) {
      setError('Erro ao carregar evento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadParticipantes = async () => {
    try {
      setLoadingParticipantes(true);
      const response = await api.get('/participantes');
      setParticipantes(response.data || []);
    } catch (err) {
      console.error('Erro ao carregar participantes:', err);
    } finally {
      setLoadingParticipantes(false);
    }
  };

  // Info Tab Handlers
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveInfo = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await api.put(`/eventos/${evento?.id}`, {
        nome: formData.nome,
        data: formData.data,
        horario: formData.horario,
        local: formData.local,
        status: formData.status,
      });

      setSuccess('Evento atualizado com sucesso!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar evento');
    } finally {
      setLoading(false);
    }
  };

  // Participants Handlers
  const handleAddParticipante = async () => {
    if (!selectedParticipante) return;

    try {
      setError('');
      await api.post(`/participantes/${selectedParticipante}/inscrever`, {
        eventoId: evento?.id,
      });

      setSelectedParticipante('');
      await loadEventoData();
      setSuccess('Participante adicionado!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao adicionar participante');
    }
  };

  const handleRemoveParticipante = async (inscricaoId: string) => {
    if (!confirm('Tem certeza que deseja remover?')) return;

    try {
      setError('');
      await api.delete(`/eventos/${evento?.id}/inscricoes/${inscricaoId}`);
      await loadEventoData();
      setSuccess('Participante removido!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao remover participante');
    }
  };

  // Rules Handlers
  const handleRuleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setRuleForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name.includes('minutos') ? parseInt(value) : value),
    }));
  };

  const handleAddRule = async () => {
    try {
      setError('');
      setLoadingRegras(true);

      await api.post(`/eventos/${evento?.id}/regras-checkin`, {
        nome: ruleForm.nome,
        minutosAntes: ruleForm.minutosAntes,
        minutosDepois: ruleForm.minutosDepois,
        obrigatorio: ruleForm.obrigatorio,
        ativa: ruleForm.ativa,
      });

      setRuleForm({
        nome: '',
        minutosAntes: 0,
        minutosDepois: 0,
        obrigatorio: false,
        ativa: true,
      });

      await loadEventoData();
      setSuccess('Regra criada com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar regra');
    } finally {
      setLoadingRegras(false);
    }
  };

  const handleDeleteRegra = async (regraId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta regra?')) return;

    try {
      setError('');
      await api.delete(`/eventos/${evento?.id}/regras-checkin/${regraId}`);
      await loadEventoData();
      setSuccess('Regra deletada!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar regra');
    }
  };

  const handleDeleteEvento = async () => {
    if (!confirm('Tem certeza que deseja deletar este evento? Esta ação não pode ser desfeita.')) return;

    try {
      setLoading(true);
      setError('');

      await api.delete(`/eventos/${evento?.id}`);

      setSuccess('Evento deletado com sucesso!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar evento');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !evento) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">{evento?.nome}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-6 flex gap-1 bg-gray-50">
          {['info', 'participantes', 'regras'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'info' && 'Informações'}
              {tab === 'participantes' && 'Participantes'}
              {tab === 'regras' && 'Regras'}
            </button>
          ))}
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Evento</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do evento"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                  <input
                    type="time"
                    name="horario"
                    value={formData.horario}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                <input
                  type="text"
                  name="local"
                  value={formData.local}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Endereço do evento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Encerrado">Encerrado</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveInfo}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>

                {formData.status === 'Encerrado' && (
                  <button
                    onClick={handleDeleteEvento}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors font-medium flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Deletar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Participants Tab */}
          {activeTab === 'participantes' && (
            <div className="space-y-4">
              {/* Add Participant */}
              <div className="flex gap-2">
                <select
                  value={selectedParticipante}
                  onChange={(e) => setSelectedParticipante(e.target.value)}
                  disabled={loadingParticipantes}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um participante...</option>
                  {participantes.map(p => {
                    // Check if already inscribed
                    const isInscribed = inscricoes.some(i => i.participante?.id === p.id);
                    if (isInscribed) return null;
                    return (
                      <option key={p.id} value={p.id}>
                        {p.nome} ({p.email})
                      </option>
                    );
                  })}
                </select>
                <button
                  onClick={handleAddParticipante}
                  disabled={!selectedParticipante || loadingParticipantes}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Adicionar
                </button>
              </div>

              {/* Participants List */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Participantes Inscritos</h3>
                {inscricoes.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum participante inscrito</p>
                ) : (
                  <div className="space-y-2">
                    {inscricoes.map(inscricao => (
                      <div
                        key={inscricao.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{inscricao.participante?.nome}</p>
                          <p className="text-sm text-gray-600">{inscricao.participante?.email}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveParticipante(inscricao.id)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'regras' && (
            <div className="space-y-4">
              {/* Add Rule Form */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium text-gray-900 mb-4">Criar Nova Regra</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Regra</label>
                    <input
                      type="text"
                      name="nome"
                      value={ruleForm.nome}
                      onChange={handleRuleInputChange}
                      placeholder="Ex: Check-in Antecipado"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minutos Antes</label>
                      <input
                        type="number"
                        name="minutosAntes"
                        value={ruleForm.minutosAntes}
                        onChange={handleRuleInputChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minutos Depois</label>
                      <input
                        type="number"
                        name="minutosDepois"
                        value={ruleForm.minutosDepois}
                        onChange={handleRuleInputChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="obrigatorio"
                        checked={ruleForm.obrigatorio}
                        onChange={handleRuleInputChange}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Obrigatório</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="ativa"
                        checked={ruleForm.ativa}
                        onChange={handleRuleInputChange}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Ativa</span>
                    </label>
                  </div>

                  <button
                    onClick={handleAddRule}
                    disabled={loadingRegras || !ruleForm.nome}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    {loadingRegras ? 'Criando...' : 'Criar Regra'}
                  </button>
                </div>
              </div>

              {/* Rules List */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Regras Cadastradas</h3>
                {regras.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma regra cadastrada</p>
                ) : (
                  <div className="space-y-2">
                    {regras.map(regra => (
                      <div
                        key={regra.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{regra.nome}</p>
                          <p className="text-sm text-gray-600">
                            {regra.minutosAntes}min antes • {regra.minutosDepois}min depois
                            {regra.obrigatorio && ' • Obrigatório'}
                            {!regra.ativa && ' • Inativa'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteRegra(regra.id)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
