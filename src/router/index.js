import Vue from 'vue'
import Router from 'vue-router'

import univsPage from '../pages/univs.vue'
import matchPage from '../pages/match.vue'

Vue.use(Router)

const router = new Router({
  root: '/',
  routes:
  [
    {
      path: '/univs',
      name: 'univs',
      component: univsPage
    },
    {
      path: '/match',
      name: 'match',
      component: matchPage
    },
    {
      path: '/',
      redirect: '/univs'
    }
  ]
})

export default router
