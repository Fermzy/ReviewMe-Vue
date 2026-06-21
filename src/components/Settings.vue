<template>
  <main>
    <Navbar />

    <div style="padding: 40px 60px; max-width: 800px; margin: 0 auto;">

      <div style="margin-bottom: 40px;">
        <div class="eyebrow">Preferences</div>
        <h1 class="section-h2">Settings</h1>
        <p style="color: var(--muted); font-size: 0.9rem;">Choose how ReviewMe looks for you. Your choice is saved on this device.</p>
      </div>

      <div class="form-group">
        <label class="form-label">Theme</label>
        <div class="theme-grid">

          <div :class="['theme-card', currentTheme === 'classic' ? 'active' : '']" @click="setTheme('classic')">
            <div class="theme-swatch-row">
              <div class="theme-swatch" style="background:#f5f0e8;"></div>
              <div class="theme-swatch" style="background:#d63a2f;"></div>
              <div class="theme-swatch" style="background:#0f0e0c;"></div>
            </div>
            <div class="theme-card-name">Classic</div>
            <div class="theme-card-desc">Warm cream & red</div>
          </div>

          <div :class="['theme-card', currentTheme === 'slate' ? 'active' : '']" @click="setTheme('slate')">
            <div class="theme-swatch-row">
              <div class="theme-swatch" style="background:#eef1f5;"></div>
              <div class="theme-swatch" style="background:#3a6ea5;"></div>
              <div class="theme-swatch" style="background:#1c2128;"></div>
            </div>
            <div class="theme-card-name">Slate</div>
            <div class="theme-card-desc">Cool gray & blue</div>
          </div>

          <div :class="['theme-card', currentTheme === 'warm' ? 'active' : '']" @click="setTheme('warm')">
            <div class="theme-swatch-row">
              <div class="theme-swatch" style="background:#f3ead9;"></div>
              <div class="theme-swatch" style="background:#4f7a4a;"></div>
              <div class="theme-swatch" style="background:#2e2417;"></div>
            </div>
            <div class="theme-card-name">Warm</div>
            <div class="theme-card-desc">Soft tan & forest green</div>
          </div>

        </div>
      </div>

      <div class="form-group" style="margin-top:32px;">
        <label class="form-label">Mode</label>
        <div style="display:flex;gap:10px;">
          <div :class="['type-btn', !isDark ? 'active' : '']" @click="setMode(false)" style="flex:1;padding:14px;text-align:left;">
            <div style="font-size:0.85rem;font-weight:600;">Light</div>
          </div>
          <div :class="['type-btn', isDark ? 'active' : '']" @click="setMode(true)" style="flex:1;padding:14px;text-align:left;">
            <div style="font-size:0.85rem;font-weight:600;">Dark</div>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from './Navbar.vue'

const currentTheme = ref('classic')
const isDark = ref(false)

function setTheme(theme) {
  currentTheme.value = theme
  document.body.classList.remove('theme-classic', 'theme-slate', 'theme-warm')
  if (theme !== 'classic') {
    document.body.classList.add('theme-' + theme)
  }
  localStorage.setItem('reviewme-theme', theme)
}

function setMode(dark) {
  isDark.value = dark
  document.body.classList.toggle('dark', dark)
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('reviewme-theme') || 'classic'
  currentTheme.value = savedTheme
  if (savedTheme !== 'classic') {
    document.body.classList.add('theme-' + savedTheme)
  }
  isDark.value = localStorage.getItem('theme') === 'dark'
})
</script>

<style scoped>
.type-btn{padding:12px 8px;text-align:center;border:1.5px solid var(--border);border-radius:4px;cursor:pointer;transition:all 0.2s;background:var(--surface);font-family:var(--ff-body);font-size:0.8rem;font-weight:500;}
.type-btn:hover,.type-btn.active{border-color:var(--red);background:rgba(214,58,47,0.06);color:var(--red);}
</style>