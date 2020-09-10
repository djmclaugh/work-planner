import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { DailySnippet, convertDayToDate } from '../../shared/entities/snippet';
import DailySnippetModel from '../models/daily_snippet_model';

import SnippetEditorComponent from '../components/snippet/snippet_editor';
import { toRelativeDate } from '../util/time';

const dailySnippetModel = DailySnippetModel.getSingleton();

const DailySnippetPageProps = Vue.extend({
  props: {},
});

@Component({
  components: {
    editor: SnippetEditorComponent,
  },
})
export default class DailySnippetPage extends DailySnippetPageProps {
  // $refs override
  $refs!: {
    editor: SnippetEditorComponent,
  }

  // Data
  snippet: DailySnippet|null = null;
  error: Error|null = null;

  // Computed

  // Methods
  private async fetchSnippet(): Promise<void> {
    try {
      this.snippet =
          await dailySnippetModel.getDailySnippet(parseInt(this.$route.params.snippetId));
    } catch (e) {
      this.error = e;
    }
  }

  private async save(newSnippet: string): Promise<void> {
    if (!this.snippet) {
      return;
    }
    try {
      this.snippet = await dailySnippetModel.updateDailySnippet(this.snippet.id, {
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
      const date = convertDayToDate(this.snippet.day, this.snippet.year);
      const absoluteDateString = date.toLocaleDateString();
      const relativeDateString = toRelativeDate(date);
      let dateString = absoluteDateString;
      if (relativeDateString != absoluteDateString) {
        dateString += " (" + relativeDateString +")";
      }
      elements.push(this.$createElement('h2', "Daily Snippet: " + dateString));
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
