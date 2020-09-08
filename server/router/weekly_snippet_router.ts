import Koa from 'koa';
import Router from '@koa/router';

import { WeeklySnippet } from '../../shared/entities/snippet';

import WeeklySnippetModel from '../db/weekly_snippet_model';

export const weeklySnippetRouter = new Router();

const COLLECTION_PATH = '/weekly';
const SINGLETON_PATH = '/weekly/:snippetID';

function getSnippetId(ctx: Koa.Context): number {
  return parseInt(ctx.params.snippetID);
}

weeklySnippetRouter.get(COLLECTION_PATH, async (ctx: Koa.Context) => {
  ctx.body = await WeeklySnippetModel.find();
});

weeklySnippetRouter.post(COLLECTION_PATH, async (ctx: Koa.Context) => {
  const draft: Partial<WeeklySnippet> = ctx.request.body;
  const result = new WeeklySnippetModel();
  if (!draft.week || !draft.year) {
    ctx.status = 400;
    ctx.message = 'WeeklySnippet.week and WeeklySnippet.year must be non-null';
  } else {
    result.week = draft.week;
    result.year = draft.year;
  }
  await result.save();
  ctx.body = result.sanitize();
});

weeklySnippetRouter.get(SINGLETON_PATH, async (ctx: Koa.Context) => {
  const result = await WeeklySnippetModel.findOne(getSnippetId(ctx));
  if (result) {
    ctx.body = result.sanitize();
  } else {
    ctx.status = 404;
  }
});

weeklySnippetRouter.put(SINGLETON_PATH, async (ctx: Koa.Context) => {
  const result = await WeeklySnippetModel.findOne(getSnippetId(ctx));
  if (result) {
    const draft: Partial<WeeklySnippet> = ctx.request.body;
    await result.update(draft);
    ctx.body = result.sanitize();
  } else {
    ctx.status = 404;
  }
});
