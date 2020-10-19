import { get, post, put } from './request_service';

import { Task, TaskUpdate } from '../../shared/entities/task';

const COLLECTION_PATH = 'api/task';
const SINGLETON_PATH = 'api/task/:taskID';
const LOG_COLLECTION_PATH = 'api/task/:taskID/log';
const LOG_SINGLETON_PATH = 'api/task/:taskID/log/:logID';

function singletonPath(taskId: number): string {
  return SINGLETON_PATH.replace(':taskID', taskId.toString());
}

function logCollectionPath(taskId: number): string {
  return LOG_COLLECTION_PATH.replace(':taskID', taskId.toString());
}

function logSingletonPath(taskId: number, logId: number): string {
  return LOG_SINGLETON_PATH
      .replace(':taskID', taskId.toString())
      .replace(':logID', logId.toString());
}

export function getTasks(): Promise<Task[]> {
  return get(COLLECTION_PATH);
}

export function createTask(draft: Partial<Task>): Promise<Task> {
  return post(COLLECTION_PATH, draft);
}

export function getTask(taskId: number): Promise<Task> {
  return get(singletonPath(taskId));
}

export function updateTask(taskId: number, draft: Partial<Task>): Promise<Task> {
  return put(singletonPath(taskId), draft);
}

export function getLogs(taskId: number): Promise<TaskUpdate[]> {
  return get(logCollectionPath(taskId));
}

export function createLog(taskId: number, draft: Partial<TaskUpdate>): Promise<TaskUpdate> {
  return post(logCollectionPath(taskId), draft);
}

export function getLog(taskId: number, logId: number): Promise<TaskUpdate> {
  return get(logSingletonPath(taskId, logId));
}

export function updateLog(
    taskId: number,
    logId: number,
    draft: Partial<Task>): Promise<TaskUpdate> {
  return put(logSingletonPath(taskId, logId), draft);
}
