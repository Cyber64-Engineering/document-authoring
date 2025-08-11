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
      expect(screen.getByText(/Kreditni kalkulator je informativnog karaktera/i)).to.exist;
    });

    expect(screen.getByLabelText(/I want a loan in the following amount/i)).to.exist;
    expect(screen.getByLabelText(/I want to pay it out in/i)).to.exist;

    expect(screen.getByText(/100.000 RSD/)).to.exist;
  });

  it('updates values when sliders are changed and calculates correct payment', async () => {
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

    await waitFor(() => screen.getByText(/Kreditni kalkulator je informativnog karaktera/i));

    const loanAmountInput = screen.getByLabelText(/I want a loan in the following amount/i);
    const loanPeriodInput = screen.getByLabelText(/I want to pay it out in/i);

    fireEvent.input(loanAmountInput, { target: { value: loanAmount.toString() } });
    fireEvent.input(loanPeriodInput, { target: { value: loanPeriod.toString() } });

    const expected = calculateMonthlyPayment(loanAmount, loanPeriod, calculatorInfoMock);
    const formattedExpected = `${expected.toLocaleString('sr-RS', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} RSD`;

    await waitFor(() => {
      expect(screen.getByText(/200.000 RSD/)).to.exist;
      expect(screen.getByText(/24 months/)).to.exist;
      expect(screen.getByText(formattedExpected)).to.exist;
      expect(screen.getByText(/Monthly rate/i)).to.exist;
    });
  });
});
