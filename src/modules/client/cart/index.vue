<template>
  <div class="pt-6">
    <el-breadcrumb separator="/" class="mb-6">
      <el-breadcrumb-item :to="{ path: '/' }">Trang chủ</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/user/shipment">Giỏ hàng</a></el-breadcrumb-item>
    </el-breadcrumb>
    <div v-loading="loading || isFetching" class="min-h-[300px]">
      <div v-if="!userStore.customer">
        <div class="bg-white flex flex-col justify-center items-center rounded-md shadow-md min-h-[500px] space-y-4">
          <div>Bạn cần đăng nhập để có thể mua hàng!</div>
          <button-main @click="$router.push({ name: 'login' })">Đăng nhập ngay</button-main>
        </div>
      </div>
      <div v-else>
        <el-steps v-if="cart.products.length" :active="step" finish-status="success" align-center>
          <el-step description="Chọn sản phẩm" />
          <el-step description="Chọn địa chỉ giao hàng" />
          <el-step description="Xem chi tiết đơn hàng" />
          <el-step description="Xác nhận đơn hàng" />
        </el-steps>
        <div v-if="cart.products.length" class="flex gap-4 mt-4">
          <div class="w-[300px] p-4 bg-white rounded-md shadow-lg">
            <div v-if="shipments.length">
              <div class="text-2xl font-semibold mb-4">Địa chỉ giao hàng</div>
              <label
                v-for="(ship, index) in shipments"
                :key="index"
                class="h-[48px] w-full border-2 rounded flex gap-3 mb-4 items-center justify-between px-4"
                :class="{ 'border-primary': ship._id === shipmentSelected }"
              >
                <input
                  type="radio"
                  name="shipment"
                  :value="ship._id"
                  @change=";(shipmentSelected = ship._id), (step = 2)"
                />
                <div class="text-[10px] flex-1">
                  <div>
                    {{ ship.address }} {{ ship.wardName }}, {{ ship.districtName }},
                    {{ ship.provinceName }}
                  </div>

                  <div>{{ ship.userName }} - {{ ship.userPhone }}</div>
                </div>
              </label>

              <button-main :disabled="!(shipmentSelected.length > 0)" @click="open">Xác nhận</button-main>

              <el-dialog v-model="visible" title="Chi tiết đơn hàng" width="50%" :before-close="close">
                <div class="space-y-4">
                  <div class="bg-slate-100 flex justify-between shadow-md rounded-md p-3">
                    <div>
                      <div>
                        <div class="font-bold text-base">Người nhận:</div>
                        <div>{{ shipmentValue?.userName }}</div>
                        <div>{{ shipmentValue?.userPhone }}</div>
                        <div>
                          {{ shipmentValue?.address }} {{ shipmentValue?.wardName }}, {{ shipmentValue?.districtName }},
                          {{ shipmentValue?.provinceName }}
                        </div>
                      </div>
                    </div>
                    <div class="flex gap-1">
                      <div class="font-bold text-base">Ngày đặt hàng:</div>
                      <div>{{ new Date().toLocaleDateString() }}</div>
                    </div>
                  </div>
                  <div class="bg-slate-100 rounded-md shadow-md p-3">
                    <div class="text-base font-bold">Phương thức thanh toán</div>
                    <div class="flex flex-col justify-between px-3">
                      <div class="flex gap-3 items-center italic h-10 cursor-pointer">
                        <input type="radio" checked />
                        <img class="h-full object-cover" src="/img/cod.png" alt="" />
                        <div>Thanh toán khi nhận hàng</div>
                      </div>

                      <div class="flex gap-3 items-center italic h-10 cursor-not-allowed">
                        <input type="radio" disabled />
                        <img class="h-full object-cover" src="/img/visa.png" alt="" />
                        <div>Thanh toán bằng thẻ tín dụng</div>
                      </div>

                      <div class="flex gap-3 items-center italic h-10 cursor-not-allowed">
                        <input type="radio" disabled />
                        <img class="h-full object-cover" src="/img/pp.png" alt="" />
                        <div>Thanh toán qua ví PayPal</div>
                      </div>

                      <div class="flex gap-3 items-center italic h-10 cursor-not-allowed">
                        <input type="radio" disabled />
                        <img class="h-full object-cover" src="/img/mc.png" alt="" />
                        <div>Thanh toán bằng thẻ MasterCard</div>
                      </div>
                    </div>
                  </div>
                  <div class="!bg-slate-100 p-3 shadow-md rounded-md">
                    <div class="text-base font-bold mb-3">Đơn hàng</div>
                    <div>
                      <div v-for="(product, index) in cart.products" :key="index">
                        <div class="flex justify-between">
                          <div>{{ product.productId.name }}</div>
                          <div>{{ product.quantity }} x {{ formatCurrency(product.productId.price) }} VND</div>
                        </div>
                      </div>
                    </div>
                    <div class="border-t my-3"></div>
                    <div class="font-semibold text-right">
                      <div>Tổng tiền</div>
                      <div>{{ formatCurrency(cart.total) }} VND</div>
                    </div>
                  </div>
                </div>
                <template #footer>
                  <span class="dialog-footer">
                    <button-main :loading="loading" @click="handleCheckout(), (step = 4)">Thanh toán</button-main>
                  </span>
                </template>
              </el-dialog>
            </div>
            <div v-else class="flex flex-col justify-center items-center gap-3">
              <div class="font-semibold">Chưa có địa chỉ thanh toán</div>
              <img src="/img/shipment.png" alt="" />
              <button-main @click="$router.push({ name: 'shipment' })">Thêm ngay</button-main>
            </div>
          </div>
          <div class="flex-1 space-y-3">
            <div
              v-for="(product, index) in cart.products"
              :key="index"
              class="p-5 bg-white rounded-md shadow-lg flex items-center justify-between"
            >
              <img :src="getPhotoUrl(product.productId.mainImage)" class="w-[80px] h-[80px] rounded-md" alt="" />

              <div>
                <div class="text-xs">Name</div>
                <div class="text-md font-semibold">{{ product.productId.name }}</div>
              </div>
              <div class="text-center">
                <div class="text-xs font-semibold line-through">
                  {{ formatCurrency(product.productId.price * product.quantity * 1.25) }} VND
                </div>
                <div class="text-sm font-semibold text-danger">
                  {{ formatCurrency(product.productId.price * product.quantity) }} VND
                </div>
              </div>
              <div>
                <div class="text-xs">Quantity</div>
                <div class="flex items-center">
                  <el-icon
                    size="small"
                    class="cursor-pointer border-2 hover:!text-danger"
                    @click="handleDecreCartItem(product.productId._id)"
                  >
                    <i-ep-minus></i-ep-minus>
                  </el-icon>
                  <div class="w-5 text-center">{{ product.quantity }}</div>
                  <el-icon
                    size="small"
                    class="cursor-pointer border-2 hover:!text-success"
                    @click="handleIncreCartItem(product.productId._id)"
                  >
                    <i-ep-plus></i-ep-plus>
                  </el-icon>
                </div>
              </div>

              <div>
                <el-icon
                  size="large"
                  class="cursor-pointer hover:!text-danger"
                  @click="handleDeleteCartItem(product.productId._id)"
                >
                  <i-ep-delete-filled></i-ep-delete-filled>
                </el-icon>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="bg-white flex items-center justify-center rounded-md shadow-sm h-[600px]">
          <div class="w-1/2">
            <img src="/img/empty-cart.png" />
            <div class="text-center">Giỏ hàng của bạn chưa có sản phẩm nào, hãy mua ngay nhé!</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useFetchData } from '@thinkvn/composables'
