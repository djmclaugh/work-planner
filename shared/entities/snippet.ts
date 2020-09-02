import { Task } from './task';

export interface DailySnippet {
  id: number;
  day: Date;
  snippet: string;
  todayTasks: Task[];
  tomorrowTasks: Task[];
}

export interface WeeklySnippet {
  id: number;
  week: Date;
  snippet: string;
  thisWeekTasks: Task[];
  nextWeekTasks: Task[];
}
