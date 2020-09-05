import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { timestampToDate } from '../../util/time';

import { Task } from '../../../shared/entities/task';
import { updateTask } from '../../services/task_service';

const StartDateProps = Vue.extend({
  props: {
    taskProp: Object,
  },
});

@Component({
  components: {},
})
export default class StartDateComponent extends StartDateProps {
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
  private async setStartDate(date: number): Promise<void> {
    try {
      const result = await updateTask(this.task.id, {
        startDate: date,
      });
      this.$emit('update', result);
    } catch(e) {
      this.$emit('error', e);
    }
  }

  private markStarted() {
    this.setStartDate((new Date().getTime()));
  }

  private setCustomDate() {
    const datePicker = this.$refs.datePicker;
    const chosenDate = new Date(datePicker.value + "T00:00");
    this.setStartDate(chosenDate.getTime());
  }

  private onPickerUpdate() {
    const datePicker = this.$refs.datePicker;
    this.$refs.setDateButton.disabled = (datePicker.value === "");
  }

  // Hooks
  render(): VNode {
    const elements: VNode[] = [];
    elements.push(this.$createElement('p', 'Start Date: ' + timestampToDate(this.task.startDate)));
    if (this.task.startDate === 0) {
      elements.push(this.$createElement('button', {
        on: {
          click: this.markStarted,
        },
      }, 'Start'));
      elements.push(this.$createElement('br'));

      elements.push(this.$createElement('input', {
        ref: 'datePicker',
        attrs: {
          id: 'start-date-picker',
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
      }, 'Set Start Date'));
    }

    return this.$createElement('div', elements);
  }
}
