import { useState, useEffect } from 'react';
import { Plus, AlertCircle, Loader2, ListTodo } from 'lucide-react';
import { supabase, Task } from './lib/supabase';
import { TaskCard } from './components/TaskCard';
import { TaskForm, TaskFormData } from './components/TaskForm';
import { FilterTabs } from './components/FilterTabs';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      setError('Error al cargar las tareas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData: TaskFormData) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...formData, completed: false }])
        .select()
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setTasks([data, ...tasks]);
      }
      setShowForm(false);
    } catch (err) {
      setError('Error al crear la tarea');
      console.error(err);
    }
  };

  const handleUpdateTask = async (formData: TaskFormData) => {
    if (!editingTask) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(formData)
        .eq('id', editingTask.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setTasks(tasks.map((t) => (t.id === data.id ? data : t)));
      }
      setEditingTask(null);
    } catch (err) {
      setError('Error al actualizar la tarea');
      console.error(err);
    }
  };

  const handleToggleTask = async (id: number, completed: boolean) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setTasks(tasks.map((t) => (t.id === data.id ? data : t)));
      }
    } catch (err) {
      setError('Error al actualizar la tarea');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);

      if (error) throw error;
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError('Error al eliminar la tarea');
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
            Mis Tareas
          </h1>
          <p className="text-gray-600">
            Organiza y gestiona tus tareas de forma eficiente
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Nueva Tarea
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="mb-6">
          <FilterTabs
            activeFilter={filter}
            onFilterChange={setFilter}
            counts={counts}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <ListTodo className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">
              {filter === 'completed'
                ? 'No hay tareas completadas'
                : filter === 'pending'
                ? 'No hay tareas pendientes'
                : 'No hay tareas. ¡Crea tu primera tarea!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={setEditingTask}
              />
            ))}
          </div>
        )}
      </div>

      {(showForm || editingTask) && (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          editTask={editingTask}
        />
      )}
    </div>
  );
}

export default App;
