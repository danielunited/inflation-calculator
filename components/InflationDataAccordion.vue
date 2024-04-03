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
const props = defineProps({
  data: Array,
});

const inflationDataSlotName = 'inflation-data';
const columns = ref([
  { key: 'year', label: 'שנה' },
  { key: 'inflationRate', label: 'שיעור האינפלציה' },
]);

const inflationData = computed(() => {
  return props.data.map((item) => ({
    year: item.year,
    inflationRate: `${(item.inflationRate * 100).toFixed(2)}%`,
  }));
});

const accordionItems = ref([
  {
    label: 'נתוני אינפלציה (בחישוב שנתי)',
    defaultOpen: false,
    slot: inflationDataSlotName,
  },
]);
</script>
