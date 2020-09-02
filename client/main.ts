import Vue from 'vue';
import VueRouter from 'vue-router';

import NotFoundPage from './pages/not_found_page';
import LandingPage from './pages/landing_page';
import TaskPage from './pages/task_page';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: LandingPage },
    { path: '/task/:taskId', component: TaskPage },
    { path: '*', component: NotFoundPage },
  ],
});

const v = new Vue({
  el: '#app',
  router: router,
  render: function() {
    return this.$createElement('router-view');
  },
});

if (!v) {
  console.log('Error while bootstrapping Vue');
}
