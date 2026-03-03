import { useState } from 'react';
import { X, Calendar, MapPin, Tag, Save, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}
interface EventForm {
  nome: string;
  data: string;
  local: string;
  status: string;
}

export function CreateEventModal({ isOpen, onClose, onEventCreated }: CreateEventModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<EventForm>({
    nome: '',
    data: '',
    local: '',
    status: 'Ativo'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // O Backend espera um ISO Date, o input datetime-local envia quase isso
      await api.post('/eventos', formData);
      
      toast.success('Evento criado com sucesso!');
      setFormData({ nome: '', data: '', local: '', status: 'Ativo' }); // Limpa o form
      onEventCreated(); // Atualiza a lista na página pai
      onClose(); // Fecha o modal
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Novo Evento</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Tag size={16} /> Nome do Evento
            </label>
            <input
              required
              type="text"
              placeholder="Ex: Workshop de React"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} /> Data e Hora
              </label>
              <input
                required
                type="datetime-local"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin size={16} /> Local
              </label>
              <input
                required
                type="text"
                placeholder="Cidade ou Link"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.local}
                onChange={(e) => setFormData({ ...formData, local: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Criar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}