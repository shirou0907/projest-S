<template>
  <div class="flex flex-col h-full">
    <div class="text-2xl font-semibold mb-6">Quản lý người dùng</div>

    <el-scrollbar :view-class="'h-full'" :wrap-class="'h-full flex-1 p-7 bg-white rounded'" class="shadow-md">
      <el-table v-loading="isFetching" :data="customers">
        <el-table-column label="UID" width="190px">
          <template #default="{ row }">
            {{ row.uid }}
          </template>
        </el-table-column>

        <el-table-column label="Email" width="240px">
          <template #default="{ row }">
            {{ row.email }}
          </template>
        </el-table-column>

        <el-table-column label="Name" width="180px">
          <template #default="{ row }">
            {{ row.displayName }}
          </template>
        </el-table-column>

        <el-table-column label="Photo" width="146px">
          <template #default="{ row }">
            <img :src="row.photoURL" alt="" referrerpolicy="no-referrer" class="!w-[64px] !h-[64px] rounded" />
          </template>
        </el-table-column>

        <el-table-column label="Role" width="146px">
          <template #default="{ row }">
            <el-tag :type="getCustomerAttribute(row.role).color as any">
              <div>
                {{ getCustomerAttribute(row.role).label }}
              </div>
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Update Time">
          <template #default="{ row }">
            {{ getLocalDate(row.updatedAt) }}
          </template>
        </el-table-column>

        <el-table-column label="Verified">
          <template #default="{ row }">
            <el-icon v-if="row.emailVerified" size="large" class="!text-success">
              <i-ep-circle-check></i-ep-circle-check>
            </el-icon>
            <el-icon v-else size="large" class="!text-danger">
              <i-ep-circle-close></i-ep-circle-close>
            </el-icon>
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

    <div class="hidden">
      <div class="text-danger"></div>
      <div class="text-warning"></div>
      <div class="text-info"></div>
      <div class="text-success"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouteQuery } from '@/composables'
import { useFetchData } from '@thinkvn/composables'
import { getAllCustomers } from './services'
import { customerRoleOptions, CUSTOMER_ROLE } from './types'
import { getLocalDate } from '@/utils'

const route = useRoute()

const { data, fetch, isFetching } = useFetchData(() => getAllCustomers({ ...state, ...route.query }), {
  autoResetData: false,
})

const state = reactive({
  page: useRouteQuery('page', 1),
  size: useRouteQuery('size', 6),
})

const getCustomerAttribute = (value: CUSTOMER_ROLE) => {
  return customerRoleOptions[value]
}

const customers = computed(() => {
  return data?.value?.data.data || []
})

const total = computed(() => {
  return data?.value?.data.total || 0
})

watch(state, fetch, { immediate: true })
</script>

<route>
{
    "name": "customer-admin",
    "path": "/admin/customer-manager",
    "meta": {
      "layout": "default",
      "admin": true,
      "auth": true
    }
  }
</route>
