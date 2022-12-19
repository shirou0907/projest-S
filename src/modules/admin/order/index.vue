<template>
  <div class="flex flex-col h-full">
    <div class="text-2xl font-semibold mb-6">Quản lý đơn hàng</div>

    <div class="relative">
      <tab-status></tab-status>
      <div class="py-4 space-x-6 flex absolute -top-full right-0">
        <div class="space-y-2">
          <div>Sort By Date</div>
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
    </div>

    <el-scrollbar
      v-loading="isFetching"
      element-loading-text="Loading..."
      :element-loading-spinner="svgLoading"
      element-loading-svg-view-box="-10, -10, 50, 50"
      :view-class="'h-full'"
      :wrap-class="'h-full flex-1'"
    >
      <div v-for="(order, index) in orders" :key="index" class="p-4 bg-white hover:shadow-lg rounded mb-3">
        <div class="flex items-center justify-between border-b p-2">
          <div>ID: {{ order._id }}</div>
          <div>Ngày tạo: {{ getLocalDate(order.createdAt) }}</div>
        </div>

        <div class="flex items-center p-4">
          <div class="space-y-2 !w-[400px]">
            <div v-for="(item, i) in order.orderDetail" :key="i" class="flex items-center space-x-4">
              <div class="min-w-[180px]">
                <div class="flex items-center justify-between">
                  <div class="w-[68px] text-sm">Name:</div>
                  <div class="w-[100px] text-primary font-semibold truncate">
                    {{ item.productId.name }}
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="w-[68px] text-sm">Quantity:</div>
                  <div>
                    {{ item.quantity }}
                  </div>
                </div>
              </div>
              <img
                v-if="item.productId.mainImage"
                :src="getPhotoUrl(item.productId.mainImage)"
                class="w-[64px] h-[64px]"
                alt=""
              />
              <img v-else src="/img/error-load-img.png" class="w-[64px] h-[64px]" alt="" />
            </div>
          </div>
          <div class="font-semibold text-primary !w-[200px]">
            {{ formatCurrency(order.total) }}
          </div>

          <div class="!w-[200px]">
            <div>Thanh toán {{ order.shipment?.paymentMethod }}</div>
            <div :class="`text-${getStatusOrder(order.status).color}`">{{ getStatusOrder(order.status).label }}</div>
          </div>
          <div class="!w-[200px]">
            <div>{{ order.shipment?.carrieName }}</div>
            <div>Dự kiến: {{ getLocalDate(order.shipment?.expectedDelivery).split('').splice(10).join('') }}</div>
          </div>

          <div v-loading="loading" class="space-y-3 text-right flex-1">
            <div
              v-if="order.status === ORDER_STATUS.CHO_DUYET"
              class="text-success cursor-pointer font-semibold hover:text-success-light-5"
              @click="handleConfirmOrder(order._id)"
            >
              Xác nhận
            </div>
            <router-link
              v-if="order.status === ORDER_STATUS.DANG_XU_LY"
              class="text-warning font-semibold cursor-pointer hover:text-warning-light-5"
              :to="{ name: 'print-admin', params: { id: order._id } }"
              target="_blank"
            >
              In đơn
            </router-link>
            <div
              v-if="order.status !== ORDER_STATUS.DA_HUY"
              class="text-danger cursor-pointer font-semibold hover:text-danger-light-5"
              @click="handleCancelOrder(order._id)"
            >
              Hủy
            </div>
          </div>
        </div>

        <div class="flex justify-center border-t p-2">
          <div class="text-sm">
            Khách hàng: {{ order.shipment.userName }} - {{ order.shipment.userPhone }} - {{ order.shipment.address }}
            {{ order.shipment.wardName }}, {{ order.shipment.districtName }}, {{ order.shipment.provinceName }}
          </div>
        </div>
      </div>
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
import { getAllOrder, cancelOrder, confirmOrder } from './services'
import { formatCurrency, getLocalDate, getPhotoUrl } from '@/utils'
import { ElNotification } from 'element-plus'
import { svgLoading } from '@/constant'
import TabStatus from './tab-status.vue'
import { ORDER_STATUS, ORDER_STATUS_DETAIL } from './constants'

const route = useRoute()
const loading = ref(false)

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

const { data, fetch, isFetching } = useFetchData(() => getAllOrder({ ...state, ...route.query }), {
  autoResetData: false,
})

const state = reactive({
  page: useRouteQuery('page', 1),
  size: useRouteQuery('size', 5),
  orderBy: useRouteQuery('orderBy', 'updatedAt'),
  sort: useRouteQuery('sort', 'desc'),
  refresh: 0,
})

const orders = computed(() => {
  return data?.value?.data.data || []
})

const total = computed(() => {
  return data?.value?.data.total || 0
})

const getStatusOrder = (status: ORDER_STATUS) => {
  return ORDER_STATUS_DETAIL[status]
}

const handleConfirmOrder = async (id: string) => {
  try {
    loading.value = true
    const { data } = await confirmOrder(id)
    if (data) {
      ElNotification({
        title: 'Success',
        message: 'Đã xác nhận đơn hàng!',
        type: 'success',
      })
    }
    fetch()
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

const handleCancelOrder = async (id: string) => {
  try {
    loading.value = true
    const { data } = await cancelOrder(id)
    if (data) {
      ElNotification({
        title: 'Success',
        message: 'Đơn hàng đã bị hủy!',
        type: 'warning',
      })
    }
    fetch()
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
    "name": "order-admin",
    "path": "/admin/order-manager",
    "meta": {
      "layout": "default",
      "admin": true,
      "auth": true
    }
  }
</route>
