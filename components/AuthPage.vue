<template>
  <main class="auth-page">
    <Navbar />
    <div class="auth-wrap">
      <div class="auth-card">

        <!-- Mode toggle -->
        <div class="auth-toggle">
          <button :class="{ active: mode === 'login' }" @click="mode = 'login'">Log In</button>
          <button :class="{ active: mode === 'signup' }" @click="mode = 'signup'">Sign Up</button>
        </div>

        <!-- Signup -->
        <div v-if="mode === 'signup'">
          <div class="auth-heading">
            <div class="eyebrow">Get started</div>
            <h1>Create your account</h1>
            <p>Free forever. No credit card needed.</p>
          </div>
          <div v-if="error" class="auth-error">{{ error }}</div>
          <div v-if="success" class="auth-success">
            Check your email — we sent a confirmation link to <strong>{{ email }}</strong>
          </div>
          <div v-if="!success">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input class="form-input" v-model="name" type="text" placeholder="Your name" />
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input class="form-input" v-model="email" type="email" placeholder="you@example.com" />
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input class="form-input" v-model="password" type="password" placeholder="At least 6 characters" />
            </div>
            <button class="btn-main" style="width:100%" @click="handleSignup" :disabled="loading">
              {{ loading ? 'Creating account...' : 'Create Account →' }}
            </button>
          </div>
        </div>

        <!-- Login -->
        <div v-if="mode === 'login'">
          <div class="auth-heading">
            <div class="eyebrow">Welcome back</div>
            <h1>Log in to ReviewMe</h1>
          </div>
          <div v-if="error" class="auth-error">{{ error }}</div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input class="form-input" v-model="email" type="email" placeholder="you@example.com" />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input class="form-input" v-model="password" type="password" placeholder="Your password" />
          </div>
          <button class="btn-main" style="width:100%" @click="handleLogin" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Log In →' }}
          </button>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../supabase'
import Navbar from './Navbar.vue'

const router = useRouter()
const route = useRoute()
const mode = ref(route.query.mode === 'signup' ? 'signup' : 'login')
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleSignup() {
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: { data: { full_name: name.value } }
  })
  if (err) { error.value = err.message; loading.value = false; return }
  success.value = true
  loading.value = false
}

async function handleLogin() {
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  if (err) { error.value = err.message; loading.value = false; return }
  router.push('/dashboard')
}
</script>

<style scoped>
.auth-page { min-height: 100vh; background: var(--paper); }
.auth-wrap { display: flex; align-items: center; justify-content: center; padding: 60px 20px; }
.auth-card { width: 100%; max-width: 440px; }
.auth-toggle { display: flex; gap: 0; margin-bottom: 32px; border: 1.5px solid var(--border); border-radius: 4px; overflow: hidden; }
.auth-toggle button { flex: 1; padding: 10px; background: transparent; border: none; cursor: pointer; font-family: var(--ff-mono); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); transition: all 0.2s; }
.auth-toggle button.active { background: var(--ink); color: var(--paper); }
.auth-heading { margin-bottom: 28px; }
.auth-heading h1 { font-family: var(--ff-display); font-size: 1.8rem; font-weight: 900; margin-bottom: 6px; }
.auth-heading p { color: var(--muted); font-size: 0.88rem; }
.auth-error { background: rgba(214,58,47,0.08); border: 1px solid rgba(214,58,47,0.3); border-radius: 4px; padding: 12px 16px; margin-bottom: 20px; font-family: var(--ff-mono); font-size: 0.78rem; color: var(--red); }
.auth-success { background: rgba(46,107,79,0.08); border: 1px solid rgba(46,107,79,0.3); border-radius: 4px; padding: 16px; margin-bottom: 20px; font-size: 0.88rem; color: #2e6b4f; line-height: 1.6; }
</style>