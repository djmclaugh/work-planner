export interface Task {
  id: number;
  description: string;
  log: TaskUpdate[];
}

export interface TaskUpdate {
  id: number;
  timestamp: Date;
  content: string;
}
