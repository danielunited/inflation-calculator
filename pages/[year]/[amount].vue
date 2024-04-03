<template>
  <div class="container" dir="rtl">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">מחשבון אינפלציה</h1>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <ul v-else-if="calculatedValue && cumulativeRate">
      <li>
        כח הקנייה של <strong>{{ formattedAmount }} ש"ח</strong> ב-{{ params.year }} שווה ערך ל-<strong>{{ calculatedValue }} ש"ח</strong> של היום.
      </li>
      <li>
        לעומת זאת, אם הכסף היה יושב בחשבון הבנק הוא היה שווה ערך ל-<strong>{{ bankValue }} ש"ח</strong> היום.
      </li>
      <li>
        לפיכך, שיעור האינפלציה המצטבר הוא <strong>{{ cumulativeRate }}</strong
        >.
      </li>
    </ul>
    <p v-else>טוען...</p>
    <UButton @click="goBack" size="xl" class="mt-4" block>חישוב נוסף</UButton>
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
const errorMessage = ref('');

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
  let value = parseFloat(params.value.amount);
  formattedAmount.value = formatNumber(value);
  const startYear = parseInt(params.value.year);
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
  const pageDescription = `מחשב את ערך ${amount} ש"ח משנת ${year} במונחים של הכסף היום, בהתחשב בשיעורי האינפלציה. גלה כמה הכסף שלך שווה בזמן.`;

  useHead({
    title: pageTitle,
    meta: [
      { name: 'description', content: pageDescription },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: pageDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/israeli-shekel.jpeg' },
      // { property: 'og:url', content: `https://www.inflationcalculator.co.il/${year}/${amount}` },
      { name: 'twitter:card', content: 'summary_large_image' },
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
