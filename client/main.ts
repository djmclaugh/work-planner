import Vue from 'vue';
import VueRouter from 'vue-router';

import NavigationComponent from './components/navigation_component';

import NotFoundPage from './pages/not_found_page';
import LandingPage from './pages/landing_page';
import TaskPage from './pages/task_page';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: LandingPage },
    { path: '/task', component: LandingPage },
    { path: '/task/:taskId', component: TaskPage },
    { path: '*', component: NotFoundPage },
  ],
});

const v = new Vue({
  el: '#app',
  components: {
    navigation: NavigationComponent,
  },
  router: router,
  render: function() {
    const navigation = this.$createElement('navigation');
    const view = this.$createElement('router-view', {class: {'main-view': true}});
    return this.$createElement('div', [navigation, view]);
  },
});

if (!v) {
  console.log('Error while bootstrapping Vue');
}
