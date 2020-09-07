import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { DailySnippet, convertDateToDay, convertDayToDate } from '../../shared/entities/snippet';
import { getDailySnippets, createDailySnippet } from '../services/daily_snippet_service';

function toDateString(snippet: DailySnippet) {
  const date = convertDayToDate(snippet.day, snippet.year);
  return date.toLocaleDateString();
}

const TasksPageProps = Vue.extend({
  props: {},
});

@Component({
  components: {},
})
export default class TasksPage extends TasksPageProps {
  // Data
  snippets: DailySnippet[]|null = null;

  // Computed

  // Methods
  async fetchSnippets(): Promise<void> {
    this.snippets = await getDailySnippets();
    this.snippets.sort((a, b) => {
      if (a.year != b.year) {
        return a.year - b.year;
      }
      return a.day - b.day;
    })
  }

  async onNewSnippetClick(): Promise<void> {
    const now = new Date();
    await createDailySnippet({
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
      }
      for (let snippet of this.snippets) {
        elements.push(this.$createElement('router-link', {
          attrs: {
            to: "/daily/" + snippet.id,
          },
        }, toDateString(snippet) + ': ' + (snippet.snippet ? snippet.snippet : "* New *")))
      }
    } else {
      elements.push(this.$createElement('p', 'Loading Daily Snippets...'));
    }

    return this.$createElement('div', elements);
  }
}
