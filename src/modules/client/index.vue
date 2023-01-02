<template>
  <div class="pt-6 space-y-6 min-h-screen">
    <section class="w-full">
      <div
        class="w-full rounded-md h-[360px] !bg-cover !bg-top !bg-no-repeat"
        :style="{ background: `url('${getPhotoUrl(themeStore.themes.bannerTop)}')` }"
      ></div>
    </section>

    <section>
      <div class="text-2xl font-semibold mb-5">Mẫu sản phẩm 3D</div>
      <div class="flex gap-3 h-[560px]">
        <three-scene :x="0.2" :y="0.5" :z="2" :model="'/3d/1.glb'" :background="'#f0f2f5'" class="w-1/2"></three-scene>
        <three-scene :x="1" :y="40" :z="130" :model="'/3d/3.glb'" :background="'#f0f2f5'" class="w-1/2"></three-scene>
      </div>
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
import ThreeScene from './components/three.vue'

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
