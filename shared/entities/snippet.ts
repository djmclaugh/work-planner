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

export function convertDayToDate(day: number, year: number): Date {
  return new Date(year, 1, day);
}

export function convertDateToDay(date: Date): number {
  const year = date.getFullYear();
  let day = 0;
  for (let i = 1; i < date.getMonth(); ++i) {
    day += (new Date(year, i, 0)).getDate();
  }
  return day + date.getDate();
}
