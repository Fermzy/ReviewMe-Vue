import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from './supabase'

import LandingPage from './components/LandingPage.vue'
import AuthPage from './components/AuthPage.vue'
import BrowsePage from './components/BrowsePage.vue'
import Dashboard from './components/Dashboard.vue'
import AdminPanel from './components/AdminPanel.vue'
import WorkDetail from './components/WorkDetail.vue'
import Settings from './components/Settings.vue'
const ADMIN_ID = '71070f28-a0e2-41a3-bea4-8c900d796587'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/auth', component: AuthPage },
  { path: '/browse', component: BrowsePage },
  { path: '/work/:id', component: WorkDetail },
  { path: '/settings', component: Settings },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminPanel, meta: { requiresAuth: true, requiresAdmin: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return '/auth'
    if (to.meta.requiresAdmin && session.user.id !== ADMIN_ID) return '/dashboard'
  }
})

export default router