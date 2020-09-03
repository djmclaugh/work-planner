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
