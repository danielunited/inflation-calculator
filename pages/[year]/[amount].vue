<template>
  <div class="container">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">מחשבון אינפלציה</h1>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <div v-else-if="calculatedValue && cumulativeRate" class="flex flex-col gap-4">
      <h2>
        💸 כח הקנייה של <strong>{{ formattedAmount }} ש"ח ב-{{ params.year }}</strong> שווה ערך ל-<strong>{{ calculatedValue }} שקלים היום</strong>
      </h2>
      <h2>
        📈 מאז {{ params.year }} האינפלציה עלתה ב-<strong>{{ cumulativeRate }}</strong>
      </h2>
      <h2>
        📉 כסף ששכב בעו״ש בתקופה הזו איבד <strong>{{ bankLossPercentage }}</strong> מערכו
      </h2>
    </div>
    <p v-else>טוען...</p>
    <UButton @click="goBack" size="xl" class="mt-4" block>חישוב נוסף</UButton>
    <InflationDataAccordion class="mt-4" />
  </div>
</template>

<script setup>
import { useHead } from '#imports';
import { onMounted, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const params = ref(route.params);
const calculatedValue = ref('');
const formattedAmount = ref('');
const bankValue = ref('');
const cumulativeRate = ref('');
const bankLossPercentage = ref('');
const errorMessage = ref('');
const transformedRatesData = ref([]);

function formatNumber(number) {
  return new Intl.NumberFormat('he-IL').format(number);
}

// Single consolidated function for calculations
async function calculateValue() {
  const response = await fetch('/data.json');
  if (!response.ok) {
    console.error('Failed to load inflation data');
    errorMessage.value = 'Error loading data.';
    return;
  }

  const rates = await response.json();
  transformedRatesData.value = Object.keys(rates).map((year) => ({
    year,
    inflationRate: rates[year],
  }));

  let value = parseFloat(params.value.amount);
  formattedAmount.value = formatNumber(value);
  const startYear = parseInt(params.value.year);
  if (startYear < 1986) {
    throw createError({
      statusCode: 404,
      statusMessage: 'השנה אינה נתמכת',
      message: 'שנים לפני 1986 אינן נתמכות',
      fatal: true,
    });
  }
  const currentYear = new Date().getFullYear();
  let cumulativeInflation = 1;
  let cumulativeRateValue = 1;

  for (let year = startYear; year < currentYear; year++) {
    if (rates.hasOwnProperty(year.toString())) {
      const rate = rates[year.toString()];
      cumulativeInflation *= 1 + rate;
      cumulativeRateValue *= 1 + rate;
      if (year === 1984) {
        // Adjust for the currency change from Old Shekel to New Shekel
        value /= 1000; // Applying the conversion rate of 1000:1 from Old to New Shekel
      }
    } else {
      console.log(`No data for year ${year}, assuming no inflation for this year.`);
    }
  }

  calculatedValue.value = new Intl.NumberFormat('he-IL').format((value * cumulativeInflation).toFixed(0));
  bankValue.value = new Intl.NumberFormat('he-IL').format((value / cumulativeInflation).toFixed(0));
  bankLossPercentage.value = ((1 - 1 / cumulativeInflation) * 100).toFixed(2) + '%';
  cumulativeRate.value = ((cumulativeInflation - 1) * 100).toFixed(2) + '%';
}

onMounted(async () => {
  await calculateValue();
});

// Dynamic SEO updates
watchEffect(() => {
  const amount = params.value.amount;
  const year = params.value.year;
  const pageTitle = `כמה היו שווים ${formattedAmount.value} שח ב-${year}? | מחשבון אינפלציה`;
  const pageDescription = `מחשב את ערך ${amount} שח משנת ${year} במונחים של הכסף היום, בהתחשב בשיעורי האינפלציה. גלה כמה הכסף שלך שווה בזמן.`;

  useHead({
    title: pageTitle,
    meta: [
      { name: 'description', content: pageDescription },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: pageDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/israeli-shekel.jpeg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: pageDescription },
      { name: 'twitter:image', content: '/israeli-shekel.jpeg' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
    htmlAttrs: {
      lang: 'he',
      dir: 'rtl',
    },
    titleTemplate: '%s',
  });
});

const goBack = () => {
  router.push('/');
};
</script>

<style>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>
