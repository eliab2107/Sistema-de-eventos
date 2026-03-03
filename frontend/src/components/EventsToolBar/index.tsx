import { Plus } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { StatusFilter } from './StatusFilter';

interface EventsToolbarProps {
  searchValue: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: () => void;
  onClear: () => void;
  currentFilter: string;
  onFilterChange: (f: string) => void;
  onOpenCreateModal: () => void;
}

export function EventsToolbar({ 
  searchValue, 
  onSearchChange, 
  onSearchSubmit, 
  onClear,
  currentFilter,
  onFilterChange,
  onOpenCreateModal 
}: EventsToolbarProps) {
  return (
    <div className="bg-white border-b p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
        <SearchBar 
          value={searchValue} 
          onChange={onSearchChange} 
          onSearch={onSearchSubmit} 
          onClear={onClear} 
        />
        <StatusFilter 
          current={currentFilter} 
          onChange={onFilterChange} 
        />
      </div>

      <button
        onClick={onOpenCreateModal}
        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 active:scale-95"
      >
        <Plus size={20} />
        Novo Evento
      </button>
    </div>
  );
}