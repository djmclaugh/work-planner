import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import DailySnippetComponent from '../components/snippet/daily_snippet_component';
import TaskComponent from '../components/task_component';
import WeeklySnippetComponent from '../components/snippet/weekly_snippet_component';

import { DailySnippet, WeeklySnippet } from '../../shared/entities/snippet';
import { Task, status } from '../../shared/entities/task';
import DailySnippetModel from '../models/daily_snippet_model';
import TaskModel from '../models/task_model';
import WeeklySnippetModel from '../models/weekly_snippet_model';

const dailyModel = DailySnippetModel.getSingleton();
const taskModel = TaskModel.getSingleton();
const weeklyModel = WeeklySnippetModel.getSingleton();

const LandingPageProps = Vue.extend({
  props: {},
});

@Component({
  components: {
    daily: DailySnippetComponent,
    task: TaskComponent,
    weekly: WeeklySnippetComponent,
  },
})
export default class LandingPage extends LandingPageProps {
  // $refs override
  $refs!: {
    newTaskName: HTMLInputElement,
  }

  // Data
  dailies: DailySnippet[]|null = null;
  tasks: Task[]|null = null;
  weeklies: WeeklySnippet[]|null = null;

  // Computed
  get mostRecentDaily(): DailySnippet|undefined {
    if (!this.dailies || this.dailies.length == 0) {
      return undefined;
    }
    let mostRecent = this.dailies[0];
    for (let daily of this.dailies) {
      if (mostRecent.year < daily.year) {
        mostRecent = daily;
      } else if (mostRecent.year == daily.year && mostRecent.day < daily.day) {
        mostRecent = daily;
      }
    }
    return mostRecent;
  }

  get mostRecentWeekly(): WeeklySnippet|undefined {
    if (!this.weeklies || this.weeklies.length == 0) {
      return undefined;
    }
    let mostRecent = this.weeklies[0];
    for (let weekly of this.weeklies) {
      if (mostRecent.year < weekly.year) {
        mostRecent = weekly;
      } else if (mostRecent.year == weekly.year && mostRecent.week < weekly.week) {
        mostRecent = weekly;
      }
    }
    return mostRecent;
  }

  // Methods
  async fetchData(): Promise<void> {
    taskModel.getTasks().then((value: Task[]) => {
      this.tasks = value;
    });
    dailyModel.getDailySnippets().then((value: DailySnippet[]) => {
      this.dailies = value;
    });
    weeklyModel.getWeeklySnippets().then((value: WeeklySnippet[]) => {
      this.weeklies = value;
    });
  }

  taskToComponent(task: Task): VNode {
    return this.$createElement('task', { props: {taskProp: task} })
  }

  // Hooks
  created() {
    this.fetchData();
  }

  render(): VNode {
    let elements: VNode[] = [];
    elements.push(this.$createElement('h1', 'Home'));

    if (!this.dailies || !this.tasks || !this.weeklies) {
      elements.push(this.$createElement('p', 'Loading Tasks...'));
    } else {
      const relevantTasks =
          this.tasks.filter(t => status(t) == "In Progress" || status(t) == "Overdue");
      if (relevantTasks.length > 0) {
        elements.push(this.$createElement('h2', 'Tasks:'));
        elements = elements.concat(relevantTasks.map(this.taskToComponent));
      }
      if (this.mostRecentDaily || this.mostRecentWeekly) {
        elements.push(this.$createElement('h2', 'Most Recent Snippets:'));
        if (this.mostRecentDaily) {
          elements.push(this.$createElement('daily', { props: {dailySnippetProp: this.mostRecentDaily}}));
        }
        if (this.mostRecentWeekly) {
          elements.push(this.$createElement('weekly', { props: {weeklySnippetProp: this.mostRecentWeekly}}));
        }
      }
    }

    return this.$createElement('div', elements);
  }
}
