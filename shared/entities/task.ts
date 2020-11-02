export interface Task {
  id: number;
  description: string;
  startDate: number;
  dueDate: number;
  completionDate: number;
  log: TaskUpdate[];
}

export interface TaskUpdate {
  id: number;
  timestamp: number;
  content: string;
}

export function isToday(timestamp: number): boolean {
  const date = new Date(timestamp);
  const now = new Date();
  return date.getFullYear() == now.getFullYear()
      && date.getMonth() == now.getMonth()
      && date.getDate() == now.getDate();
}

export function isPastDate(timestamp: number): boolean {
  const date = new Date(timestamp);
  const now = new Date();
  if (date.getFullYear() == now.getFullYear()) {
    if (date.getMonth() == now.getMonth()) {
      return date.getDate() < now.getDate();
    }
    return date.getMonth() < now.getMonth();
  }
  return date.getFullYear() < now.getFullYear();
}

export function isFutureDate(timestamp: number): boolean {
  const date = new Date(timestamp);
  const now = new Date();
  if (date.getFullYear() == now.getFullYear()) {
    if (date.getMonth() == now.getMonth()) {
      return date.getDate() > now.getDate();
    }
    return date.getMonth() > now.getMonth();
  }
  return date.getFullYear() > now.getFullYear();
}

export function isOverdue(task: Task): boolean {
  return task.completionDate === 0 && task.dueDate !== 0 && isPastDate(task.dueDate);
}

export function isStarted(task: Task): boolean {
  return task.startDate !== 0 && (isPastDate(task.startDate) || isToday(task.startDate));
}

export function isUpcoming(task: Task): boolean {
  const startingInFuture = task.startDate !== 0 && isFutureDate(task.startDate);
  const dueInFuture = task.dueDate !== 0 && (isToday(task.dueDate) || isFutureDate(task.dueDate));
  return startingInFuture || dueInFuture;
}

export function status(task: Task) {
  if (task.completionDate > 0) {
    return 'Completed';
  } else if (isOverdue(task)) {
    return 'Overdue';
  } else if (isStarted(task)) {
    return 'In Progress';
  } else if (isUpcoming(task)) {
    return 'Upcoming';
  }
  return 'Pending';
}
