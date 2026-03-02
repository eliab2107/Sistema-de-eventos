import { useState } from 'react';
import { LayoutDashboard, Calendar, Users, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botão Hambúrguer - Só aparece em telas pequenas (mobile/tablet) */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg md:hidden shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay Escuro - Fecha o menu ao clicar fora (mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - Fixa no Desktop, Deslizante no Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        <div className="p-6 mt-12 md:mt-0">
          <h2 className="text-2xl font-bold text-blue-600">EventMaster</h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl font-medium">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/eventos" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition">
            <Calendar size={20} /> Eventos
          </Link>
          <Link to="/participantes" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition">
            <Users size={20} /> Participantes
          </Link>
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition font-medium"
          >
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>
    </>
  );
}