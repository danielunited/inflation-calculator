<template>
  <div class="container">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">מחשבון אינפלציה</h1>
    <p v-if="error">{{ error }}</p>
    <div v-else-if="calculationResult" class="flex flex-col gap-4">
      <h2>
        💸 כח הקנייה של <strong>{{ calculationResult.formattedAmount }} ש"ח ב-{{ year }}</strong> שווה ערך ל-<strong>{{ calculationResult.calculatedValue }} שקלים היום</strong>
      </h2>
      <h2>
        📈 מאז {{ year }} האינפלציה עלתה ב-<strong>{{ calculationResult.cumulativeRate }}</strong>
      </h2>
      <h2>
        📉 כסף ששכב בעו״ש בתקופה הזו איבד <strong>{{ calculationResult.bankLossPercentage }}</strong> מערכו
      </h2>
    </div>
    <p v-else>טוען...</p>
    <UButton @click="goBack" size="xl" class="mt-4" block>חישוב נוסף</UButton>
    <InflationDataAccordion class="mt-4" />
  </div>
</template>

<script setup>
import { useHead, useRoute, useRouter } from '#imports';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();
const { amount, year } = route.params;

const { data: calculationResult, error } = await useFetch('/api/calculateInflation', {
  params: { amount, year },
});

const pageTitle = computed(() => (calculationResult.value ? `כמה היו שווים ${calculationResult.value.formattedAmount} שח ב-${year}? | מחשבון אינפלציה` : 'מחשבון אינפלציה'));

useHead({
  title: pageTitle,
  meta: [
    {
      name: 'description',
      content: computed(() =>
        calculationResult.value
          ? `מחשב את ערך ${calculationResult.value.formattedAmount} שח משנת ${year} במונחים של הכסף היום. שווה ל-${calculationResult.value.calculatedValue} שקלים כיום.`
          : 'מחשבון אינפלציה'
      ),
    },
    { property: 'og:title', content: pageTitle },
    {
      property: 'og:description',
      content: computed(() =>
        calculationResult.value
          ? `מחשב את ערך ${calculationResult.value.formattedAmount} שח משנת ${year} במונחים של הכסף היום. שווה ל-${calculationResult.value.calculatedValue} שקלים כיום.`
          : 'מחשבון אינפלציה'
      ),
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/israeli-shekel.jpeg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    {
      name: 'twitter:description',
      content: computed(() =>
        calculationResult.value
          ? `מחשב את ערך ${calculationResult.value.formattedAmount} שח משנת ${year} במונחים של הכסף היום. שווה ל-${calculationResult.value.calculatedValue} שקלים כיום.`
          : 'מחשבון אינפלציה'
      ),
    },
    { name: 'twitter:image', content: '/israeli-shekel.jpeg' },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
  htmlAttrs: {
    lang: 'he',
    dir: 'rtl',
  },
});

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
