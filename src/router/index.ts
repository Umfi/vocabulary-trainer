import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/list'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/list'
      },
      {
        path: 'list',
        component: () => import('@/views/VocablesPage.vue')
      },
      {
        path: 'list/:id',
        component: () => import('@/views/VocablesDetailPage.vue')
      },
      {
        path: 'practise',
        component: () => import('@/views/PractisePage.vue')
      },
      {
        path: 'practise/:id',
        component: () => import('@/views/PractisePage.vue')
      },
      {
        path: 'settings',
        component: () => import('@/views/SettingsPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
