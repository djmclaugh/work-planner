import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import TaskComponent from '../components/task_component';

import { Task, status } from '../../shared/entities/task';
import TaskModel from '../models/task_model';

const taskModel = TaskModel.getSingleton();

const TasksPageProps = Vue.extend({
  props: {},
});

@Component({
  components: {
    task: TaskComponent,
  },
})
export default class TasksPage extends TasksPageProps {
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

  async onNewTaskClick(): Promise<void> {
    const newTaskNameInput = this.$refs.newTaskName;
    await taskModel.createTask({
      description: newTaskNameInput.value.length === 0 ? "New Task" : newTaskNameInput.value,
    });
    newTaskNameInput.value = "";
    this.fetchTasks();
  }

  private onNewTaskNameKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onNewTaskClick();
    }
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
    elements.push(this.$createElement('h1', 'Tasks'));
    elements.push(this.$createElement('input', {
      ref: 'newTaskName',
      attrs: {
        id: 'newTaskName',
        type: 'text',
        placeholder: "Task Name",
      },
      on: {
        keyup: this.onNewTaskNameKeyUp,
      },
    }));
    const newTaskButton = this.$createElement('button', {
      on: {
        click: this.onNewTaskClick,
      }
    }, 'Create New Task');
    elements.push(newTaskButton);
    if (this.tasks) {
      const pendingTasks: Task[] = [];
      const overdueTasks: Task[] = [];
      const inProgressTasks: Task[] = [];
      const completedTasks: Task[] = [];
      const upcomingTasks: Task[] = [];

      for (let task of this.tasks) {
        switch(status(task)) {
          case "Pending":
            pendingTasks.push(task);
            break;
          case "Overdue":
            overdueTasks.push(task);
            break;
          case "Completed":
            completedTasks.push(task);
            break;
          case "In Progress":
            inProgressTasks.push(task);
            break;
          case "Upcoming":
            upcomingTasks.push(task);
            break;
          default:
            pendingTasks.push(task);
        }
      }

      if (overdueTasks.length > 0) {
        overdueTasks.sort((a, b) => {
          return a.dueDate - b.dueDate;
        });
        elements.push(this.$createElement('h2', 'Overdue:'));
        elements = elements.concat(overdueTasks.map(this.taskToComponent));
      }

      if (inProgressTasks.length > 0) {
        inProgressTasks.sort((a, b) => {
          return a.dueDate - b.dueDate;
        });
        elements.push(this.$createElement('h2', 'In Progress:'));
        elements = elements.concat(inProgressTasks.map(this.taskToComponent));
      }

      if (upcomingTasks.length > 0) {
        upcomingTasks.sort((a, b) => {
          const aTime = a.startDate === 0 ? a.dueDate : a.startDate;
          const bTime = b.startDate === 0 ? b.dueDate : b.startDate;
          return aTime - bTime;
        });
        elements.push(this.$createElement('h2', 'Upcoming:'));
        elements = elements.concat(upcomingTasks.map(this.taskToComponent));
      }

      if (pendingTasks.length > 0) {
        pendingTasks.sort((a, b) => {
          return a.dueDate - b.dueDate;
        });
        elements.push(this.$createElement('h2', 'Pending:'));
        elements = elements.concat(pendingTasks.map(this.taskToComponent));
      }

      if (completedTasks.length > 0) {
        inProgressTasks.sort((a, b) => {
          return a.completionDate - b.completionDate;
        });
        elements.push(this.$createElement('h2', 'Recently Completed:'));
        elements = elements.concat(completedTasks.map(this.taskToComponent));
      }
    } else {
      elements.push(this.$createElement('p', 'Loading Tasks...'));
    }

    return this.$createElement('div', elements);
  }
}
