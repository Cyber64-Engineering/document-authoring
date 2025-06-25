import { h, render } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';
import { renderContentBasedOnBlock } from '../../scripts/helpers.js';
import CashCreditCalculator from './components/cashcreditcalculator.js';

const html = htm.bind(h);

export default async function decorate(block) {
  const content = renderContentBasedOnBlock(block);
  block.innerHTML = '';
  render(html`<${CashCreditCalculator} content=${content} />`, block);
}
