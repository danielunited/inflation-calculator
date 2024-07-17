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

<script setup lang="ts">
import { useHead, useRoute, useRouter } from '#imports';
import { ref, watch, computed } from 'vue';

const route = useRoute();
const router = useRouter();
const { amount, year } = route.params as { amount: string; year: string };

interface CalculationResult {
  formattedAmount: string;
  calculatedValue: string;
  cumulativeRate: string;
  bankLossPercentage: string;
}

const error = ref<string | null>(null);

const { data: calculationResult, error: fetchError } = await useFetch<CalculationResult>('/api/calculateInflation', {
  params: { amount, year },
});

if (fetchError.value) {
  error.value = 'אירעה שגיאה בחישוב הנתונים.';
}

// Memoized computation for SEO metadata
const seoMetadata = computed(() => {
  if (calculationResult.value) {
    return {
      title: `כמה היו שווים ${calculationResult.value.formattedAmount} שח ב-${year}? | מחשבון אינפלציה`,
      description: `מחשב את ערך ${calculationResult.value.formattedAmount} שח משנת ${year} במונחים של הכסף היום. שווה ל-${calculationResult.value.calculatedValue} שקלים כיום.`,
    };
  }
  return null;
});

// SEO
watch(
  seoMetadata,
  (newMetadata) => {
    if (newMetadata) {
      useHead({
        title: newMetadata.title,
        meta: [
          { name: 'description', content: newMetadata.description },
          { property: 'og:title', content: newMetadata.title },
          { property: 'og:description', content: newMetadata.description },
          { property: 'og:type', content: 'website' },
          { property: 'og:image', content: '/israeli-shekel.jpeg' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: newMetadata.title },
          { name: 'twitter:description', content: newMetadata.description },
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
