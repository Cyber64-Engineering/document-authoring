function getAttributes(el) {
  const attrs = {};
  Array.from(el.attributes).forEach((attr) => {
    if (attr.name !== 'id' && attr.name !== 'class') {
      attrs[attr.name] = attr.value;
    }
  });
  return attrs;
}

function getChildElements(el) {
  const children = Array.from(el.children);
  if (!children.length) return undefined;

  return children.map((child) => ({
    tag: child.tagName.toLowerCase(),
    id: child.id || null,
    className: child.className || '',
    attributes: getAttributes(child),
    text: child.textContent.trim(),
    children: getChildElements(child),
  }));
}

const renderPropsBasedOnHTML = (block, selector = 'p, h1, h2, h3, h4, h5, h6, ul, ol') => {
  const elements = block.querySelectorAll(selector);

  return Array.from(elements).map((el) => ({
    tag: el.tagName.toLowerCase(),
    id: el.id || null,
    className: el.className || '',
    attributes: getAttributes(el),
    text: el.childNodes.length === 1 && el.firstChild.nodeType === Node.TEXT_NODE ? el.textContent.trim() : null,
    children: getChildElements(el),
  }));
};

export default renderPropsBasedOnHTML;
