import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { timestampToDate } from '../../util/time';

import { Task } from '../../../shared/entities/task';
import TaskModel from '../../models/task_model';

const taskModel = TaskModel.getSingleton();

const CompletionDateProps = Vue.extend({
  props: {
    taskProp: Object,
  },
});

@Component({
  components: {},
})
export default class CompletionDateComponent extends CompletionDateProps {
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
  private async setCompletionDate(date: number): Promise<void> {
    try {
      const result = await taskModel.updateTask(this.task.id, {
        completionDate: date,
      });
      this.$emit('update', result);
    } catch(e) {
      this.$emit('error', e);
    }
  }

  private markComplete() {
    this.setCompletionDate((new Date().getTime()));
  }

  private reopen() {
    this.setCompletionDate(0);
  }

  // private setCustomDate() {
  //   const datePicker = this.$refs.datePicker;
  //   const chosenDate = new Date(datePicker.value + "T00:00");
  //   this.setCompletionDate(chosenDate.getTime());
  // }
  //
  // private onPickerUpdate() {
  //   const datePicker = this.$refs.datePicker;
  //   this.$refs.setDateButton.disabled = (datePicker.value === "");
  // }

  // Hooks
  render(): VNode {
    const elements: VNode[] = [];
    elements.push(this.$createElement('p', 'Completion Date: ' + timestampToDate(this.task.completionDate)));
    if (this.task.completionDate === 0) {
      elements.push(this.$createElement('button', {
        on: {
          click: this.markComplete,
        },
      }, 'Mark Completed'));
    } else {
      elements.push(this.$createElement('button', {
        on: {
          click: this.reopen,
        },
      }, 'Reopen'));
    }

    // elements.push(this.$createElement('br'));
    // elements.push(this.$createElement('input', {
    //   ref: 'datePicker',
    //   attrs: {
    //     id: 'completion-date-picker',
    //     type: 'date'
    //   },
    //   on: {
    //     change: this.onPickerUpdate,
    //   },
    // }));
    // elements.push(this.$createElement('button', {
    //   attrs: {
    //     disabled: true,
    //   },
    //   ref: 'setDateButton',
    //   on: {
    //     click: this.setCustomDate,
    //   },
    // }, 'Set Completion Date'));

    return this.$createElement('div', elements);
  }
}
