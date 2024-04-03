<template>
  <div class="container" dir="rtl">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">מחשבון אינפלציה</h1>
    <form @submit.prevent="submitForm">
      <div class="field">
        <USelect id="year" v-model="selectedYear" :options="yearOptions" required placeholder="בחר שנה" label="שנה" size="xl" />
      </div>
      <div class="field">
        <UInput type="number" id="amount" v-model="amount" placeholder="הכנס סכום בשקלים" required label='סכום בש"ח"' size="xl" />
      </div>
      <UButton type="submit" size="xl" block>חשב</UButton>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

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
    console.error('נכשל טעינת נתוני השנים');
  }
});

const submitForm = () => {
  if (selectedYear.value && amount.value) {
    router.push(`/${selectedYear.value}/${amount.value}`);
  } else {
    alert('אנא מלא את כל השדות.');
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
