<template>
  <button class="font-semibold" @click="open()">
    <el-icon><i-ep-close></i-ep-close></el-icon>
  </button>

  <teleport to="body">
    <el-dialog
      v-model="visible"
      title="Are you sure want to delete Custom variant type?"
      width="532px"
      :before-close="handleClose"
    >
      <div class="flex items-center space-x-2">
        <div class="text-sm">This will permannently deletel all Custom variant</div>
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
