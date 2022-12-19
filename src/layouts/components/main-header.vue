<template>
  <div class="px-10 h-[80px] shadow-md bg-white fixed top-0 left-0 right-0 z-50">
    <div class="flex items-center justify-between h-full max-w-[1200px] mx-auto">
      <div class="flex items-center space-x-10">
        <div class="w-[160px] cursor-pointer" @click="$router.replace('/')">
          <component :is="Logo"></component>
        </div>
        <div
          class="relative w-[400px] h-[48px] border-2 rounded-3xl flex items-center hover:border-primary transition"
          :class="{ 'border-primary': isFocus }"
        >
          <el-icon class="!text-3xl ml-2">
            <i-ep-search></i-ep-search>
          </el-icon>
          <input
            v-model="search"
            type="text"
            class="h-full w-full outline-none ml-3 mr-6"
            placeholder="Tìm kiếm sản phẩm"
            @focus="isFocus = true"
            @blur="isFocus = false"
          />

          <div
            v-if="search.length"
            v-loading="isFetching"
            class="p-4 absolute border shadow-md top-[calc(100%+1rem)] left-0 bg-white rounded-md w-full z-1000"
          >
            <el-scrollbar :view-class="'h-full'" :wrap-class="'h-full max-h-[200px]'">
              <div
                v-for="(product, index) in products"
                :key="index"
                class="h-14 cursor-pointer mb-2 p-2 hover:!bg-fill flex items-center justify-between"
                @click="gotoDetail(product)"
              >
                <div class="flex items-center space-x-2">
                  <img :src="getPhotoUrl(product.mainImage)" class="h-full w-10" alt="" />
                  <div class="font-semibold">{{ product.name }}</div>
                </div>
                <div class="text-danger font-semibold">{{ formatCurrency(product.price) }} VND</div>
              </div>
            </el-scrollbar>
            <div class="text-center">Kết quả tìm kiếm</div>
          </div>
        </div>
      </div>

      <div class="flex space-x-4">
        <div
          class="main-user relative h-12 !w-[80px] rounded-full bg-fill transition flex items-center justify-center cursor-pointer"
          @click="$router.push({ name: 'cart' })"
        >
          <el-icon size="large">
            <i-ep-shopping-cart></i-ep-shopping-cart>
          </el-icon>
          <div class="ml-3">{{ userStore.cartCount }}</div>
          <div
            v-if="userStore.cartCount"
            class="animate-ping top-0 right-0 absolute h-3 w-3 rounded-full !bg-primary opacity-75"
          ></div>
          <div
            v-if="userStore.cartCount"
            class="top-0 right-0 absolute h-3 w-3 rounded-full !bg-primary opacity-75"
          ></div>
        </div>

        <div
          class="main-user h-12 w-12 rounded-full bg-fill transition flex items-center justify-center cursor-pointer"
          @click="$router.push({ name: 'order' })"
        >
          <el-icon size="large"><i-ep-van></i-ep-van></el-icon>
        </div>

        <el-popover placement="bottom" :width="440" trigger="click">
          <template #reference>
            <div
              class="main-user h-12 w-12 rounded-full bg-fill transition flex items-center justify-center cursor-pointer"
            >
              <el-icon size="large"><i-ep-user></i-ep-user></el-icon>
            </div>
          </template>
          <template #default>
            <div class="text-2xl font-semibold">Tài khoản</div>
            <div v-if="!userStore.customer" class="w-full p-5">
              <div class="border p-2 rounded-md flex space-x-2">
                <div>
                  <img src="/img/user-unlogin.png" alt="" />
                </div>
                <div class="space-y-2">
                  <div class="text-lg font-bold text-primary">Tùng Shop xin chào!</div>
                  <div class="text-sm">Đăng nhập để mua và theo dõi đơn hàng bạn nhé</div>
                  <button-main @click="$router.push({ name: 'login' })">Đăng nhập ngay</button-main>
                </div>
              </div>
            </div>

            <div v-else>
              <div class="flex p-3 items-center space-x-2 border-b">
                <img
                  :src="userStore.customer?.photoURL!"
                  alt=""
                  referrerpolicy="no-referrer"
                  class="w-12 h-12 rounded-full border"
                />
                <div>{{ userStore.customer?.displayName }}</div>
              </div>
              <div
                v-for="(tab, index) in tabs"
                :key="index"
                class="p-2 my-2 border-l-4 border-transparent cursor-pointer hover:text-primary"
                @click="$router.push({ name: tab.path })"
              >
                {{ tab.name }}
              </div>

              <div class="p-2 rounded border-primary cursor-pointer hover:text-danger" @click="userStore.logout">
                Đăng xuất
              </div>
            </div>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, watch } from 'vue'
import Logo from '@/assets/logo.svg'
import { ref } from 'vue'
import ButtonMain from '@/components/button-main.vue'
import { searchProduct } from '@/modules/client/product/services'
import { useFetchData } from '@thinkvn/composables'
import { useUserStore } from '@/store/user'
import { formatCurrency, getPhotoUrl } from '@/utils'
import { Product } from '@/modules/client/product/types'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const search = ref('')
const isFocus = ref(false)
const router = useRouter()

const tabs = [
  { id: 0, path: 'profile', name: 'Thông tin người dùng' },
  { id: 1, path: 'shipment', name: 'Sổ địa chỉ' },
  { id: 2, path: 'order', name: 'Đơn hàng' },
  { id: 3, path: 'viewed', name: 'Sản phẩm đã xem' },
]

const { data, fetch, isFetching } = useFetchData(() => searchProduct(search.value), { autoResetData: false })
const products = computed(() => data.value?.data.data || [])

const gotoDetail = (product: Product) => {
  if (product.stock === 0) {
    return ElNotification({
      title: 'Thông báo',
      message: 'Sản phẩm tạm hết hàng, bạn quay lại sau nhé! ',
      type: 'warning',
    })
  }
  search.value = ''
  return router.push({ name: 'product', params: { id: product._id } })
}

watch(search, () => {
  fetch()
})
</script>
