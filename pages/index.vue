<template>
  <div class="container">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">ILS Inflation Calculator</h1>
    <form @submit.prevent="submitForm">
      <div class="field">
        <USelect id="year" v-model="selectedYear" :options="yearOptions" required placeholder="Select a year" label="Year" size="xl" />
      </div>
      <div class="field">
        <UInput type="number" id="amount" v-model="amount" placeholder="Enter amount" required label="Amount in ILS" size="xl" />
      </div>
      <UButton type="submit" size="xl">Calculate</UButton>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import { USelect, UInput, UButton } from 'nuxt-ui';

const router = useRouter();
const years = ref([]);
const selectedYear = ref('');
const amount = ref('');

// Derived state to format years for USelect options
const yearOptions = computed(() => years.value.map((year) => ({ label: year, value: year })));

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
