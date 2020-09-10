import { VNode, CreateElement } from 'vue';

export function button(createElement: CreateElement, label: string, onClick: () => void, ref?: string): VNode {
  return createElement('button', {
    ref: ref,
    on: {
      click: onClick,
    },
  }, label);
}
