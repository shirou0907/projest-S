<template>
  <el-container class="bg-white dark:bg-black" direction="vertical">
    <the-header></the-header>

    <el-container class="!bg-fill-light">
      <the-aside></the-aside>

      <el-main class="min-h-[calc(100vh-60px)] max-w-[1300px] mx-auto">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import TheHeader from './components/the-header.vue'
import TheAside from './components/the-aside.vue'
</script>
