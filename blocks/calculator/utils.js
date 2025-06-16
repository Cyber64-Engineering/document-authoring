export function formatRSD(value) {
  return value.toLocaleString('sr-RS', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getSumOfFees(fees) {
  let initialSum = 0;

  fees?.data.forEach((fee) => {
    const feeStringAmount = fee.fixedAmount;
    const amount = !Number.isNaN(feeStringAmount)
      ? parseFloat(feeStringAmount)
      : 0;
    initialSum += amount;
  });
  return initialSum;
}

export function calculateMonthlyPayment(amount, months, calculatorInfo) {
  const interestRateData = calculatorInfo?.interestRate?.data?.[0];
  const interestRatePercentage = interestRateData?.percentage ?? '';
  const interestRateNumeric = parseInt(interestRatePercentage, 10);
  const interestRate = interestRateNumeric / 100;
  const monthlyRate = interestRate / 12;
  const rateFactor = (1 + monthlyRate) ** months;
  let monthly = (amount * monthlyRate * rateFactor) / (rateFactor - 1);
  monthly += getSumOfFees(calculatorInfo.fees);
  return formatRSD(monthly);
}
