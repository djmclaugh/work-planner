import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { DailySnippet } from '../../shared/entities/snippet';
import { getDailySnippets, createDailySnippet } from '../services/daily_snippet_service';

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
    // TODO
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
    elements.push(newTaskButton);
    if (this.snippets) {
      for (let snippet of this.snippets) {
        elements.push(this.$createElement('p', snippet.day + ': ' + snippet.snippet))
      }
    } else {
      elements.push(this.$createElement('p', 'Loading Daily Snippets...'));
    }

    return this.$createElement('div', elements);
  }
}
