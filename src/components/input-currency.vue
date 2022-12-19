<template>
  <el-input
    :validate-event="false"
    :model-value="modelValueAsCurrency"
    class="el-input--textfield"
    inputmode="number"
    @update:model-value="handleUpdateModelValue"
  >
    <template v-if="suffix" #append>{{ suffix }}</template>
  </el-input>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { formatCurrency, unCurrencyFormat } from '@/utils'
const props = defineProps<{
  modelValue?: number | string
  suffix?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
}>()

const modelValueAsCurrency = computed(() => {
  if (!props.modelValue) {
    return props.modelValue
  }
  return formatCurrency(props.modelValue)
})

const handleUpdateModelValue = (value: string | number) => {
  value = unCurrencyFormat(value)
  return emit('update:modelValue', value)
}
</script>
