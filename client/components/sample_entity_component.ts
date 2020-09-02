import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { SampleEntity } from '../../shared/entities/sample_entity';

const SampleEntityProps = Vue.extend({
  props: {
    entityProp: Object,
  },
});

@Component({
  components: {},
})
export default class SampleEntityComponent extends SampleEntityProps {
  // Data

  // Computed
  get entity(): SampleEntity {
    return this.entityProp as SampleEntity;
  }

  // Methods

  // Hooks
  render(): VNode {
    return this.$createElement('div', this.entity.id + ': ' + this.entity.value);
  }
}
