import moment = require('moment');

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
  return moment().year(year).dayOfYear(day).toDate();
}

export function convertDateToDay(date: Date): number {
  return moment(date).dayOfYear();
}

export function convertWeekToDate(week: number, year: number): Date {
  return moment().year(year).week(week).toDate();
}

export function convertDateToWeek(date: Date): number {
  return moment(date).week();
}
