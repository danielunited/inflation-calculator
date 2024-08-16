import inflationRates from '../data/inflation-rates.json';

export default defineEventHandler(async (event) => {
  const { amount, year } = getQuery(event);

  const formatNumber = (number) => new Intl.NumberFormat('he-IL').format(number);

  try {
    const value = parseFloat(amount);
    const startYear = parseInt(year);
    if (startYear < 1986) {
      throw new Error('שנים לפני 1986 אינן נתמכות');
    }
    const currentYear = new Date().getFullYear();
    let cumulativeInflation = 1;

    for (const [y, rate] of Object.entries(inflationRates)) {
      if (parseInt(y) >= startYear && parseInt(y) <= currentYear) {
        cumulativeInflation *= 1 + rate;
      }
    }

    const calculatedValue = formatNumber((value * cumulativeInflation).toFixed(0));
    const cumulativeRate = ((cumulativeInflation - 1) * 100).toFixed(2) + '%';
    const bankLossPercentage = ((1 - 1 / cumulativeInflation) * 100).toFixed(2) + '%';

    return {
      formattedAmount: formatNumber(value),
      calculatedValue,
      cumulativeRate,
      bankLossPercentage,
      rates: inflationRates,
    };
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: `Calculation error: ${err.message}`,
    });
  }
});
