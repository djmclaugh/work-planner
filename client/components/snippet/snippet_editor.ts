import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';
import * as marked from 'marked';

import { button } from '../util/button';

const SnippetEditorProps = Vue.extend({
  props: {
    snippet: String,
  },
});

@Component({
  components: {},
})
export default class SnippetEditorComponent extends SnippetEditorProps {
  // $refs override
  $refs!: {
    content: HTMLInputElement,
    cancelButton: HTMLButtonElement,
    saveButton: HTMLButtonElement,
  }

  // Data
  editting: boolean = false;
  saving: boolean = false;

  // Computed

  // Methods
  private save(): void {
    const contentInput = this.$refs.content;

    if (contentInput.value !== this.snippet) {
      // Disable all input while the snippet is being saved.
      const saveButton = this.$refs.saveButton;
      const cancelButton = this.$refs.cancelButton;
      contentInput.disabled = true;
      saveButton.disabled = true;
      cancelButton.disabled = true;

      // Tell the parent to update the snippet on the back end.
      // The parent will have to call saveCompleted once the snippet has been updated.
      this.$emit('save', contentInput.value);
    } else {
      // If nothing changed, this is the same as a cancel.
      this.cancel();
    }
  }

  private cancel(): void {
    this.editting = false;
  }

  private edit(): void {
    this.editting = true;
  }

  public saveCompleted(): void {
    this.$refs.content.disabled = false;
    this.$refs.saveButton.disabled = false;
    this.$refs.cancelButton.disabled = false;
    this.editting = false;
  }

  // Hooks
  render(): VNode {
    const elements: VNode[] = [];
    if (this.editting) {

      elements.push(this.$createElement('textarea', {
        ref: 'content',
        class: {
          'snippet-editor': true,
        },
        attrs: {
          id: 'content',
        },
      }, this.snippet));
      elements.push(this.$createElement('br'));
      elements.push(button(this.$createElement, 'Cancel', this.cancel, 'cancelButton'));
      elements.push(button(this.$createElement, 'Save', this.save, 'saveButton'));
    } else {
      const content = this.snippet.length ? this.snippet : "*Nothing entered yet*";
      elements.push(this.$createElement('div', {
        domProps: {
          innerHTML: marked(content),
        },
      }));
      elements.push(button(this.$createElement, "Edit", this.edit));
    }
    return this.$createElement('div', elements);
  }
}
