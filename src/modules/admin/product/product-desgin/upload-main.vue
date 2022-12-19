<template>
  <div class="upload-single space-y-2">
    <el-upload
      class="avatar-uploader"
      action="#"
      accept="image/*"
      :auto-upload="false"
      :show-file-list="false"
      :list-type="'picture'"
      :on-change="handleChange"
    >
      <div v-loading="isLoading" class="group">
        <div v-if="(isSuccess && imageUrl.length) || props.imgUrl.length">
          <img
            :src="imageUrl.length ? imageUrl : imgUrl"
            class="m-auto"
            :class="{ 'group-hover:brightness-50': preview }"
            :style="{ width: `${width}px`, height: `${height}px` }"
          />

          <div
            v-if="preview"
            class="absolute top-0 left-0 bottom-0 w-full items-center justify-center z-10 hidden group-hover:flex"
          >
            <div class="" @click.stop="handlePictureCardPreview()">
              <el-icon class="!text-white !text-2xl font-semibold"><i-ep-zoom-in /></el-icon>
            </div>
          </div>
        </div>
        <el-icon v-else class="avatar-uploader-icon !text-sm" :style="{ width: `${width}px`, height: `${height}px` }">
          <i-ep-plus />
        </el-icon>
      </div>
    </el-upload>

    <el-dialog v-model="dialogVisible">
      <img w-full class="m-auto p-5" :src="dialogImageUrl.length ? dialogImageUrl : imgUrl" alt="Preview Image" />
    </el-dialog>

    <div v-if="showLimit" class="text-xs">
      Định dạng {{ type.join(', ') }}. Dung lượng &lt; {{ formatBytes(maxSize) }}.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, UploadFile, UploadProps, UploadRawFile } from 'element-plus'
import { formatBytes } from '@/utils'

const props = withDefaults(
  defineProps<{
    type?: string[]
    imgUrl?: string
    checkType?: boolean
    maxSize?: number
    showLimit?: boolean
    preview?: boolean
    width?: number
    height?: number
    isLoading?: boolean
    isSuccess?: boolean
  }>(),
  {
    type: () => ['image/jpeg', 'image/png'],
    imgUrl: '',
    maxSize: 2097152,
    checkType: false,
    showLimit: true,
    preview: true,
    width: 148,
    height: 148,
    isLoading: false,
    isSuccess: true,
  }
)

const emit = defineEmits<{
  (e: 'uploaded', imageUrl: UploadFile): void
}>()

const imageUrl = ref('')

const checkUpload = (rawFile: UploadRawFile) => {
  if (!props.type?.some(item => item === rawFile.type)) {
    ElMessage.error('File không đúng định dạng')
    return false
  }
  if (rawFile.size > props.maxSize) {
    ElMessage.error(`Dung lượng file quá lớn, tối đa ${formatBytes(props.maxSize)}`)
    return false
  }
  return true
}

const fileUpload = ref<UploadFile>()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview = () => {
  imageUrl.value && (dialogImageUrl.value = imageUrl.value)
  dialogVisible.value = true
}

const handleChange: UploadProps['onChange'] = async (uploadFile: UploadFile) => {
  const { raw } = uploadFile
  fileUpload.value = uploadFile
  if (checkUpload(raw!)) {
    emit('uploaded', fileUpload.value)
  }
  return
}
</script>

<style scoped>
.avatar-uploader .avatar {
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
