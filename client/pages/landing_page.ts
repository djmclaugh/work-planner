import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import TaskComponent from '../components/task_component';

import { Task } from '../../shared/entities/task';
import { getTasks, createTask } from '../services/task_service';

const LandingPageProps = Vue.extend({
  props: {},
});

@Component({
  components: {
    task: TaskComponent,
  },
})
export default class LandingPage extends LandingPageProps {
  // Data
  tasks: Task[]|null = null;

  // Computed

  // Methods
  async fetchTasks(): Promise<void> {
    this.tasks = await getTasks();
  }

  async onNewTaskClick(): Promise<void> {
    await createTask({
      description: "New Task",
    });
    this.fetchTasks();
  }

  // Hooks
  created() {
    this.fetchTasks();
  }

  render(): VNode {
    const elements: VNode[] = [];
    elements.push(this.$createElement('h2', 'Tasks:'));
    elements.push(this.$createElement('button', {
      on: {
        click: this.onNewTaskClick,
      }
    }, 'New Task'));
    if (this.tasks) {
      for (let task of this.tasks) {
        elements.push(this.$createElement('task', { props: {taskProp: task} }));
      }
    } else {
      elements.push(this.$createElement('p', 'Loading Tasks...'));
    }

    return this.$createElement('div', elements);
  }
}
