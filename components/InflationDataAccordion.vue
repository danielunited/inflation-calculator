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
import { onMounted, ref } from 'vue';

const inflationDataSlotName = 'inflation-data';
const columns = ref([
  { key: 'year', label: 'שנה' },
  { key: 'inflationRate', label: 'שינוי במדד המחירים לצרכן (אינפלציה)' },
]);
const inflationData = ref([]);

const accordionItems = ref([
  {
    label: 'נתוני אינפלציה בחישוב שנתי',
    defaultOpen: false,
    slot: inflationDataSlotName,
  },
]);

async function fetchData() {
  try {
    const response = await fetch('/data.json');
    if (!response.ok) throw new Error('Failed to load data');

    const rates = await response.json();
    inflationData.value = Object.keys(rates).map((year) => ({
      year,
      inflationRate: `${(rates[year] * 100).toFixed(2)}%`,
    }));
  } catch (error) {
    console.error(error.message);
  }
}

onMounted(fetchData);
</script>
