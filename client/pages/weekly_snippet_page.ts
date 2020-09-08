import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { WeeklySnippet } from '../../shared/entities/snippet';
import WeeklySnippetModel from '../models/weekly_snippet_model';

const weeklySnippetModel = WeeklySnippetModel.getSingleton();

const WeeklySnippetPageProps = Vue.extend({
  props: {},
});

@Component({
  components: {},
})
export default class WeeklySnippetPage extends WeeklySnippetPageProps {
  // $refs override
  $refs!: {
    content: HTMLInputElement,
  }

  // Data
  snippet: WeeklySnippet|null = null;
  error: Error|null = null;

  // Computed

  // Methods
  private async fetchSnippet(): Promise<void> {
    try {
      this.snippet =
          await weeklySnippetModel.getWeeklySnippet(parseInt(this.$route.params.snippetId));
    } catch (e) {
      this.error = e;
    }
  }

  private async saveContent(): Promise<void> {
    if (!this.snippet) {
      return;
    }
    const contentInput = this.$refs.content;
    contentInput.disabled = true;
    if (contentInput.value !== this.snippet.snippet) {
      try {
        this.snippet = await weeklySnippetModel.updateWeeklySnippet(this.snippet.id, {
          snippet: contentInput.value,
        });
      } catch(e) {
        this.error = e;
      }
    }
    contentInput.disabled = false;
  }

  // Hooks
  created() {
    this.fetchSnippet();
  }

  render(): VNode {
    const elements: VNode[] = [];
    if (this.snippet) {
      elements.push(this.$createElement('h2', "Weekly Snippet: Week " + this.snippet.week));
      elements.push(this.$createElement('textarea', {
        ref: 'content',
        attrs: {
          id: 'content',
        },
      }, this.snippet.snippet));
      elements.push(this.$createElement('br'));
      elements.push(this.$createElement('button', {
        on: {
          click: this.saveContent,
        },
      }, 'Save'));
    } else if (this.error) {
      elements.push(this.$createElement('p', this.error.message));
    } else {
      elements.push(this.$createElement('h2', 'Loading...'));
    }

    return this.$createElement('div', elements);
  }
}
