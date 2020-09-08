import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { toRelativeDate } from '../../util/time';

import { DailySnippet, convertDayToDate } from '../../../shared/entities/snippet';

const DailySnippetProps = Vue.extend({
  props: {
    dailySnippetProp: Object,
  },
});

@Component({
  components: {},
})
export default class DailySnippetComponent extends DailySnippetProps {
  // Data

  // Computed
  public get snippet(): DailySnippet {
    return this.dailySnippetProp as DailySnippet;
  }

  public get date(): Date {
    return convertDayToDate(this.snippet.day, this.snippet.year);
  }

  // Methods

  // Hooks
  render(): VNode {
    const elements: VNode[] = [];
    elements.push(this.$createElement('b', toRelativeDate(this.date)));
    elements.push(this.$createElement('br'));
    elements.push(this.$createElement('span', this.snippet.snippet ? this.snippet.snippet : "* New *"));

    return this.$createElement('router-link', {
      class: {
        'daily-snippet': true,
      },
      attrs: {
        to: "/daily/" + this.snippet.id,
      },
    }, elements);
  }
}
