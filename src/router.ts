import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'

const routes = setupLayouts(generatedRoutes)

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from) {
    if (to.name === 'home' && from.name === 'home') return
    return {
      behavior: 'smooth',
      top: 0,
    }
  },
})
