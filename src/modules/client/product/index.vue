<template>
  <div class="pt-6">
    <el-breadcrumb separator="/" class="mb-6">
      <el-breadcrumb-item :to="{ path: '/' }">Trang chủ</el-breadcrumb-item>
      <el-breadcrumb-item><a :href="`/product/${route.params.id}`">Sản phẩm</a></el-breadcrumb-item>
      <el-breadcrumb-item>
        <div>{{ product.name }}</div>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div v-loading="isFetching" class="min-h-screen">
      <div v-if="product">
        <div v-if="product.images?.length" class="flex gap-5 min-h-screen">
          <div class="w-2/3 space-y-5">
            <slide-thumb :photos="product.images" class="bg-white p-5 rounded-md shadow-lg"></slide-thumb>

            <div class="relative bg-white rounded-md shadow-md p-10">
              <div class="text-2xl font-semibold mb-4">Thông tin chi tiết</div>
              <div class="overflow-hidden w-full space-y-2" :class="[seeMore ? 'h-full' : 'h-[300px]']">
                <!-- eslint-disable vue/no-v-html -->
                <div v-html="product.description"></div>
                <!--eslint-enable-->
                <div class="absolute bottom-0 left-1/2 -translate-x-1/2 p-2 bg-white w-full flex justify-center">
                  <button-main v-if="!seeMore" @click="seeMore = true">Xem thêm</button-main>
                  <button-main v-else @click="seeMore = false">Ẩn bớt</button-main>
                </div>
              </div>
            </div>

            <div ref="refScroll">
              <div class="text-2xl font-semibold mb-4">Bình luận và đánh giá</div>

              <div v-if="userStore.customer" class="bg-white p-5 rounded-md shadow-md mb-4 space-y-2">
                <div class="flex items-center space-x-3">
                  <img
                    :src="userStore.customer.photoURL!"
                    referrerpolicy="no-referrer"
                    class="w-[32px] h-[32px] rounded-full"
                  />
                  <el-rate
                    v-model="commentState.rate"
                    :texts="['Rất không hài lòng', 'Không hài lòng', 'Bình thường', 'Tốt', 'Rất tốt']"
                    show-text
                  />
                </div>
                <el-input
                  v-model="commentState.comment"
                  maxlength="30"
                  placeholder="Nhập bình luận của bạn về sản phẩm này"
                  show-word-limit
                  type="textarea"
                ></el-input>
                <button-main
                  :loading="loadingComment"
                  :disabled="commentState.rate === 0 || commentState.comment.length <= 0"
                  @click="handleAddComment()"
                >
                  Gửi bình luận
                </button-main>
              </div>

              <div v-else class="bg-white rounded-md mb-4">
                <div class="border p-2 rounded-md flex space-x-2">
                  <div>
                    <img src="/img/user-unlogin.png" alt="" />
                  </div>
                  <div class="space-y-2">
                    <div class="text-lg font-bold text-primary">Tùng Shop xin chào!</div>
                    <div class="text-sm">Vui lòng đăng nhập để có thể bình luận bạn nhé</div>
                    <button-main @click="$router.push({ name: 'login' })">Đăng nhập ngay</button-main>
                  </div>
                </div>
              </div>

              <div v-loading="isFetchingComment">
                <div v-if="comments.length" class="space-y-3">
                  <div v-for="(comment, index) in comments" :key="index" class="bg-white p-2 rounded-md shadow-md">
                    <div class="p-3 flex gap-3">
                      <img
                        :src="comment.customer?.photoURL"
                        referrerpolicy="no-referrer"
                        class="w-[32px] h-[32px] rounded-full"
                      />
                      <div class="flex-1">
                        <div class="flex justify-between">
                          <div>{{ comment.customer?.displayName }}</div>
                          <div>{{ getLocalDate(comment.date) }}</div>
                        </div>
                        <el-rate :model-value="comment.rate" clearable disabled />
                        <div>{{ comment.comment }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="product-bar flex-1 sticky top-[96px] space-y-4 bg-white p-5 rounded-md shadow-lg h-[600px] overflow-auto"
          >
            <div>
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-1 cursor-pointer hover:!text-primary">
                  <div class="text-xs" @click="handleScroll()">Đánh giá sản phẩm</div>
                  <el-icon>
                    <i-ep-comment></i-ep-comment>
                  </el-icon>
                </div>
                <div class="flex items-center space-x-1 cursor-pointer hover:!text-primary" @click="open">
                  <div class="text-xs">Chia sẻ</div>
                  <el-icon>
                    <i-ep-share></i-ep-share>
                  </el-icon>
                </div>
              </div>

              <teleport to="#app">
                <el-dialog v-model="visible" width="40%" class="share-dialog" :show-close="false" draggable>
                  <div class="flex">
                    <qrcode-vue :value="shareURL" :size="300" level="H" />
                    <div>Share</div>
                  </div>
                </el-dialog>
              </teleport>
            </div>
            <div class="text-2xl font-semibold">{{ product.name }}</div>
            <div class="text-xl font-semibold">SKU: {{ btoa(product._id) }}</div>
            <div class="text-sm">Chọn màu sắc</div>
            <div class="flex items-center space-x-3">
              <div
                v-for="(color, index) in product.options.colors"
                :key="index"
                class="w-10 h-10 border-2"
                :style="{ background: color }"
                :class="{ 'border-primary': colorSelected === color }"
                @click="colorSelected = color"
              ></div>
            </div>

            <div class="text-sm">Chọn kích cỡ</div>
            <div class="flex items-center space-x-3">
              <div v-for="(size, index) in product.options.sizes" :key="index">
                <div
                  class="p-2 border-2 w-10 text-center"
                  :class="{ 'border-primary': sizeSelected === size }"
                  @click="sizeSelected = size"
                >
                  {{ size }}
                </div>
              </div>
            </div>

            <div>
              <div class="text-xs font-semibold line-through">{{ formatCurrency(product.price * 1.25) }} VND</div>
              <div class="text-lg font-semibold text-danger">Giá chỉ: {{ formatCurrency(product.price) }} VND</div>
            </div>

            <button-main :loading="loading" @click="handleAddCart()">Thêm vào giỏ hàng</button-main>

            <section v-if="product.attributes">
              <div class="demo-collapse">
                <el-collapse v-model="activeNames">
                  <el-collapse-item
                    v-for="(attr, index) in product.attributes"
                    :key="index"
                    :title="attr.title"
                    :name="index"
                  >
                    <!-- eslint-disable vue/no-v-html -->
                    <div v-html="attr.content"></div>
                    <!--eslint-enable-->
                  </el-collapse-item>
                </el-collapse>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFetchData } from '@thinkvn/composables'
