<template>
  <main>
    <Navbar />

    <div style="padding: 40px 60px; max-width: 1200px; margin: 0 auto;">

      <!-- HEADER -->
      <div style="margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1.5px solid var(--border);">
        <div class="eyebrow">Admin Only</div>
        <h1 class="section-h2">Platform Dashboard</h1>
        <p style="color: var(--muted); font-size: 0.9rem;">Everything happening on ReviewMe in one place.</p>
      </div>

      <!-- STATS ROW -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-card-num">{{ stats.users }}</div>
          <div class="stat-card-lbl">Total Users</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-num">{{ stats.works }}</div>
          <div class="stat-card-lbl">Works Submitted</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-num">{{ stats.reviews }}</div>
          <div class="stat-card-lbl">Reviews Written</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-num">{{ stats.today }}</div>
          <div class="stat-card-lbl">Joined Today</div>
        </div>
      </div>

      <!-- TABS -->
      <div class="tab-row" style="margin-bottom: 32px; margin-top: 40px;">
        <div :class="['tab', activeTab === 'users' ? 'active' : '']" @click="activeTab = 'users'">Users</div>
        <div :class="['tab', activeTab === 'works' ? 'active' : '']" @click="activeTab = 'works'">Works</div>
        <div :class="['tab', activeTab === 'reviews' ? 'active' : '']" @click="activeTab = 'reviews'">Reviews</div>
      </div>

      <!-- USERS TAB -->
      <div v-if="activeTab === 'users'">
        <div v-if="loading" class="empty">Loading users...</div>
        <div v-else-if="users.length === 0" class="empty">No users yet.</div>
        <div v-else style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
          <div class="admin-table-header">
            <div>Email</div>
            <div>Joined</div>
            <div>Last Sign In</div>
            <div>Works</div>
          </div>
          <div v-for="user in users" :key="user.id" class="admin-table-row">
            <div style="font-size: 0.85rem;">{{ user.email }}</div>
            <div style="font-family: var(--ff-mono); font-size: 0.72rem; color: var(--muted);">{{ formatDate(user.created_at) }}</div>
            <div style="font-family: var(--ff-mono); font-size: 0.72rem; color: var(--muted);">{{ formatDate(user.last_sign_in_at) }}</div>
            <div style="font-family: var(--ff-mono); font-size: 0.72rem;">{{ user.works_count || 0 }}</div>
          </div>
        </div>
      </div>

      <!-- WORKS TAB -->
      <div v-if="activeTab === 'works'">
        <div v-if="loading" class="empty">Loading works...</div>
        <div v-else-if="works.length === 0" class="empty">No works submitted yet.</div>
        <div v-else style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
          <div class="admin-table-header" style="grid-template-columns: 2fr 1fr 1fr 1fr;">
            <div>Title</div>
            <div>Type</div>
            <div>Reviews</div>
            <div>Submitted</div>
          </div>
          <div v-for="work in works" :key="work.id" class="admin-table-row" style="grid-template-columns: 2fr 1fr 1fr 1fr;">
            <div>
              <div style="font-weight: 500; font-size: 0.88rem;">{{ work.title }}</div>
              <a v-if="work.link" :href="work.link" target="_blank" style="font-family: var(--ff-mono); font-size: 0.68rem; color: var(--red);">View Work ↗</a>
            </div>
            <div><span class="card-type" :style="{ background: typeColors[work.type] }">{{ typeLabels[work.type] }}</span></div>
            <div style="font-family: var(--ff-mono); font-size: 0.78rem;">{{ work.reviews?.length || 0 }}</div>
            <div style="font-family: var(--ff-mono); font-size: 0.72rem; color: var(--muted);">{{ formatDate(work.created_at) }}</div>
          </div>
        </div>
      </div>

      <!-- REVIEWS TAB -->
      <div v-if="activeTab === 'reviews'">
        <div v-if="loading" class="empty">Loading reviews...</div>
        <div v-else-if="reviews.length === 0" class="empty">No reviews written yet.</div>
        <div v-else style="display: flex; flex-direction: column; gap: 16px;">
          <div v-for="review in reviews" :key="review.id" style="border: 1px solid var(--border); border-radius: 6px; padding: 20px; background: var(--surface);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div style="font-family: var(--ff-mono); font-size: 0.7rem; color: var(--muted);">Review on: <strong style="color: var(--ink);">{{ review.works?.title || 'Unknown work' }}</strong></div>
              <div style="font-family: var(--ff-mono); font-size: 0.68rem; color: var(--muted);">{{ formatDate(review.created_at) }}</div>
            </div>
            <div style="font-size: 0.88rem; line-height: 1.7; color: #3d3830; margin-bottom: 12px;">{{ review.text }}</div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <span v-for="(val, key) in review.scores" :key="key" class="score-tag">{{ key }} {{ val }}/10</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import Navbar from './Navbar.vue'

const activeTab = ref('users')
const loading = ref(true)
const users = ref([])
const works = ref([])
const reviews = ref([])
const stats = ref({ users: 0, works: 0, reviews: 0, today: 0 })

const typeColors = { design: '#2a6496', writing: '#5a3e6b', music: '#2e6b4f', film: '#8b4513' }
const typeLabels = { design: 'Design', writing: 'Writing', music: 'Music', film: 'Photography' }

onMounted(async () => {
  // Load works
  const { data: worksData } = await supabase
    .from('works')
    .select('*, reviews(*)')
    .order('created_at', { ascending: false })
  works.value = worksData || []

  // Load reviews
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*, works(title)')
    .order('created_at', { ascending: false })
  reviews.value = reviewsData || []

  // Stats
  stats.value.works = works.value.length
  stats.value.reviews = reviews.value.length

  // Load users via admin RPC
  const { data: usersData } = await supabase
    .rpc('get_users_admin')
  
  if (usersData) {
    users.value = usersData
    stats.value.users = usersData.length
    const today = new Date().toDateString()
    stats.value.today = usersData.filter(u => new Date(u.created_at).toDateString() === today).length
  }

  loading.value = false
})

function formatDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 24px; text-align: center; }
.stat-card-num { font-family: var(--ff-display); font-size: 2.5rem; font-weight: 900; color: var(--red); }
.stat-card-lbl { font-family: var(--ff-mono); font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }
.tab-row { display: flex; border-bottom: 1.5px solid var(--border); }
.tab { padding: 12px 24px; cursor: pointer; font-family: var(--ff-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); border-bottom: 2px solid transparent; margin-bottom: -1.5px; transition: all 0.2s; }
.tab.active { color: var(--red); border-bottom-color: var(--red); }
.admin-table-header { display: grid; grid-template-columns: 2fr 1fr 1fr 80px; padding: 12px 20px; background: var(--cream); border-bottom: 1px solid var(--border); font-family: var(--ff-mono); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
.admin-table-row { display: grid; grid-template-columns: 2fr 1fr 1fr 80px; padding: 14px 20px; border-bottom: 1px solid var(--border); align-items: center; background: var(--surface); transition: background 0.2s; }
.admin-table-row:hover { background: var(--cream); }
@media(max-width: 768px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .admin-table-header, .admin-table-row { grid-template-columns: 1fr 1fr; }
}
</style>