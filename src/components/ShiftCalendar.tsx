import { ShiftType, ShiftRegistration } from '../App';
import { ShiftCell } from './ShiftCell';

interface ShiftCalendarProps {
  weekNumber: number;
  weekDates: Date[];
  shiftRegistrations: ShiftRegistration[];
  onAddRegistration: (date: string, shift: ShiftType, userName: string) => void;
}

const SHIFTS: ShiftType[] = ['Morning', 'Afternoon'];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ShiftCalendar({ 
  weekNumber,
  weekDates, 
  shiftRegistrations, 
  onAddRegistration 
}: ShiftCalendarProps) {
  const getRegistration = (date: string, shift: ShiftType): ShiftRegistration | undefined => {
    return shiftRegistrations.find(r => r.date === date && r.shift === shift);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-100 via-cyan-100 to-blue-100 border-b-2 border-slate-300">
              <th className="p-4 text-left text-slate-900 min-w-[120px]">Shift</th>
              {weekDates.map((date, index) => (
                <th key={index} className="p-4 text-center text-slate-900 min-w-[180px]">
                  <div>{DAYS[index]}</div>
                  <div className="text-slate-600 mt-1">{formatDisplayDate(date)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SHIFTS.map((shift, shiftIndex) => (
              <tr key={shift} className={shiftIndex % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'}>
                <td className="p-4 border-r border-slate-200">
                  <div className="text-slate-900">
                    {shift}
                  </div>
                  <div className="text-slate-600 text-xs mt-1">
                    {shift === 'Morning' ? '8:00 - 12:00' : '13:00 - 17:00'}
                  </div>
                </td>
                {weekDates.map((date, dateIndex) => {
                  const dateStr = formatDate(date);
                  const registration = getRegistration(dateStr, shift);
                  
                  return (
                    <td key={dateIndex} className="p-2 border-l border-slate-100">
                      <ShiftCell
                        date={dateStr}
                        shift={shift}
                        registration={registration}
                        onRegister={onAddRegistration}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gradient-to-r from-slate-50 via-cyan-50 to-blue-50 p-4 border-t border-slate-300">
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-100 border border-slate-300 rounded"></div>
            <span className="text-slate-700">Empty (0/2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cyan-200 border border-cyan-400 rounded"></div>
            <span className="text-slate-700">Partial (1/2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 border border-blue-500 rounded"></div>
            <span className="text-slate-700">Full (2/2)</span>
          </div>
        </div>
      </div>
    </div>
  );
}