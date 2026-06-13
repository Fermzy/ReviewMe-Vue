<template>
  <main>
    <Navbar />

    <div class="section">
      <div class="section-tag">Submissions</div>
      <h2 class="section-h2">Browse Works</h2>
      <p class="section-sub">Read-only. Sign up to submit your work or write a review.</p>

      <!-- FILTERS -->
      <div class="tag-row">
        <div :class="['tag', filter === 'all' ? 'active' : '']" @click="filter = 'all'">All</div>
        <div :class="['tag', filter === 'film' ? 'active' : '']" @click="filter = 'film'">Photography</div>
        <div :class="['tag', filter === 'design' ? 'active' : '']" @click="filter = 'design'">Design</div>
        <div :class="['tag', filter === 'writing' ? 'active' : '']" @click="filter = 'writing'">Writing</div>
        <div :class="['tag', filter === 'music' ? 'active' : '']" @click="filter = 'music'">Music</div>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="empty">Loading submissions...</div>

      <!-- EMPTY -->
      <div v-else-if="filteredWorks.length === 0" class="empty">
        No works submitted yet in this category.<br><br>
        <span style="color:var(--red);cursor:pointer;" @click="router.push('/auth?mode=signup')">Be the first to submit →</span>
      </div>

      <!-- WORKS WALL -->
      <div v-else class="review-wall">
        <div
          v-for="work in filteredWorks"
          :key="work.id"
          class="review-card"
          @click="openWork(work)"
        >
          <div class="review-card-header">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span class="card-type" :style="{ background: typeColors[work.type] || '#555' }">
                {{ typeLabels[work.type] || work.type }}
              </span>
              <span class="review-card-meta">{{ work.reviews?.length || 0 }} reviews</span>
            </div>
            <div class="review-card-title">{{ work.title }}</div>
            <div class="review-card-meta">{{ timeAgo(work.created_at) }}</div>
          </div>
          <div class="review-card-body">
            <div class="review-snippet">{{ work.description || 'No description provided.' }}</div>
            <div v-if="work.context" style="font-family:var(--ff-mono);font-size:0.7rem;color:var(--red);margin-bottom:12px;">
              ❓ {{ work.context }}
            </div>
            <a v-if="work.link" :href="work.link" target="_blank" style="font-family:var(--ff-mono);font-size:0.7rem;color:var(--red);" @click.stop>View Work ↗</a>
          </div>
          <div class="review-footer">
            <span class="review-card-meta">{{ work.reviews?.length > 0 ? 'Latest review available' : 'Be the first to review' }}</span>
            <button class="helpful-btn" @click.stop="requireAuth">Review →</button>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer>
      <div class="footer-bottom">
        <span>© 2025 ReviewMe. Built for creatives who want the truth.</span>
        <span style="color:var(--red);">◈ Honest by design.</span>
      </div>
    </footer>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'
import Navbar from './Navbar.vue'

const router = useRouter()
const works = ref([])
const loading = ref(true)
const filter = ref('all')

const typeColors = { design: '#2a6496', writing: '#5a3e6b', music: '#2e6b4f', film: '#8b4513' }
const typeLabels = { design: 'Design', writing: 'Writing', music: 'Music', film: 'Photography' }

const filteredWorks = computed(() => {
  if (filter.value === 'all') return works.value
  return works.value.filter(w => w.type === filter.value)
})

onMounted(async () => {
  const { data, error } = await supabase
    .from('works')
    .select('*, reviews(id)')
    .order('created_at', { ascending: false })
  if (!error) works.value = data || []
  loading.value = false
})

function timeAgo(ts) {
  const d = Date.now() - new Date(ts).getTime()
  if (d < 3600000) return Math.floor(d / 60000) + 'm ago'
  if (d < 86400000) return Math.floor(d / 3600000) + 'h ago'
  return Math.floor(d / 86400000) + 'd ago'
}

function openWork(work) {
  router.push(`/browse/${work.id}`)
}

function requireAuth() {
  router.push('/auth')
}
</script>

<style scoped>
.helpful-btn{font-family:var(--ff-mono);font-size:0.68rem;background:none;border:1px solid var(--border);border-radius:2px;padding:4px 10px;cursor:pointer;color:var(--muted);transition:all 0.2s;}
.helpful-btn:hover{border-color:var(--ink);color:var(--ink);}
</style>