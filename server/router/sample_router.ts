import Koa from 'koa';
import Router from '@koa/router';

import { SampleEntity } from '../../shared/entities/sample_entity';

import SampleModel from '../db/sample_model';

export const sampleRouter = new Router();

const COLLECTION_PATH = '/sample';
const SINGLETON_PATH = '/sample/:sampleID';

sampleRouter.get(COLLECTION_PATH, async (ctx: Koa.Context) => {
  ctx.body = await SampleModel.find();
});

sampleRouter.post(COLLECTION_PATH, async (ctx: Koa.Context) => {
  const draft: Partial<SampleEntity> = ctx.request.body;
  const result = new SampleModel();
  if (draft.value) {
    result.value = draft.value;
  } else {
    result.value = "--- EMPTY ---";
  }
  await result.save();
  ctx.body = result;
});

sampleRouter.get(SINGLETON_PATH, async (ctx: Koa.Context) => {
  ctx.body = await SampleModel.findOne(parseInt(ctx.params.sampleID));
});
