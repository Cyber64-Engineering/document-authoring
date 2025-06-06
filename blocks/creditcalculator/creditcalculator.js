import calculatorInfo from "./mockResponse.json" with { type: "json" };

function formatRSD(value) {
  return value.toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculateMonthlyPayment(amount, months, interestRateData) {
  const interestRatePercentage = interestRateData.percentage;
  const interestRateNumeric = parseInt(interestRatePercentage, 10);
  const interestRate = interestRateNumeric / 100;
  const monthlyRate = interestRate / 12;
  const rateFactor = (1 + monthlyRate) ** months;
  const monthly = (amount * monthlyRate * rateFactor) / (rateFactor - 1);
  return monthly;
}

function getSumOfFees(fees) {
  let initialSum = 0;

  fees?.data.forEach((fee) => {
    const feeStringAmount = fee.fixedAmount;
    const amount = !Number.isNaN(feeStringAmount) ? parseFloat(feeStringAmount) : 0;
    initialSum += amount;
  });
  return initialSum;
}

function updateCalculator(calculatorInfo) {
  const additionalFees = getSumOfFees(calculatorInfo.fees);
  const interestRateData = calculatorInfo?.interestRate?.data?.[0];
  const loanAmountSlider = document.getElementById('loanAmount');
  const loanPeriodSlider = document.getElementById('loanPeriod');
  const loanAmountLabel = document.getElementById('loanAmountLabel');
  const loanPeriodLabel = document.getElementById('loanPeriodLabel');
  const creditOutput = document.getElementById('creditOutput');
  const periodOutput = document.getElementById('periodOutput');
  const monthlyPaymentOutput = document.getElementById('monthlyPaymentOutput');
  const amount = parseInt(loanAmountSlider.value, 10);
  const months = parseInt(loanPeriodSlider.value, 10);
  let monthlyPayment = calculateMonthlyPayment(amount, months, interestRateData);

  monthlyPayment += additionalFees;

  loanAmountLabel.textContent = amount.toLocaleString('sr-RS');
  loanPeriodLabel.textContent = months;

  creditOutput.innerHTML = `${amount.toLocaleString('sr-RS')} RSD`;
  periodOutput.textContent = `${months} months`;
  monthlyPaymentOutput.textContent = `${formatRSD(monthlyPayment)} RSD`;
}

export default async function decorate(block) {

  const rootElement = document.createElement('div');
  rootElement.classList.add('creditcalculator');

  const container = document.createElement('div');
  container.classList.add('container');
  const section = document.createElement('section');

  // Loan Amount markup

  const sliderContainer = document.createElement('div');
  sliderContainer.classList.add('slider-container');
  const labelElement = document.createElement('label');
  labelElement.setAttribute('for', 'loanAmount');

  const spanLabelElement = document.createElement('span');
  spanLabelElement.setAttribute('id', 'loanAmountLabel');
  spanLabelElement.innerHTML = '100000';

  labelElement.innerHTML = 'I want a loan in the following amount (RSD): ';
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

  labelForLoanPeriodElement.innerHTML = 'I want to pay it out in (months): ';
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
  creditOutput.innerHTML = 'Credit: ';

  const spanCreditOut = document.createElement('span');
  spanCreditOut.setAttribute('id', 'creditOutput');
  spanCreditOut.innerHTML = '100.000';

  creditOutput.append(spanCreditOut);

  outputBoxElement.append(creditOutput);
  /* Credit output */

  const payoutPeriodElement = document.createElement('div');
  payoutPeriodElement.innerHTML = 'Payout period: ';
  const spanPayoutPeriod = document.createElement('span');
  spanPayoutPeriod.setAttribute('id', 'periodOutput');
  spanPayoutPeriod.innerHTML = '18';
  payoutPeriodElement.append(spanPayoutPeriod);

  outputBoxElement.append(payoutPeriodElement);

  const monthyRateElement = document.createElement('div');
  monthyRateElement.innerHTML = 'Monthly rate: ';
  const spanMonthyRate = document.createElement('span');
  spanMonthyRate.setAttribute('id', 'monthlyPaymentOutput');
  spanMonthyRate.innerHTML = '0';
  monthyRateElement.append(spanMonthyRate);

  outputBoxElement.append(monthyRateElement);
  container.append(outputBoxElement);

  const note = document.createElement('div');
  note.classList.add('note');
  note.innerHTML = 'Kreditni kalkulator je informativnog karaktera i ne predstavlja zvaničnu ponudu banke.';
  container.append(note);

  rootElement.append(container);
  block.innerHTML = '';
  block.append(rootElement);

  /* API CALL */

  updateCalculator(calculatorInfo);

  inputRangeLoanAmount.addEventListener('input', () => {
    updateCalculator(calculatorInfo);
  });
  inputRangeLoanPeriodAmount.addEventListener('input', () => {
    updateCalculator(calculatorInfo);
  });
  
}
