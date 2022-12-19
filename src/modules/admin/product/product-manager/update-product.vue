<template>
  <div v-loading="isFetching" class="min-h-[50vh] space-y-4">
    <div v-if="state && state.name" class="text-2xl font-bold py-4">{{ state.name }}</div>
    <div v-else class="text-2xl font-bold py-4">Thêm mới sản phẩm</div>

    <div v-if="state" class="p-12 bg-white border !border-border-color rounded space-y-4">
      <div class="flex justify-between">
        <div class="text-lg font-semibold">Thông tin cơ bản</div>
        <el-button type="primary" :loading="loading" :disabled="!state.name.length" @click="updateProductBasic">
          Save
        </el-button>
      </div>

      <div class="flex w-full space-x-[100px]">
        <div class="space-y-4">
          <div class="space-y-2 w-[400px]">
            <div class="w-[180px] flex-shrink-0">
              <div class="text-sm">Tên sản phẩm</div>
            </div>
            <el-input v-model="state.name" size="large"></el-input>
          </div>

          <div class="space-y-2 w-[400px]">
            <div class="w-[180px] flex-shrink-0">
              <div class="text-sm">Phân loại</div>
            </div>
            <select-tag v-model="state.tag" class="!w-full"></select-tag>
          </div>

          <div class="space-y-2 w-[400px]">
            <div class="w-[180px] flex-shrink-0">
              <div class="text-sm">Giá tiền</div>
            </div>
            <input-currency v-model="state.price" size="large" suffix="VND"></input-currency>
          </div>

          <div class="space-y-2 w-[400px]">
            <div class="w-[180px] flex-shrink-0">
              <div class="text-sm">Số lượng hiện có</div>
            </div>
            <el-input v-model.number="state.stock" size="large"></el-input>
          </div>
        </div>

        <div class="space-y-2">
          <div>Ảnh chính</div>
          <UploadMain
            :is-loading="loadingUpload"
            :width="360"
            :height="360"
            :img-url="getPhotoUrl(state.mainImage)"
            @uploaded="val => uploadMain(val)"
          ></UploadMain>
        </div>
      </div>

      <div class="space-y-2">
        <div class="w-[180px] flex-shrink-0">
          <div class="text-sm">Thông tin giới thiệu</div>
        </div>
        <tip-tap v-model="state.description"></tip-tap>
      </div>
      <div class="flex items-center space-x-1 text-sm">
        <el-icon>
          <i-ep-question-filled></i-ep-question-filled>
        </el-icon>
        <div
          class="hover:text-primary cursor-pointer"
          @click="$router.replace({ name: 'product-admin-attribute', params: { id: state._id } })"
        >
          Thông tin chi tiết
        </div>
      </div>
    </div>

    <div class="p-12 bg-white border !border-border-color rounded space-y-4">
      <div class="flex justify-between">
        <div class="text-lg font-semibold">Upload ảnh phụ</div>
      </div>
      <UploadSub @uploaded="val => checkSub(val)"></UploadSub>
      <el-button type="primary" @click="uploadSub()">Uploads</el-button>
    </div>

    <div v-if="state && state.images.length" class="p-12 bg-white border !border-border-color rounded space-y-4">
      <div class="flex justify-between">
        <div class="text-lg font-semibold">Ảnh phụ hiện tại</div>
      </div>
      <slide-thumb :photos="state.images"></slide-thumb>
    </div>

    <div v-if="state" class="p-12 bg-white border !border-border-color rounded space-y-4">
      <div class="flex justify-between">
        <div class="text-lg font-semibold">Màu sắc & kích cỡ</div>
      </div>

      <div>Color</div>
      <div class="flex space-x-3">
        <div
          v-for="(color, index) in state.options.colors"
          :key="index"
          class="h-10 w-10 rounded border-2 hover:border-danger hover:border-2"
          :style="{ backgroundColor: color }"
          @click="state.options.colors.splice(index, 1)"
        ></div>
      </div>

      <div class="flex items-center space-x-2">
        <el-color-picker v-model="colorAddNew" size="large" />
        <el-button
          type="primary"
          :disabled="!colorAddNew.length"
          @click="state.options.colors.push(colorAddNew), (colorAddNew = '')"
        >
          Thêm màu
        </el-button>
      </div>

      <div>Size</div>
      <el-tag
        v-for="(size, index) in state.options.sizes"
        :key="index"
        size="large"
        class="mx-1"
        closable
        @close="state.options.sizes.splice(index, 1)"
      >
        {{ size }}
      </el-tag>

      <div class="flex items-center space-x-2">
        <el-input v-model="sizeAddNew" class="!w-[60px]"></el-input>
        <el-button
          type="primary"
          :disabled="!sizeAddNew.length"
          @click="state.options.sizes.push(sizeAddNew), (sizeAddNew = '')"
        >
          Thêm size
        </el-button>
      </div>
    </div>

    <div v-if="state" class="p-12 bg-white border !border-border-color rounded space-y-4">
      <div class="flex justify-between">
        <div class="text-lg font-semibold">Thông tin vận chuyển</div>
      </div>

      <div class="space-y-2 w-[400px]">
        <div class="w-[180px] flex-shrink-0">
          <div class="text-sm">Cân nặng</div>
        </div>
        <el-input v-model.number="state.weight" size="large">
          <template #append>
            <div class="!w-[20px]">g</div>
          </template>
        </el-input>
      </div>

      <div class="space-y-2 w-[400px]">
        <div class="w-[180px] flex-shrink-0">
          <div class="text-sm">Chiều dài</div>
        </div>
        <el-input v-model.number="state.length" size="large">
          <template #append>
            <div class="!w-[20px]">cm</div>
          </template>
        </el-input>
      </div>

      <div class="space-y-2 w-[400px]">
        <div class="w-[180px] flex-shrink-0">
          <div class="text-sm">Chiều rộng</div>
        </div>
        <el-input v-model.number="state.width" size="large">
          <template #append>
            <div class="!w-[20px]">cm</div>
          </template>
        </el-input>
      </div>

      <div class="space-y-2 w-[400px]">
        <div class="w-[180px] flex-shrink-0">
          <div class="text-sm">Chiều cao</div>
        </div>
        <el-input v-model.number="state.height" size="large">
          <template #append>
            <div class="!w-[20px]">cm</div>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElNotification } from 'element-plus'
