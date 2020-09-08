import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import DailySnippetComponent from "../components/snippet/daily_snippet_component";

import { DailySnippet, convertDateToDay } from '../../shared/entities/snippet';
import DailySnippetModel from '../models/daily_snippet_model';

const dailySnippetModel = DailySnippetModel.getSingleton();

const DailySnippetsPageProps = Vue.extend({
  props: {},
});

@Component({
  components: {
    daily: DailySnippetComponent,
  },
})
export default class TasksPage extends DailySnippetsPageProps {
  // Data
  snippets: DailySnippet[]|null = null;

  // Computed

  // Methods
  async fetchSnippets(): Promise<void> {
    this.snippets = await dailySnippetModel.getDailySnippets();
    this.snippets.sort((a, b) => {
      if (a.year != b.year) {
        return b.year - a.year;
      }
      return b.day - a.day;
    })
  }

  async onNewSnippetClick(): Promise<void> {
    const now = new Date();
    await dailySnippetModel.createDailySnippet({
      day: convertDateToDay(now),
      year: now.getFullYear(),
    });
    this.fetchSnippets();
  }

  // Hooks
  created() {
    this.fetchSnippets();
  }

  render(): VNode {
    let elements: VNode[] = [];
    elements.push(this.$createElement('h1', 'Daily Snippets'));
    const newTaskButton = this.$createElement('button', {
      on: {
        click: this.onNewSnippetClick,
      }
    }, 'Create Today\'s Snippet');

    if (this.snippets) {
      const now = new Date();
      const thisDay = convertDateToDay(now);
      const thisYear = now.getFullYear();
      if (!this.snippets.find(s => s.day == thisDay && s.year == thisYear)) {
        elements.push(newTaskButton);
        elements.push(this.$createElement('br'));
      }
      for (let snippet of this.snippets) {
        elements.push(this.$createElement('daily', { props: {dailySnippetProp: snippet}}));
        elements.push(this.$createElement('br'));
      }
    } else {
      elements.push(this.$createElement('p', 'Loading Daily Snippets...'));
    }

    return this.$createElement('div', elements);
  }
}
