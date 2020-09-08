import { Task, TaskUpdate } from '../../shared/entities/task';
import { getTasks, createTask, updateTask, createLog } from '../services/task_service';

export default class TaskModel {
  private static singleton = new TaskModel();
  public static getSingleton() {
    return this.singleton;
  }

  private dirty: boolean = true;
  private currentTasks: Task[] = [];
  private taskIdToIndex: Map<number, number> = new Map();

  private async fetchTask() {
    this.currentTasks = await getTasks();
    this.taskIdToIndex = new Map();
    for (let i = 0; i < this.currentTasks.length; ++i) {
      this.taskIdToIndex.set(this.currentTasks[i].id, i);
    }
    this.dirty = false;
  }

  public async getTasks(): Promise<Task[]> {
    if (this.dirty) {
      await this.fetchTask();
    }
    return this.currentTasks.concat();
  }

  public async getTask(taskId: number): Promise<Task> {
    if (this.dirty) {
      await this.fetchTask();
    }
    return this.currentTasks[this.taskIdToIndex.get(taskId)!];
  }

  public async createTask(draft: Partial<Task>): Promise<Task> {
    try {
      const newTask = await createTask(draft);
      this.currentTasks.push(newTask);
      this.taskIdToIndex.set(newTask.id, this.currentTasks.length - 1);
      return newTask;
    } catch (e) {
      this.dirty = true;
      throw e;
    }
  }

  public async updateTask(taskId: number, draft: Partial<Task>): Promise<Task> {
    try {
      const newTask = await updateTask(taskId, draft);
      this.currentTasks[this.taskIdToIndex.get(taskId)!] = newTask;
      return newTask;
    } catch (e) {
      this.dirty = true;
      throw e;
    }
  }

  public async createLog(taskId: number, draft: Partial<TaskUpdate>): Promise<TaskUpdate> {
    try {
      const newLog = await createLog(taskId, draft);
      this.currentTasks[this.taskIdToIndex.get(taskId)!].log.push(newLog);
      return newLog;
    } catch (e) {
      this.dirty = true;
      throw e;
    }
  }
}
