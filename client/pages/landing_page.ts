import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import SampleEntityComponent from '../components/sample_entity_component';

import { SampleEntity } from '../../shared/entities/sample_entity';
import { getSampleEntities } from '../services/sample_entity_service';

const LandingPageProps = Vue.extend({
  props: {},
});

@Component({
  components: {
    entity: SampleEntityComponent,
  },
})
export default class LandingPage extends LandingPageProps {
  // Data
  entities: SampleEntity[]|null = null;

  // Computed

  // Methods
  async fetchEntities(): Promise<void> {
    this.entities = await getSampleEntities();
  }

  // Hooks
  created() {
    this.fetchEntities();
  }

  render(): VNode {
    const elements: VNode[] = [];
    elements.push(this.$createElement('p', 'hello world!'));
    if (this.entities) {
      for (let entity of this.entities) {
        elements.push(this.$createElement('entity', { props: {entityProp: entity} }));
      }
    } else {
      elements.push(this.$createElement('p', 'Loading Entities...'));
    }

    return this.$createElement('div', elements);
  }
}
