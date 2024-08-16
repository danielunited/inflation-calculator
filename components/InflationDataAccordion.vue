<template>
  <UAccordion :items="accordionItems" variant="link" size="xl">
    <template #[inflationDataSlotName]>
      <div class="overflow-x-auto">
        <p class="mb-4">הנתונים מובאים מפי בנק ישראל והלשכה המרכזית לסטטיסטיקה</p>
        <div class="border-gray-300 dark:border-gray-700 border rounded-md">
          <UTable :rows="inflationData" :columns="columns" variant="outline" />
        </div>
      </div>
    </template>
  </UAccordion>
</template>

<script setup>
import { ref, computed } from 'vue';

const inflationDataSlotName = 'inflation-data';
const columns = [
  { key: 'year', label: 'שנה' },
  { key: 'inflationRate', label: 'שינוי במדד המחירים לצרכן (אינפלציה)' },
];

const { data } = await useFetch('/api/calculateInflation?year=2023&amount=1');

const inflationData = computed(() => {
  const rates = data.value?.rates || {};
  return Object.entries(rates).map(([year, rate]) => ({
    year,
    inflationRate: `${(rate * 100).toFixed(2)}%`,
  }));
});

const accordionItems = ref([
  {
    label: 'נתוני אינפלציה בחישוב שנתי',
    defaultOpen: false,
    slot: inflationDataSlotName,
  },
]);
</script>