import { getCart, updateCart, deleteCart, removeCart, destroyCart } from './services'
import { getPhotoUrl } from '@/utils'
import { useVisible } from '@thinkvn/composables'
import { useUserStore } from '@/store/user'
import { addOrderCustomer } from '.././order/services'
import { getAllShipment } from '.././shipment/services'
import { ElNotification } from 'element-plus'
import ButtonMain from '@/components/button-main.vue'
import { formatCurrency } from '@thinkvn/utils'

const step = ref(1)
const userStore = useUserStore()
const { visible, open, close } = useVisible()
const loading = ref(false)
const shipmentSelected = ref('')

watch(visible, val => {
  if (val) {
    step.value = 3
  } else {
    step.value = 2
  }
})

const shipmentValue = computed(() => {
  return shipments.value.find(ship => ship._id === shipmentSelected.value)
})

const { data, fetch, isFetching } = useFetchData(() => getCart(), { autoResetData: false })
fetch()

const { data: dataShipment, fetch: fetchShipment } = useFetchData(() => getAllShipment(), {
  autoResetData: false,
})

const cart = computed(() => data?.value?.data?.data)
const shipments = computed(() => dataShipment?.value?.data || [])
fetchShipment()

const handleIncreCartItem = async (productId: string) => {
  try {
    loading.value = true
    await updateCart(productId)
    fetch()
  } catch (e: any) {
    return ElNotification({
      title: 'Error',
      message: e?.response?.data?.message,
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const handleDecreCartItem = async (productId: string) => {
  try {
    loading.value = true
    await deleteCart(productId)
    fetch()
  } catch (e: any) {
    return ElNotification({
      title: 'Error',
      message: e?.response?.data?.message,
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const handleDeleteCartItem = async (productId: string) => {
  try {
    loading.value = true
    await removeCart(productId)
    fetch()
  } catch (e: any) {
    return ElNotification({
      title: 'Error',
      message: e?.response?.data?.message,
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const handleCheckout = async () => {
  try {
    loading.value = true
    await addOrderCustomer({
      orderDetail: cart.value.products.map(e => {
        return {
          productId: e.productId._id,
          quantity: e.quantity,
        }
      }),
      total: cart.value.total,
      shipment: shipmentSelected.value,
    })
    await userStore.getCartCount()
  } catch (e: any) {
    return ElNotification({
      title: 'Error',
      message: e?.response?.data?.message,
      type: 'error',
    })
  } finally {
    loading.value = false
    close()
  }

  try {
    loading.value = true
    await destroyCart(cart.value._id)
    fetch()
  } catch (e: any) {
    return ElNotification({
      title: 'Error',
      message: e?.response?.data?.message,
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<route>
{
  "name": "cart",
  "path": "/cart",
  "meta": {
    "layout": "home",
  }
}
</route>
