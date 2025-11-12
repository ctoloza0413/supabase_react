import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Task = {
  id: number;
  title: string;
  description: string | null;
  priority: 'baja' | 'media' | 'alta';
  completed: boolean;
  created_at: string;
};
