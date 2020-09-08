import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { WeeklySnippet, convertDateToWeek } from '../../shared/entities/snippet';
import { getWeeklySnippets, createWeeklySnippet } from '../services/weekly_snippet_service';

const WeeklySnippetsPageProps = Vue.extend({
  props: {},
});

@Component({
  components: {},
})
export default class TasksPage extends WeeklySnippetsPageProps {
  // Data
  snippets: WeeklySnippet[]|null = null;

  // Computed

  // Methods
  async fetchSnippets(): Promise<void> {
    this.snippets = await getWeeklySnippets();
    this.snippets.sort((a, b) => {
      if (a.year != b.year) {
        return b.year - a.year;
      }
      return b.week - a.week;
    })
  }

  async onNewSnippetClick(): Promise<void> {
    const now = new Date();
    await createWeeklySnippet({
      week: convertDateToWeek(now),
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
    elements.push(this.$createElement('h1', 'Weekly Snippets'));
    const newTaskButton = this.$createElement('button', {
      on: {
        click: this.onNewSnippetClick,
      }
    }, 'Create This Week\'s Snippet');

    if (this.snippets) {
      const now = new Date();
      const thisWeek = convertDateToWeek(now);
      const thisYear = now.getFullYear();
      if (!this.snippets.find(s => s.week == thisWeek && s.year == thisYear)) {
        elements.push(newTaskButton);
        elements.push(this.$createElement('br'));
      }
      for (let snippet of this.snippets) {
        elements.push(this.$createElement('router-link', {
          attrs: {
            to: "/weekly/" + snippet.id,
          },
        }, 'Week ' + snippet.week + ': ' + (snippet.snippet ? snippet.snippet : "* New *")))
        elements.push(this.$createElement('br'));
      }
    } else {
      elements.push(this.$createElement('p', 'Loading Weekly Snippets...'));
    }

    return this.$createElement('div', elements);
  }
}
