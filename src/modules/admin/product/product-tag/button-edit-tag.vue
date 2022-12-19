<template>
  <el-dialog v-model="visible" title="Update loại sản phẩm" width="600px" :before-close="handleClose">
    <div class="space-y-4">
      <div class="flex items-center space-x-2">
        <div class="w-[160px] flex-shrink-0">Tên loại sản phẩm</div>
        <el-input v-model="state.name" placeholder="Nhập tên"></el-input>
      </div>

      <div class="flex items-center space-x-2">
        <div class="w-[160px] flex-shrink-0">Mô tả ngắn</div>

        <el-input
          v-model="state.description"
          maxlength="500"
          show-word-limit
          type="textarea"
          class="flex-1 w-full"
          placeholder="Nhập mô tả "
        ></el-input>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close()">Cancel</el-button>
        <el-button type="primary" :loading="loading" :disabled="!isFullFill" @click="handleConfirm()">Save</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElNotification } from 'element-plus'
import { useVisible } from '@thinkvn/composables'
import { updateTag } from '../services'

const emit = defineEmits<{ (e: 'success'): void }>()

const props = defineProps<{ id: string; name: string; description: string; open: boolean }>()

const { visible, open, close } = useVisible()

const loading = ref(false)

const isFullFill = computed(() => {
  return state.name.length !== 0 && state.description.length !== 0
})

const state = reactive({
  name: '',
  description: '',
})

watch(props, value => {
  if (value.open) {
    state.description = value.description
    state.name = value.name
    open()
  }
})

const handleConfirm = async () => {
  loading.value = true
  try {
    await updateTag(props.id, state)
    ElNotification.success({ message: 'Update thành công' })
    emit('success')
    close()
  } catch (e: any) {
    ElNotification({
      title: 'Lỗi',
      message: e?.response?.data?.status?.message,
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const handleClose = (done: () => void) => {
  done()
  close()
}
</script>
