import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

import { dailySnippetRouter } from './daily_snippet_router';
import { taskRouter } from './task_router';
import { weeklySnippetRouter } from './weekly_snippet_router';

export const router: Router = new Router({
  prefix: '/api',
});
router.use(bodyParser());
router.use(dailySnippetRouter.routes());
router.use(taskRouter.routes());
router.use(weeklySnippetRouter.routes());
