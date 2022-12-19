<template>
  <div class="upload-multiple space-y-2">
    <el-upload
      v-model:file-list="uploadList"
      action="#"
      accept="image/*"
      list-type="picture-card"
      :auto-upload="false"
      :on-change="handleChange"
      multiple
    >
      <el-icon><i-ep-plus /></el-icon>

      <template #file="{ file }">
        <div v-loading="isLoading" class="relative group w-full h-full">
          <div v-if="isSuccess" class="w-full h-full">
            <img class="w-full h-full object-cover" :src="file.url" :class="{ 'group-hover:brightness-50': preview }" />
            <div class="absolute top-1 right-1 z-10">
              <span v-if="!disabled" class="hover:cursor-pointer hover:brightness-200" @click="handleRemove(file)">
                <el-icon><i-ep-circle-close-filled /></el-icon>
              </span>
            </div>
            <div class="absolute top-0 left-0 w-full h-full hidden items-center justify-center group-hover:flex">
              <span
                v-if="preview"
                class="!text-white !text-4xl font-semibold cursor-pointer"
                @click.stop="handlePictureCardPreview(file)"
              >
                <el-icon><i-ep-zoom-in /></el-icon>
              </span>
            </div>
          </div>
        </div>
      </template>
    </el-upload>

    <el-dialog v-model="dialogVisible">
      <img w-full class="m-auto p-5" :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>

    <div v-if="checkType" class="text-xs">
      Định dạng {{ type.join(', ') }}. Dung lượng &lt; {{ formatBytes(maxSize) }}.
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, UploadFile, UploadProps } from 'element-plus'
import { formatBytes } from '@/utils'

withDefaults(
  defineProps<{
    checkType?: boolean
    type?: string[]
    maxSize?: number
    showLimit?: boolean
    preview?: boolean
    isLoading?: boolean
    isSuccess?: boolean
  }>(),
  {
    checkType: false,
    type: () => ['image/jpeg', 'image/png'],
    maxSize: 2097152, //2MB
    showLimit: true,
    preview: true,
    isLoading: false,
    isSuccess: true,
  }
)

const emit = defineEmits<{
  (e: 'uploaded', image: UploadFile[]): void
}>()

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file: UploadFile) => {
  const index = uploadList.value.findIndex(item => item.uid === file.uid)
  uploadList.value.splice(index, 1)
}

const uploadList = ref<UploadFile[]>([])

const handleChange: UploadProps['onChange'] = async (uploadFile: UploadFile) => {
  uploadList.value.push(uploadFile!)
  try {
    emit('uploaded', uploadList.value)
  } catch (error) {
    ElMessage.error('Lỗi khi upload ảnh')
  }

  return
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
</script>
