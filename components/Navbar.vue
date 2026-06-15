<template>
  <nav class="navbar">
    <!-- Logo -->
    <div class="nav-logo" @click="router.push('/')">Review<em>Me</em></div>

    <!-- Pinterest-style center search -->
    <div class="nav-search" @click="focusSearch">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input ref="searchInput" class="nav-search-input" placeholder="Search photos, critics, genres…" />
    </div>

    <!-- Right side actions -->
    <div class="nav-right">
      <!-- Theme picker -->
      <div class="theme-picker">
        <button class="theme-toggle" @click="themeOpen = !themeOpen" title="Change theme">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20V2z" fill="currentColor" opacity="0.15"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
        </button>
        <div class="theme-dropdown" v-if="themeOpen">
          <div class="theme-dropdown-label">Theme</div>
          <div class="theme-options">
            <button
              v-for="t in themes" :key="t.name"
              class="theme-swatch"
              :class="{ active: currentTheme === t.name }"
              :style="{ background: t.preview }"
              :title="t.label"
              @click="applyTheme(t.name)"
            ></button>
          </div>
        </div>
      </div>

      <button class="nav-icon-btn" @click="router.push('/browse')" title="Browse">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
      </button>

      <button class="nav-icon-btn" @click="router.push('/dashboard')" title="Dashboard">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </button>

      <button class="nav-pill-btn" @click="router.push('/auth')">Submit Work</button>
    </div>
  </nav>

  <!-- Click outside to close theme picker -->
  <div v-if="themeOpen" class="theme-backdrop" @click="themeOpen = false"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchInput = ref(null)
const themeOpen = ref(false)
const currentTheme = ref('default')

const themes = [
  { name: 'default',  label: 'Cream & Red',    preview: 'linear-gradient(135deg, #f5f0e8 50%, #d63a2f 50%)' },
  { name: 'midnight', label: 'Midnight',        preview: 'linear-gradient(135deg, #0f0e0c 50%, #e0b04a 50%)' },
  { name: 'forest',   label: 'Forest',          preview: 'linear-gradient(135deg, #1a2e1a 50%, #6db36d 50%)' },
  { name: 'ocean',    label: 'Ocean',           preview: 'linear-gradient(135deg, #0d1b2a 50%, #3a86c8 50%)' },
  { name: 'blush',    label: 'Blush',           preview: 'linear-gradient(135deg, #fdf0f0 50%, #c0687a 50%)' },
  { name: 'slate',    label: 'Slate',           preview: 'linear-gradient(135deg, #f0f2f5 50%, #4a5568 50%)' },
]

const themeVars = {
  default: {
    '--paper': '#f5f0e8', '--ink': '#0f0e0c', '--red': '#d63a2f',
    '--red-dark': '#a82a21', '--surface': '#fdfcf8', '--border': '#e2ddd4',
    '--muted': '#8a8278', '--cream': '#ede8df', '--gold': '#c8952a',
  },
  midnight: {
    '--paper': '#0f0e0c', '--ink': '#f0ece3', '--red': '#e0b04a',
    '--red-dark': '#b8882e', '--surface': '#1a1816', '--border': '#2e2b26',
    '--muted': '#7a7468', '--cream': '#1e1c18', '--gold': '#e0b04a',
  },
  forest: {
    '--paper': '#1a2e1a', '--ink': '#e8f0e8', '--red': '#6db36d',
    '--red-dark': '#4a8a4a', '--surface': '#1e341e', '--border': '#2a402a',
    '--muted': '#7a9a7a', '--cream': '#223022', '--gold': '#a8cc6a',
  },
  ocean: {
    '--paper': '#0d1b2a', '--ink': '#e0eaf5', '--red': '#3a86c8',
    '--red-dark': '#2a6aa0', '--surface': '#111f30', '--border': '#1e2f42',
    '--muted': '#6a8aaa', '--cream': '#152234', '--gold': '#4ab8d8',
  },
  blush: {
    '--paper': '#fdf0f0', '--ink': '#2a1a1a', '--red': '#c0687a',
    '--red-dark': '#9a4a5a', '--surface': '#fff5f5', '--border': '#f0d8d8',
    '--muted': '#9a7878', '--cream': '#f8e8e8', '--gold': '#c89a4a',
  },
  slate: {
    '--paper': '#f0f2f5', '--ink': '#1a202c', '--red': '#4a5568',
    '--red-dark': '#2d3748', '--surface': '#f7f8fa', '--border': '#dde1e8',
    '--muted': '#718096', '--cream': '#e8eaee', '--gold': '#c8952a',
  },
}

