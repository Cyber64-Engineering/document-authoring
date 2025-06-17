import { h } from 'https://esm.sh/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import { calculateMonthlyPayment } from './utils.js';
import { fetchPlaceholders } from '../../scripts/placeholders.js';
import Button from "./components/button.js";
export default function CashCreditCalculator() {
  const [{
    labelLoanAmount,
    labelLoanPeriod,
    labelCredit,
    labelPayoutPeriod,
    labelMonthlyRate,
    labelMonths,
    noteCreditCalculatorInfo,
    currencyRsd
  }, setPlaceholders] = useState({});
  const [calculatorInfo, setCalculatorInfo] = useState({});
  const [loanAmount, setLoanAmount] = useState(100000);
  const [loanPeriod, setLoanPeriod] = useState(18);
  const [monthlyRate, setMonthlyRate] = useState(6164.5);
  const apiHostName = `${window.location.protocol}//${window.location.host}`;
  useEffect(async () => {
    try {
      const placeholdersData = await fetchPlaceholders();
      const calculatorResponse = await fetch(`${apiHostName}/financial-site/data/credit.json`, {
        headers: {
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
        },
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
      });
      const calculatorInfoData = await calculatorResponse.json();
      setPlaceholders(placeholdersData);
      setCalculatorInfo(calculatorInfoData);
    } catch (e) {
      console.error(e, 'an error');
    }
  }, []);
  useEffect(() => {
    const monthlyPaymentValue = calculateMonthlyPayment(loanAmount, loanPeriod, calculatorInfo);
    setMonthlyRate(monthlyPaymentValue);
  }, [loanAmount, loanPeriod, calculatorInfo]);
  const updateLoanAmount = event => setLoanAmount(+event.target.value);
  const updateLoanPeriod = event => setLoanPeriod(+event.target.value);
  return h("div", {
    class: "creditcalculator"
  }, h("h2", null, "Preact version jda ", h(Button, null)), h("div", {
    class: "container"
  }, h("section", {
    class: "calculator-section"
  }, h("div", {
    class: "slider-container"
  }, h("label", {
    for: "loanAmount"
  }, labelLoanAmount, ": ", h("span", {
    id: "loanAmountLabel"
  }, loanAmount.toLocaleString('sr-RS'))), h("input", {
    type: "range",
    id: "loanAmount",
    min: "10000",
    max: "1000000",
    step: "10000",
    value: loanAmount,
    onInput: updateLoanAmount
  })), h("div", {
    class: "slider-container"
  }, h("label", {
    for: "loanPeriod"
  }, labelLoanPeriod, ":", h("span", {
    id: "loanPeriodLabel"
  }, " ", loanPeriod)), h("input", {
    type: "range",
    id: "loanPeriod",
    min: "6",
    max: "60",
    step: "1",
    value: loanPeriod,
    onInput: updateLoanPeriod
  }))), h("div", {
    class: "summary"
  }, h("div", null, labelCredit, ":", h("span", {
    id: "creditOutput"
  }, loanAmount.toLocaleString('sr-RS'), " ", currencyRsd)), h("div", null, labelPayoutPeriod, ":", h("span", {
    id: "periodOutput"
  }, ' ', loanPeriod, " ", labelMonths)), h("div", null, labelMonthlyRate, ":", h("span", {
    id: "monthlyPaymentOutput"
  }, monthlyRate, " ", currencyRsd))), h("div", {
    class: "note"
  }, noteCreditCalculatorInfo)));
}