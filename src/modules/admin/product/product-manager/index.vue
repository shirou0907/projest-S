<template>
  <div class="flex flex-col h-full !w-[1200px] mx-auto">
    <div class="text-2xl font-bold py-6 border-b-2">Quản lý sản phẩm</div>

    <div class="flex justify-between items-end">
      <div class="py-4 space-x-6 flex">
        <div class="space-y-2">
          <div>Order By</div>
          <el-select v-model="state.orderBy" class="!w-[160px]">
            <template #prefix>
              <el-icon>
                <i-ep-sort></i-ep-sort>
              </el-icon>
            </template>
            <el-option v-for="item in orderByOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <div class="space-y-2">
          <div>Sort By</div>
          <el-select v-model="state.sort" class="!w-[90px]">
            <template #prefix>
              <el-icon>
                <i-ep-d-caret></i-ep-d-caret>
              </el-icon>
            </template>
            <el-option v-for="item in sortOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <div class="space-y-2">
          <div>Search</div>
          <el-input v-model="state.name" class="!w-[160px]" placeholder="Search by name">
            <template #prefix>
              <el-icon>
                <i-ep-search></i-ep-search>
              </el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <div class="py-4">
        <el-button type="primary" @click="$router.push({ name: 'product-admin-add-new' })">+ Thêm mới</el-button>
      </div>
    </div>

    <el-scrollbar :view-class="'h-full'" :wrap-class="'h-full flex-1 p-7 bg-white rounded'" class="shadow-md">
      <el-table
        v-loading="isFetching || loading"
        element-loading-text="Loading..."
        :element-loading-spinner="svgLoading"
        element-loading-svg-view-box="-10, -10, 50, 50"
        :data="tags"
      >
        <el-table-column label="UID" width="220px">
          <template #default="{ row }">
            <div
              class="cursor-pointer hover:text-primary"
              @click="$router.push({ name: 'product-admin-detail', params: { id: row._id } })"
            >
              {{ row._id }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Name" width="180px">
          <template #default="{ row }">
            <div class="font-bold text-primary">
              {{ row.name }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Photo" width="100px">
          <template #default="{ row }">
            <img :src="getPhotoUrl(row.mainImage)" class="w-[64px] h-[64px] rounded" />
          </template>
        </el-table-column>

        <el-table-column label="Price">
          <template #default="{ row }">{{ formatCurrency(row.price) }} VND</template>
        </el-table-column>

        <el-table-column label="Stock">
          <template #default="{ row }">
            {{ row.stock }}
          </template>
        </el-table-column>

        <el-table-column label="Update Time">
          <template #default="{ row }">
            {{ getLocalDate(row.updatedAt) }}
          </template>
        </el-table-column>

        <el-table-column label="Active">
          <template #default="{ row }">
            <el-switch
              v-model="row.active"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              @change="
                (value: any) => {
                  if (value) {
                    handleEnable(row._id)
                  } else {
                    handleDisable(row._id)
                  }
                }
              "
            />
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <el-pagination
      v-model:currentPage="state.page"
      v-model:page-size="state.size"
      :page-sizes="[2, 4, 5, 10]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="!p-0 mt-3"
    ></el-pagination>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouteQuery } from '@/composables'
import { useFetchData } from '@thinkvn/composables'
import { getALlProducts, enableProduct, disableProduct } from '../services'
import { getLocalDate, getPhotoUrl, formatCurrency } from '@/utils'
import { ElNotification } from 'element-plus'
import { svgLoading } from '@/constant'

const route = useRoute()
const loading = ref(false)

const orderByOption = [
  {
    label: 'Name',
    value: 'name',
  },
  { label: 'Active', value: 'active' },
  {
    label: 'Update Time',
    value: 'updatedAt',
  },
]

const sortOption = [
  {
    label: 'A-Z',
    value: 'asc',
  },
  {
    label: 'Z-A',
    value: 'desc',
  },
]

const { data, fetch, isFetching } = useFetchData(() => getALlProducts({ ...state, ...route.query }), {
  autoResetData: false,
})

const state = reactive({
  page: useRouteQuery('page', 1),
  size: useRouteQuery('size', 5),
  orderBy: useRouteQuery('orderBy', 'updatedAt'),
  sort: useRouteQuery('sort', 'desc'),
  name: useRouteQuery('name', ''),
  refresh: 0,
})

const tags = computed(() => {
  return data?.value?.data.data || []
})

const total = computed(() => {
  return data?.value?.data.total || 0
})

const handleEnable = async (id: string) => {
  try {
    loading.value = true
    const { data } = await enableProduct(id)
    if (data) {
      ElNotification({
        title: 'Success',
        message: 'Enable tag successfully',
        type: 'success',
      })
    }
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

const handleDisable = async (id: string) => {
  try {
    loading.value = true
    const { data } = await disableProduct(id)
    if (data) {
      ElNotification({
        title: 'Success',
        message: 'Disable tag successfully',
        type: 'success',
      })
    }
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

watch(state, fetch, { immediate: true })
</script>

<route>
{
    "name": "product-admin",
    "path": "/admin/product/manage",
    "meta": {
      "layout": "default",
      "admin": true,
      "auth": true
    }
  }
</route>
