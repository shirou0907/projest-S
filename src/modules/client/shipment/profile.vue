<template>
  <div class="bg-white rounded-lg shadow-md p-10 flex-1 mt-6">
    <el-breadcrumb separator="/" class="mb-6">
      <el-breadcrumb-item :to="{ path: '/' }">Trang chủ</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/user/profile">Thông tin cơ bản</a></el-breadcrumb-item>
    </el-breadcrumb>

    <div class="">
      <div class="text-2xl font-semibold mb-4">Thông tin người dùng</div>

      <div class="space-y-2">
        <div class="flex">
          <div class="text-sm font-semibold w-[180px]">Id người dùng</div>
          <div>{{ user?.uid }}</div>
        </div>

        <div class="flex">
          <div class="text-sm font-semibold w-[180px]">Tên người dùng</div>
          <div>{{ user?.displayName }}</div>
        </div>

        <div class="flex">
          <div class="text-sm font-semibold w-[180px]">Email người dùng</div>
          <div>{{ user?.email }}</div>
        </div>

        <div class="flex">
          <div class="text-sm font-semibold w-[180px]">Số điện thoại</div>
          <div>{{ user?.phoneNumber || '**********' }}</div>
        </div>

        <div>{{ user?.providerData?.providerId }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const user = computed(() => userStore.customer)
</script>

<route>
  {
    "name": "profile",
    "path": "/user/profile",
    "meta": {
      "layout": "home",
      "layoutUser": true,
    }
  }
    </route>
