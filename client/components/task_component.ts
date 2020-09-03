import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { Task } from '../../shared/entities/task';

const TaskProps = Vue.extend({
  props: {
    taskProp: Object,
  },
});

@Component({
  components: {},
})
export default class TaskComponent extends TaskProps {
  // Data

  // Computed
  get task(): Task {
    return this.taskProp as Task;
  }

  get status(): string {
    if (this.task.completionDate > 0) {
      return 'Completed';
    } else if (this.task.startDate > 0) {
      return 'In Progress';
    }
    return 'Pending';
  }

  // Methods

  // Hooks
  render(): VNode {
    const elements: VNode[] = [];
    elements.push(this.$createElement('b', this.task.description));
    elements.push(this.$createElement('br'));
    elements.push(this.$createElement('span', 'Status: ' + this.status));

    return this.$createElement('router-link', {
      class: {
        task: true,
      },
      attrs: {
        to: "/task/" + this.task.id,
      },
    }, elements);
  }
}
