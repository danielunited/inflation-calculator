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
import { ref, watch } from 'vue';

const route = useRoute();
const router = useRouter();
const { amount, year } = route.params;

const error = ref('');

const { data: calculationResult, error: fetchError } = await useFetch('/api/calculateInflation', {
  params: { amount, year },
});

if (fetchError.value) {
  error.value = 'אירעה שגיאה בחישוב הנתונים.';
}

// SEO
watch(
  calculationResult,
  (newResult) => {
    if (newResult) {
      useHead({
        title: `כמה היו שווים ${newResult.formattedAmount} שח ב-${year}? | מחשבון אינפלציה`,
        meta: [
          { name: 'description', content: `מחשב את ערך ${newResult.formattedAmount} שח משנת ${year} במונחים של הכסף היום. שווה ל-${newResult.calculatedValue} שקלים כיום.` },
          { property: 'og:title', content: `כמה היו שווים ${newResult.formattedAmount} שח ב-${year}? | מחשבון אינפלציה` },
          { property: 'og:description', content: `מחשב את ערך ${newResult.formattedAmount} שח משנת ${year} במונחים של הכסף היום. שווה ל-${newResult.calculatedValue} שקלים כיום.` },
          { property: 'og:type', content: 'website' },
          { property: 'og:image', content: '/israeli-shekel.jpeg' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: `כמה היו שווים ${newResult.formattedAmount} שח ב-${year}? | מחשבון אינפלציה` },
          { name: 'twitter:description', content: `מחשב את ערך ${newResult.formattedAmount} שח משנת ${year} במונחים של הכסף היום. שווה ל-${newResult.calculatedValue} שקלים כיום.` },
          { name: 'twitter:image', content: '/israeli-shekel.jpeg' },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
        htmlAttrs: {
          lang: 'he',
          dir: 'rtl',
        },
      });
    }
  },
  { immediate: true }
);

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
