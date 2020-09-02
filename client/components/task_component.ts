import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { Task } from '../../shared/entities/task';

const SampleEntityProps = Vue.extend({
  props: {
    taskProp: Object,
  },
});

@Component({
  components: {},
})
export default class SampleEntityComponent extends SampleEntityProps {
  // Data

  // Computed
  get task(): Task {
    return this.taskProp as Task;
  }

  // Methods

  // Hooks
  render(): VNode {
    return this.$createElement('router-link', {
      class: {
        task: true,
      },
      attrs: {
        to: "/task/" + this.task.id,
      },
    }, this.task.description);
  }
}
