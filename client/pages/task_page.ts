import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import CompletionDateComponent from '../components/task/completion_date_component';
import DueDateComponent from '../components/task/due_date_component';
import StartDateComponent from '../components/task/start_date_component';

import { Task } from '../../shared/entities/task';
import { getTask, updateTask, createLog } from '../services/task_service';

function toString(timestamp: number) {
  if (timestamp === 0) {
    return "--";
  }
  const date = new Date(timestamp);
  return date.toLocaleString();
}

const LandingPageProps = Vue.extend({
  props: {},
});

@Component({
  components: {
    completion: CompletionDateComponent,
    due: DueDateComponent,
    start: StartDateComponent,
  },
})
export default class LandingPage extends LandingPageProps {
  // $refs override
  $refs!: {
    description: HTMLInputElement,
    update: HTMLInputElement,
  }

  // Data
  task: Task|null = null;
  error: Error|null = null;

  // Computed

  // Methods
  private async fetchTask(): Promise<void> {
    try {
      this.task = await getTask(parseInt(this.$route.params.taskId));
    } catch (e) {
      this.error = e;
    }
  }

  private async saveDescription(): Promise<void> {
    if (!this.task) {
      return;
    }
    const descriptionInput = this.$refs.description;
    descriptionInput.disabled = true;
    if (descriptionInput.value !== this.task.description) {
      try {
        this.task = await updateTask(this.task.id, {
          description: descriptionInput.value,
        });
      } catch(e) {
        this.error = e;
      }
    }
    descriptionInput.disabled = false;
  }

  private onDescriptionKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveDescription();
    }
  }

  private async saveUpdate(): Promise<void> {
    if (!this.task) {
      return;
    }
    const updateInput = this.$refs.update;
    updateInput.disabled = true;
    if (updateInput.value.length > 0) {
      try {
        await createLog(this.task.id, {
          content: updateInput.value,
        });
      } catch(e) {
        this.error = e;
      }
    }
    updateInput.value = "";
    await this.fetchTask();
    updateInput.disabled = false;
  }

  private onUpdateKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveUpdate();
    }
  }

  private onUpdate(task: Task) {
    this.task = task;
  }

  private onError(error: Error) {
    this.error = error;
  }

  private taskComponentOptions() {
    return {
      on: {
        update: this.onUpdate,
        error: this.onError,
      },
      props: {
        taskProp: this.task,
      },
    };
  }

  // Hooks
  created() {
    this.fetchTask();
  }

  render(): VNode {
    const elements: VNode[] = [];
    if (this.task) {
      elements.push(this.$createElement('h2', "Task: " + this.task.description));
      elements.push(this.$createElement('label', {
        attrs: { for: 'description' },
      }, 'Name: '));
      elements.push(this.$createElement('input', {
        ref: 'description',
        attrs: {
          id: 'description',
          type: 'text',
          value: this.task.description,
        },
        on: {
          keyup: this.onDescriptionKeyUp,
        },
      }));
      elements.push(this.$createElement('button', {
        on: {
          click: this.saveDescription,
        },
      }, 'save'));
      elements.push(this.$createElement('start', this.taskComponentOptions()));
      elements.push(this.$createElement('due', this.taskComponentOptions()));
      elements.push(this.$createElement('completion', this.taskComponentOptions()));
      elements.push(this.$createElement('h3', 'Updates'));
      for (let taskUpdate of this.task.log) {
        elements.push(this.$createElement('p', toString(taskUpdate.timestamp) + ": " + taskUpdate.content));
      }
      elements.push(this.$createElement('input', {
        ref: 'update',
        attrs: {
          id: 'update',
          type: 'text',
          placeholder: "new update",
        },
        on: {
          keyup: this.onUpdateKeyUp,
        },
      }));
      elements.push(this.$createElement('button', {
        on: {
          click: this.saveUpdate,
        },
      }, 'save'));
    } else if (this.error) {
      elements.push(this.$createElement('p', this.error.message));
    } else {
      elements.push(this.$createElement('h2', 'Loading...'));
    }

    return this.$createElement('div', elements);
  }
}
