import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '', redirect: '/write' },
    {
      path: '',
      name: 'Dashboard',
      component: Layout,
      children: [{
        path: 'write',
        name: 'write',
        meta: { title: '作文精批', showTab: true },
        component: () => import('@/views/write')
      }, {
        path: 'write/edit/:id',
        name: 'write-edit',
        meta: { title: '写作' },
        component: () => import('@/views/write/edit')
      }, {
        path: 'write/result/:id',
        name: 'write-result',
        meta: { title: '写作' },
        component: () => import('@/views/write/result')
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  // 修改页面title值
  // if (to.meta.title) {
  //   document.title = to.meta.title
  // }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
