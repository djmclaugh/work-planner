import Koa from 'koa';
import Router from '@koa/router';

import { Task, TaskUpdate } from '../../shared/entities/task';

import TaskModel from '../db/task_model';

export const taskRouter = new Router();

const COLLECTION_PATH = '/task';
const SINGLETON_PATH = '/task/:taskID';
const LOG_COLLECTION_PATH = '/task/:taskID/log';
const LOG_SINGLETON_PATH = '/task/:taskID/log/:logID';

function getTaskId(ctx: Koa.Context): number {
  return parseInt(ctx.params.taskID);
}

function getLogId(ctx: Koa.Context): number {
  return parseInt(ctx.params.logID);
}

taskRouter.get(COLLECTION_PATH, async (ctx: Koa.Context) => {
  ctx.body = await TaskModel.find();
});

taskRouter.post(COLLECTION_PATH, async (ctx: Koa.Context) => {
  const draft: Partial<Task> = ctx.request.body;
  const result = new TaskModel();
  if (draft.description) {
    result.description = draft.description;
  } else {
    result.description = "";
  }
  await result.save();
  ctx.body = result.sanitize();
});

taskRouter.get(SINGLETON_PATH, async (ctx: Koa.Context) => {
  const result = await TaskModel.findOne(getTaskId(ctx));
  if (result) {
    ctx.body = result.sanitize();
  } else {
    ctx.status = 404;
  }
});

taskRouter.put(SINGLETON_PATH, async (ctx: Koa.Context) => {
  const result = await TaskModel.findOne(getTaskId(ctx));
  if (result) {
    const draft: Partial<Task> = ctx.request.body;
    await result.update(draft);
    ctx.body = result.sanitize();
  } else {
    ctx.status = 404;
  }
});

taskRouter.get(LOG_COLLECTION_PATH, async (ctx: Koa.Context) => {
  const result = await TaskModel.findOne(getTaskId(ctx));
  if (result) {
    ctx.body = result.log.map(log => log.sanitize());
  } else {
    ctx.status = 404;
  }
});

taskRouter.post(LOG_COLLECTION_PATH, async (ctx: Koa.Context) => {
  const body: Partial<TaskUpdate> = ctx.request.body;
  if (!body.content) {
    ctx.status = 400;
    ctx.message = 'TaskUpdate.content must be non-null';
  }
  const result = await TaskModel.findOne(getTaskId(ctx));
  if (result) {
    ctx.body = (await result.createLog(body.content!)).sanitize();
  } else {
    ctx.status = 404;
  }
});

taskRouter.get(LOG_SINGLETON_PATH, async (ctx: Koa.Context) => {
  const taskResult = await TaskModel.findOne(getTaskId(ctx));
  if (taskResult) {
    const logId = getLogId(ctx);
    const logResult = taskResult.log.find(update => update.id === logId);
    if (logResult) {
      ctx.body = logResult.sanitize();
      return;
    }
  }
  ctx.status = 404;
});

taskRouter.put(LOG_SINGLETON_PATH, async (ctx: Koa.Context) => {
  const taskResult = await TaskModel.findOne(getTaskId(ctx));
  if (taskResult) {
    const logId = getLogId(ctx);
    const logResult = taskResult.log.find(update => update.id === logId);
    if (logResult) {
      const draft: TaskUpdate = ctx.request.body;
      await logResult.update(draft);
      ctx.body = logResult.sanitize();
      return;
    }
  }
  ctx.status = 404;
});
