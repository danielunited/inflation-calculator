<template>
  <div class="container">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Inflation Calculation Result</h1>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-else-if="calculatedValue">
      If you had <strong>{{ params.amount }} ILS</strong> in <strong>{{ params.year }}</strong
      >, it would be worth approximately <strong>{{ calculatedValue }} ILS</strong> today.
    </p>
    <p v-else>Loading...</p>
    <UButton @click="goBack" size="xl">Calculate Again</UButton>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const params = route.params;

const calculatedValue = ref(null);
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

    for (let year = startYear; year < currentYear; year++) {
      if (rates.hasOwnProperty(year.toString())) {
        value *= 1 + rates[year.toString()];
        if (year === 1984) {
          // Adjust for the currency change from Old Shekel to New Shekel
          value /= 1000; // Applying the conversion rate of 1000:1 from Old to New Shekel
        }
      } else {
        console.log(`No data for year ${year}, using last available rate.`);
        break;
      }
    }

    calculatedValue.value = value.toFixed(2);
  } else {
    console.error('Failed to load inflation rates data');
    calculatedValue.value = 'Error: Failed to load data.';
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
