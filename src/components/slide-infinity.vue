<template>
  <swiper
    :space-between="24"
    :loop="true"
    :slides-per-view="4"
    :slides-perview="1"
    :pagination="{
      clickable: true,
      type: 'bullets',
    }"
    :modules="modules"
    class="mySwiper"
    :autoplay="{
      delay: 1500,
      disableOnInteraction: false,
    }"
  >
    <swiper-slide v-for="(photo, index) in photos" :key="index">
      <img :src="getPhotoUrl(photo)" class="h-[360px] rounded-md" />
    </swiper-slide>
  </swiper>
</template>
<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper'
import { getPhotoUrl } from '@/utils'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

defineProps<{ photos: string[] }>()

const modules = [Pagination, Autoplay]
</script>
