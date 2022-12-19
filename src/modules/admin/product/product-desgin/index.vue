<template>
  <div class="flex justify-between bg-white p-6 rounded-md shadow-md">
    <div class="!w-[400px] space-y-4 px-6 border-r !border-border-color">
      <div class="flex items-center space-x-2 mt-4 cursor-pointer">
        <i-ep-arrow-left></i-ep-arrow-left>
        <div class="text-xl font-semibold">Design Clothes</div>
      </div>
      <div class="flex items-end justify-between space-x-3 text-sm">
        <div class="space-y-2">
          <div>Height</div>
          <el-input v-model="state.height" class="!w-[142px]" size="large"></el-input>
        </div>
        <div class="space-y-2">
          <div>Width</div>
          <el-input v-model="state.width" class="!w-[142px]" size="large"></el-input>
        </div>
        <div class="w-10 h-10 bg-fill border !border-border-color flex items-center justify-center rounded">px</div>
      </div>

      <upload-single
        :type="['image/png']"
        :width="352"
        :height="180"
        :img-url="fillImg.src"
        @uploaded="value => handleUploaded(value)"
      ></upload-single>

      <div class="flex items-center space-x-2">
        <el-switch v-model="showVariantColor"></el-switch>
        <div>Background by variant color</div>
      </div>
      <div v-if="showVariantColor" class="flex space-x-2">
        <div
          v-for="(color, index) in listColors"
          :key="index"
          class="w-6 h-6 relative flex items-center justify-center border !border-border-color-light rounded"
          :class="{
            [`after:content-[''] after:absolute after:w-[calc(100%+8px)] after:h-[calc(100%+8px)] after:border-2 after:border-[#1D005A] after:rounded`]:
              selectedColor === color,
          }"
          :style="{ backgroundColor: color }"
          @click="selectedColor = color"
        >
          <el-icon v-if="selectedColor === color" class="!text-white">
            <i-ep-select></i-ep-select>
          </el-icon>
        </div>
      </div>

      <div v-if="showVariantColor" class="space-y-2">
        <div>Or other color</div>
        <el-color-picker v-model="selectedColor" size="large"></el-color-picker>
      </div>
    </div>

    <div class="flex-1">
      <div class="flex items-center justify-between px-10 h-[72px]">
        <div class="flex items-center space-x-2">
          <el-switch v-model="showPreview"></el-switch>
          <div class="text-sm">Preview width image</div>
        </div>
        <div>
          <el-button type="primary" @click="exportStage">Export Design</el-button>
        </div>
      </div>
      <div class="relative border rounded-sm !w-[700px] !h-[700px] p-2 m-auto">
        <v-stage
          :key="resetKey"
          ref="stageRef"
          :config="configKonva"
          @mousedown="handleStageMouseDown"
          @touchstart="handleStageMouseDown"
        >
          <v-layer ref="layer">
            <v-image :config="configImage"></v-image>
            <v-image v-if="!showPreview" :config="configImage"></v-image>
            <v-rect :config="configRetangle" @transformend="handleTransformEnd" @dragend="handleDragEnd" />
            <v-transformer ref="transformerRef" />
            <v-image v-if="showPreview" :config="configBaseImage"></v-image>
          </v-layer>
        </v-stage>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import Konva from 'konva'
import UploadSingle from './upload-main.vue'

const resetKey = ref(0)
const showPreview = ref(false)
const showVariantColor = ref(false)
const selectedLayer = ref('')
const selectedColor = ref('')

const stageRef = ref<Konva.Stage>()
const transformerRef = ref<Konva.Transformer>()

const fillImg = ref(new Image())
fillImg.value.src = '/img/2d-mockup-preview.png'

const layerImg = ref(new Image())
layerImg.value.src = '/img/2d-mockup.png'

const printImage = ref({
  imageBase64: '',
  imageName: '',
})

const initialRect = {
  width: 200,
  height: 200,
}

//832 * 832 px ( padding 8px )
const configKonva = ref<Partial<Konva.StageConfig>>({
  width: 684,
  height: 684,
})

const state = ref({
  width: 700,
  height: 700,
})

const handleUploaded = (image: any) => {
  fillImg.value.src = image.url as string
  printImage.value.imageBase64 = image.base64 as string
  printImage.value.imageName = image.name!
  resetKey.value++
}

const listColors = ref([
  '#F93920',
  '#30953B',
  '#ED487B',
  '#0077FA',
  '#3BB346',
  '#0062D6',
  '#00B3A1',
  '#570CF6',
  '#7EAE00',
])

