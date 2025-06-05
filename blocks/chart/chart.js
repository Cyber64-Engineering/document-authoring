import { readBlockConfig } from '../../scripts/aem.js';

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const chartType = config.type?.toLowerCase() || 'bar';
  const titleText = config.title || '';

  block.textContent = 'Loading chart...';

  try {
    const res = await fetch('https://api.polygon.io/v3/reference/dividends?apiKey=XK7sUehimG0Tqjszm6IFfmyk6ZoDqNZ5');
    const { results } = await res.json();

    const chartData = results.map((item) => ({
      date: item.ex_dividend_date,
      value: item.cash_amount,
      currency: item.currency,
    }));

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
      block.innerHTML = '';

      const titleEl = document.createElement('h2');
      titleEl.textContent = titleText;
      block.appendChild(titleEl);

      const canvas = document.createElement('canvas');
      canvas.id = 'dividendChart';
      canvas.width = 600;
      canvas.height = 400;
      block.appendChild(canvas);

      const ctx = canvas.getContext('2d');

      const chartConfig = {
        type: chartType,
        data: {
          labels: chartData.map(d => d.date),
          datasets: [{
            label: `Dividend (${chartData[0]?.currency || 'USD'})`,
            data: chartData.map(d => d.value),
            backgroundColor: chartType === 'pie'
              ? chartData.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`)
              : 'rgba(75, 192, 192, 0.6)',
            borderColor: chartType === 'pie'
              ? '#fff'
              : 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: false },
          },
        }
      };

      if (['bar', 'line'].includes(chartType)) {
        chartConfig.options.scales = {
          y: {
            beginAtZero: true,
            title: { display: true, text: config.yname },
          },
          x: {
            title: { display: true, text: config.xname },
          },
        };
      }

      new Chart(ctx, chartConfig);
    };
    document.head.appendChild(script);

  } catch (e) {
    block.textContent = `Error loading chart: ${e.message}`;
  }
}