import { getProductById, getProductComment, addProductComment } from './services'
import { getLocalDate } from '@/utils'
import { addToCart } from '../cart/services'
import ButtonMain from '@/components/button-main.vue'
import SlideThumb from '@/components/slide-thumb.vue'
import { useUserStore } from '@/store/user'
import { Buffer } from 'buffer'
import { formatCurrency } from '@thinkvn/utils'
import QrcodeVue from 'qrcode.vue'
import { useVisible } from '@thinkvn/composables'
import { useScroll } from '@/composables'

const userStore = useUserStore()
const route = useRoute()

watch(route, () => {
  fetch()
  fetchComment()
})

const { visible, open } = useVisible()

const id = computed(() => route.params.id as string)
const loading = ref(false)
const activeNames = ref('1')
const colorSelected = ref('')
const sizeSelected = ref('')
const seeMore = ref(false)
const shareURL = computed(() => window.location.href)

const { refScroll, handleScroll } = useScroll()

const { data, fetch, isFetching } = useFetchData(() => getProductById(id.value), { autoResetData: false })
const {
  data: dataComment,
  fetch: fetchComment,
  isFetching: isFetchingComment,
} = useFetchData(() => getProductComment(id.value), {
  autoResetData: false,
})
fetch()
fetchComment()

const product = computed(() => data?.value?.data?.data || {})
const comments = computed(() => dataComment?.value?.data?.data || {})

const btoa = (str: string) => {
  return Buffer.from(str).toString('base64').substring(0, 10)
}

const handleAddCart = async () => {
  try {
    loading.value = true
    await addToCart(product.value._id)
    userStore.getCartCount()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const loadingComment = ref(false)
const commentState = reactive({
  rate: 0,
  comment: '',
})

const handleAddComment = async () => {
  try {
    loadingComment.value = true
    await addProductComment(product.value._id, commentState.comment, commentState.rate)
    await fetchComment()
    commentState.comment = ''
    commentState.rate = 0
  } catch (e: any) {
    console.log(e)
  } finally {
    loadingComment.value = false
  }
}
</script>

<route>
{
  "name": "product",
  "path": "/product/:id",
  "meta": {
    "layout": "home",
  }
}
</route>
