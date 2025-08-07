import { expect } from 'chai';
import {
  waitFor, screen, cleanup, fireEvent,
} from '@testing-library/preact';
import { h, render } from '../../../dist/preact/index.js';
import CashCreditCalculator from '../components/cashcreditcalculator.js';
import calculatorInfoMock from '../../../mocks/credit.js';
import placeholdersMock from '../../../mocks/placeholders.js';
import { renderContentBasedOnBlock } from '../../../scripts/preactHelpers.js';

// Transform function (unchanged)
function transformPlaceholders(placeholders) {
  const mapKeyToCamel = {
    'label-loan-amount': 'labelLoanAmount',
    'label-loan-period': 'labelLoanPeriod',
    'label-credit': 'labelCredit',
    'label-payout-period': 'labelPayoutPeriod',
    'label-monthly-rate': 'labelMonthlyRate',
    'label-months': 'labelMonths',
    'note-credit-calculator-info': 'noteCreditCalculatorInfo',
    'currency-rsd': 'currencyRsd',
  };

  return placeholders.data.data.reduce((acc, item) => {
    const camelKey = mapKeyToCamel[item.Key];
    if (camelKey) acc[camelKey] = item.Text;
    return acc;
  }, {});
}

describe('Caclulator test', () => {
  let block;

  beforeEach(() => {
    block = document.createElement('div');
    block.id = 'test-block'; // Add an id for easier debugging if needed
    block.innerHTML = `
    <h2>Test Heading</h2>
    <p>Test paragraph content for calculator</p>
  `;
    document.body.appendChild(block);
  });

  afterEach(() => {
    cleanup();
    if (block) block.remove();
  });

  it('renders calculator with correct placeholders and calculated values', async () => {
    const content = renderContentBasedOnBlock(block);
    block.innerHTML = ''; // Clear before rendering

    const transformedPlaceholders = transformPlaceholders(placeholdersMock);

    render(
      h(CashCreditCalculator, {
        content,
        fetchCalculatorInfo: () => Promise.resolve(calculatorInfoMock),
        fetchPlaceholders: () => Promise.resolve(transformedPlaceholders),
      }),
      block,
    );

    await waitFor(() => {
      expect(screen.getByText(/Kreditni kalkulator je informativnog karaktera/i)).to.exist;
    });

    // Labels updated to match placeholdersMock
    expect(screen.getByLabelText(/I want a loan in the following amount/i)).to.exist;
    expect(screen.getByLabelText(/I want to pay it out in/i)).to.exist;

    // Value should be formatted as before
    expect(screen.getByText(/100.000 RSD/)).to.exist;
  });

  it('updates summary when loan amount is changed', async () => {
    const content = renderContentBasedOnBlock(block);
    block.innerHTML = '';

    const transformedPlaceholders = transformPlaceholders(placeholdersMock);

    render(
      h(CashCreditCalculator, {
        content,
        fetchCalculatorInfo: () => Promise.resolve(calculatorInfoMock),
        fetchPlaceholders: () => Promise.resolve(transformedPlaceholders),
      }),
      block,
    );

    await waitFor(() => screen.getByText(/Kreditni kalkulator je informativnog karaktera/i));

    const amountSlider = screen.getByLabelText(/I want a loan in the following amount/i);

    fireEvent.input(amountSlider, { target: { value: '200000' } });

    await waitFor(() => {
      expect(screen.getByText(/200.000 RSD/)).to.exist;
    });
  });
});
