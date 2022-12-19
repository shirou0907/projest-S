<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useThemeStore } from './store/theme'
import { useLocalStorage } from '@vueuse/core'
import Cookies from 'js-cookie'

const router = useRouter()
const store = useUserStore()
const theme = useThemeStore()
const token = Cookies.get('token')
const role = useLocalStorage('role', 0)
const root = document.documentElement

nextTick(async () => {
  await theme.fetch()
  root.style.setProperty('--el-color-primary', theme.themes.lightMainColor!)
  root.style.setProperty('font-family', theme.themes.fontFamily!)
})

store.checkUser()
if (token) {
  store.getCartCount()
}

router.beforeEach(async (to, from, next) => {
  if (to.meta.admin) {
    console.log('admin', role.value)
    if (role.value === 1) {
      next()
    } else {
      next({ name: 'login-admin' })
    }
  } else {
    next()
  }
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.auth) {
    if (token) {
      console.log('auth')
      next()
    } else {
      next({ name: 'login' })
    }
  } else {
    next()
  }
})
</script>
