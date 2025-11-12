import { ListTodo, CheckCircle2, Circle } from 'lucide-react';

interface FilterTabsProps {
  activeFilter: 'all' | 'pending' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
  counts: { all: number; pending: number; completed: number };
}

export function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  const tabs = [
    { id: 'all' as const, label: 'Todas', icon: ListTodo, count: counts.all },
    { id: 'pending' as const, label: 'Pendientes', icon: Circle, count: counts.pending },
    { id: 'completed' as const, label: 'Completadas', icon: CheckCircle2, count: counts.completed },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
            <span className={`text-sm px-2 py-0.5 rounded-full ${
              isActive ? 'bg-blue-500' : 'bg-gray-200'
            }`}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
