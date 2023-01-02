<template>
  <div class="product-gallery flex gap-7 w-full h-[700px]">
    <div class="w-[20%]">
      <swiper
        direction="vertical"
        :space-between="12"
        :slides-per-view="6"
        :free-mode="false"
        :watch-slides-progress="true"
        :modules="modules"
        class="swiper1 w-full h-full"
        @swiper="setThumbsSwiper"
      >
        <swiper-slide v-for="(photo, index) in photos" :key="index">
          <img class="absolute w-full h-full object-contain" :src="getPhotoUrl(photo)" />
        </swiper-slide>
      </swiper>
    </div>
    <div class="w-[80%] h-fit">
      <swiper :space-between="10" :zoom="true" :thumbs="{ swiper: thumbsSwiper }" :modules="modules">
        <swiper-slide v-for="(photo, index) in photos" :key="index" class="overflow-hidden">
          <div class="image-slide relative w-full h-[660px]">
            <img class="img-slide w-full h-full object-cover pointer-events-none" :src="getPhotoUrl(photo)" />
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Thumbs, Zoom } from 'swiper'
import { getPhotoUrl } from '@/utils'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import 'swiper/css/zoom'

const modules = [FreeMode, Thumbs, Zoom]
const thumbsSwiper = ref(null)

defineProps<{
  photos: string[]
}>()

const setThumbsSwiper = (swiper: any) => {
  thumbsSwiper.value = swiper
}

nextTick(() => {
  const images = document.querySelectorAll('.image-slide')
  images.forEach(element => {
    if (!(element instanceof HTMLElement)) {
      return
    }
    let x: number, y: number, width: number, height: number
    element.onmouseenter = () => {
      const size = element.getBoundingClientRect()

      x = size.x
      y = size.y
      width = size.width
      height = size.height
    }

    element.onmousemove = e => {
      const horizontal = ((e.clientX - x) / width) * 100
      const vertical = ((e.clientY - y) / height) * 100

      element.style.setProperty('--x', horizontal + '%')
      element.style.setProperty('--y', vertical + '%')
    }
  })
})
</script>
<style lang="scss">
.img-slide {
  position: relative;
  width: 100%;
  height: 100%;

  transform: scale(var(--zoom, 1));
  transform-origin: var(--x) var(--y);
  transition: transform 0.4s ease-in-out;
}
.image-slide:hover {
  --zoom: 1.3;
  cursor: zoom-in;
}
</style>
