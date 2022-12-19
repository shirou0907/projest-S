<template>
  <div v-loading="isFetching || loading" class="space-y-6 h-full flex flex-col">
    <div class="flex items-center space-x-3 cursor-pointer">
      <el-icon><i-ep-arrow-left></i-ep-arrow-left></el-icon>
      <div @click="$router.replace({ name: 'product-admin-detail', params: { id: route.params.id } })">Quay lại</div>
    </div>

    <div class="flex justify-between items-end">
      <div>
        <div class="text-lg font-semibold">Edit additional sections</div>
        <div class="text-sm">
          These sections, often appearing below the description, add additional information to help your fans make their
          purchase.
        </div>
      </div>
      <el-button type="primary" :loading="loading" @click="handleUpdate()">Save</el-button>
    </div>

    <el-scrollbar :view-class="'h-full'" :wrap-class="'h-full'">
      <div class="space-y-6">
        <vue-draggable
          v-model="sectionData"
          class="list-group w-full space-y-6"
          tag="transition-group"
          group="description"
          handle=".handle"
          animation="300"
          ghost-class="ghost"
          @start="drag = true"
          @end="drag = false"
        >
          <template #item="{ element }">
            <div class="relative bg-white shadow-lg p-6 rounded space-y-4">
              <div
                class="absolute flex space-x-2 items-center top-4 right-4 cursor-pointer hover:text-placeholder-text"
              >
                <div class="handle">
                  <component :is="DragIcon" />
                </div>
                <el-icon>
                  <button-confirm-delete @delete="removeSectionData(element.type)"></button-confirm-delete>
                </el-icon>
              </div>
              <div class="space-y-2">
                <div>Title</div>
                <el-input v-model="element.title"></el-input>
              </div>
              <div class="space-y-2">
                <div>Description</div>
                <tip-tap v-model="element.content" :loading="drag"></tip-tap>
              </div>
            </div>
          </template>
        </vue-draggable>

        <div>
          <el-button v-if="checkSectionData('MORE_DETAILS')" @click="addSectionData('MORE_DETAILS')">
            Add more details section
          </el-button>
          <el-button v-if="checkSectionData('SIZE_AND_FIT')" @click="addSectionData('SIZE_AND_FIT')">
            Add size & fit section
          </el-button>
          <el-button v-if="checkSectionData('GUARANTEE_AND_RETURNS')" @click="addSectionData('GUARANTEE_AND_RETURNS')">
            Add quality guarantee & returns section
          </el-button>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import DragIcon from '@/assets/drag.svg'
import { ElNotification } from 'element-plus'
import VueDraggable from 'vuedraggable'
import { getProductById } from '../services'
import TipTap from '@/components/tiptap-editor.vue'
import { ProductAttribute } from '../types'
import ButtonConfirmDelete from './confirm-delete.vue'
import { useRoute } from 'vue-router'
import { useFetchData } from '@thinkvn/composables'
import { updateProductAttributeById } from '../services'

const route = useRoute()

const { isFetching, fetch, data } = useFetchData(() => getProductById(route.params.id as string))
fetch()

const drag = ref(false)

const sectionData = ref<ProductAttribute[]>()

watch(
  data,
  val => {
    sectionData.value = val?.data?.data?.attributes
  },
  { immediate: true }
)

const SectionDefault: Record<AttributeType, { title: string; content: string; type: AttributeType }> = {
  MORE_DETAILS: {
    title: 'More details',
    content: '',
    type: 'MORE_DETAILS',
  },
  SIZE_AND_FIT: {
    title: 'Size & fit',
    content: '',
    type: 'SIZE_AND_FIT',
  },
  GUARANTEE_AND_RETURNS: {
    title: 'Quality guarantee & returns',
    content: '',
    type: 'GUARANTEE_AND_RETURNS',
  },
}

const loading = ref(false)

type AttributeType = 'MORE_DETAILS' | 'SIZE_AND_FIT' | 'GUARANTEE_AND_RETURNS'

const checkSectionData = (type: AttributeType) => {
  return !sectionData.value?.some(section => {
    return section.type === type
  })
}

const addSectionData = (type: AttributeType) => {
  sectionData.value?.push(SectionDefault[type])
}

const removeSectionData = (type: AttributeType) => {
  sectionData.value = sectionData.value?.filter(section => {
    return section.type !== type
  })
}

const handleUpdate = async () => {
  try {
    loading.value = true
    await updateProductAttributeById(route.params.id as string, sectionData.value as ProductAttribute[])
    ElNotification({
      title: 'Success',
      message: 'Update success',
      type: 'success',
    })
    fetch()
  } catch (error: any) {
    ElNotification.error({
      title: 'Error',
      message: error.message,
    })
  } finally {
    loading.value = false
  }
}
</script>

<route>
  {
      "name": "product-admin-attribute",
      "path": "/admin/product/attribute/:id",
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
