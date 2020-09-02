import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

import { sampleRouter } from './sample_router';
import { taskRouter } from './task_router';

export const router: Router = new Router({
  prefix: '/api',
});
router.use(bodyParser());
router.use(sampleRouter.routes());
router.use(taskRouter.routes());
