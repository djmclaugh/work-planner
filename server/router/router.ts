import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

import { sampleRouter } from './sample_router';

export const router: Router = new Router({
  prefix: '/api',
});
router.use(bodyParser());
router.use(sampleRouter.routes());
