<template>
  <div class="h-screen flex items-center justify-center !bg-cover !bg-no-repeat !bg-center bg-[url('/img/admin.jpg')]">
    <form
      class="opacity-[95] flex flex-col space-y-6 w-1/3 bg-white p-10 shadow-md rounded-md"
      @submit.prevent="onSubmit"
    >
      <div class="flex items-center space-x-3 justify-center">
        <el-icon class="!text-3xl">
          <i-ep-lock></i-ep-lock>
        </el-icon>
        <span class="text-3xl font-semibold text-primary-text">Admin System</span>
      </div>

      <base-input v-model="state.email" title="Email" name="email"></base-input>

      <base-input v-model="state.password" title="Password" type="password" name="password"></base-input>

      <div class="relative">
        <button
          v-loading="loading"
          class="h-[56px] p-4 w-full outline-none border border-divide-lighter rounded text-white bg-primary font-semibold"
          type="submit"
        >
          Login to admin
        </button>
      </div>
    </form>
  </div>
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
  email: '',
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
    await store.loginWithEmailForAdmin({ email: state.email, password: state.password })
  } catch (e: any) {
    console.log(e)
  } finally {
    loading.value = false
  }
}, checkInValid)
</script>

<route>
  {
    "name": "login-admin",
    "path": "/admin/login",
    "meta": {
      "layout": "mockup",
    }
  }
</route>
