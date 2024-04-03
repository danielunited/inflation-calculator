<template>
  <div class="container">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">מחשבון אינפלציה</h1>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-else-if="calculatedValue && cumulativeRate">
      אם היו לך <strong>{{ params.amount }} ש"ח</strong> בשנת <strong>{{ params.year }}</strong
      >, הם היו שווים <strong>{{ calculatedValue }} ש"ח</strong> היום. לפיכך, שיעור האינפלציה המצטבר הוא <strong>{{ cumulativeRate }}</strong
      >.
    </p>
    <p v-else>טוען...</p>
    <UButton @click="goBack" size="xl" class="mt-4" block>חישוב נוסף</UButton>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '#imports';

const route = useRoute();
const router = useRouter();
const calculatedValue = ref(null);
const cumulativeRate = ref('');
const errorMessage = ref('');

// Ensure route.params is reactive
const params = ref(route.params);

// Watch for changes to params to update SEO dynamically
watchEffect(() => {
  const amount = params.value.amount;
  const year = params.value.year;
  const pageTitle = `כמה ${amount} ש“ח משנת ${year} שווים היום? | מחשבון אינפלציה`;
  const pageDescription = `מחשב את ערך ${amount} ש“ח ${year} במונחים של הכסף היום, בהתחשב בשיעורי האינפלציה. גלה כמה הכסף שלך שווה בזמן.`;

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
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk}` : 'מחשבון אינפלציה';
    },
  });
});

onMounted(async () => {
  await calculateValue();
});

async function calculateValue() {
  const response = await fetch('/data.json');
  if (response.ok) {
    const rates = await response.json();
    let value = parseFloat(params.value.amount);
    const startYear = parseInt(params.value.year);
    const currentYear = new Date().getFullYear();
    let cumulativeRateValue = 1; // Start with a base of 1 (100%)

    for (let year = startYear; year < currentYear; year++) {
      if (rates.hasOwnProperty(year.toString())) {
        const rate = rates[year.toString()];
        value *= 1 + rate;
        cumulativeRateValue *= 1 + rate;
        if (year === 1984) {
          // Adjust for the currency change from Old Shekel to New Shekel
          value /= 1000; // Applying the conversion rate of 1000:1 from Old to New Shekel
        }
      } else {
        console.log(`אין נתונים לשנה ${year}, משתמש בשיעור האחרון הזמין.`);
        break;
      }
    }

    calculatedValue.value = new Intl.NumberFormat('he-IL').format(value.toFixed(2));
    cumulativeRate.value = ((cumulativeRateValue - 1) * 100).toFixed(2) + '%';
  } else {
    console.error('נכשל טעינת נתוני קצבי האינפלציה');
    errorMessage.value = 'שגיאה: נכשל טעינת הנתונים.';
  }
}

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
