import { useState } from 'react';
import { LayoutDashboard, Calendar, Users, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { theme } from '../constants/theme';

interface NavLink {
  path: string;
  icon: React.ComponentType<{ size?: number }>; // lucide icons
  label: string;
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const isActive = (path: string) => location.pathname === path;

  const navLinks: NavLink[] = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/eventos', icon: Calendar, label: 'Eventos' },
    { path: '/participantes', icon: Users, label: 'Participantes' },
  ];

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
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        <div className="p-6 mt-12 md:mt-0">
          <h2 className="text-2xl font-bold text-blue-600">EventMaster</h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navLinks.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 p-3 rounded-xl font-medium transition ${
                isActive(path)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} /> {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 bg-gradient-to-t from-gray-50 to-white">
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
          >
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>
    </>
  );
}