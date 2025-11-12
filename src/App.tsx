import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ShiftCalendar } from './components/ShiftCalendar';
import { TaskTable } from './components/TaskTable';
import { Calendar, ClipboardList } from 'lucide-react';

// Mock data types
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

  const addShiftRegistration = (date: string, shift: ShiftType, userName: string) => {
    setShiftRegistrations(prev => {
      const existing = prev.find(r => r.date === date && r.shift === shift);
      
      if (existing) {
        if (existing.users.includes(userName)) {
          // Unregister user
          const newUsers = existing.users.filter(u => u !== userName);
          if (newUsers.length === 0) {
            return prev.filter(r => !(r.date === date && r.shift === shift));
          }
          return prev.map(r => 
            r.date === date && r.shift === shift 
              ? { ...r, users: newUsers }
              : r
          );
        } else {
          // Register user if not full
          if (existing.users.length < 2) {
            return prev.map(r => 
              r.date === date && r.shift === shift 
                ? { ...r, users: [...r.users, userName] }
                : r
            );
          }
          return prev;
        }
      } else {
        // Create new registration
        return [...prev, { date, shift, users: [userName] }];
      }
    });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-slate-900 mb-2">Shift Registration System</h1>
          <p className="text-slate-600">Register for your shifts and manage tasks collaboratively.</p>
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