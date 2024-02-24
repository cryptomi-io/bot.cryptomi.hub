import { createRouter, createWebHistory } from 'vue-router'
import { routes, AUTH_ROUTES, GUEST_ROUTES } from '@/data/routes.js'
import { useUserStore } from './store/user'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { isAuth } = useUserStore()

  if (AUTH_ROUTES.find((item) => item.path === to.path) && !isAuth) {
    next('/welcome')
  } else if(isAuth && GUEST_ROUTES.find((item) => item.path === to.path)){
    next('/')
  }else{
    next()
  }
})
export default router
