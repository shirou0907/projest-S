<template>
  <div v-if="order" class="w-full h-full bg-[url('/img/asset_2.png')] bg-contain bg-no-repeat bg-center">
    <div class="flex p-8 pb-0">
      <div class="w-[44mm]">
        <div class="flex flex-col h-full">
          <component :is="LogoT"></component>
        </div>
      </div>
      <div class="flex-1 flex flex-col space-y-4 p-4">
        <div class="h-[10mm]">
          <base-barcode :value="order._id" class="w-[250px]"></base-barcode>
        </div>
        <div class="grid grid-cols-2 grid-rows-2 gap-2 text-sm">
          <div>Đơn vị vận chuyển:</div>
          <div>{{ order.shipment.carrieName }}</div>
          <div>Thanh toán:</div>
          <div>{{ order.shipment.paymentMethod }}</div>
        </div>
      </div>
    </div>
    <div class="flex p-8 h-[160mm] space-x-4 pt-0">
      <div class="w-[46mm] bg-slate-200 flex flex-col items-center justify-between p-1">
        <div class="h-[110mm] w-full p-2 flex flex-col space-y-4">
          <div class="text-sm">
            <div class="font-bold">Gửi từ:</div>
            <div>
              <div>Tùng Shop</div>
              <div>0379.000.0135</div>
            </div>

            <div class="mt-1">55 Giải Phóng, Hai Bà Trưng, Hà Nội</div>
          </div>
          <div class="text-sm">
            <div class="font-bold">Gửi đến:</div>
            <div>
              <div>{{ order.shipment.userName }}</div>
              <div>{{ order.shipment.userPhone }}</div>
            </div>

            <div class="mt-1">
              {{ order.shipment.wardName }}, {{ order.shipment.districtName }}, {{ order.shipment.provinceName }}
            </div>
          </div>
          <div class="text-sm">
            <div class="font-bold">Ghi chú:</div>
          </div>
        </div>
        <div class="font-bold p-2">
          <div class="text-sm">Ngày đặt hàng</div>
          <div class="text">{{ getLocalDate(order.createdAt) }}</div>
        </div>
      </div>
      <div class="flex-1 bg-[url('/img/asset_5.png')] bg-contain bg-center bg-no-repeat">
        <div class="h-[110mm]">
          <div class="text-4xl font-bold py-5">{{ btoa(order._id) }}</div>
          <div>
            <div>
              <div class="text-sm font-bold py-2">Nội dung hàng:</div>
              <div v-for="(item, i) in order.orderDetail" :key="i">
                <div class="text-sm">{{ i + 1 }}. {{ item.productId.name }} - Số lượng: {{ item.quantity }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="font-bold">
          <div class="text-md">Tiền thu</div>
          <div class="text-3xl">{{ formatCurrency(order.total) }} VND</div>
          <div class="text-md">Chữ kí người nhận</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { formatCurrency } from '@thinkvn/utils'
import { useFetchData } from '@thinkvn/composables'
import BaseBarcode from '@/components/base-barcode.vue'
import { getOrderById } from './services'
import { Buffer } from 'buffer'
import LogoT from '@/assets/logo.svg'
import { getLocalDate } from '@/utils'

useHead({
  title: 'In nhãn vận chuyển',
})

const route = useRoute()
const { id } = route.params

const { fetch, data } = useFetchData(() => getOrderById(id as string))

fetch()

const order = computed(() => data.value?.data?.data)

const btoa = (str: string) => {
  return Buffer.from(str).toString('base64').substring(0, 10)
}
</script>

<route>
{
  "name": "print-admin",
  "path": "/admin/print/:id",
  "meta": {
    "layout": "print"
  }
}
</route>
