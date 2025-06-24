import { h, render } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';
import renderPropsBasedOnHTML from '../../scripts/helpers.js';
import CashCreditCalculator from './components/cashcreditcalculator.js';

const html = htm.bind(h);

export default async function decorate(block) {
  const listOfElements = renderPropsBasedOnHTML(block);
  render(html`<${CashCreditCalculator} listOfElements=${listOfElements} />`, block);
}
