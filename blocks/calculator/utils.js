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
    const amount = !Number.isNaN(feeStringAmount) ? parseFloat(feeStringAmount) : 0;
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

export async function fetchCalculatorInfo() {
  const apiHostName = `${window.location.protocol}//${window.location.host}`;
  try {
    const calculatorResponse = await fetch(`${apiHostName}/financial-site/data/credit.json`, {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      },
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
    });
    return await calculatorResponse.json();
  } catch (e) {
    console.error('Could not fetch Calculator Info: ', e);
  }
  return {};
}
