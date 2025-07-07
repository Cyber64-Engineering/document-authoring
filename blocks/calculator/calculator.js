import { h, render } from '../../../dist/preact/index.js';
import { renderContentBasedOnBlock } from '../../scripts/preactHelpers.js';
import CashCreditCalculator from './components/cashcreditcalculator.js';

export default async function decorate(block) {
  const content = renderContentBasedOnBlock(block);
  block.innerHTML = '';
  render(h(CashCreditCalculator, { content }), block);
}
