import { h } from '../../../dist/preact/index.js';

const getAttributes = (element) => {
  const attributes = {};
  Array.from(element.attributes).forEach((attribute) => {
    attributes[attribute.name] = attribute.value;
  });
  return attributes;
};

function mapByIndex(elements) {
  const map = new Map();

  elements.forEach((node) => {
    const { index } = node;
    if (!map.has(index)) {
      map.set(index, { index, elements: [] });
    }
    map.get(index).elements.push(node);
  });

  return Array.from(map.values()).sort((a, b) => a.index - b.index);
}

// Removes \n and whitespace nodes
const isText = (text) => text.replace(/\s/g, '').length > 0;

// Extract values from HTML element and it's children to object
const elementToObject = (element, index) => {
  if (element.nodeType !== Node.ELEMENT_NODE) return null;

  const tag = element.tagName.toLowerCase();

  const children = Array.from(element.childNodes)
    .map((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent;
        return isText(text) ? { text } : null;
      }

      if (child.nodeType === Node.ELEMENT_NODE) {
        return elementToObject(child, index);
      }

      return null;
    })
    .flat()
    .filter(Boolean);

  const attributes = getAttributes(element);

  return tag === 'div'
    ? children
    : {
      index,
      tag,
      attributes,
      children,
    };
};

export function renderContentBasedOnBlock(block) {
  const contentArray = Array.from(block.children).map(elementToObject).flat().filter(Boolean);
  const contentMap = mapByIndex(contentArray);
  return contentMap;
}

export function RenderElement({ element }) {
  if (!element) return null;
  if ('text' in element) {
    return element.text;
  }
  if (!element.tag) return null;
  const { tag: Tag, attributes = {}, children = [] } = element;
  const props = {
    ...attributes,
  };
  if (props.class) {
    props.className = props.class;
    delete props.class;
  }
  return h(
    Tag,
    props,
    children.map((child, i) => h(RenderElement, {
      key: i,
      element: child,
    })),
  );
}
