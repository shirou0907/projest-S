import { computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isArray, isNumeric, toArray } from '@thinkvn/utils'
import type { Ref } from 'vue'

export function useRouteQuery<T extends null | undefined | string | string[] | number | number[]>(
  name: string,
  defaultValue?: T
): Ref<T>
export function useRouteQuery<T extends string | string[]>(name: string, defaultValue?: T) {
  const router = useRouter()
  const route = useRoute()

  return computed<T>({
    get() {
      let data: any = route.query[name]

      if (data == null) return defaultValue as T

      if (isNumeric(data)) {
        data = Number(data) as unknown as T
      }

      if (isArray(defaultValue)) {
        data = toArray(data).map(item => (isNumeric(item) ? Number(item) : item))
      }

      return data as unknown as T
    },
    set(v) {
      nextTick(() => {
        router.push({ query: { ...route.query, [name]: v === defaultValue || v === null ? undefined : v } })
      })
    },
  })
}
