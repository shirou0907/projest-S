<template>
  <el-tabs v-model="activatedStatus">
    <el-tab-pane v-for="(tab, index) in statusSorts" :key="index" :name="tab.id">
      <template #label>
        <div class="flex items-center space-x-1">
          <div>{{ tab.value.label }}</div>

          <el-tag size="small" :type="checkActiveTab(tab.id)">{{ tab.value.count }}</el-tag>
        </div>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFetchData } from '@thinkvn/composables'
import { pick } from '@thinkvn/utils'
import { ORDER_STATUS, ORDER_STATUS_DETAIL } from './constants'
import { getOrderCount } from './services'

const router = useRouter()
const route = useRoute()

const activatedStatus = ref((route.query.status || '') as string)

const checkActiveTab = (index: string | number) => {
  return activatedStatus.value == index ? '' : 'info'
}

const { data, fetch } = useFetchData(() => getOrderCount())
fetch()

const statusData = computed<any>(() => data.value?.data.data || [])

watch(activatedStatus, value => {
  if (value == '-1') {
    updateRouter('')
  } else {
    updateRouter(value)
  }
})

const statusFilters = computed(() => {
  const statusTabList = [
    ORDER_STATUS.TAT_CA,
    ORDER_STATUS.CHO_DUYET,
    ORDER_STATUS.DANG_XU_LY,
    ORDER_STATUS.DA_HUY,
    ORDER_STATUS.DA_HOAN_THANH,
  ] as unknown as string[]

  const statusFiltered = pick(ORDER_STATUS_DETAIL, ...statusTabList) as Record<
    string,
    { label: string; statusLabel: string; name: string; color: string; count: number }
  >

  for (const key in statusFiltered) {
    const value = statusFiltered[key]

    statusFiltered[key] = {
      ...value,
      count: statusData.value[value.name],
    }
  }

  return statusFiltered
})

const statusSorts = computed(() => {
  return Object.entries(statusFilters.value)
    .sort()
    .map(([key, value]) => {
      return { id: key, value: value }
    })
})

const updateRouter = (status: string) => {
  router.push({
    name: 'order-admin',
    query: {
      ...route.query,
      status: status,
      pageNum: 1,
    },
  })
  console.log(status)
}
</script>
