import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { toRelativeDate } from '../util/time';
import { Task, status } from '../../shared/entities/task';

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
  public get task(): Task {
    return this.taskProp as Task;
  }

  // Methods

  // Hooks
  render(): VNode {
    const elements: VNode[] = [];
    elements.push(this.$createElement('b', this.task.description));
    elements.push(this.$createElement('br'));
    elements.push(this.$createElement('span', 'Status: ' + status(this.task)));
    if (this.task.dueDate) {
      elements.push(this.$createElement('br'));
      elements.push(this.$createElement('span', 'Due: ' + toRelativeDate(new Date(this.task.dueDate))));
    }


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
