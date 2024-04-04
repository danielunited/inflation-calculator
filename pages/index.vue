<template>
  <div class="container">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">מחשבון אינפלציה</h1>
    <h2 class="mb-6 text-md font-normal text-gray-500 lg:text-lg dark:text-gray-400">חשב את כוח הקנייה של השקל הישראלי במהלך השנים, בהתאם לשינויי האינפלציה ומדד המחירים לצרכן</h2>
    <form @submit.prevent="submitForm">
      <div class="field">
        <UInputMenu
          v-model="selectedYear"
          :options="yearOptions"
          placeholder="בחר שנה להשוואה"
          label="שנה"
          size="xl"
          :popper="{ placement: 'bottom-start' }"
          required
          autofocus
          icon="i-heroicons-calendar-20-solid"
        />
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
          icon="i-heroicons-wallet-20-solid"
        />
      </div>
      <UButton type="submit" size="xl" block>חשב</UButton>
      <InflationDataAccordion class="mt-4" />
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
    { name: 'description', content: 'חשב את כוח הקנייה של השקל הישראלי במהלך השנים, בהתאם לשינויי האינפלציה ומדד המחירים לצרכן' },
    { name: 'keywords', content: 'מחשבון אינפלציה, אינפלציה, מדד המחירים לצרכן, הצמדה, חישוב אינפלציה' },
    { property: 'og:title', content: 'מחשבון אינפלציה | חשב את הערך המתואם לאינפלציה של כספך' },
    { property: 'og:description', content: 'מחשבון אינפלציה מאפשר לך לחשב את כוח הקנייה של הכסף שלך בהתאם לשינויי האינפלציה ומדד המחירים לצרכן. הזן סכום, שנה וקבל את הערך המדוייק.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/israeli-shekel.jpeg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'מחשבון אינפלציה' },
    { name: 'twitter:description', content: 'מחשבון אינפלציה מאפשר לך לחשב את כוח הקנייה של הכסף שלך בהתאם לשינויי האינפלציה ומדד המחירים לצרכן. הזן סכום, שנה וקבל את הערך המדוייק.' },
    { name: 'twitter:image', content: '/israeli-shekel.jpeg' },
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
