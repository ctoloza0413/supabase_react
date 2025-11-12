import { CheckCircle2, Circle, Trash2, Edit2 } from 'lucide-react';
import { Task } from '../lib/supabase';

interface TaskCardProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  baja: 'bg-green-100 text-green-800 border-green-300',
  media: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  alta: 'bg-red-100 text-red-800 border-red-300',
};

export function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-md ${
      task.completed ? 'opacity-70 border-gray-200' : 'border-gray-300'
    }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(task.id, !task.completed)}
            className="mt-1 text-gray-400 hover:text-blue-500 transition-colors"
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold mb-1 ${
              task.completed ? 'line-through text-gray-500' : 'text-gray-800'
            }`}>
              {task.title}
            </h3>

            {task.description && (
              <p className={`text-sm mb-3 ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full border font-medium ${
                priorityColors[task.priority]
              }`}>
                {task.priority.toUpperCase()}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(task.created_at).toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
