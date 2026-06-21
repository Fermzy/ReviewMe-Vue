<template>
  <nav>
    <div class="nav-logo" @click="router.push('/')">Review<em>Me</em></div>
    <div class="nav-links" v-if="!isMobile">
      <button class="nav-btn" @click="router.push('/browse')">Browse</button>
      <button class="nav-btn" @click="router.push('/settings')">Settings</button>
      <!-- Dark mode toggle -->
      <button class="nav-btn icon-btn" @click="toggleDark" :title="isDark ? 'Switch to Light' : 'Switch to Dark'">
        <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      </button>
      <template v-if="user">
        <button class="nav-btn" @click="handleLogout">Log Out</button>
        <button class="nav-btn primary" @click="router.push('/dashboard')">Dashboard</button>
      </template>
      <template v-else>
        <button class="nav-btn" @click="router.push('/auth')">Log In</button>
        <button class="nav-btn primary" @click="router.push('/auth?mode=signup')">Sign Up Free</button>
      </template>
    </div>
    <div style="display:flex;align-items:center;gap:8px;" v-if="isMobile">
      <!-- Dark mode toggle on mobile too -->
      <button class="nav-btn icon-btn" @click="toggleDark">
        <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      </button>
      <button class="nav-hamburger" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="nav-mobile" :class="{ open: menuOpen }" v-if="isMobile">
      <button class="nav-btn" @click="navigate('/browse')">Browse</button>
      <button class="nav-btn" @click="navigate('/settings')">Settings</button>
      <template v-if="user">
        <button class="nav-btn" @click="handleLogout">Log Out</button>
        <button class="nav-btn primary" @click="navigate('/dashboard')">Dashboard</button>
      </template>
      <template v-else>
        <button class="nav-btn" @click="navigate('/auth')">Log In</button>
        <button class="nav-btn primary" @click="navigate('/auth?mode=signup')">Sign Up Free</button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const router = useRouter()
const user = ref(null)
const menuOpen = ref(false)
const isMobile = ref(window.innerWidth <= 768)
const isDark = ref(false)

function handleResize() { isMobile.value = window.innerWidth <= 768 }

function toggleDark() {
  isDark.value = !isDark.value
  document.body.classList.toggle('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  window.addEventListener('resize', handleResize)

  if (localStorage.getItem('theme') === 'dark') {
    isDark.value = true
    document.body.classList.add('dark')
  }

  supabase.auth.getSession().then(({ data: { session } }) => {
    user.value = session?.user ?? null
  })
  supabase.auth.onAuthStateChange((_, session) => {
    user.value = session?.user ?? null
  })
})

onUnmounted(() => window.removeEventListener('resize', handleResize))

function navigate(path) { menuOpen.value = false; router.push(path) }

async function handleLogout() {
  await supabase.auth.signOut()
  router.push('/')
}
</script>