export default defineEventHandler(async (event) => {
  const { amount, year } = getQuery(event);

  function formatNumber(number) {
    return new Intl.NumberFormat('he-IL').format(number);
  }

  const ratesData = {
    '1986': 0.1965,
    '1987': 0.1613,
    '1988': 0.164,
    '1989': 0.2069,
    '1990': 0.1761,
    '1991': 0.1804,
    '1992': 0.0937,
    '1993': 0.1125,
    '1994': 0.1445,
    '1995': 0.081,
    '1996': 0.1059,
    '1997': 0.0699,
    '1998': 0.0862,
    '1999': 0.0134,
    '2000': 0,
    '2001': 0.0141,
    '2002': 0.065,
    '2003': -0.0189,
    '2004': 0.0121,
    '2005': 0.0239,
    '2006': -0.001,
    '2007': 0.034,
    '2008': 0.038,
    '2009': 0.0391,
    '2010': 0.0266,
    '2011': 0.0217,
    '2012': 0.0163,
    '2013': 0.0182,
    '2014': -0.002,
    '2015': -0.01,
    '2016': -0.002,
    '2017': 0.004,
    '2018': 0.008,
    '2019': 0.006,
    '2020': -0.007,
    '2021': 0.028,
    '2022': 0.053,
    '2023': 0.03,
    '2024': 0.021,
  };

  try {
    console.log('Amount:', amount, 'Year:', year); // Log input parameters

    let value = parseFloat(amount);
    const formattedAmount = formatNumber(value);
    const startYear = parseInt(year);
    if (startYear < 1986) {
      throw new Error('שנים לפני 1986 אינן נתמכות');
    }
    const currentYear = new Date().getFullYear();
    let cumulativeInflation = 1;

    console.log('Starting calculation from', startYear, 'to', currentYear);

    for (let y = startYear; y < currentYear; y++) {
      if (ratesData.hasOwnProperty(y.toString())) {
        const rate = ratesData[y.toString()];
        cumulativeInflation *= 1 + rate;
        console.log('Year:', y, 'Rate:', rate, 'Cumulative:', cumulativeInflation);
      } else {
        console.log('No data for year', y);
      }
    }

    const calculatedValue = formatNumber((value * cumulativeInflation).toFixed(0));
    const cumulativeRate = ((cumulativeInflation - 1) * 100).toFixed(2) + '%';
    const bankLossPercentage = ((1 - 1 / cumulativeInflation) * 100).toFixed(2) + '%';

    console.log('Calculation results:', {
      formattedAmount,
      calculatedValue,
      cumulativeRate,
      bankLossPercentage,
    });

    return {
      formattedAmount,
      calculatedValue,
      cumulativeRate,
      bankLossPercentage,
    };
  } catch (err) {
    console.error('Detailed error:', err);
    throw createError({
      statusCode: 400,
      statusMessage: `Calculation error: ${err.message}`,
    });
  }
});
