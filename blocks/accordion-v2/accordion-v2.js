export default function decorate(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0].children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(label);
    const body = row.children[0].children[0];
    const itemContainer = document.createElement('div');
    itemContainer.className = 'accordion-item-body';
    itemContainer.append(...body.childNodes);
    [...itemContainer.children].forEach((innerRow) => {
      console.log(innerRow);
      const labelInner = innerRow.children[0].children[0];
      const summaryInner = document.createElement('summary');
      const titleInner = document.createElement('p');
      titleInner.append(...labelInner.childNodes);
      summaryInner.className = 'accordion-item-label';
      summaryInner.append(titleInner);
      const bodyInner = innerRow.children[0].children[0];
      const itemContainerInner = document.createElement('div');
      itemContainerInner.append(...bodyInner.childNodes);
      const detailsInner = document.createElement('details');
      detailsInner.className = 'accordion-item';
      detailsInner.append(summaryInner, itemContainerInner);
      innerRow.replaceWith(detailsInner);
    });
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, itemContainer);
    row.replaceWith(details);
  });
}
