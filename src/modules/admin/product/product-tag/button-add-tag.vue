<template>
  <el-button type="primary" @click="open()">+ Thêm mới</el-button>

  <el-dialog v-model="visible" title="Thêm loại sản phẩm" width="600px" :before-close="handleClose">
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
import { computed, reactive, ref } from 'vue'
import { ElNotification } from 'element-plus'
import { useVisible } from '@thinkvn/composables'
import { addNewTag } from '../services'

const emit = defineEmits<{ (e: 'success'): void }>()

const { visible, open, close } = useVisible()

const loading = ref(false)

const isFullFill = computed(() => {
  return state.name.length !== 0 && state.description.length !== 0
})

const state = reactive({
  name: '',
  description: '',
})

const handleConfirm = async () => {
  loading.value = true
  try {
    await addNewTag(state)
    ElNotification.success({ message: 'Thêm mới thành công' })
    emit('success')
    close()
  } catch (error) {
    ElNotification.error({ message: 'Thêm mới thất bại' })
  } finally {
    loading.value = false
  }
}

const handleClose = (done: () => void) => {
  done()
  close()
}
</script>
