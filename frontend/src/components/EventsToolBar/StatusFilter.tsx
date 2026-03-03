interface StatusFilterProps {
  current: string;
  onChange: (status: string) => void; // Definimos que é uma função que recebe string
}

export function StatusFilter({ current, onChange }: StatusFilterProps) {
  const options = [
    { id: 'all', label: 'Todos' },
    { id: 'Ativo', label: 'Ativos' },
    { id: 'Encerrado', label: 'Encerrados' }
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-sm">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-all ${
            current === option.id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}