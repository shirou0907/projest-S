<template>
  <section direction="vertical" class="min-h-screen">
    <main-header></main-header>

    <main class="container mt-[80px]">
      <section :class="{ 'flex space-x-8': route.meta.layoutUser }">
        <div v-if="route.meta.layoutUser">
          <div class="w-[300px] bg-white rounded-md shadow-md p-8 mt-6">
            <div class="space-x-4">
              <div class="flex p-3 items-center space-x-2 border-b">
                <img
                  :src="userStore.customer?.photoURL!"
                  alt=""
                  referrerpolicy="no-referrer"
                  class="w-12 h-12 rounded-full border"
                />
                <div>{{ userStore.customer?.displayName }}</div>
              </div>
            </div>
            <div
              v-for="(tab, index) in tabs"
              :key="index"
              class="p-2 my-2 border-l-4 border-transparent cursor-pointer hover:text-primary"
              :class="{ 'border-primary': tabSelectd === index }"
              @click="$router.push({ name: tab.path }), (tabSelectd = index)"
            >
              {{ tab.name }}
            </div>

            <div class="p-2 rounded border-primary cursor-pointer hover:text-danger" @click="userStore.logout">
              Đăng xuất
            </div>
          </div>
        </div>

        <router-view></router-view>
      </section>

      <intro-vue class="my-6"></intro-vue>

      <main-footer></main-footer>
    </main>

    <el-backtop :right="50" :bottom="50" />
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import MainHeader from './components/main-header.vue'
import MainFooter from './components/main-footer.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import IntroVue from '@/components/intro-vue.vue'

const userStore = useUserStore()
const route = useRoute()
const tabSelectd = ref<number>()

const tabs = [
  { id: 0, path: 'profile', name: 'Thông tin người dùng' },
  { id: 1, path: 'shipment', name: 'Sổ địa chỉ' },
  { id: 2, path: 'order', name: 'Đơn hàng' },
  { id: 3, path: 'viewed', name: 'Sản phẩm đã xem' },
]
</script>