function applyTheme(name) {
  currentTheme.value = name
  themeOpen.value = false
  const vars = themeVars[name]
  const root = document.documentElement
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
  localStorage.setItem('rm-theme', name)
}

function focusSearch() { searchInput.value?.focus() }

onMounted(() => {
  const saved = localStorage.getItem('rm-theme')
  if (saved && themeVars[saved]) applyTheme(saved)
})
</script>

<style scoped>
.navbar {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center; gap: 16px;
  padding: 10px 24px;
  background: var(--paper);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px);
}
.nav-logo {
  font-family: var(--ff-display); font-weight: 900;
  font-size: 1.3rem; letter-spacing: -0.02em;
  cursor: pointer; white-space: nowrap; flex-shrink: 0;
}
.nav-logo em { font-style: italic; color: var(--red); }

/* Pinterest-style pill search */
.nav-search {
  flex: 1; max-width: 560px; margin: 0 auto;
  display: flex; align-items: center; gap: 10px;
  background: var(--cream); border: 1.5px solid var(--border);
  border-radius: 24px; padding: 10px 18px;
  cursor: text; transition: border-color 0.2s, box-shadow 0.2s;
}
.nav-search:focus-within {
  border-color: var(--red);
  box-shadow: 0 0 0 3px rgba(214,58,47,0.08);
}
.nav-search svg { color: var(--muted); flex-shrink: 0; }
.nav-search-input {
  border: none; background: transparent; outline: none;
  font-family: var(--ff-body); font-size: 0.88rem;
  color: var(--ink); width: 100%;
}
.nav-search-input::placeholder { color: var(--muted); }

.nav-right {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
}
.nav-icon-btn {
  background: none; border: none; cursor: pointer;
  color: var(--muted); padding: 8px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.nav-icon-btn:hover { background: var(--cream); color: var(--ink); }

.nav-pill-btn {
  background: var(--red); color: white; border: none;
  padding: 9px 18px; border-radius: 24px;
  font-family: var(--ff-body); font-weight: 700;
  font-size: 0.82rem; cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  white-space: nowrap;
}
.nav-pill-btn:hover { background: var(--red-dark); transform: translateY(-1px); }

/* Theme picker */
.theme-picker { position: relative; }
.theme-toggle {
  background: none; border: none; cursor: pointer;
  color: var(--muted); padding: 8px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.theme-toggle:hover { background: var(--cream); color: var(--ink); }
.theme-dropdown {
  position: absolute; top: calc(100% + 10px); right: 0;
  background: var(--paper); border: 1.5px solid var(--border);
  border-radius: 12px; padding: 14px 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  z-index: 200; min-width: 180px;
}
.theme-dropdown-label {
  font-family: var(--ff-mono); font-size: 0.65rem;
  text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--muted); margin-bottom: 10px;
}
.theme-options { display: flex; gap: 8px; flex-wrap: wrap; }
.theme-swatch {
  width: 32px; height: 32px; border-radius: 50%;
  border: 2px solid transparent; cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;
}
.theme-swatch:hover { transform: scale(1.15); }
.theme-swatch.active { border-color: var(--ink); transform: scale(1.1); }
.theme-backdrop {
  position: fixed; inset: 0; z-index: 199;
}
</style>
