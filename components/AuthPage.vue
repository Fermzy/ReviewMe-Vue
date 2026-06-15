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
            <!-- Google Button -->
            <button class="btn-google" @click="handleGoogleLogin">
              <svg width="18" height="18" viewBox="0 0 24 24" style="margin-right:10px;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <div class="divider-row">
              <div class="divider-line"></div>
              <span class="divider-text">OR</span>
              <div class="divider-line"></div>
            </div>
            <!-- Email/Password -->
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
          <!-- Google Button -->
          <button class="btn-google" @click="handleGoogleLogin">
            <svg width="18" height="18" viewBox="0 0 24 24" style="margin-right:10px;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <div class="divider-row">
            <div class="divider-line"></div>
            <span class="divider-text">OR</span>
            <div class="divider-line"></div>
          </div>
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
import { ref } from 'vue'
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

async function handleGoogleLogin() {
  const { error: err } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/dashboard' }
  })
  if (err) error.value = err.message
}

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
.btn-google { display: flex; align-items: center; justify-content: center; width: 100%; background: white; color: #3c4043; border: 1.5px solid var(--border); padding: 12px 24px; border-radius: 4px; font-family: var(--ff-body); font-weight: 500; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.08); margin-bottom: 20px; }
.btn-google:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.divider-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.divider-line { flex: 1; height: 1px; background: var(--border); }
.divider-text { font-family: var(--ff-mono); font-size: 0.68rem; color: var(--muted); }
</style>