const configImage = ref<Partial<Konva.ImageConfig>>({
  image: layerImg.value as any,
  width: state.value.width || 720,
  height: state.value.height || 720,
  x: (configKonva.value.width! - state.value.width) / 2,
  y: (configKonva.value.height! - state.value.height) / 2,
  fill: '',
})

const configBaseImage = ref<Partial<Konva.ImageConfig>>({
  image: layerImg.value as any,
  width: state.value.width || 720,
  height: state.value.height || 720,
  x: (configKonva.value.width! - state.value.width) / 2,
  y: (configKonva.value.height! - state.value.height) / 2,
})

const initRect = {
  name: 'configRetangle',
  x: (700 - initialRect.width) / 2,
  y: (700 - initialRect.height) / 2,
  width: initialRect.width,
  height: initialRect.height,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  skewX: 0,
  skewY: 0,
  offsetX: 0,
  offsetY: 0,
  stroke: 'black',
  dashEnabled: true,
  dash: [4, 4],
  strokeWidth: 1,
  fillPatternImage: undefined,
  fillPatternRepeat: 'no-repeat',
  fillPatternScaleX: initialRect.width / fillImg.value.width,
  fillPatternScaleY: initialRect.height / fillImg.value.height,
  draggable: true,
}

const configRetangle = ref<Partial<Konva.RectConfig>>(initRect)

watch(showPreview, newValue => {
  newValue
    ? ((configRetangle.value.fillPatternImage = fillImg.value), (configRetangle.value.stroke = undefined))
    : ((configRetangle.value.fillPatternImage = undefined), (configRetangle.value.stroke = 'black'))
})

watch(selectedColor, newValue => {
  configImage.value.fill = newValue
})

watch(
  () => state,
  newValue => {
    configImage.value.width = newValue.value.width
    configImage.value.height = newValue.value.height
    configImage.value.x = (configKonva.value.width! - state.value.width) / 2
    configImage.value.y = (configKonva.value.height! - state.value.height) / 2
    configBaseImage.value.width = newValue.value.width
    configBaseImage.value.height = newValue.value.height
    configBaseImage.value.x = (configKonva.value.width! - state.value.width) / 2
    configBaseImage.value.y = (configKonva.value.height! - state.value.height) / 2
    resetKey.value++
  },
  { deep: true }
)

const handleDragEnd = (e: any) => {
  configRetangle.value = {
    ...configRetangle.value,
    ...e.target.attrs,
    fillPatternScaleX: e.target.attrs.width / fillImg.value.width,
    fillPatternScaleY: e.target.attrs.height / fillImg.value.height,
  }
}

const handleTransformEnd = (e: any) => {
  configRetangle.value = {
    ...configRetangle.value,
    ...e.target.attrs,
    fillPatternScaleX: e.target.attrs.width / fillImg.value.width,
    fillPatternScaleY: e.target.attrs.height / fillImg.value.height,
  }
}

const handleStageMouseDown = (e: any) => {
  if (e.target === e.target.getStage()) {
    selectedLayer.value = ''
    updateTransformer()
    return
  }

  const clickedOnTransformer = e.target.getParent()?.className === 'Transformer'
  if (clickedOnTransformer) {
    return
  }

  const name = e.target.name()
  if (name === configRetangle.value.name) {
    selectedLayer.value = name
  } else {
    selectedLayer.value = ''
  }
  updateTransformer()
}

const updateTransformer = () => {
  const transformerNode = transformerRef?.value?.getNode() as any

  const stage = transformerNode?.getStage()

  const selectedNode = stage?.findOne('.' + selectedLayer.value)

  if (selectedNode === transformerNode?.node()) {
    return
  }

  if (selectedNode) {
    transformerNode?.nodes([selectedNode])
  } else {
    transformerNode?.nodes([])
  }
}

const downloadURI = (uri: string, name: string): void => {
  const link = document.createElement('a')
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportStage = () => {
  console.log(stageRef?.value?.getStage())
  const dataURL = stageRef.value?.getStage().toDataURL({ pixelRatio: 2 })
  if (dataURL) {
    downloadURI(dataURL, `design_${Date.now()}.png`)
  }
}
</script>

<route>
  {
      "name": "design-admin",
      "path": "/admin/product/desgin",
      "meta": {
        "layout": "default",
        "admin": true,
        "auth": true
      }
    }
  </route>

<style>
.invalid .el-input__wrapper {
  box-shadow: 0 0 0 1px var(--el-color-danger) !important;
}
</style>
