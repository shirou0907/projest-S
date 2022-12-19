<template>
  <div class="flex flex-col h-full">
    <div class="text-2xl font-semibold mb-6">Home</div>

    <div class="flex gap-4 w-1/2 mb-5">
      <div
        class="flex items-center justify-between w-1/3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-md shadow-md p-5"
      >
        <el-icon class="!text-3xl">
          <i-ep-avatar></i-ep-avatar>
        </el-icon>
        <div>
          <div>Customer</div>
          <div>{{ dashboard.customer }}</div>
        </div>
      </div>

      <div
        class="flex items-center justify-between w-1/3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-md shadow-md p-5"
      >
        <el-icon class="!text-3xl">
          <i-ep-management></i-ep-management>
        </el-icon>
        <div>
          <div>Product</div>
          <div>{{ dashboard.product }}</div>
        </div>
      </div>

      <div
        class="flex items-center justify-between w-1/3 bg-gradient-to-r from-lime-400 to-green-400 rounded-md shadow-md p-5"
      >
        <el-icon class="!text-3xl">
          <i-ep-promotion></i-ep-promotion>
        </el-icon>
        <div>
          <div>Order</div>
          <div>{{ dashboard.order }}</div>
        </div>
      </div>
    </div>

    <div class="flex w-full h-[460px] space-x-5">
      <div class="w-1/2 h-full p-5 bg-white rounded-md shadow-md">
        <div class="flex items-center justify-between">
          <div class="flex mb-3 space-x-3 items-center">
            <div class="text-sm">Chọn năm</div>
            <el-date-picker v-model="state.oYear" type="year" placeholder="Pick a year" />
          </div>
          <div v-loading="oLoading" class="h-1 w-10"></div>
        </div>
        <order-chart :order="order" :year="new Date(state.oYear).getFullYear()" class="!h-[360px]"></order-chart>
      </div>

      <div class="w-1/2 h-full p-5 bg-white rounded-md shadow-md">
        <div class="flex items-center justify-between">
          <div class="flex mb-3 space-x-3 items-center">
            <div class="text-sm">Chọn năm</div>
            <el-date-picker v-model="state.cYear" type="year" placeholder="Pick a year" />
          </div>
          <div v-loading="cLoading" class="h-1 w-10"></div>
        </div>
        <customer-chart
          :customer="customer"
          :year="new Date(state.cYear).getFullYear()"
          class="!h-[360px]"
        ></customer-chart>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from 'vue'
import { useFetchData } from '@thinkvn/composables'
import { getDashBoard, getStatisicOrder, getStatisicCustomer } from './services'
import OrderChart from './components/order-chart.vue'
import CustomerChart from './components/customer-chart.vue'

const state = reactive({
  oYear: '2022',
  cYear: '2022',
})

const { data: dData, fetch: dFetch } = useFetchData(() => getDashBoard())
const {
  data: oData,
  fetch: oFetch,
  isFetching: oLoading,
} = useFetchData(() => getStatisicOrder(new Date(state.oYear).getFullYear()))
const {
  data: cData,
  fetch: cFetch,
  isFetching: cLoading,
} = useFetchData(() => getStatisicCustomer(new Date(state.cYear).getFullYear()))

dFetch()
oFetch()
cFetch()

const dashboard = computed(() => {
  return dData?.value?.data?.data || []
})

const order = computed(() => {
  return oData?.value?.data?.data || []
})

const customer = computed(() => {
  return cData?.value?.data?.data || []
})

watch(
  () => state.oYear,
  () => {
    oFetch()
  },
  { immediate: true, deep: true }
)

watch(
  () => state.cYear,
  () => {
    cFetch()
  },
  { immediate: true, deep: true }
)
</script>

<route>
{
    "name": "home-admin",
    "path": "/admin/home",
    "meta": {
      "layout": "default",
      "admin": true,
      "auth": true
    }
  }
</route>
