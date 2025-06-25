import { h } from 'https://esm.sh/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import { calculateMonthlyPayment, fetchCalculatorInfo } from '../utils.js';
import { fetchPlaceholders } from '../../../scripts/placeholders.js';
import ContentBlock from './renderHTML.js';

export default function CashCreditCalculator({
  content,
}) {
  const [{
    labelLoanAmount,
    labelLoanPeriod,
    labelCredit,
    labelPayoutPeriod,
    labelMonthlyRate,
    labelMonths,
    noteCreditCalculatorInfo,
    currencyRsd,
  }, setPlaceholders] = useState({});
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
  return h('div', {
    class: 'creditcalculator',
  }, h(ContentBlock, {
    content,
  }), h('div', {
    class: 'container',
  }, h('section', {
    class: 'calculator-section',
  }, h('div', {
    class: 'slider-container',
  }, h('label', {
    for: 'loanAmount',
  }, labelLoanAmount, ': ', h('span', {
    id: 'loanAmountLabel',
  }, loanAmount.toLocaleString('sr-RS'))), h('input', {
    type: 'range',
    id: 'loanAmount',
    min: '10000',
    max: '1000000',
    step: '10000',
    value: loanAmount,
    onInput: updateLoanAmount,
  })), h('div', {
    class: 'slider-container',
  }, h('label', {
    for: 'loanPeriod',
  }, labelLoanPeriod, ': ', h('span', {
    id: 'loanPeriodLabel',
  }, ' ', loanPeriod)), h('input', {
    type: 'range',
    id: 'loanPeriod',
    min: '6',
    max: '60',
    step: '1',
    value: loanPeriod,
    onInput: updateLoanPeriod,
  }))), h('div', {
    class: 'summary',
  }, h('div', null, labelCredit, ':', h('span', {
    id: 'creditOutput',
  }, loanAmount.toLocaleString('sr-RS'), ' ', currencyRsd)), h('div', null, labelPayoutPeriod, ':', h('span', {
    id: 'periodOutput',
  }, ' ', loanPeriod, ' ', labelMonths)), h('div', null, labelMonthlyRate, ':', h('span', {
    id: 'monthlyPaymentOutput',
  }, monthlyRate, ' ', currencyRsd))), h('div', {
    class: 'note',
  }, noteCreditCalculatorInfo)));
}
