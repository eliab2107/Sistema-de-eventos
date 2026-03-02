export function StatCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 transition-all hover:shadow-md">
      <div className={`p-4 rounded-2xl ${colorClass} flex items-center justify-center`}>
        <Icon size={28} />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{value}</h3>
      </div>
    </div>
  );
}