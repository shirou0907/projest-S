<template>
  <el-icon size="large" class="hover:text-danger cursor-pointer" @click="open()">
    <i-ep-circle-close-filled></i-ep-circle-close-filled>
  </el-icon>

  <teleport to="body">
    <el-dialog v-model="visible" title="Cảnh báo" width="400px" :before-close="handleClose">
      <div class="flex items-center space-x-2">
        <div class="text-sm">Bạn có chắc muốn xóa địa chỉ này ?</div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close()">Hủy</el-button>
          <el-button type="danger" @click="handleDelete()">Delete</el-button>
        </span>
      </template>
    </el-dialog>
  </teleport>
</template>

<script lang="ts" setup>
import { useVisible } from '@thinkvn/composables'

const emit = defineEmits<{ (e: 'delete'): void }>()

const { visible, open, close } = useVisible()

const handleClose = (done: () => void) => {
  done()
  close()
}

const handleDelete = () => {
  emit('delete')
  close()
}
</script>
