<template>
  <div>
    <Bar :key="resetKey" :data="data" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'
import { getCount } from '../utils'
import { useThemeStore } from '@/store/theme'

const themeStore = useThemeStore()

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  order: any
  year: number
}>()

const resetKey = ref(0)

const data = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Doanh thu',
      backgroundColor: '',
      data: [],
    },
  ],
})

watch(
  () => props.order,
  () => {
    data.value.datasets[0].data = getCount(props.order).map(i => i.total) as any
    data.value.datasets[0].label = `Doanh thu năm ${props.year}`
    data.value.datasets[0].backgroundColor = themeStore.themes.lightMainColor
    resetKey.value++
  },
  { immediate: true, deep: true }
)

const options = {
  responsive: true,
  maintainAspectRatio: false,
}
</script>
