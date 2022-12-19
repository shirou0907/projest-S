<template>
  <div class="bg-white rounded-lg shadow-md p-10 flex-1 mt-6">
    <el-breadcrumb separator="/" class="mb-6">
      <el-breadcrumb-item :to="{ path: '/' }">Trang chủ</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/user/shipment">Quản lý địa chỉ</a></el-breadcrumb-item>
    </el-breadcrumb>

    <div class="flex justify-between">
      <div class="text-2xl font-semibold mb-4">Địa chỉ hiện tại</div>
      <button-add-shipment @added="fetch"></button-add-shipment>
    </div>

    <div v-loading="loading || isFetching" class="min-h-[100px] mt-6">
      <div v-if="shipments.length" class="flex justify-between">
        <div class="flex-1">
          <div
            v-for="shipment in shipments"
            :key="shipment._id"
            class="rounded-md p-4 flex items-center w-full justify-between bg-fill-dark mb-2 mx-2"
          >
            <div class="flex items-center space-x-3">
              <el-icon><i-ep-location></i-ep-location></el-icon>

              <div>
                <div>
                  {{ shipment.address }} {{ shipment.wardName }}, {{ shipment.districtName }},
                  {{ shipment.provinceName }}
                </div>

                <div>{{ shipment.userName }} - {{ shipment.userPhone }}</div>
              </div>
            </div>
            <button-delete @delete="handleDeleteShipment(shipment._id)"></button-delete>
          </div>
        </div>
        <div class="ml-10">
          <img src="/img/shipment.png" alt="" />
        </div>
      </div>

      <div v-else class="flex flex-col space-y-3 justify-center items-center">
        <div class="text-4xl font-bold">Oops</div>
        <div class="w-12 h-12 bg-fill flex items-center justify-center rounded-full">
          <el-icon size="large">
            <i-ep-map-location></i-ep-map-location>
          </el-icon>
        </div>

        <div>Có vẻ bạn chưa lưu địa chỉ nào thì phải</div>
        <div>Cho chúng tôi biết ngay nhé !</div>

        <button-add-shipment @added="fetch"></button-add-shipment>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getAllShipment, deleteShipment } from './services'
import { useFetchData } from '@thinkvn/composables'
import { ElNotification } from 'element-plus'
import ButtonDelete from './button-delete.vue'
import ButtonAddShipment from './button-add-shipment.vue'

const loading = ref(false)

const { data, isFetching, fetch } = useFetchData(() => getAllShipment())
fetch()

const shipments = computed(() => data.value?.data || [])

const handleDeleteShipment = async (id: string) => {
  try {
    loading.value = true
    await deleteShipment(id)
    fetch()
  } catch (e: any) {
    ElNotification({
      title: 'Lỗi',
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
    "name": "shipment",
    "path": "/user/shipment",
    "meta": {
      "layout": "home",
      "layoutUser": true,
      "auth": true,
    }
  }
    </route>
