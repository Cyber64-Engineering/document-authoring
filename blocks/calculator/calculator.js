import { h, render } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';
import CashCreditCalculator from './cashcreditcalculator.js';

const html = htm.bind(h);

export default async function decorate(block) {
  render(html`<${CashCreditCalculator} />`, block);
}
