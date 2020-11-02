import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

const RadioGroupProps = Vue.extend({
  props: {
    name: String,
    legend: String,
    values: Array,
    valueDisplayNames: Array,
    initialValue: String,
    disabled: Boolean,
  },
});

@Component
export default class RadioGroupComponent extends RadioGroupProps {
  // Data
  selectedValue: string = this.initialValue;

  // Methods
  private processSelection(event: any): void {
    this.selectedValue = event.target.value;
    this.$emit('change', this.selectedValue);
  }

  private createRadioButtonWithLabel(index: number): VNode {
    const value = this.values[index];
    const buttonId = [this.name, value, 'radio_button'].join('_');

    const inputElement = this.$createElement('input', {
      attrs: {
        id: buttonId,
        name: this.name,
        type: 'radio',
        value: value,
        checked: this.selectedValue === value,
        disabled: this.disabled,
      },
      on: {
        change: this.processSelection,
      },
    });

    const labelElement = this.$createElement('label', {
      attrs: {
        for: buttonId,
      },
    }, [inputElement, this.valueDisplayNames[index] as string]);

    return labelElement;
  }

  // Hooks
  render(): VNode {
    const elements: VNode[] = [];

    if (this.legend) {
      elements.push(this.$createElement('legend', this.legend));
    }

    for (let i = 0; i < this.values.length; ++i) {
      elements.push(this.createRadioButtonWithLabel(i));
    }

    return this.$createElement('fieldset', elements);
  }
}
