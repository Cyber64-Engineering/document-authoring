import { h } from 'https://esm.sh/preact';

function RenderNode({
  node,
}) {
  const {
    tag: Tag = 'div',
    id,
    className,
    attributes = {},
    text,
    children = [],
  } = node;
  const props = {
    id,
    className,
    ...attributes,
  };
  const childElements = children?.length ? children.map((child, i) => h(RenderNode, {
    key: i,
    node: child,
  })) : text;
  return h(Tag, props, childElements);
}
export default function ContentBlock({
  nodes,
}) {
  return h('div', {
    class: 'text block',
    'data-block-name': 'text',
    'data-block-status': 'loaded',
  }, h('article', {
    class: 'text',
  }, nodes.map((node, i) => h(RenderNode, {
    key: i,
    node,
  }))));
}
