import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { toRelativeDate, isPastDate } from '../util/time';
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
    switch(status(this.task)) {
      case 'Completed': {
        elements.push(this.$createElement('br'));
        elements.push(this.$createElement('span', 'Completed: ' + toRelativeDate(new Date(this.task.completionDate))));
        break;
      }
      case 'Overdue': {
        elements.push(this.$createElement('br'));
        elements.push(this.$createElement('span', 'Due: ' + toRelativeDate(new Date(this.task.dueDate))));
        break;
      }
      case 'In Progress': {
        elements.push(this.$createElement('br'));
        elements.push(this.$createElement('span', 'Due: ' + toRelativeDate(new Date(this.task.dueDate))));
        break;
      }
      case 'Upcoming': {
        if (this.task.startDate) {
          elements.push(this.$createElement('br'));
          elements.push(this.$createElement('span', 'Starting: ' + toRelativeDate(new Date(this.task.startDate))));
        }
        if (this.task.dueDate) {
          elements.push(this.$createElement('br'));
          elements.push(this.$createElement('span', 'Due: ' + toRelativeDate(new Date(this.task.dueDate))));
        }
        break;
      }
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
