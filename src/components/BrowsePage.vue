<template>
  <main>
    <Navbar />

    <div class="browse-header">
      <div class="section-tag">Submissions</div>
      <h2 class="section-h2">Browse Works</h2>
      <p class="section-sub">Read-only here. Sign up to submit your own work or write a review.</p>

      <div class="tag-row">
        <div :class="['tag', filter === 'all' ? 'active' : '']" @click="filter = 'all'">All</div>
        <div :class="['tag', filter === 'film' ? 'active' : '']" @click="filter = 'film'">Photography</div>
        <div :class="['tag', filter === 'art' ? 'active' : '']" @click="filter = 'art'">Art</div>
        <div :class="['tag', filter === 'design' ? 'active' : '']" @click="filter = 'design'">Graphic Design</div>
      </div>
    </div>

    <div class="browse-body">
      <div v-if="loading" class="empty">Loading submissions...</div>

      <div v-else-if="filteredWorks.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </div>
        <div class="empty-state-title">Nothing here yet</div>
        <p class="empty-state-desc">No work has been submitted in this category. Be the one who starts it.</p>
        <button class="btn-main" @click="router.push('/auth?mode=signup')">Submit the first work →</button>
      </div>

      <div v-else class="review-wall">
        <div
          v-for="(work, i) in filteredWorks"
          :key="work.id"
          :class="['print-card', i === 0 && filter === 'all' ? 'print-card--featured' : '']"
          @click="openWork(work)"
        >
          <div class="print-frame">
            <img v-if="work.link && isImageUrl(work.link)" :src="work.link" class="print-image" />
            <div v-else class="print-image print-image--placeholder">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <span class="print-type" :style="{ background: typeColors[work.type] || '#555' }">
              {{ typeLabels[work.type] || work.type }}
            </span>
          </div>

          <div class="print-caption">
            <div class="print-caption-top">
              <div class="print-title">{{ work.title }}</div>
              <div class="print-meta">{{ timeAgo(work.created_at) }}</div>
            </div>

            <div v-if="work.submitter_name" class="print-by">by {{ work.submitter_name }}</div>

            <p class="print-snippet">{{ work.description || 'No description provided.' }}</p>

            <div v-if="work.context" class="print-context">❓ {{ work.context }}</div>

            <div class="print-footer">
              <span class="print-reviews">{{ work.reviews?.length || 0 }} review{{ work.reviews?.length === 1 ? '' : 's' }}</span>
              <button class="helpful-btn" @click.stop="requireAuth">Review →</button>
            </div>
          </div>
        </div>
      </div>
    </div>

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

const typeColors = { film: '#8b4513', art: '#5a3e6b', design: '#2a6496' }
const typeLabels = { film: 'Photography', art: 'Art', design: 'Graphic Design' }

const filteredWorks = computed(() => {
  if (filter.value === 'all') return works.value
  return works.value.filter(w => w.type === filter.value)
})

onMounted(async () => {
  const { data, error } = await supabase
    .from('works')
    .select('*, reviews(id)')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
  if (!error) works.value = data || []
  loading.value = false
})

function isImageUrl(url) {
  return url && (url.includes('supabase') || /\.(jpg|jpeg|png|webp|gif)$/i.test(url))
}

function timeAgo(ts) {
  const d = Date.now() - new Date(ts).getTime()
  if (d < 3600000) return Math.floor(d / 60000) + 'm ago'
  if (d < 86400000) return Math.floor(d / 3600000) + 'h ago'
  return Math.floor(d / 86400000) + 'd ago'
}

function openWork(work) {
  router.push(`/work/${work.id}`)
}

function requireAuth() {
  router.push('/auth')
}
</script>

<style scoped>
/* ─── PAGE STRUCTURE ─── */
.browse-header{ padding: 56px 60px 32px; max-width: 1280px; margin: 0 auto; }
.browse-header .section-sub{ margin-bottom: 32px; }
.browse-body{ padding: 0 60px 80px; max-width: 1280px; margin: 0 auto; }

/* ─── GRID ─── */
.review-wall{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 36px;
}

/* ─── PRINT CARD — mounted-photo treatment ─── */
.print-card{
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}
.print-card:hover{ transform: translateY(-4px); }
.print-card--featured{ grid-column: span 2; }
@media(max-width: 900px){ .print-card--featured{ grid-column: span 1; } }

.print-frame{
  position: relative;
  background: var(--ink);
  padding: 14px 14px 0;
  border-radius: 6px 6px 0 0;
  overflow: hidden;
}
.print-image{
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
  border-radius: 2px;
}
.print-card--featured .print-image{ height: 340px; }
.print-image--placeholder{
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  color: var(--muted);
}
.print-type{
  position: absolute;
  top: 26px; left: 26px;
  font-family: var(--ff-mono);
  font-size: 0.62rem;
  color: var(--paper);
  padding: 4px 10px;
  border-radius: 2px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.print-caption{
  background: var(--surface);
  border: 1px solid var(--border);
  border-top: none;
  border-radius: 0 0 6px 6px;
  padding: 20px 22px 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.print-caption-top{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 4px;
}
.print-title{
  font-family: var(--ff-display);
  font-weight: 700;
  font-size: 1.08rem;
  line-height: 1.3;
}
.print-meta{
  font-family: var(--ff-mono);
  font-size: 0.65rem;
  color: var(--muted);
  white-space: nowrap;
  margin-top: 4px;
}
.print-by{
  font-family: var(--ff-mono);
  font-size: 0.7rem;
  color: var(--muted);
  margin-bottom: 10px;
}
.print-snippet{
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--muted);
  margin-bottom: 14px;
  flex: 1;
}
.print-context{
  font-family: var(--ff-mono);
  font-size: 0.7rem;
  color: var(--red);
  margin-bottom: 14px;
}
.print-footer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}
.print-reviews{
  font-family: var(--ff-mono);
  font-size: 0.68rem;
  color: var(--muted);
}
.helpful-btn{font-family:var(--ff-mono);font-size:0.68rem;background:none;border:1px solid var(--border);border-radius:2px;padding:5px 12px;cursor:pointer;color:var(--muted);transition:all 0.2s;}
.helpful-btn:hover{border-color:var(--red);color:var(--red);}

/* ─── EMPTY STATE ─── */
.empty-state{
  text-align: center;
  padding: 100px 20px;
  max-width: 420px;
  margin: 0 auto;
}
.empty-state-icon{ color: var(--muted); margin-bottom: 18px; display: flex; justify-content: center; }
.empty-state-title{ font-family: var(--ff-display); font-size: 1.4rem; font-weight: 900; margin-bottom: 10px; }
.empty-state-desc{ color: var(--muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 28px; }

@media(max-width: 768px){
  .browse-header{ padding: 40px 20px 24px; }
  .browse-body{ padding: 0 20px 56px; }
  .review-wall{ grid-template-columns: 1fr; gap: 28px; }
}
</style>