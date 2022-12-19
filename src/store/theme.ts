import { getThemeStyle } from '@/services'
import { useFetchData } from '@thinkvn/composables'
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const { data, fetch } = useFetchData(() => getThemeStyle(), {
    autoResetData: false,
  })

  const themes = computed(() => {
    return data?.value?.data?.data || []
  })

  return { themes, fetch }
})
