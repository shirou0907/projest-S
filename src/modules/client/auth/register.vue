<template>
  <form class="flex flex-col space-y-4 h-full rounded-md py-5 px-10 shadow-lg border" @submit.prevent="onSubmit">
    <div>
      <span class="text-[32px] font-semibold text-primary-text">Create new account</span>
    </div>
    <base-input v-model="state.name" title="Name" name="fullName"></base-input>

    <base-input v-model="state.username" title="Email" name="email"></base-input>

    <base-input v-model="state.password" title="Password" type="password" name="password"></base-input>

    <div class="relative">
      <button
        v-loading="loading"
        class="h-[56px] p-4 w-full outline-none border border-divide-lighter rounded text-white bg-primary font-semibold"
        type="submit"
      >
        Register
      </button>
    </div>

    <div class="border-t w-full"></div>

    <div
      class="h-[56px] p-4 w-full outline-none bg-white border border-divide-lighter rounded text-center cursor-pointer text-primary bg-divide-lighter font-semibold"
      @click="$router.push('/login')"
    >
      Back to Login
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
const store = useUserStore()
useHead({
  title: 'Đăng nhập',
})

const loading = ref(false)
const state = reactive({
  name: '',
  username: '',
  password: '',
})

const { email, password, fullName } = getAllRules()
const { handleSubmit } = useForm({
  validationSchema: markRaw(yup.object({ email, password, fullName })),
})

const checkInValid = () => {
  return ElNotification({ title: 'Lỗi', message: 'Vui lòng kiểm tra lại thông tin', type: 'error' })
}

const onSubmit = handleSubmit(async () => {
  try {
    loading.value = true
    await store.register({ name: state.name, email: state.username, password: state.password })
  } catch (e: any) {
    console.log(e)
  } finally {
    loading.value = false
  }
}, checkInValid)
</script>

<route>
  {
    "name": "register",
    "path": "/register",
    "meta": {
      "layout": "auth",
    }
  }
</route>
