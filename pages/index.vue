<template>
  <div class="container">
    <h1>ILS Inflation Calculator</h1>
    <form @submit.prevent="submitForm">
      <div class="field">
        <label for="year">Year:</label>
        <select id="year" v-model="selectedYear" required>
          <option disabled value="">Please select one</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <div class="field">
        <label for="amount">Amount in ILS:</label>
        <input type="number" id="amount" v-model="amount" placeholder="Enter amount" required />
      </div>
      <button type="submit">Calculate</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const years = ref([]);
const selectedYear = ref('');
const amount = ref('');

// Fetch the available years from your data.json when the component mounts
onMounted(async () => {
  const response = await fetch('/data.json');
  if (response.ok) {
    const rates = await response.json();
    years.value = Object.keys(rates).sort((a, b) => a - b);
  } else {
    console.error('Failed to load years data');
  }
});

const submitForm = () => {
  if (selectedYear.value && amount.value) {
    router.push(`/${selectedYear.value}/${amount.value}`);
  } else {
    alert('Please fill in all fields.');
  }
};
</script>

<style>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.field {
  margin-bottom: 20px;
}
</style>
