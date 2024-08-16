<template>
  <div class="container">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">מחשבון אינפלציה</h1>
    <h2 class="mb-6 text-md font-normal text-gray-500 lg:text-lg dark:text-gray-400">חשב את כוח הקנייה של השקל במהלך השנים והשווה אותו להיום</h2>
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
        <UInput v-model="amount" type="text" placeholder="הזן סכום בשקלים" required label='סכום בש"ח"' size="xl" autocomplete="off" icon="i-heroicons-wallet-20-solid" />
      </div>
      <UButton type="submit" size="xl" block>חשב</UButton>
    </form>
    <InflationDataAccordion class="mt-4" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useHead } from '#imports';

const router = useRouter();
const selectedYear = ref('');
const amount = ref('');

const { data: yearsData } = await useFetch('/api/calculateInflation?year=2023&amount=1');

const yearOptions = computed(() =>
  Object.keys(yearsData.value?.rates || {})
    .filter((year) => parseInt(year) >= 1986)
    .sort((a, b) => parseInt(a) - parseInt(b))
);

const formattedAmount = computed(() => {
  if (!amount.value) return '';
  return new Intl.NumberFormat('he-IL').format(parseFloat(amount.value.replace(/[^\d.]/g, '')));
});

const submitForm = () => {
  if (selectedYear.value && amount.value) {
    const unformattedAmount = amount.value.replace(/[^\d.]/g, '');
    router.push(`/${selectedYear.value}/${unformattedAmount}`);
  } else {
    alert('אנא מלא את כל השדות.');
  }
};

useHead({
  title: 'מחשבון אינפלציה',
  meta: [
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
