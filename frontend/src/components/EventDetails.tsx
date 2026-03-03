import { useState, useEffect } from 'react';
import { X, Save, Trash2, MapPin, Clock } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Evento {
  id: string;
  nome: string;
  data: string;
  local?: string;
  status: string;
  horario?: string;
}
interface EventDetailProps {
  evento: Evento;
  onClose: () => void;
  onUpdate: () => void;
}

export function EventDetail({ evento, onClose, onUpdate }: EventDetailProps) {
  const [formData, setFormData] = useState<Evento>({ ...evento });

  // Atualiza o formulário se o usuário clicar em outro evento da lista
  useEffect(() => {
    setFormData({ ...evento });
  }, [evento]);

  const handleSave = async () => {
    try {
      await api.put(`/eventos/${evento.id}`, formData);
      toast.success("Evento atualizado!");
      onUpdate(); // Recarrega a lista lateral
    } catch (error) {
      toast.error("Erro ao salvar alterações.");
    }
  };

  return (
    <div className="w-full p-6 md:p-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onClose} className="md:hidden p-2 text-gray-500"><X /></button>
        <h2 className="text-xl font-bold text-gray-800">Detalhes do Evento</h2>
        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition">
            <Save size={18} /> Salvar
          </button>
          <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-100 transition">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 bg-white p-8 rounded-2xl shadow-sm border">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Evento</label>
          <input 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Data e Hora</label>
            <input 
              type="datetime-local"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.data.slice(0, 16)} // Ajuste para o input datetime-local
              onChange={(e) => setFormData({...formData, data: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Local</label>
            <input 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.local}
              onChange={(e) => setFormData({...formData, local: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="Ativo">Ativo</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>
    </div>
  );
}