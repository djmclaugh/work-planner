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

function isBeforeNow(timestamp: number) {
  return timestamp + (1000 * 60 * 60 * 24) < (new Date()).getTime();
}

export function isOverdue(task: Task): boolean {
  return task.completionDate === 0 && task.dueDate !== 0 && isBeforeNow(task.dueDate);
}

export function isStarted(task: Task): boolean {
  return task.startDate !== 0 && isBeforeNow(task.startDate);
}

export function status(task: Task) {
  if (task.completionDate > 0) {
    return 'Completed';
  } else if (isOverdue(task)) {
    return 'Overdue';
  } else if (isStarted(task)) {
    return 'In Progress';
  }
  return 'Pending';
}
