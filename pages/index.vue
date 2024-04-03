<template>
  <div class="container">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">מחשבון אינפלציה</h1>
    <form @submit.prevent="submitForm">
      <div class="field">
        <UInputMenu v-model="selectedYear" :options="yearOptions" placeholder="בחר שנה להשוואה" label="שנה" size="xl" :popper="{ placement: 'bottom-start' }" required autofocus />
      </div>
      <div class="field">
        <UInput
          type="text"
          id="amount"
          v-model="rawAmount"
          :value="amount"
          @input="rawAmount = $event.target.value"
          placeholder="הזן סכום בשקלים"
          required
          label='סכום בש"ח"'
          size="xl"
          autocomplete="off"
        />
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
let rawAmount = ref('');

// Derived state to format years for USelect options
const yearOptions = computed(() => years.value.map((year) => year.toString()));

// Fetch the available years from your data.json when the component mounts
onMounted(async () => {
  const response = await fetch('/data.json');
  if (response.ok) {
    const rates = await response.json();
    years.value = Object.keys(rates)
      .map(Number)
      .filter((year) => year >= 1986)
      .sort((a, b) => a - b)
      .map(String); // Convert back to strings for the input menu
  } else {
    console.error('Failed to load year data');
  }
});

watch(
  rawAmount,
  (newValue) => {
    if (newValue === '') {
      // If the new value is an empty string, keep the display also empty to show the placeholder
      amount.value = '';
    } else {
      // Otherwise, strip non-numeric characters (preserve decimal point) and format
      const numericValue = newValue.replace(/[^\d.]/g, '');
      amount.value = new Intl.NumberFormat('he-IL').format(parseFloat(numericValue) || 0);
    }
  },
  { immediate: true }
);

const submitForm = () => {
  if (selectedYear.value && rawAmount.value) {
    const unformattedAmount = rawAmount.value.replace(/[^\d.]/g, ''); // Ensure we use unformatted value for calculations/navigation
    router.push(`/${selectedYear.value}/${unformattedAmount}`);
  } else {
    alert('אנא מלא את כל השדות.');
  }
};

useHead({
  title: 'מחשבון אינפלציה',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'מחשבון אינפלציה מאפשר לך לחשב את ערך הכסף שלך בהתאם לשינויים במדד האינפלציה. הזן סכום ושנה וקבל את הערך המתואם.' },
    { name: 'keywords', content: 'מחשבון אינפלציה, אינפלציה, מדד המחירים לצרכן, הצמדה, חישוב אינפלציה' },
    { property: 'og:title', content: 'מחשבון אינפלציה | חשב את הערך המתואם לאינפלציה של כספך' },
    { property: 'og:description', content: 'מחשבון אינפלציה מאפשר לך לחשב את ערך הכסף שלך בהתאם לשינויים במדד האינפלציה. הזן סכום ושנה וקבל את הערך המתואם.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/israeli-shekel.jpeg' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
  htmlAttrs: {
    lang: 'he',
    dir: 'rtl',
  },
  titleTemplate: '%s',
});
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
