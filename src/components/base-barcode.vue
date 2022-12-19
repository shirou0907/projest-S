<template>
  <svg id="barcode" ref="barcode"></svg>
</template>

<script lang="ts" setup>
import { nextTick, watch } from 'vue'
import JsBarcode from 'jsbarcode'

const props = defineProps<{ value: string }>()

const init = async () => {
  await nextTick()

  JsBarcode('#barcode', props.value, {
    height: 30,
    displayValue: false,
    margin: 0,
  })
}

watch(props, init, { immediate: true, deep: true })
</script>

<style scoped></style>
