<template>
  <el-header class="bg-primary">
    <div class="h-full flex justify-between items-center">
      <router-link to="/admin" class="h-10">
        <full-logo></full-logo>
      </router-link>

      <div class="flex items-center space-x-4 text-white">
        <el-icon :size="24">
          <i-ep-chat-dot-round></i-ep-chat-dot-round>
        </el-icon>

        <el-icon :size="24">
          <i-ep-bell></i-ep-bell>
        </el-icon>

        <div class="w-[1px] h-5 bg-white"></div>

        <el-dropdown @command="handleCommand">
          <span class="text-white flex items-center">
            <el-icon :size="24" class="el-icon--left">
              <i-ep-user></i-ep-user>
            </el-icon>

            <el-icon :size="16" class="el-icon--right">
              <i-ep-arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">Đăng xuất</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import FullLogo from '@/assets/logo-light.svg'
import { useUserStore } from '@/store/user'

const store = useUserStore()

const handleCommand = (command: string) => {
  if (command === 'logout') {
    store.logout()
  }
}
</script>
