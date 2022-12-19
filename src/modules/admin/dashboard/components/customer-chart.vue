<template>
  <div>
    <Line :key="resetKey" :data="data" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { getCount } from '../utils'
import { useThemeStore } from '@/store/theme'

const themeStore = useThemeStore()

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps<{
  customer: any
  year: number
}>()

const resetKey = ref(0)

const data = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Số lượng người dùng',
      backgroundColor: '',
      data: [],
    },
  ],
})

watch(
  () => props.customer,
  () => {
    data.value.datasets[0].data = getCount(props.customer).map(i => i.total) as any
    data.value.datasets[0].label = `Số lượng người dùng năm ${props.year}`
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
