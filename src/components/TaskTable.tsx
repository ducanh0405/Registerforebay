import { useState, type KeyboardEvent } from 'react';
import { Task, TaskStatus } from '../App';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Calendar, CheckCircle2, Circle, Clock, Plus, Trash2 } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskTable({ tasks, onUpdateTask, onAddTask, onDeleteTask }: TaskTableProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in progress':
        return <Clock className="w-4 h-4 text-cyan-600" />;
      default:
        return <Circle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    const variants: Record<TaskStatus, string> = {
      'completed': 'bg-green-100 text-green-800 border-green-300',
      'in progress': 'bg-cyan-100 text-cyan-800 border-cyan-300',
      'not started': 'bg-slate-100 text-slate-800 border-slate-300'
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {getStatusIcon(status)}
        <span className="ml-1.5">{status}</span>
      </Badge>
    );
  };

  const handleTaskNameClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditValue(task.name);
  };

  const handleTaskNameSave = (taskId: string) => {
    if (editValue.trim()) {
      onUpdateTask(taskId, { name: editValue.trim() });
    }
    setEditingTaskId(null);
  };

  const handleTaskNameKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    taskId: string,
  ) => {
    if (e.key === 'Enter') {
      handleTaskNameSave(taskId);
    } else if (e.key === 'Escape') {
      setEditingTaskId(null);
    }
  };

  const toggleCompleted = (task: Task) => {
    const newStatus: TaskStatus = task.status === 'completed' ? 'not started' : 'completed';
    onUpdateTask(task.id, { status: newStatus });
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (deadline: string, status: TaskStatus) => {
    if (status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    return deadlineDate < today;
  };

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      onAddTask({
        name: newTaskName.trim(),
        assignedTo: newTaskAssignedTo || null,
        deadline: newTaskDeadline,
        status: 'not started'
      });
    }
    setIsAddDialogOpen(false);
    setNewTaskName('');
    setNewTaskAssignedTo('');
    setNewTaskDeadline('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden relative">
      <div className="bg-gradient-to-r from-slate-100 via-cyan-100 to-blue-100 p-4 border-b-2 border-slate-300 flex justify-between items-center">
        <div>
          <h2 className="text-slate-900">Task Management</h2>
          <p className="text-slate-600 text-sm mt-1">Track and manage your team's tasks</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="w-12">Done</TableHead>
              <TableHead className="min-w-[250px]">Task Name</TableHead>
              <TableHead className="min-w-[150px]">Assigned To</TableHead>
              <TableHead className="min-w-[150px]">Status</TableHead>
              <TableHead className="min-w-[150px]">Deadline</TableHead>
              <TableHead className="w-12">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className="hover:bg-slate-50/30">
                <TableCell>
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={() => toggleCompleted(task)}
                    className="border-slate-600 data-[state=checked]:bg-green-600"
                  />
                </TableCell>
                <TableCell>
                  {editingTaskId === task.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleTaskNameSave(task.id)}
                      onKeyDown={(e) => handleTaskNameKeyDown(e, task.id)}
                      className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-slate-50"
                      autoFocus
                    />
                  ) : (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            onClick={() => handleTaskNameClick(task)}
                            className="cursor-pointer hover:text-cyan-700 text-slate-900"
                          >
                            {task.name}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-slate-800 text-white border-slate-700"
                          side="top"
                        >
                          <div className="space-y-1">
                            <div>{task.name}</div>
                            <div className="text-cyan-300 text-xs">Click to edit task name</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
                <TableCell>
                  <Input
                    value={task.assignedTo || ''}
                    onChange={(e) => 
                      onUpdateTask(task.id, { 
                        assignedTo: e.target.value || null
                      })
                    }
                    placeholder="Unassigned"
                    className="border-slate-300 focus:ring-cyan-400 bg-slate-50/50"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={task.status}
                    onValueChange={(value) => 
                      onUpdateTask(task.id, { status: value as TaskStatus })
                    }
                  >
                    <SelectTrigger className="border-slate-300 focus:ring-cyan-400 bg-slate-50/50 w-full">
                      <SelectValue>
                        {getStatusBadge(task.status)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-300">
                      {(['not started', 'in progress', 'completed'] as TaskStatus[]).map((status) => (
                        <SelectItem 
                          key={status} 
                          value={status}
                          className="focus:bg-cyan-100 focus:text-cyan-900"
                        >
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status)}
                            <span>{status}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`flex items-center gap-2 ${
                          isOverdue(task.deadline, task.status) ? 'text-red-600' : 'text-slate-700'
                        }`}>
                          <Calendar className="w-4 h-4" />
                          <span>{formatDeadline(task.deadline)}</span>
                        </div>
                      </TooltipTrigger>
                      {isOverdue(task.deadline, task.status) && (
                        <TooltipContent 
                          className="bg-red-600 text-white border-red-700"
                          side="top"
                        >
                          This task is overdue!
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => onDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-gradient-to-r from-slate-50 via-cyan-50 to-blue-50 p-4 border-t border-slate-300">
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4 text-slate-400" />
            <span className="text-slate-700">Not Started</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600" />
            <span className="text-slate-700">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-slate-700">Completed</span>
          </div>
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your task management system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={newTaskAssignedTo}
                onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddTask}
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}