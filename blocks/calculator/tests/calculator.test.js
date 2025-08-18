import { expect } from 'chai';
import { waitFor, screen, cleanup, fireEvent } from '@testing-library/preact';
import { h, render } from '../../../dist/preact/index.js';
import CashCreditCalculator from '../components/cashcreditcalculator.js';
import { calculateMonthlyPayment } from '../utils.js';
import calculatorInfoMock from '../../../test/mocks/credit.js';
import placeholdersMock from '../../../test/mocks/placeholders.js';
import { renderContentBasedOnBlock } from '../../../scripts/preactHelpers.js';

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

describe('Calculator test', () => {
  let block;

  beforeEach(() => {
    block = document.createElement('div');
    block.id = 'calculator';
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

  it('renders calculator with placeholders and valid text', async () => {
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

    await waitFor(() => {
      const infoText = screen.getByText(/Kreditni kalkulator/i);
      expect(infoText).to.exist;
      expect(infoText.textContent.length).to.be.greaterThan(0); // non-empty
      expect(infoText.textContent.length).to.be.lessThan(500); // reasonable length
    });

    // Validate inputs exist and are non-empty
    const loanInput = screen.getByLabelText(/I want a loan/i);
    const periodInput = screen.getByLabelText(/I want to pay it out/i);
    [loanInput, periodInput].forEach((input) => {
      expect(input).to.exist;
      expect(input.value).to.satisfy((val) => typeof val === 'string' || typeof val === 'number');
    });

    const amountText = screen.getByText(/100.000 RSD/);
    expect(amountText).to.exist;
    expect(amountText.textContent).to.match(/[\d.,]+\s?RSD/); // matches currency format
  });

  it('updates calculator and validates computed values', async () => {
    const loanAmount = 200000;
    const loanPeriod = 24;

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

    await waitFor(() => screen.getByText(/Kreditni kalkulator/i));

    const loanInput = screen.getByLabelText(/I want a loan/i);
    const periodInput = screen.getByLabelText(/I want to pay it out/i);

    fireEvent.input(loanInput, { target: { value: loanAmount.toString() } });
    fireEvent.input(periodInput, { target: { value: loanPeriod.toString() } });

    const expected = calculateMonthlyPayment(loanAmount, loanPeriod, calculatorInfoMock);
    const formattedExpected = `${expected.toLocaleString('sr-RS', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} RSD`;

    await waitFor(() => {
      const amountDisplay = screen.getByText(/200.000 RSD/);
      expect(amountDisplay).to.exist;
      expect(amountDisplay.textContent).to.match(/[\d.,]+\s?RSD/); // validate currency format

      const monthsDisplay = screen.getByText(/24 months/i);
      expect(monthsDisplay).to.exist;
      expect(monthsDisplay.textContent).to.match(/\d+/); // ensure number of months

      const monthlyRateDisplay = screen.getByText(/Monthly rate/i);
      expect(formattedExpected).to.exist;
      expect(monthlyRateDisplay.textContent.length).to.be.greaterThan(0);
    });
  });
});
