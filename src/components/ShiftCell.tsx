import { useState, type KeyboardEvent } from 'react';
import { ShiftType, ShiftRegistration } from '../App';
import { Checkbox } from './ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { CheckCircle2, Users } from 'lucide-react';

interface ShiftCellProps {
  date: string;
  shift: ShiftType;
  registration: ShiftRegistration | undefined;
  onRegister: (date: string, shift: ShiftType, userName: string) => void;
}

export function ShiftCell({ date, shift, registration, onRegister }: ShiftCellProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [actionType, setActionType] = useState<'register' | 'unregister'>('register');
  
  const registeredUsers = registration?.users || [];
  const count = registeredUsers.length;
  const isFull = count >= 2;

  // Color coding based on registration count
  const getBgColor = () => {
    if (count === 0) return 'bg-slate-100 border-slate-300';
    if (count === 1) return 'bg-cyan-200 border-cyan-400';
    return 'bg-blue-300 border-blue-500';
  };

  const getHoverColor = () => {
    if (count === 0) return 'hover:bg-slate-200';
    if (count === 1) return 'hover:bg-cyan-300';
    return 'hover:bg-blue-400';
  };

  const handleCellClick = () => {
    if (!isFull) {
      setActionType('register');
      setIsDialogOpen(true);
    }
  };

  const handleUnregister = (user: string) => {
    setUserName(user);
    setActionType('unregister');
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (userName.trim()) {
      onRegister(date, shift, userName.trim());
      setUserName('');
      setIsDialogOpen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`
                relative min-h-[100px] p-3 rounded-lg border-2 transition-all
                ${getBgColor()} 
                ${!isFull ? getHoverColor() + ' cursor-pointer' : 'cursor-not-allowed opacity-75'}
              `}
              onClick={handleCellClick}
            >
              {/* Registration count badge */}
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-700" />
                <span className={`text-xs ${count === 2 ? 'text-slate-900' : 'text-slate-600'}`}>
                  {count}/2
                </span>
              </div>

              {/* Register checkbox */}
              <div className="flex items-start gap-2 mt-6">
                <Checkbox
                  checked={false}
                  disabled={isFull}
                  className="border-slate-600 data-[state=checked]:bg-cyan-600"
                />
                <span className="text-slate-900 text-sm">
                  Register
                </span>
              </div>

              {/* Registered users list */}
              {registeredUsers.length > 0 && (
                <div className="mt-3 space-y-1">
                  {registeredUsers.map((user, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between gap-1 px-2 py-1 rounded hover:bg-slate-200/50 group cursor-pointer transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnregister(user);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-slate-800">{user}</span>
                      </div>
                      <span className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        ✕
                      </span>
                    </div>
                  ))}
                  <div className="text-xs text-slate-500 mt-2 italic">
                    Click name to unregister
                  </div>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent 
            className="bg-slate-800 text-white border-slate-700 max-w-xs"
            side="top"
          >
            <div className="space-y-2">
              <div>
                <span>{shift} Shift</span>
                <span className="text-cyan-300"> • {count}/2 registered</span>
              </div>
              
              {registeredUsers.length > 0 ? (
                <div>
                  <div className="text-cyan-300 text-xs mb-1">Registered users:</div>
                  <ul className="space-y-0.5">
                    {registeredUsers.map((user, index) => (
                      <li key={index} className="text-sm">• {user}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-cyan-300 text-xs">No registrations yet</div>
              )}
              
              <div className="text-cyan-300 text-xs pt-2 border-t border-slate-700">
                {isFull 
                  ? 'This shift is full' 
                  : 'Click to register for this shift'
                }
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white border-slate-300">
          <DialogHeader>
            <DialogTitle className="text-slate-900">
              {actionType === 'register' ? 'Register for Shift' : 'Unregister from Shift'}
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              {actionType === 'register' 
                ? `Enter your name to register for the ${shift} shift.`
                : `Confirm your name to unregister from the ${shift} shift.`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-slate-300 focus:ring-cyan-500"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setUserName('');
              }}
              className="border-slate-300 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!userName.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}