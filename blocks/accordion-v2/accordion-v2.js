export default function decorate(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0].children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    const body = row.children[0].children[1];
    const isAccordionContent = body.querySelector('tr td') && body.querySelector('tr td').textContent === 'accordion-content';
    const accordionContent = isAccordionContent ? body.querySelector('tbody').children[1].children[0] : null;
    const itemContainer = document.createElement('div');
    itemContainer.className = 'accordion-item-body';
    if (accordionContent) itemContainer.append(...accordionContent.childNodes);
    body.remove();
    summary.append(label);
    const innerAccordion = row.children[0]?.children[0]?.children[0];
    const isInnerAccordion = innerAccordion && innerAccordion.querySelector('tr td') && innerAccordion.querySelector('tr td').textContent.includes('inner-');
    if (isInnerAccordion) {
      [...innerAccordion.children].forEach((innerRow, index) => {
        if (index === 0) {
          innerRow.remove();
        }
        const innerLabel = innerRow.children[0];
        const innerSummary = document.createElement('summary');
        innerSummary.className = 'accordion-item-label';
        const innerBody = innerRow.children[1];
        const innerItemContainer = document.createElement('div');
        innerItemContainer.className = 'accordion-item-body';
        const innerDetails = document.createElement('details');
        innerDetails.className = 'accordion-item inner';
        innerSummary.append(innerLabel);
        innerItemContainer.append(...innerBody.childNodes);
        innerDetails.append(innerSummary, innerItemContainer);
        innerRow.replaceWith(innerDetails);
      });
    }
    const innerItemContainer = document.createElement('div');
    innerItemContainer.className = 'inner-accordion';
    if (innerAccordion) innerItemContainer.append(...innerAccordion.childNodes);
    const details = document.createElement('details');
    details.className = 'accordion-item';
    if (innerAccordion) itemContainer.append(innerItemContainer);
    details.append(summary, itemContainer);
    row.replaceWith(details);
  });
}
