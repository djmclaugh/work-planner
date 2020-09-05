import { Task } from './task';

export interface DailySnippet {
  id: number;
  day: number;
  year: number;
  snippet: string;
  todayTasks: Task[];
  tomorrowTasks: Task[];
}

export interface WeeklySnippet {
  id: number;
  week: number;
  year: number;
  snippet: string;
  thisWeekTasks: Task[];
  nextWeekTasks: Task[];
}
