import { fetchPlaceholders } from '../../scripts/placeholders.js';

async function updateCalculator(
  placeholders,
  inputRangeLoanAmount,
  inputRangeLoanPeriodAmount,
  spanMonthyRate,
  loanAmountLabel,
  loanPeriodLabel,
  periodOutput,
  creditOutput,
) {
  const queryParams = new URLSearchParams({ borrowedAmount: inputRangeLoanAmount.value, code: 'RSD', term: `${inputRangeLoanPeriodAmount.value}M` }).toString();
  const apiUrl = `https://1898068-creditcalculator-stage.adobeio-static.net/api/v1/web/credit-calculator/generic?${queryParams}`;

  const calculatorData = await fetch(
    apiUrl,
    {
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      },
      body: null,
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
    },
  );
  const calculatorInfo = await calculatorData.json();

  const amount = inputRangeLoanAmount.value.toLocaleString('sr-RS');

  const months = parseInt(calculatorInfo?.months, 10);
  const monthlyPayment = calculatorInfo?.mothlyPayment;

  const { currencyRsd, labelMonths } = placeholders;

  loanAmountLabel.textContent = amount;
  loanPeriodLabel.textContent = months;

  creditOutput.innerHTML = `${amount} ${currencyRsd}`;
  periodOutput.textContent = `${months} ${labelMonths}`;
  spanMonthyRate.textContent = `${monthlyPayment.toLocaleString('sr-RS')} ${currencyRsd}`;
}

export default async function decorate(block) {
  const rootElement = document.createElement('div');
  rootElement.classList.add('creditcalculator');

  const container = document.createElement('div');
  container.classList.add('container');
  const section = document.createElement('section');
  section.classList.add('calculator-section');

  // Placeholder fetching
  const placeholders = await fetchPlaceholders();
  const {
    labelLoanAmount, labelLoanPeriod, labelCredit,
    labelPayoutPeriod, labelMonthlyRate, noteCreditCalculatorInfo,
  } = placeholders;

  // Loan Amount markup

  const sliderContainer = document.createElement('div');
  sliderContainer.classList.add('slider-container');
  const labelElement = document.createElement('label');
  labelElement.setAttribute('for', 'loanAmount');

  const spanLabelElement = document.createElement('span');
  spanLabelElement.setAttribute('id', 'loanAmountLabel');
  spanLabelElement.innerHTML = '100000';

  labelElement.innerHTML = `${labelLoanAmount}: `;
  labelElement.append(spanLabelElement);
  sliderContainer.append(labelElement);

  const inputRangeLoanAmount = document.createElement('input');
  inputRangeLoanAmount.setAttribute('type', 'range');
  inputRangeLoanAmount.setAttribute('id', 'loanAmount');
  inputRangeLoanAmount.setAttribute('min', '10000');
  inputRangeLoanAmount.setAttribute('max', '1000000');
  inputRangeLoanAmount.setAttribute('step', '10000');
  inputRangeLoanAmount.setAttribute('value', '100000');
  sliderContainer.append(inputRangeLoanAmount);

  section.append(sliderContainer);

  // Loan Period Markup

  const sliderContainerForLoanPeriod = document.createElement('div');
  sliderContainerForLoanPeriod.classList.add('slider-container');

  const labelForLoanPeriodElement = document.createElement('label');
  labelForLoanPeriodElement.setAttribute('for', 'loanPeriod');

  const spanLabelForLoanPeriodElement = document.createElement('span');
  spanLabelForLoanPeriodElement.setAttribute('id', 'loanPeriodLabel');
  spanLabelForLoanPeriodElement.innerHTML = '18';

  labelForLoanPeriodElement.innerHTML = `${labelLoanPeriod}: `;
  labelForLoanPeriodElement.append(spanLabelForLoanPeriodElement);
  sliderContainerForLoanPeriod.append(labelForLoanPeriodElement);

  const inputRangeLoanPeriodAmount = document.createElement('input');
  inputRangeLoanPeriodAmount.setAttribute('type', 'range');
  inputRangeLoanPeriodAmount.setAttribute('id', 'loanPeriod');
  inputRangeLoanPeriodAmount.setAttribute('min', '6');
  inputRangeLoanPeriodAmount.setAttribute('max', '60');
  inputRangeLoanPeriodAmount.setAttribute('step', '1');
  inputRangeLoanPeriodAmount.setAttribute('value', '18');
  sliderContainerForLoanPeriod.append(inputRangeLoanPeriodAmount);

  section.append(sliderContainerForLoanPeriod);
  container.append(section);

  // Output boxes markup

  /* CREDIT Output */
  const outputBoxElement = document.createElement('div');
  outputBoxElement.classList.add('summary');

  const creditOutput = document.createElement('div');
  creditOutput.innerHTML = `${labelCredit}: `;

  const spanCreditOut = document.createElement('span');
  spanCreditOut.setAttribute('id', 'creditOutput');
  spanCreditOut.innerHTML = '100.000';

  creditOutput.append(spanCreditOut);

  outputBoxElement.append(creditOutput);
  /* Credit output */

  const payoutPeriodElement = document.createElement('div');
  payoutPeriodElement.innerHTML = `${labelPayoutPeriod}: `;
  const spanPayoutPeriod = document.createElement('span');
  spanPayoutPeriod.setAttribute('id', 'periodOutput');
  spanPayoutPeriod.innerHTML = '18';
  payoutPeriodElement.append(spanPayoutPeriod);

  outputBoxElement.append(payoutPeriodElement);

  const monthyRateElement = document.createElement('div');
  monthyRateElement.innerHTML = `${labelMonthlyRate}: `;
  const spanMonthyRate = document.createElement('span');
  spanMonthyRate.setAttribute('id', 'monthlyPaymentOutput');
  spanMonthyRate.innerHTML = '0';
  monthyRateElement.append(spanMonthyRate);

  outputBoxElement.append(monthyRateElement);
  container.append(outputBoxElement);

  const note = document.createElement('div');
  note.classList.add('note');
  note.innerHTML = `${noteCreditCalculatorInfo}`;
  container.append(note);

  rootElement.append(container);
  block.innerHTML = '';
  block.append(rootElement);

  updateCalculator(
    placeholders,
    inputRangeLoanAmount,
    inputRangeLoanPeriodAmount,
    spanMonthyRate,
    spanLabelElement,
    spanLabelForLoanPeriodElement,
    spanPayoutPeriod,
    spanCreditOut,
  );

  inputRangeLoanAmount.addEventListener('input', () => {
    updateCalculator(
      placeholders,
      inputRangeLoanAmount,
      inputRangeLoanPeriodAmount,
      spanMonthyRate,
      spanLabelElement,
      spanLabelForLoanPeriodElement,
      spanPayoutPeriod,
      spanCreditOut,
    );
  });
  inputRangeLoanPeriodAmount.addEventListener('input', () => {
    updateCalculator(
      placeholders,
      inputRangeLoanAmount,
      inputRangeLoanPeriodAmount,
      spanMonthyRate,
      spanLabelElement,
      spanLabelForLoanPeriodElement,
      spanPayoutPeriod,
      spanCreditOut,
    );
  });
}
