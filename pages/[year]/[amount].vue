<template>
  <div class="container" dir="rtl">
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
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const params = route.params;

const calculatedValue = ref(null);
const cumulativeRate = ref(0);
const errorMessage = ref('');

onMounted(async () => {
  await calculateValue();
});

async function calculateValue() {
  const response = await fetch('/data.json');
  if (response.ok) {
    const rates = await response.json();
    let value = parseFloat(params.amount);
    const startYear = parseInt(params.year);
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

    // Formatting values
    calculatedValue.value = new Intl.NumberFormat('en-US').format(value.toFixed(0));
    cumulativeRate.value = new Intl.NumberFormat('en-US').format(((cumulativeRateValue - 1) * 100).toFixed(2)) + '%';
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
