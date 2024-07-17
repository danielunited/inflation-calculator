import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const { amount, year } = getQuery(event);

  function formatNumber(number) {
    return new Intl.NumberFormat('he-IL').format(number);
  }

  try {
    const dataPath = path.join(process.cwd(), 'public', 'data.json');
    const ratesData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    let value = parseFloat(amount);
    const formattedAmount = formatNumber(value);
    const startYear = parseInt(year);
    if (startYear < 1986) {
      throw new Error('שנים לפני 1986 אינן נתמכות');
    }
    const currentYear = new Date().getFullYear();
    let cumulativeInflation = 1;

    for (let y = startYear; y < currentYear; y++) {
      if (ratesData.hasOwnProperty(y.toString())) {
        const rate = ratesData[y.toString()];
        cumulativeInflation *= 1 + rate;
      }
    }

    const calculatedValue = formatNumber((value * cumulativeInflation).toFixed(0));
    const cumulativeRate = ((cumulativeInflation - 1) * 100).toFixed(2) + '%';
    const bankLossPercentage = ((1 - 1 / cumulativeInflation) * 100).toFixed(2) + '%';

    return {
      formattedAmount,
      calculatedValue,
      cumulativeRate,
      bankLossPercentage,
    };
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err.message || 'An error occurred during calculation.',
    });
  }
});
