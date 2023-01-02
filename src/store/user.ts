import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  updateProfile,
  signOut,
  updatePassword,
} from '@firebase/auth'
import { auth } from '@/utils'
import { ElNotification } from 'element-plus'
import type { User } from 'firebase/auth'
import { useLocalStorage } from '@vueuse/core'
import { login } from '@/modules/client/auth/services'
import { loginAdmin } from '@/modules/admin/auth/services'
import Cookies from 'js-cookie'
import { countCart } from '@/modules/client/cart/services'

interface LoginEmail {
  email: string
  password: string
  name: string
}

export const useUserStore = defineStore('customer', () => {
  const customer = ref<User | null>()
  const cartCount = ref<number>(0)

  const localStorageToken = useLocalStorage('token', '')
  const localStorageRole = useLocalStorage('role', 0)

  const checkUser = async () => {
    onAuthStateChanged(auth, async user => {
      if (user) {
        customer.value = user
      } else {
        console.log('setLogin', false)
      }
    })
  }

  const register = async (data: LoginEmail) => {
    try {
      const { name, email, password } = data
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      if (user) {
        await updateProfile(user, {
          displayName: name,
          photoURL: 'https://img.icons8.com/wired/64/undefined/walter-white.png',
        })
      }
    } catch (error: any) {
      if (error.response) {
        ElNotification({
          title: 'Error',
          message: error.response.data,
          type: 'error',
        })
      } else if (error.request) {
        ElNotification({
          title: 'Error',
          message: error.request,
          type: 'error',
        })
      } else {
        ElNotification({
          title: 'Error',
          message: error.message,
          type: 'error',
        })
      }
    }
  }

  const loginWithEmailForAdmin = async (data: Omit<LoginEmail, 'name'>) => {
    try {
      const { email, password } = data
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      if (user) {
        customer.value = user
      }
    } catch (error: any) {
      return ElNotification({
        title: 'Lỗi',
        message: 'Tên tài khoản hoặc mật khẩu không chính xác, vui lòng xem lại!',
        type: 'error',
      })
    }

    try {
      const result = await loginAdmin(customer.value)
      if (result.data) {
        Cookies.set('token', result.data.token)
        localStorageToken.value = result.data.token
        localStorageRole.value = 1
        window.location.href = '/admin/home'
      }
    } catch (error: any) {
      ElNotification({
        title: 'Lỗi',
        message: error?.response?.data?.message,
        type: 'error',
      })
    }
  }

  const loginWithEmail = async (data: Omit<LoginEmail, 'name'>) => {
    try {
      const { email, password } = data
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      if (user) {
        customer.value = user
      }
    } catch (error: any) {
      console.log(error)
      return ElNotification({
        title: 'Lỗi',
        message: 'Tên tài khoản hoặc mật khẩu không chính xác, vui lòng xem lại!',
        type: 'error',
      })
    }

    try {
      const result = await login(customer.value)
      if (result.data) {
        Cookies.set('token', result.data.token)
        localStorageToken.value = result.data.token
        window.location.href = '/'
      }
    } catch (error) {
      console.log(error)
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      console.log(token)
      // The signed-in user info.
      customer.value = result.user
      const { data } = await login(customer.value)
      if (data) {
        Cookies.set('token', data.token)
        localStorageToken.value = data.token
        window.location.href = '/'
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const loginWithFaceBook = async () => {
    try {
      const provider = new FacebookAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const credential = FacebookAuthProvider.credentialFromResult(result)
      const accessToken = credential?.accessToken
      console.log(accessToken)
      customer.value = result.user
      const { data } = await login(customer.value)
      if (data) {
        Cookies.set('token', data.token)
        localStorageToken.value = data.token
        window.location.href = '/'
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleChangePassword = async (password: string) => {
    try {
      const user = auth.currentUser
      try {
        if (user) await updatePassword(user, password)
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const logout = async () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        customer.value = null
        localStorageToken.value = null
        localStorageRole.value = 0
        Cookies.remove('token')
        window.location.href = '/'
      })
      .catch(error => {
        console.error('error', error.message)
      })
  }

  const getCartCount = async () => {
    const { data } = await countCart()
    if (data) {
      cartCount.value = data.data
    }
  }

  return {
    customer,
    cartCount,
    getCartCount,
    checkUser,
    register,
    loginWithGoogle,
    loginWithFaceBook,
    loginWithEmail,
    loginWithEmailForAdmin,
    handleChangePassword,
    logout,
  }
})
