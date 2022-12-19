<template>
  <div class="flex flex-col h-full !w-[1200px] mx-auto">
    <div class="text-2xl font-bold py-6 border-b-2">Quản lý loại sản phẩm</div>

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
      </div>

      <div class="py-4">
        <button-add-tag @success="fetch"></button-add-tag>
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
            <div class="cursor-pointer hover:text-primary" @click="setEditValue(row as Partial<Tag>)">
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

        <el-table-column label="Description" width="400px">
          <template #default="{ row }">
            {{ row.description }}
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
                    handleEnableTag(row._id)
                  } else {
                    handleDisableTag(row._id)
                  }
                }
              "
            />
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <button-edit-tag
      :id="edit._id"
      :name="edit.name"
      :description="edit.description"
      :open="isOpenEdit"
      @success=";(isOpenEdit = false), state.refresh++"
    ></button-edit-tag>

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
import { disableTag, getALlTags, enableTag } from '../services'
import { Tag } from '../types'
import { getLocalDate } from '@/utils'
import { ElNotification } from 'element-plus'
import ButtonAddTag from './button-add-tag.vue'
import ButtonEditTag from './button-edit-tag.vue'
import { svgLoading } from '@/constant'

const route = useRoute()
const isOpenEdit = ref(false)
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

const edit = reactive({
  _id: '',
  name: '',
  description: '',
})

const setEditValue = (tag: Partial<Tag>) => {
  edit._id = tag._id!
  edit.name = tag.name!
  edit.description = tag.description!
  isOpenEdit.value = true
}

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

const { data, fetch, isFetching } = useFetchData(() => getALlTags({ ...state, ...route.query }), {
  autoResetData: false,
})

const state = reactive({
  page: useRouteQuery('page', 1),
  size: useRouteQuery('size', 5),
  orderBy: useRouteQuery('orderBy', 'updatedAt'),
  sort: useRouteQuery('sort', 'desc'),
  refresh: 0,
})

const tags = computed(() => {
  return data?.value?.data.data || []
})

const total = computed(() => {
  return data?.value?.data.total || 0
})

const handleEnableTag = async (id: string) => {
  try {
    loading.value = true
    const { data } = await enableTag(id)
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

const handleDisableTag = async (id: string) => {
  try {
    loading.value = true
    const { data } = await disableTag(id)
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
    "name": "tag-admin",
    "path": "/admin/product/tag",
    "meta": {
      "layout": "default",
      "admin": true,
      "auth": true
    }
  }
</route>
