/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

function replaceTagName(element, newTagName, className) {
  const newElement = document.createElement(newTagName);
  newElement.className = className;

  while (element.firstChild) {
    newElement.appendChild(element.firstChild);
  }
  element.replaceWith(newElement);
  return newElement;
}

const createInnerAccordion = (innerAccordion) => {
  const innerAccordionBody = innerAccordion.querySelector('tbody');

  Array.from(innerAccordionBody.children).forEach((row, index) => {
    if (index === 0) {
      row.remove();
      return;
    }
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label inner';
    summary.append(...label.childNodes);
    // decorate accordion item body
    const body = row.children[1];
    const accordionItem = replaceTagName(body, 'div', 'accordion-item-body inner');
    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-item inner';
    details.append(summary, accordionItem);
    row.replaceWith(details);
  });

  innerAccordion.parentElement.insertBefore(innerAccordionBody, innerAccordion);
  innerAccordion.remove();
  replaceTagName(innerAccordionBody, 'div', 'accordion inner');
};

const createAccordion = (block) => {
  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    // decorate accordion item body
    const body = row.children[1];
    const isNestedAccordion = body.querySelector('table > tbody > tr > td');
    if (isNestedAccordion && isNestedAccordion.textContent === 'accordion') {
      const innerAccordion = isNestedAccordion.closest('table');
      createInnerAccordion(innerAccordion);
    }
    body.className = 'accordion-item-body';
    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
};

export default function decorate(block) {
  createAccordion(block);
}
