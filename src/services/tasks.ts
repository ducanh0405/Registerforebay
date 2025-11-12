import { supabase } from '../utils/supabase/client';
import { Task, TaskStatus } from '../App';

export interface TaskRow {
  id: string;
  name: string;
  assigned_to: string | null;
  status: TaskStatus;
  deadline: string;
  created_at: string;
  updated_at: string;
}

/**
 * Convert database row to app format
 */
function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    name: row.name,
    assignedTo: row.assigned_to,
    status: row.status,
    deadline: row.deadline
  };
}

/**
 * Get all tasks
 */
export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
  
  return (data || []).map(rowToTask);
}

/**
 * Create a new task
 */
export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      name: task.name,
      assigned_to: task.assignedTo,
      status: task.status,
      deadline: task.deadline
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }
  
  return rowToTask(data);
}

/**
 * Update a task
 */
export async function updateTask(
  taskId: string,
  updates: Partial<Task>
): Promise<Task> {
  const updateData: Partial<TaskRow> = {};
  
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.assignedTo !== undefined) updateData.assigned_to = updates.assignedTo;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.deadline !== undefined) updateData.deadline = updates.deadline;
  
  const { data, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', taskId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }
  
  return rowToTask(data);
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
  
  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

/**
 * Subscribe to tasks changes (real-time)
 */
export function subscribeToTasks(
  callback: (tasks: Task[]) => void
) {
  const channel = supabase
    .channel('tasks_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks'
      },
      async () => {
        // Refetch all tasks when any change occurs
        const tasks = await getTasks();
        callback(tasks);
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}

