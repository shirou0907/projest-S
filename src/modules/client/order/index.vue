<template>
  <div class="pt-6">
    <el-breadcrumb separator="/" class="mb-6">
      <el-breadcrumb-item :to="{ path: '/' }">Trang chủ</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/user/order">Đơn hàng</a></el-breadcrumb-item>
    </el-breadcrumb>

    <div class="flex items-center justify-between">
      <div class="text-2xl font-semibold mb-6">Đơn hàng của bạn</div>
      <div v-if="orders.length">
        <el-pagination
          v-model:currentPage="state.page"
          v-model:page-size="state.size"
          :page-sizes="[2, 4, 5, 10]"
          layout="prev, pager, next"
          :total="total"
          class="!p-0 mt-3"
        ></el-pagination>
      </div>
    </div>

    <div v-if="!userStore.customer">
      <div class="bg-white flex flex-col justify-center items-center rounded-md shadow-md min-h-[500px] space-y-4">
        <div>Bạn cần đăng nhập để có thể xem thông tin!</div>
        <button-main @click="$router.push({ name: 'login' })">Đăng nhập ngay</button-main>
      </div>
    </div>
    <div v-else v-loading="loading || isFetching" class="min-h-[300px]">
      <div v-if="orders.length">
        <el-scrollbar v-loading="isFetching" :view-class="'h-full'" :wrap-class="'h-full'">
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

              <div class="!w-[200px] text-center">
                <div>Thanh toán {{ order.shipment?.paymentMethod }}</div>
              </div>
              <div class="!w-[200px] text-center">
                <div>{{ order.shipment?.carrieName }}</div>
                <div>Dự kiến: {{ getLocalDate(order.shipment?.expectedDelivery).split('').splice(10).join('') }}</div>
              </div>

              <div class="!w-[200px] text-center">
                <div :class="`text-${getStatusOrder(order.status).color}`">
                  {{ getStatusOrder(order.status).label }}
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div v-else class="bg-white flex items-center justify-center rounded-md shadow-sm h-[600px]">
        <div class="w-1/2">
          <img src="/img/empty-cart.png" />
          <div class="text-center">Giỏ hàng của bạn chưa có sản phẩm nào, hãy mua ngay nhé!</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useFetchData } from '@thinkvn/composables'
import { getPhotoUrl } from '@/utils'
import { useUserStore } from '@/store/user'
import { getOrderCustomer } from './services'
import { getLocalDate } from '@/utils'
import { ElNotification } from 'element-plus'
import ButtonMain from '@/components/button-main.vue'
import { formatCurrency } from '@thinkvn/utils'
import { ORDER_STATUS, ORDER_STATUS_DETAIL } from '@/modules/admin/order/constants'
import { useRouteQuery } from '@/composables'
import { useRoute } from 'vue-router'

const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)

const { data, fetch, isFetching } = useFetchData(() => getOrderCustomer({ ...route.query, ...state }), {
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
  return data.value?.data?.data || []
})

const total = computed(() => {
  return data.value?.data?.total || 0
})

const getStatusOrder = (status: ORDER_STATUS) => {
  return ORDER_STATUS_DETAIL[status]
}

watch(state, fetch, { immediate: true })
</script>

<route>
{
  "name": "order",
  "path": "/order",
  "meta": {
    "layout": "home",
  }
}
</route>
