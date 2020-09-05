import Koa from 'koa';
import Router from '@koa/router';

import { DailySnippet } from '../../shared/entities/snippet';

import DailySnippetModel from '../db/daily_snippet_model';

export const dailySnippetRouter = new Router();

const COLLECTION_PATH = '/daily';
const SINGLETON_PATH = '/daily/:snippetID';

function getSnippetId(ctx: Koa.Context): number {
  return parseInt(ctx.params.snippetID);
}

dailySnippetRouter.get(COLLECTION_PATH, async (ctx: Koa.Context) => {
  ctx.body = await DailySnippetModel.find();
});

dailySnippetRouter.post(COLLECTION_PATH, async (ctx: Koa.Context) => {
  const draft: Partial<DailySnippet> = ctx.request.body;
  const result = new DailySnippetModel();
  if (!draft.day || !draft.year) {
    ctx.status = 400;
    ctx.message = 'DailySnippet.day and DailySnippet.year must be non-null';
  }
  await result.save();
  ctx.body = result.sanitize();
});

dailySnippetRouter.get(SINGLETON_PATH, async (ctx: Koa.Context) => {
  const result = await DailySnippetModel.findOne(getSnippetId(ctx));
  if (result) {
    ctx.body = result.sanitize();
  } else {
    ctx.status = 404;
  }
});

dailySnippetRouter.put(SINGLETON_PATH, async (ctx: Koa.Context) => {
  const result = await DailySnippetModel.findOne(getSnippetId(ctx));
  if (result) {
    const draft: Partial<DailySnippet> = ctx.request.body;
    await result.update(draft);
    ctx.body = result.sanitize();
  } else {
    ctx.status = 404;
  }
});
