<template>
  <button-main @click="open()">Thêm địa chỉ nhận hàng</button-main>

  <teleport to="body">
    <el-dialog v-model="visible" title="Thêm địa chỉ nhận hàng" width="720px" :before-close="handleClose">
      <div class="">
        <div class="p-5 rounded-md border bg-white">
          <div class="text-lg font-bold mb-4">Thông tin liên hệ</div>

          <div class="flex justify-between">
            <div class="space-y-2">
              <div class="text-sm font-semibold">Tên người nhận</div>
              <el-input
                v-model="state.userName"
                size="large"
                class="!w-[300px]"
                placeholder="Tên người nhận"
              ></el-input>
            </div>

            <div class="space-y-2">
              <div class="text-sm font-semibold">Số điện thoại</div>
              <el-input
                v-model="state.userPhone"
                size="large"
                class="!w-[300px]"
                placeholder="Số điện thoại người nhận"
              ></el-input>
            </div>
          </div>
        </div>

        <div class="p-5 rounded-md border bg-white mt-5">
          <div class="text-lg font-bold mb-4">Địa chỉ</div>

          <div class="flex justify-between">
            <div class="space-y-2">
              <div class="space-y-2">
                <div class="text-sm font-semibold">Tỉnh / Thành phố</div>
                <el-select
                  v-model="state.provinceName"
                  v-loading="isFetching"
                  filterable
                  size="large"
                  class="!w-[300px]"
                  placeholder="Tỉnh / Thành phố"
                >
                  <el-option
                    v-for="(item, index) in Object.entries(provinces).map(e => e[0])"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </div>

              <div class="space-y-2">
                <div class="text-sm font-semibold">Quận / Huyện</div>
                <el-select
                  v-model="state.districtName"
                  v-loading="isFetchDistrict"
                  filterable
                  size="large"
                  class="!w-[300px]"
                  placeholder="Quận / Huyện"
                >
                  <el-option v-for="(item, index) in districts" :key="index" :label="item.name" :value="item.name" />
                </el-select>
              </div>
            </div>

            <div class="space-y-2">
              <div class="space-y-2">
                <div class="text-sm font-semibold">Phường / Xã</div>
                <el-select
                  v-model="state.wardName"
                  filterable
                  size="large"
                  class="!w-[300px]"
                  placeholder="Xã / Phường"
                >
                  <el-option v-for="(item, index) in ward" :key="index" :label="item.name" :value="item.name" />
                </el-select>
              </div>

              <div class="space-y-2">
                <div class="text-sm font-semibold">Địa chỉ</div>
                <el-input
                  v-model="state.address"
                  size="large"
                  class="!w-[300px]"
                  placeholder="Số nhà, tòa nhà, đường, khu vực"
                ></el-input>
              </div>

              <div>Ví dụ: 1205 E1, Gold Park, 122, Phố Trung Kính</div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer flex justify-end space-x-2">
          <button-main class="bg-[#ccc]" @click="close()">Hủy</button-main>
          <button-main :loading="loading" type="primary" :disabled="!isFullFill" @click="handleAddShipment()">
            Thêm
          </button-main>
        </span>
      </template>
    </el-dialog>
  </teleport>
</template>

<script lang="ts" setup>
import { useVisible } from '@thinkvn/composables'
import { reactive, ref, computed, watch } from 'vue'
import { ShipmentParams } from './types'
import { useUserStore } from '@/store/user'
import { getProvince, getDistrict, addShipment } from './services'
import { useFetchData } from '@thinkvn/composables'
import { ElNotification } from 'element-plus'
import ButtonMain from '@/components/button-main.vue'

const emit = defineEmits<{ (e: 'added'): void }>()

const { visible, open, close } = useVisible()
const userStore = useUserStore()

const { data, isFetching, fetch } = useFetchData(() => getProvince())
fetch()

const path = computed(() => {
  return provinces.value[state.provinceName]?.file_path.split('/').slice(1).join('/') || ''
})

const {
  data: districtData,
  isFetching: isFetchDistrict,
  fetch: fetchDistrict,
} = useFetchData(() => getDistrict(path.value))

const provinces = computed(() => data?.value?.data || [])
const districts = computed(() => districtData?.value?.data?.district || [])
const ward = computed(() => {
  return districts.value.find(item => item.name === state.districtName)?.ward || []
})

const state = reactive<ShipmentParams>({
  userId: userStore?.customer?.uid || '',
  userName: '',
  userPhone: '',
  address: '',
  wardName: '',
  districtName: '',
  provinceName: '',
})

const isFullFill = computed(() => {
  return (
    state.userName.length > 0 &&
    state.userPhone.length > 0 &&
    state.address.length > 0 &&
    state.wardName.length > 0 &&
    state.districtName.length > 0 &&
    state.provinceName.length > 0
  )
})

const loading = ref(false)
const handleAddShipment = async () => {
  try {
    loading.value = true
    await addShipment(state)
    emit('added')
    close()
  } catch (e: any) {
    ElNotification({
      title: 'Lỗi',
      message: e?.response?.data?.status?.message,
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

watch(
  () => state.provinceName,
  () => {
    state.districtName = ''
    state.wardName = ''
    fetchDistrict()
  }
)

const handleClose = (done: () => void) => {
  done()
  close()
}
</script>
