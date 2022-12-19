<template>
  <div class="pt-6 space-y-6 min-h-screen">
    <section class="w-full">
      <div
        class="w-full rounded-md h-[360px] !bg-cover !bg-top !bg-no-repeat"
        :style="{ background: `url('${getPhotoUrl(themeStore.themes.bannerTop)}')` }"
      ></div>
    </section>

    <div class="w-full cursor-grab rounded-md overflow-hidden">
      <slide-infinity :photos="themeStore.themes.slideImages"></slide-infinity>
    </div>

    <section id="product-home" class="w-full min-h-screen">
      <home-vue></home-vue>
    </section>

    <section class="w-full">
      <div
        class="w-full rounded-md h-[360px] !bg-cover !bg-top !bg-no-repeat"
        :style="{ background: `url('${getPhotoUrl(themeStore.themes.bannerBottom)}')` }"
      ></div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store/theme'
import { getPhotoUrl } from '@/utils'
import HomeVue from './home/index.vue'
import slideInfinity from '@/components/slide-infinity.vue'

const themeStore = useThemeStore()
</script>

<route>
{
  "name": "home",
  "path": "/",
  "meta": {
    "layout": "home",
  }
}
  </route>
