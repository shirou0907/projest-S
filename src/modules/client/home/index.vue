<template>
  <div class="flex items-center justify-between">
    <div class="text-2xl font-semibold mb-4">Tất cả sản phẩm</div>
    <div>
      <el-pagination
        v-model:current-page="state.page"
        layout="prev, pager, next"
        :page-size="state.size"
        :total="total"
      />
    </div>
  </div>

  <div class="flex space-x-5">
    <div class="w-[300px] bg-white p-5 rounded-md">
      <div class="flex items-center justify-between border-b pb-2">
        <div class="flex items-center space-x-2">
          <el-icon size="large">
            <i-ep-operation></i-ep-operation>
          </el-icon>
          <div class="text-xl font-semibold">Lọc sản phẩm</div>
        </div>
        <button-main @click="$router.push('/')">Reset</button-main>
      </div>

      <div class="space-y-3 mt-3">
        <div class="space-y-1">
          <div class="text-sm text-primary">Theo loại sản phẩm</div>
          <div class="grid grid-cols-4 gap-2">
            <div v-for="(tag, index) in tags" :key="index">
              <div
                class="px-1 py-1 text-xs truncate text-center rounded-md !bg-white w-[60px] hover:!bg-fill border cursor-pointer"
                :class="{ '!border-primary !bg-fill text-primary': tag.name == state.tag }"
                @click="state.tag = tag.name"
              >
                {{ tag.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <div class="text-sm text-primary">Theo size</div>
          <el-radio-group v-model="state.p_size">
            <el-radio-button size="small" label="XS">XS</el-radio-button>
            <el-radio-button size="small" label="S">S</el-radio-button>
            <el-radio-button size="small" label="M">M</el-radio-button>
            <el-radio-button size="small" label="L">L</el-radio-button>
            <el-radio-button size="small" label="XL">XL</el-radio-button>
            <el-radio-button size="small" label="XXL">XXL</el-radio-button>
          </el-radio-group>
        </div>

        <div class="space-y-1">
          <div class="text-sm text-primary">Theo màu sắc</div>
          <div class="grid grid-cols-6 gap-2">
            <div
              v-for="(color, index) in listColors"
              :key="index"
              class="w-8 h-8 flex items-center rounded justify-center border-2 cursor-pointer"
              :style="{ backgroundColor: `#${color}` }"
              :class="{ 'border-warning': color == state.p_color }"
              @click="state.p_color = color"
            ></div>
          </div>
        </div>

        <div class="space-y-1">
          <div class="text-sm text-primary">Khoảng giá</div>

          <div class="flex items-center space-x-1">
            <div>{{ formatCurrency(state.range[0]) }} VND</div>
            <div>-</div>
            <div>{{ formatCurrency(state.range[1]) }} VND</div>
          </div>
          <el-slider v-model="state.range" range show-stops :max="10000000" :step="100000" />
        </div>
      </div>
    </div>

    <div class="flex-1 justify-between">
      <div v-if="isFetching" class="grid grid-cols-4 gap-3 gap-y-6">
        <el-skeleton v-for="i of 8" :key="i" loading animated class="p-3 bg-white rounded-md">
          <template #template>
            <el-skeleton-item variant="image" style="width: 100%; height: 200px" />
            <div style="padding: 14px">
              <el-skeleton-item variant="h3" style="width: 50%" />

              <el-skeleton-item variant="text" style="margin-right: 16px" />
              <el-skeleton-item variant="text" style="width: 30%" />
            </div>
          </template>
        </el-skeleton>
      </div>

      <div v-else>
        <div v-if="products.length" class="grid grid-cols-4 gap-3 gap-y-6">
          <transition-group appear name="list">
            <div
              v-for="(product, index) in products"
              :key="index"
              class="bg-white rounded-md cursor-pointer hover:shadow-xl"
              :class="{ 'opacity-50 cursor-no-drop': product.stock === 0 }"
              @click="gotoDetail(product)"
            >
              <div class="w-full p-3">
                <div class="relative w-full h-[200px] rounded-md overflow-hidden mb-3">
                  <div v-if="product.stock === 0" class="absolute inset-0 p-5">
                    <img src="/img/sold-out.png" class="w-full h-full" alt="" />
                  </div>
                  <div
                    :style="{ backgroundImage: `url('${getPhotoUrl(product.mainImage)}')` }"
                    class="w-full h-full !bg-contain !bg-center !bg-no-repeat hover:scale-125 transition-all duration-300"
                  />
                </div>

                <div>
                  <el-tag
                    v-for="(ptag, i) in filLMore(product.tag, seeMore)"
                    :key="i"
                    size="small"
                    type="success"
                    class="mr-2"
                  >
                    {{ ptag }}
                  </el-tag>
                  <el-tag v-if="product.tag.length > 2" size="small" type="success" class="mr-2">
                    +{{ product.tag.length - 2 }}
                  </el-tag>
                </div>

                <div class="space-y-1 mt-2">
                  <div class="font-semibold truncate">{{ product.name }}</div>
                  <div class="flex items-center space-x-1">
                    <div class="text-xs">Màu sắc:</div>
                    <div
                      v-for="(pcolor, i) in product.options.colors"
                      :key="i"
                      class="w-4 h-4 rounded-full border"
                      :style="{ backgroundColor: pcolor }"
                    ></div>
                  </div>

                  <div class="text-danger font-semibold">Giá: {{ formatCurrency(product.price) }} VND</div>
                  <div class="flex items-center space-x-2">
                    <div class="text-sm line-through">{{ formatCurrency(product.price * 1.25) }} VND</div>
                    <div>- 20%</div>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
        <div v-else class="w-full h-[460px] flex flex-col justify-center space-y-3 items-center bg-white rounded-md">
          <div class="text-center">Không tìm thấy kết quả phù hợp, bạn thử lại nhé!</div>
          <img src="/img/shipment.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch } from 'vue'
import { useFetchData } from '@thinkvn/composables'
import { getAllProducts } from './services'
import { useRouteQuery } from '@/composables'
import { getPhotoUrl } from '@/utils'
import { getALlTags } from '@/modules/admin/product/services'
import { formatCurrency } from '@thinkvn/utils'
import ButtonMain from '@/components/button-main.vue'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
import { Product } from './types'

const router = useRouter()

const state = reactive({
  page: useRouteQuery('page', 1),
  size: useRouteQuery('size', 8),
  orderBy: useRouteQuery('orderBy', 'updatedAt'),
  sort: useRouteQuery('sort', 'desc'),
  range: useRouteQuery<number[]>('range', [0, 10000000]),
  p_color: useRouteQuery<string>('p_color', ''),
  p_size: useRouteQuery<string>('p_size', ''),
  tag: useRouteQuery<string>('tag', ''),
  refresh: 0,
})

const listColors = ['ffffff', '000000', 'ff0000', '00ff00', '0000ff', 'ffff00', '00ffff', 'ff00ff']

const { data, fetch, isFetching } = useFetchData(() => getAllProducts({ ...state }), {
  autoResetData: false,
})
const products = computed(() => data.value?.data.data || [])
const total = computed(() => data.value?.data.total || 0)
fetch()

const { data: tagData, fetch: tagFetch } = useFetchData(() => getALlTags({ size: 1000 }), { autoResetData: false })
const tags = computed(() => tagData.value?.data.data.filter(t => t.active === true) || [])
tagFetch()

const seeMore = ref(false)
const filLMore = (arr: any, isOpen: boolean) => {
  const per = 2
  if (isOpen) {
    return arr
  } else {
    return arr.slice(0, per)
  }
}
const gotoDetail = (product: Product) => {
  if (product.stock === 0) {
    return ElNotification({
      title: 'Thông báo',
      message: 'Sản phẩm tạm hết hàng, bạn quay lại sau nhé! ',
      type: 'warning',
    })
  }
  return router.push({ name: 'product', params: { id: product._id } })
}

watch(state, fetch, { deep: true, immediate: true })
</script>
