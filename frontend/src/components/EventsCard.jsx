import { CalendarClock, MapPin } from 'lucide-react';

export function EventsCard({ eventos = [] }) {
  // Pegamos apenas os 3 primeiros eventos da lista
  const nextEvents = eventos.slice(0, 3);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[250px]">
      {/* Cabeçalho do Card */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
          <CalendarClock size={20} />
        </div>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          Próximos Eventos
        </h3>
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-4 flex-1">
        {nextEvents.length > 0 ? (
          nextEvents.map((event) => (
            <div 
              key={event.id} 
              className="group flex flex-col border-b border-gray-50 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate pr-2">
                  {event.nome}
                </p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  event.status === 'Ativo' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {event.status}
                </span>
              </div>
              
             
    
              </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-gray-400 italic">Nenhum evento futuro</p>
          </div>
        )}
      </div>
    </div>
  );
}