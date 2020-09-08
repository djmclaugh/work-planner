import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import TaskComponent from '../components/task_component';

import { Task, status } from '../../shared/entities/task';
import TaskModel from '../models/task_model';

const taskModel = TaskModel.getSingleton();

const LandingPageProps = Vue.extend({
  props: {},
});

@Component({
  components: {
    task: TaskComponent,
  },
})
export default class LandingPage extends LandingPageProps {
  // $refs override
  $refs!: {
    newTaskName: HTMLInputElement,
  }

  // Data
  tasks: Task[]|null = null;

  // Computed

  // Methods
  async fetchTasks(): Promise<void> {
    this.tasks = await taskModel.getTasks();
  }

  taskToComponent(task: Task): VNode {
    return this.$createElement('task', { props: {taskProp: task} })
  }

  // Hooks
  created() {
    this.fetchTasks();
  }

  render(): VNode {
    let elements: VNode[] = [];
    elements.push(this.$createElement('h1', 'Home'));

    if (this.tasks) {
      const relevantTasks =
          this.tasks.filter(t => status(t) == "In Progress" || status(t) == "Overdue");
      if (relevantTasks.length > 0) {
        elements.push(this.$createElement('h2', 'Tasks:'));
        elements = elements.concat(relevantTasks.map(this.taskToComponent));
      }
    } else {
      elements.push(this.$createElement('p', 'Loading Tasks...'));
    }

    return this.$createElement('div', elements);
  }
}
