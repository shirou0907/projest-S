<template>
  <el-aside class="rounded bg-white" width="224px">
    <el-scrollbar :view-class="'h-full'" :wrap-class="'h-full'">
      <el-menu :default-active="defaultActive" class="flex flex-col h-full py-3" @select="handleSelect">
        <el-menu-item index="home-admin">
          <el-icon>
            <i-ep-house></i-ep-house>
          </el-icon>
          <span>Home</span>
          <div class="absolute w-[176px] bottom-0 border-b border-border-color left-1/2 -translate-x-1/2"></div>
        </el-menu-item>

        <el-sub-menu index="sub-menu-customer">
          <template #title>
            <el-icon><i-ep-user></i-ep-user></el-icon>
            <span>Đối tác</span>
          </template>

          <el-menu-item index="customer-admin">Quản lý người dùng</el-menu-item>
          <el-menu-item index="supplier">Quản lý Suppliers</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="san-pham">
          <template #title>
            <el-icon><i-ep-tickets></i-ep-tickets></el-icon>
            <span>Sản phẩm</span>
          </template>

          <el-menu-item index="tag-admin">Loại sản phẩm</el-menu-item>
          <el-menu-item index="product-admin">Danh sách sản phẩm</el-menu-item>
          <el-menu-item index="design-admin">Thiết kế sản phẩm</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="order-admin">
          <el-icon>
            <i-ep-goods></i-ep-goods>
          </el-icon>
          Đơn hàng
        </el-menu-item>

        <el-menu-item class="mt-auto" index="setting-admin">
          <el-icon>
            <i-ep-setting></i-ep-setting>
          </el-icon>
          Cài đặt
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const defaultActive = computed(() => route.name as string)

const handleSelect = (key: string) => {
  router.push({ name: key })
}
</script>
