import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

const NavigationProps = Vue.extend({});

@Component({
  components: {},
})
export default class NavigationComponent extends NavigationProps {
  // Data
  public leftLinks: { name: string, link: string}[] = [
    { name: 'Work Planner', link:'/' },
  ];

  public rightLinks: { name: string, link: string}[] = [
    { name: 'Tasks', link:'/task' },
    { name: 'Dailies', link:'/daily' },
    { name: 'Weeklies', link:'/weekly' },
  ];

  // Computed

  // Methods
  toNode(link: {name: string, link: string}): VNode {
    return this.$createElement('router-link', {
      class: {
        'navigation-link': true,
      },
      attrs: {
        to: link.link,
      },
    }, link.name);
  }

  // Hooks
  render(): VNode {
    const left = this.$createElement('div', {
      class: {
        'navigation-left': true,
      },
    }, this.leftLinks.map(this.toNode));

    const right = this.$createElement('div', {
      class: {
        'navigation-right': true,
      },
    }, this.rightLinks.map(this.toNode));

    return this.$createElement('nav', {
      class: {
        'navigation-bar': true,
      },
    }, [left, right]);
  }
}
