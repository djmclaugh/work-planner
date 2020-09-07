import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { DailySnippet, convertDayToDate } from '../../shared/entities/snippet';
import { getDailySnippet, updateDailySnippet } from '../services/daily_snippet_service';

function toDateString(snippet: DailySnippet) {
  const date = convertDayToDate(snippet.day, snippet.year);
  return date.toLocaleDateString();
}

const DailySnippetPageProps = Vue.extend({
  props: {},
});

@Component({
  components: {},
})
export default class LandingPage extends DailySnippetPageProps {
  // $refs override
  $refs!: {
    content: HTMLInputElement,
  }

  // Data
  snippet: DailySnippet|null = null;
  error: Error|null = null;

  // Computed

  // Methods
  private async fetchSnippet(): Promise<void> {
    try {
      this.snippet = await getDailySnippet(parseInt(this.$route.params.snippetId));
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
        this.snippet = await updateDailySnippet(this.snippet.id, {
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
      elements.push(this.$createElement('h2', "Daily Snippet: " + toDateString(this.snippet)));
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
