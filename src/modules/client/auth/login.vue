<template>
  <form class="flex flex-col space-y-4 h-full rounded-md py-5 px-10 shadow-lg border" @submit.prevent="onSubmit">
    <div>
      <span class="text-[32px] font-semibold text-primary-text">Sign in</span>
    </div>

    <base-input v-model="state.username" title="Email Number" name="email"></base-input>

    <base-input v-model="state.password" title="Password" type="password" name="password"></base-input>

    <div class="relative">
      <button
        v-loading="loading"
        class="h-[56px] p-4 w-full outline-none border border-divide-lighter rounded text-white bg-primary font-semibold"
        type="submit"
      >
        Sign in
      </button>
      <div class="text-xs text-primary mt-4 text-left cursor-pointer">Or sign in with social account</div>

      <div class="grid grid-cols-2 gap-4 mt-4">
        <div
          class="h-14 px-2 cursor-pointer rounded-md flex items-center space-x-2 bg-white"
          @click="store.loginWithGoogle"
        >
          <component :is="GoogleIcon"></component>
          <div class="text-sm">Google</div>
        </div>
        <div
          class="h-14 px-2 cursor-pointer rounded-md flex items-center space-x-2 bg-white"
          @click="store.loginWithFaceBook"
        >
          <component :is="FacebookIcon"></component>
          <div class="text-sm">Facebook</div>
        </div>
      </div>
    </div>

    <div class="border-t w-full"></div>

    <div class="text-sm text-primary-text text-center">Don't have an account?</div>

    <div
      class="h-[56px] p-4 w-full outline-none bg-white border border-divide-lighter rounded text-center cursor-pointer text-primary bg-divide-lighter font-semibold"
      @click="$router.push('/register')"
    >
      Sign up
    </div>
  </form>
</template>

<script lang="ts" setup>
import { markRaw, reactive, ref } from 'vue'
import { ElNotification } from 'element-plus'
import { useHead } from '@vueuse/head'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { getAllRules } from '@/utils'
import BaseInput from '@/components/base-input.vue'
import { useUserStore } from '@/store/user'
import GoogleIcon from '@/assets/google.svg'
import FacebookIcon from '@/assets/facebook.svg'

const store = useUserStore()

useHead({
  title: 'Đăng nhập',
})

const loading = ref(false)
const state = reactive({
  username: '',
  password: '',
})

const { email, password } = getAllRules()
const { handleSubmit } = useForm({
  validationSchema: markRaw(yup.object({ email, password })),
})

const checkInValid = () => {
  return ElNotification({ title: 'Lỗi', message: 'Vui lòng kiểm tra lại thông tin', type: 'error' })
}

const onSubmit = handleSubmit(async () => {
  try {
    loading.value = true
    await store.loginWithEmail({ email: state.username, password: state.password })
  } catch (e: any) {
    console.log(e)
  } finally {
    loading.value = false
  }
}, checkInValid)
</script>

<route>
  {
    "name": "login",
    "path": "/login",
    "meta": {
      "layout": "auth",
    }
  }
</route>
