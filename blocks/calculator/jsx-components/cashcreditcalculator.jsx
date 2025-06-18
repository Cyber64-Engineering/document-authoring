import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import { calculateMonthlyPayment, fetchCalculatorInfo } from '../utils.js';
import { fetchPlaceholders } from '../../../scripts/placeholders.js';
import Button from './button.jsx';

export default function CashCreditCalculator() {
  const [
    {
      labelLoanAmount,
      labelLoanPeriod,
      labelCredit,
      labelPayoutPeriod,
      labelMonthlyRate,
      labelMonths,
      noteCreditCalculatorInfo,
      currencyRsd,
    },
    setPlaceholders,
  ] = useState({});
  const [calculatorInfo, setCalculatorInfo] = useState({});
  const [loanAmount, setLoanAmount] = useState(100000);
  const [loanPeriod, setLoanPeriod] = useState(18);
  const [monthlyRate, setMonthlyRate] = useState(6164.5);

  useEffect(() => {
    const loadData = async () => {
      try {
        const placeholdersData = await fetchPlaceholders();
        const calculatorInfoData = await fetchCalculatorInfo();
        setPlaceholders(placeholdersData);
        setCalculatorInfo(calculatorInfoData);
      } catch (error) {
        console.error('Could not fetch data: ', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const monthlyPaymentValue = calculateMonthlyPayment(loanAmount, loanPeriod, calculatorInfo);
    setMonthlyRate(monthlyPaymentValue);
  }, [loanAmount, loanPeriod, calculatorInfo]);

  const updateLoanAmount = (event) => setLoanAmount(+event.target.value);
  const updateLoanPeriod = (event) => setLoanPeriod(+event.target.value);

  return (
    <div class="creditcalculator">
      <h2>
        Preact version <Button />
      </h2>
      <div class="container">
        <section class="calculator-section">
          <div class="slider-container">
            <label for="loanAmount">
              {labelLoanAmount}: <span id="loanAmountLabel">{loanAmount.toLocaleString('sr-RS')}</span>
            </label>
            <input
              type="range"
              id="loanAmount"
              min="10000"
              max="1000000"
              step="10000"
              value={loanAmount}
              onInput={updateLoanAmount}
            />
          </div>
          <div class="slider-container">
            <label for="loanPeriod">
              {labelLoanPeriod}: <span id="loanPeriodLabel"> {loanPeriod}</span>
            </label>
            <input type="range" id="loanPeriod" min="6" max="60" step="1" value={loanPeriod} onInput={updateLoanPeriod} />
          </div>
        </section>
        <div class="summary">
          <div>
            {labelCredit}:
            <span id="creditOutput">
              {loanAmount.toLocaleString('sr-RS')} {currencyRsd}
            </span>
          </div>
          <div>
            {labelPayoutPeriod}:
            <span id="periodOutput">
              {' '}
              {loanPeriod} {labelMonths}
            </span>
          </div>
          <div>
            {labelMonthlyRate}:
            <span id="monthlyPaymentOutput">
              {monthlyRate} {currencyRsd}
            </span>
          </div>
        </div>
        <div class="note">{noteCreditCalculatorInfo}</div>
      </div>
    </div>
  );
}
