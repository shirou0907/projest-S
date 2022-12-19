<template>
  <div class="relative">
    <label
      class="h-[56px] px-4 border border-divide-lighter text-secondary-text rounded absolute top-0 left-0 w-full"
      :class="classObject"
      @click="handleClick()"
    >
      {{ title }}
    </label>

    <input
      ref="refInput"
      :name="name"
      class="h-[56px] px-4 pt-5 outline-none w-full font-semibold text-primary-text"
      autocomplete="off"
      autofill="off"
      :value="modelValue"
      :readonly="readOnly"
      :title="title"
      :type="type"
      v-bind="attrs"
      @focus="handleFocus()"
      @blur="handleBlur()"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <div class="absolute pt-4 top-1/2 -translate-y-1/2 right-4 text-secondary-text">
      <slot v-if="$slots.prefix && isShow" name="prefix"></slot>
    </div>
  </div>

  <div v-if="errorMessage && isShow" class="min-w-max flex items-center space-x-1 !mt-2">
    <el-icon class="!text-danger"><i-ep-circle-close-filled></i-ep-circle-close-filled></el-icon>
    <div class="text-xs">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef, useAttrs } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps<{ modelValue: string; type?: string; title?: string; name: string }>()

defineEmits<{
  (e: 'update:modelValue', modelValue: string): void
}>()

const attrs = useAttrs()
const isShow = ref(false)
const readOnly = ref(true)
const refInput = ref<HTMLInputElement>()

const classObject = computed(() => ({
  'leading-[34px] text-xs': isShow.value,
  'leading-[56px]': !isShow.value,
  'border-danger': errorMessage.value,
}))

const handleClick = () => {
  if (refInput.value) {
    refInput.value.focus()
  }
}

const handleFocus = () => {
  isShow.value = true
  readOnly.value = false
}

const handleBlur = () => {
  isShow.value = !!modelValue.value
}

const { errorMessage, value: modelValue } = useField(toRef(props, 'name'))
</script>
