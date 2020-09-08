import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { toRelativeWeek } from '../../util/time';

import { WeeklySnippet, convertWeekToDate } from '../../../shared/entities/snippet';

const WeeklySnippetProps = Vue.extend({
  props: {
    weeklySnippetProp: Object,
  },
});

@Component({
  components: {},
})
export default class WeeklySnippetComponent extends WeeklySnippetProps {
  // Data

  // Computed
  public get snippet(): WeeklySnippet {
    return this.weeklySnippetProp as WeeklySnippet;
  }

  public get date(): Date {
    return convertWeekToDate(this.snippet.week, this.snippet.year);
  }

  // Methods

  // Hooks
  render(): VNode {
    const elements: VNode[] = [];
    elements.push(this.$createElement('b', toRelativeWeek(this.date)));
    elements.push(this.$createElement('br'));
    elements.push(this.$createElement('span', this.snippet.snippet ? this.snippet.snippet : "* New *"));

    return this.$createElement('router-link', {
      class: {
        'weekly-snippet': true,
      },
      attrs: {
        to: "/weekly/" + this.snippet.id,
      },
    }, elements);
  }
}
