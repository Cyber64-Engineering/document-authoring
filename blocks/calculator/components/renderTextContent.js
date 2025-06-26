import { h } from 'https://esm.sh/preact';
import { RenderElement } from '../../../scripts/preactHelpers.js';

export default function ContentBlockText({
  content,
}) {
  if (content.length === 0) return null;
  return h('div', {
    class: 'text block',
    'data-block-name': 'text',
    'data-block-status': 'loaded',
  }, h('article', {
    class: 'text',
  }, content.map(({
    elements,
    index,
  }) => h('div', {
    id: `${index + 1}-row-content`,
  }, elements.map((element, j) => h(RenderElement, {
    key: j,
    element,
  }))))));
}
