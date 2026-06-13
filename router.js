import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from './supabase'

import LandingPage from './components/LandingPage.vue'
import AuthPage from './components/AuthPage.vue'
import BrowsePage from './components/BrowsePage.vue'
import Dashboard from './components/Dashboard.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/auth', component: AuthPage },
  { path: '/browse', component: BrowsePage },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Protect dashboard — redirect to auth if not logged in
router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return '/auth'
  }
})

export default router