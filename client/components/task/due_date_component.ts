import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { timestampToDate } from '../../util/time';

import { Task } from '../../../shared/entities/task';
import TaskModel from '../../models/task_model';

const taskModel = TaskModel.getSingleton();

const DueDateProps = Vue.extend({
  props: {
    taskProp: Object,
  },
});

@Component({
  components: {},
})
export default class DueDateComponent extends DueDateProps {
  // $refs override
  $refs!: {
    datePicker: HTMLInputElement,
    setDateButton: HTMLButtonElement,
  }

  // Data

  // Computed
  get task(): Task {
    return this.taskProp as Task;
  }

  // Methods
  private async setDueDate(date: number): Promise<void> {
    try {
      const result = await taskModel.updateTask(this.task.id, {
        dueDate: date,
      });
      this.$emit('update', result);
    } catch(e) {
      this.$emit('error', e);
    }
  }

  private setCustomDate() {
    const datePicker = this.$refs.datePicker;
    const chosenDate = new Date(datePicker.value + "T00:00");
    this.setDueDate(chosenDate.getTime());
  }

  private onPickerUpdate() {
    const datePicker = this.$refs.datePicker;
    this.$refs.setDateButton.disabled = (datePicker.value === "");
  }

  // Hooks
  render(): VNode {
    const elements: VNode[] = [];
    elements.push(this.$createElement('p', 'Due Date: ' + timestampToDate(this.task.dueDate)));
    if (this.task.dueDate === 0) {
      elements.push(this.$createElement('input', {
        ref: 'datePicker',
        attrs: {
          id: 'due-date-picker',
          type: 'date'
        },
        on: {
          change: this.onPickerUpdate,
        },
      }));
      elements.push(this.$createElement('button', {
        attrs: {
          disabled: true,
        },
        ref: 'setDateButton',
        on: {
          click: this.setCustomDate,
        },
      }, 'Set Due Date'));
    }

    return this.$createElement('div', elements);
  }
}
