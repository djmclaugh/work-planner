import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { WeeklySnippet } from '../../shared/entities/snippet';
import WeeklySnippetModel from '../models/weekly_snippet_model';

import SnippetEditorComponent from '../components/snippet/snippet_editor';

const weeklySnippetModel = WeeklySnippetModel.getSingleton();

const WeeklySnippetPageProps = Vue.extend({
  props: {},
});

@Component({
  components: {
    editor: SnippetEditorComponent,
  },
})
export default class WeeklySnippetPage extends WeeklySnippetPageProps {
  // $refs override
  $refs!: {
    editor: SnippetEditorComponent,
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

  private async save(newSnippet: string): Promise<void> {
    if (!this.snippet) {
      return;
    }
    try {
      this.snippet = await weeklySnippetModel.updateWeeklySnippet(this.snippet.id, {
        snippet: newSnippet,
      });
      this.$refs.editor.saveCompleted();
    } catch(e) {
      this.error = e;
    }
  }

  // Hooks
  created() {
    this.fetchSnippet();
  }

  render(): VNode {
    const elements: VNode[] = [];
    if (this.snippet) {
      elements.push(this.$createElement('h2', "Weekly Snippet: Week " + this.snippet.week));
      elements.push(this.$createElement('editor', {
        ref: 'editor',
        props: {
          snippet: this.snippet.snippet,
        },
        on: {
          save: this.save,
        },
      }));
    } else if (this.error) {
      elements.push(this.$createElement('p', this.error.message));
    } else {
      elements.push(this.$createElement('h2', 'Loading...'));
    }

    return this.$createElement('div', elements);
  }
}
