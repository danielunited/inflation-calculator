<template>
  <div class="container">
    <h1>Inflation Calculation Result</h1>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-else-if="calculatedValue">
      If you had <strong>{{ params.amount }} ILS</strong> in <strong>{{ params.year }}</strong
      >, it would be worth approximately <strong>{{ calculatedValue }} ILS</strong> today.
    </p>
    <p v-else>Loading...</p>
    <button @click="goBack">Calculate Again</button>
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
    let compoundedRate = 1;

    for (let year = startYear; year < currentYear; year++) {
      if (rates.hasOwnProperty(year.toString())) {
        compoundedRate *= 1 + rates[year.toString()];
      } else {
        // Handle missing data for a year; log, break, or use a default rate
        console.log(`No data for year ${year}, using last available rate.`);
        break;
      }
    }

    value *= compoundedRate;
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
