<template>
  <el-select v-model="value" multiple placeholder="Select tag" size="large">
    <el-option v-for="item in tagValids" :key="item._id" :label="item.name" :value="item.name"></el-option>
  </el-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getALlTags } from '../services'
import { useFetchData } from '@thinkvn/composables'

const props = defineProps<{ modelValue: string[] }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string[]): void }>()

const { fetch, data } = useFetchData(() => getALlTags({ size: 100 }), {
  autoResetData: false,
})

fetch()

const tagLists = computed(() => {
  return data?.value?.data?.data || []
})

const tagValids = computed(() => {
  return tagLists?.value?.filter(item => item.active === true) || []
})

const value = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  },
})
</script>
