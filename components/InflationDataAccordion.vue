<template>
  <UAccordion :items="accordionItems" variant="link" size="xl">
    <template #[inflationDataSlotName]>
      <div class="overflow-x-auto">
        <p class="mb-4">הנתונים מובאים מפי בנק ישראל והלשכה המרכזית לסטטיסטיקה</p>
        <div class="border-gray-300 dark:border-gray-700 border rounded-md">
          <UTable :rows="inflationData" :columns="columns" variant="outline">
            <template #inflationRate-data="{ row }">
              <span class="px-2 py-1 rounded text-black" :class="getBadgeColor(row.inflationRateValue)">
                {{ row.inflationRate }}
              </span>
            </template>
          </UTable>
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
    inflationRateValue: rate,
  }));
});

const getBadgeColor = (rate) => {
  if (rate < 0) return 'bg-green-100'; // Negative inflation
  if (rate < 0.03) return 'bg-amber-100'; // 0-3% inflation
  if (rate < 0.07) return 'bg-orange-100'; // 3-7% inflation
  return 'bg-red-100'; // 7%+ inflation
};

const accordionItems = ref([
  {
    label: 'נתוני אינפלציה בחישוב שנתי',
    defaultOpen: false,
    slot: inflationDataSlotName,
  },
]);
</script>
