<template>
  <nav>
    <div class="nav-logo" @click="router.push('/')">Review<em>Me</em></div>
    <div class="nav-links" v-if="!isMobile">
      <button class="nav-btn" @click="router.push('/browse')">Browse</button>
      <template v-if="user">
        <button class="nav-btn" @click="handleLogout">Log Out</button>
        <button class="nav-btn primary" @click="router.push('/dashboard')">Dashboard</button>
      </template>
      <template v-else>
        <button class="nav-btn" @click="router.push('/auth')">Log In</button>
        <button class="nav-btn primary" @click="router.push('/auth?mode=signup')">Sign Up Free</button>
      </template>
    </div>
    <button class="nav-hamburger" @click="menuOpen = !menuOpen" v-if="isMobile">
      <span></span><span></span><span></span>
    </button>
    <div class="nav-mobile" :class="{ open: menuOpen }" v-if="isMobile">
      <button class="nav-btn" @click="navigate('/browse')">Browse</button>
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

function handleResize() { isMobile.value = window.innerWidth <= 768 }
onMounted(() => {
  window.addEventListener('resize', handleResize)
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