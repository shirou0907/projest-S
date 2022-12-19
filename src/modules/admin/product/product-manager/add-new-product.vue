<template>
  <div v-if="state.name" class="text-2xl font-bold py-4">{{ state.name }}</div>
  <div v-else class="text-2xl font-bold py-4">Thêm mới sản phẩm</div>

  <div class="p-12 bg-white border !border-border-color rounded space-y-4">
    <div class="flex justify-between">
      <div class="text-lg font-semibold">Thông tin cơ bản</div>
      <el-button type="primary" :loading="loading" :disabled="!state.name.length" @click="handleAddNewProduct">
        Save
      </el-button>
    </div>

    <div class="flex items-baseline">
      <div class="w-[180px] flex-shrink-0">
        <div class="text-sm">Tên sản phẩm</div>
      </div>
      <el-input v-model="state.name" size="large"></el-input>
    </div>

    <div class="flex items-baseline">
      <div class="w-[180px] flex-shrink-0">
        <div class="text-sm">Thông tin giới thiệu</div>
      </div>
      <tip-tap v-model="state.description"></tip-tap>
    </div>

    <div class="flex items-baseline">
      <div class="w-[180px] flex-shrink-0">
        <div class="text-sm">Phân loại</div>
      </div>
      <select-tag v-model="state.tag" class="!w-full"></select-tag>
    </div>

    <div class="flex items-baseline">
      <div class="w-[180px] flex-shrink-0">
        <div class="text-sm">Giá tiền</div>
      </div>
      <input-currency v-model="state.price" size="large" suffix="VND"></input-currency>
    </div>

    <div class="flex items-baseline">
      <div class="w-[180px] flex-shrink-0">
        <div class="text-sm">Số lượng hiện có</div>
      </div>
      <el-input v-model="state.stock" size="large"></el-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElNotification } from 'element-plus'
import InputCurrency from '@/components/input-currency.vue'
import { addNewProduct } from '../services'
import TipTap from '@/components/tiptap-editor.vue'
import { AddProductParams } from '../types'
import SelectTag from './select-tag.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const state = reactive<AddProductParams>({
  name: '',
  tag: [],
  description: '',
  price: 0,
  stock: 0,
})

const loading = ref(false)

const handleAddNewProduct = async () => {
  try {
    loading.value = true
    await addNewProduct(state)
    router.push({ name: 'product-admin' })
  } catch (e: any) {
    ElNotification({
      title: 'Error',
      message: e?.response?.data?.status?.message,
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<route>
  {
      "name": "product-admin-add-new",
      "path": "/admin/product/new",
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
