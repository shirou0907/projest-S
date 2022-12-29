<template>
  <el-scrollbar :view-class="'h-full'" :wrap-class="'h-full flex-1 p-7 bg-white rounded'" class="shadow-md">
    <div class="flex items-center justify-between">
      <div class="text-2xl font-semibold mb-6">Cài đặt giao diện</div>
      <el-button :loading="loading" type="primary" @click="uploadBasicTheme()">Save</el-button>
    </div>

    <div class="flex">
      <div class="p-5 bg-white rounded-md w-1/2 mr-6 space-y-3 shadow-md">
        <div class="font-semibold text-lg">Màu sắc chủ đạo</div>
        <div class="flex flex-wrap items-center">
          <div
            v-for="(color, index) in listColors"
            :key="index"
            class="h-10 w-10 rounded-full m-2 shadow flex items-center justify-center cursor-pointer hover:shadow-lg hover:scale-110 transition"
            :style="{ backgroundColor: color }"
            @click="state.lightMainColor = color"
          >
            <el-icon v-if="state.lightMainColor === color" class="!text-white !text-3xl">
              <i-ep-check></i-ep-check>
            </el-icon>
          </div>
        </div>

        <div>Select another colors</div>
        <div class="flex items-center space-x-6">
          <el-color-picker v-model="state.lightMainColor" size="large" />
          <el-button type="primary">Mehub</el-button>

          <el-tag>Mehub</el-tag>
          <el-checkbox type="primary" :checked="true"></el-checkbox>
          <el-radio type="primay"></el-radio>
        </div>
      </div>

      <div class="p-5 bg-white rounded-md h-[300px] w-1/2 ml-6 space-y-3 shadow-md">
        <div class="font-semibold text-lg">Font chữ</div>
        <el-select v-model="state.fontFamily" size="large" class="!w-full">
          <el-option v-for="(font, index) in listFonts" :key="index" :label="font" :value="font"></el-option>
        </el-select>

        <div class="text-5xl space-y-2" :style="{ fontFamily: state.fontFamily }">
          <div class="font-bold">A B C D E F</div>
          <div class="font-semibold">a b c d e f</div>
          <div class="font-normal">1 2 3 4 5 6</div>
        </div>

        <el-progress :percentage="100" :indeterminate="true" :duration="5" />
      </div>
    </div>

    <div class="my-6 space-y-3">
      <div class="font-semibold text-lg">Banner Top</div>
      <UploadDragOne
        :is-loading="loadingBannerTop"
        :img-url="getPhotoUrl(store.themes.bannerTop)"
        :show-limit="false"
        @uploaded="val => uploadBannerTop(val)"
      ></UploadDragOne>
    </div>

    <div class="my-6 space-y-3">
      <div class="font-semibold text-lg">Slides</div>
      <UploadSlides @uploaded="val => checkSlide(val)"></UploadSlides>
      <el-button type="primary" @click="uploadSildes">Uploads</el-button>

      <slide-infinity v-loading="loading" :photos="store.themes.slideImages"></slide-infinity>
    </div>

    <div class="my-6 space-y-3">
      <div class="font-semibold text-lg">Banner Bottom</div>
      <UploadDragOne
        :is-loading="loadingBannerBottom"
        :img-url="getPhotoUrl(store.themes.bannerBottom)"
        :show-limit="false"
        @uploaded="val => uploadBannerBottom(val)"
      ></UploadDragOne>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Theme } from '@/types'
import UploadDragOne from './components/upload-drag-one.vue'
import UploadSlides from './components/upload-slides.vue'
import { useThemeStore } from '@/store/theme'
import { getPhotoUrl } from '@/utils'
import { updateBannerTop, updateBannerBottom, updateSlides, updateThemeStyle } from '@/services'
import { ElNotification } from 'element-plus'
import SlideInfinity from '@/components/slide-infinity.vue'

const store = useThemeStore()
const loading = ref(false)
const loadingBannerTop = ref(false)
const loadingBannerBottom = ref(false)

const state = reactive<Partial<Theme>>({
  lightMainColor: '',
  darkMainColor: '',
  fontFamily: '',
  favicon: '',
})

const uploadBannerTop = async (file: any) => {
  const formData = new FormData()
  formData.append('image', file.raw)
  console.log(file.raw)
  try {
    loadingBannerTop.value = true
    await updateBannerTop(formData)
    await store.fetch()
  } catch (error) {
    console.log(error)
  } finally {
    loadingBannerTop.value = false
  }
}

const uploadBannerBottom = async (file: any) => {
  const formData = new FormData()
  formData.append('image', file.raw)
  console.log(file.raw)
  try {
    loadingBannerBottom.value = true
    await updateBannerBottom(formData)
    await store.fetch()
  } catch (error) {
    console.log(error)
  } finally {
    loadingBannerBottom.value = false
  }
}

const uploadBasicTheme = async () => {
  try {
    loading.value = true
    await updateThemeStyle(state)
    await store.fetch()
    ElNotification({
      title: 'Thành công',
      message: 'Đã cập nhật themes',
      type: 'success',
    })
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const subFormData = ref(new FormData())

const checkSlide = (file: any) => {
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

const uploadSildes = async () => {
  try {
    loading.value = true
    await updateSlides(subFormData.value)
    await store.fetch()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

watch(
  () => store.themes,
  newValue => {
    state.lightMainColor = newValue.lightMainColor
    state.darkMainColor = newValue.darkMainColor
    state.fontFamily = newValue.fontFamily
    state.favicon = newValue.favicon
  },
  { immediate: true, deep: true }
)

watch(state, value => {
  const root = document.documentElement
  root.style.setProperty('--el-color-primary', value.lightMainColor!)
})

const listColors = [
  '#FF0000',
  '#FF7F00',
  '#FFFF00',
  '#00FF00',
  '#0000FF',
  '#4B0082',
  '#9400D3',
  '#edbb87',
  '##e54f6e',
  '#f37b1d',
  '#8dc63f',
  '#39b54a',
  '#1cbbb4',
  '#0081ff',
  '#6739b6',
  '#9c26b0',
  '#f56c6c',
  '#e6a23c',
  '#5cb87a',
  '#1989fa',
  '#6f7ad3',
  '#ff9900',
]

const listFonts = [
  'Manrope',
  'Arial',
  'Arial Black',
  'Comic Sans MS',
  'Helvetica Neue',
  'Courier New',
  'Georgia',
  'Impact',
  'Lucida Console',
  'Lucida Sans Unicode',
  'Palatino Linotype',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
]
</script>

<route>
  {
      "name": "setting-admin",
      "path": "/admin/setting",
      "meta": {
        "layout": "default",
        "admin": true,
        "auth": true
      }
    }
  </route>

<style>
.el-progress__text {
  display: none;
}
</style>