import InputCurrency from '@/components/input-currency.vue'
import { getProductById, uploadMainImage, uploadSubImages, updateProductBasicById } from '../services'
import TipTap from '@/components/tiptap-editor.vue'
import SelectTag from './select-tag.vue'
import { useRoute } from 'vue-router'
import { useFetchData } from '@thinkvn/composables'
import UploadMain from './upload-main.vue'
import UploadSub from './upload-sub.vue'
import SlideThumb from '@/components/slide-thumb.vue'
import { getPhotoUrl } from '@/utils'

const route = useRoute()

const colorAddNew = ref('')
const sizeAddNew = ref('')

const { isFetching, fetch, data } = useFetchData(() => getProductById(route.params.id as string))
fetch()

const loading = ref(false)
const loadingUpload = ref(false)

const state = computed(() => {
  return data?.value?.data?.data
})

const uploadMain = async (file: any) => {
  const formData = new FormData()
  formData.append('image', file.raw)
  console.log(file.raw)
  try {
    loadingUpload.value = true
    await uploadMainImage(route.params.id as string, formData)
    await fetch()
  } catch (error) {
    console.log(error)
  } finally {
    loadingUpload.value = false
  }
}

const subFormData = ref(new FormData())

const checkSub = (file: any) => {
  const uploads: any[] = []
  file.forEach((item: any) => {
    uploads.push(item.raw)
  })
  console.log(uploads)
  subFormData.value = new FormData()
  for (const i of uploads) {
    subFormData.value.append('images', i)
  }
}

const uploadSub = async () => {
  try {
    await uploadSubImages(route.params.id as string, subFormData.value)
    await fetch()
  } catch (error) {
    console.log(error)
  } finally {
    loadingUpload.value = false
  }
}

const updateProductBasic = async () => {
  try {
    loading.value = true
    await updateProductBasicById(route.params.id as string, state.value)
    ElNotification({
      title: 'Cập nhật thành công',
      type: 'success',
    })
    fetch()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
</script>

<route>
  {
      "name": "product-admin-detail",
      "path": "/admin/product/manage/:id",
      "meta": {
        "layout": "default",
        "admin": true,
        "auth": true
      }
    }
  </route>

<style>
.product-detail-cutomize-checkbox .el-radio {
  margin-right: 0;
  width: 212px;
}
</style>
