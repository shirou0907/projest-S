<template>
  <el-tooltip effect="dark" :content="copied ? 'Copied' : 'Copy'" placement="top">
    <button @click="copy(String(value))">
      <el-icon class="!text-primary">
        <document-copy></document-copy>
      </el-icon>
    </button>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'
import { DocumentCopy } from '@element-plus/icons-vue'

defineProps<{ value: string | number }>()

const { copy, copied } = useClipboard()
</script>
