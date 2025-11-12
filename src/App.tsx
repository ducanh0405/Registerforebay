import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ShiftCalendar } from './components/ShiftCalendar';
import { TaskTable } from './components/TaskTable';
import { Calendar } from 'lucide-react';
import { 
  getShiftRegistrations, 
  toggleShiftRegistration,
  subscribeToShiftRegistrations 
} from './services/shiftRegistrations';
import { 
  getTasks, 
  createTask, 
  updateTask as updateTaskService, 
  deleteTask as deleteTaskService,
  subscribeToTasks 
} from './services/tasks';

// Data types
export type ShiftType = 'Morning' | 'Afternoon';
export type TaskStatus = 'not started' | 'in progress' | 'completed';

export interface ShiftRegistration {
  date: string;
  shift: ShiftType;
  users: string[];
}

export interface Task {
  id: string;
  name: string;
  assignedTo: string | null;
  status: TaskStatus;
  deadline: string;
}

// Generate dates for a week starting from a given date
function generateWeekDates(startDate: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);
  
  // Find Monday of the week
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  current.setDate(diff);
  
  // Generate Monday to Friday
  for (let i = 0; i < 5; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

// Get current week number (1, 2, 3, etc.)
function getCurrentWeekNumber(baseDate: Date): number {
  const today = new Date();
  const diffTime = today.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
}

export default function App() {
  // Week 1: Starting from 17/11/2025
  const week1Start = new Date(2025, 10, 17); // November is month 10
  const currentWeekNumber = getCurrentWeekNumber(week1Start);
  
  const [activeTab, setActiveTab] = useState(`week${Math.min(currentWeekNumber, 10)}`);
  
  const [shiftRegistrations, setShiftRegistrations] = useState<ShiftRegistration[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [registrations, tasksData] = await Promise.all([
          getShiftRegistrations(),
          getTasks()
        ]);
        setShiftRegistrations(registrations);
        setTasks(tasksData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribeRegistrations = subscribeToShiftRegistrations((registrations) => {
      setShiftRegistrations(registrations);
    });

    const unsubscribeTasks = subscribeToTasks((tasks) => {
      setTasks(tasks);
    });

    return () => {
      unsubscribeRegistrations();
      unsubscribeTasks();
    };
  }, []);

  const addShiftRegistration = async (date: string, shift: ShiftType, userName: string) => {
    try {
      setError(null);
      await toggleShiftRegistration(date, shift, userName);
      // Real-time subscription will update the state automatically
    } catch (err) {
      console.error('Error toggling shift registration:', err);
      setError(err instanceof Error ? err.message : 'Failed to update shift registration');
      // Re-fetch on error to ensure consistency
      const registrations = await getShiftRegistrations();
      setShiftRegistrations(registrations);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setError(null);
      await updateTaskService(taskId, updates);
      // Real-time subscription will update the state automatically
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task');
      // Re-fetch on error to ensure consistency
      const tasksData = await getTasks();
      setTasks(tasksData);
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      setError(null);
      await createTask(task);
      // Real-time subscription will update the state automatically
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err instanceof Error ? err.message : 'Failed to create task');
      // Re-fetch on error to ensure consistency
      const tasksData = await getTasks();
      setTasks(tasksData);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setError(null);
      await deleteTaskService(taskId);
      // Real-time subscription will update the state automatically
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      // Re-fetch on error to ensure consistency
      const tasksData = await getTasks();
      setTasks(tasksData);
    }
  };
  
  // Generate week dates
  const weeks = Array.from({ length: 10 }, (_, i) => {
    const weekStart = new Date(week1Start);
    weekStart.setDate(weekStart.getDate() + (i * 7));
    return {
      number: i + 1,
      dates: generateWeekDates(weekStart),
      start: weekStart
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-slate-900 mb-2">Shift Registration System</h1>
          <p className="text-slate-600">Register for your shifts and manage tasks collaboratively.</p>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {error}
            </div>
          )}
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="bg-white/80 border border-slate-300 p-1 inline-flex">
              {weeks.map((week) => (
                <TabsTrigger 
                  key={week.number}
                  value={`week${week.number}`} 
                  className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-900"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Week {week.number}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {weeks.map((week) => (
            <TabsContent key={week.number} value={`week${week.number}`} className="space-y-6">
              <ShiftCalendar
                weekNumber={week.number}
                weekDates={week.dates}
                shiftRegistrations={shiftRegistrations}
                onAddRegistration={addShiftRegistration}
              />
              
              <div className="mt-8">
                <TaskTable tasks={tasks} onUpdateTask={updateTask} onAddTask={addTask} onDeleteTask={deleteTask} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}