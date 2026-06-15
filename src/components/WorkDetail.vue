<template>
  <main>
    <Navbar />

    <!-- LOADING -->
    <div v-if="loading" class="empty" style="padding: 100px 20px;">
      Loading work...
    </div>

    <!-- NOT FOUND -->
    <div v-else-if="!work" class="empty" style="padding: 100px 20px;">
      Work not found. It may have been removed.
      <br><br>
      <span style="color:var(--red);cursor:pointer;" @click="router.push('/browse')">Browse all submissions →</span>
    </div>

    <!-- WORK DETAIL -->
    <div v-else>

      <!-- HERO -->
      <div style="padding: 60px 60px 40px; border-bottom: 1.5px solid var(--border); max-width: 900px; margin: 0 auto;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <span class="card-type" :style="{ background: typeColors[work.type] }">{{ typeLabels[work.type] }}</span>
          <span style="font-family:var(--ff-mono);font-size:0.7rem;color:var(--muted);">{{ timeAgo(work.created_at) }}</span>
        </div>
        <h1 style="font-family:var(--ff-display);font-size:clamp(1.8rem,4vw,3rem);font-weight:900;line-height:1.1;margin-bottom:16px;">{{ work.title }}</h1>
        <p v-if="work.description" style="font-size:1rem;color:var(--muted);line-height:1.7;max-width:620px;margin-bottom:24px;">{{ work.description }}</p>
        <div v-if="work.context" style="font-family:var(--ff-mono);font-size:0.78rem;color:var(--red);padding:12px 16px;border:1px solid rgba(214,58,47,0.2);border-radius:4px;background:rgba(214,58,47,0.04);margin-bottom:24px;max-width:620px;">
          ❓ Creator's question: {{ work.context }}
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
          <a v-if="work.link" :href="work.link" target="_blank" class="btn-main" style="text-decoration:none;display:inline-block;">View Work ↗</a>
          <button class="btn-outline" @click="copyLink">
            {{ copied ? '✓ Link Copied!' : 'Share This Work' }}
          </button>
          <button class="btn-main" @click="requireAuth" style="background:var(--ink);box-shadow:4px 4px 0 #333;">Write a Review</button>
        </div>
      </div>

      <!-- REVIEWS -->
      <div style="max-width: 900px; margin: 0 auto; padding: 40px 60px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
          <h2 style="font-family:var(--ff-display);font-size:1.5rem;font-weight:900;">
            {{ reviews.length }} Review{{ reviews.length !== 1 ? 's' : '' }}
          </h2>
          <button class="btn-main" @click="requireAuth">Write a Review →</button>
        </div>

        <!-- No reviews yet -->
        <div v-if="reviews.length === 0" style="text-align:center;padding:60px 20px;border:1px solid var(--border);border-radius:6px;background:var(--surface);">
          <div style="font-family:var(--ff-display);font-size:1.2rem;font-weight:700;margin-bottom:8px;">No reviews yet</div>
          <p style="color:var(--muted);font-size:0.88rem;margin-bottom:24px;">Be the first to give honest feedback on this work.</p>
          <button class="btn-main" @click="requireAuth">Write the First Review</button>
        </div>

        <!-- Review list -->
        <div v-else style="display:flex;flex-direction:column;gap:20px;">
          <div v-for="review in reviews" :key="review.id" style="border:1px solid var(--border);border-radius:6px;padding:24px;background:var(--surface);">

            <!-- Scores -->
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
              <span v-for="(val, key) in review.scores" :key="key" class="score-tag">{{ key }} {{ val }}/10</span>
            </div>

            <!-- Review text -->
            <div style="font-size:0.92rem;line-height:1.75;color:#3d3830;margin-bottom:16px;">{{ review.text }}</div>

            <!-- Strength / Weakness -->
            <div v-if="review.strength || review.weakness" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
              <div v-if="review.strength" class="ai-sw-box strength">
                <div style="font-family:var(--ff-mono);font-size:0.6rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-bottom:4px;">✦ Strength</div>
                {{ review.strength }}
              </div>
              <div v-if="review.weakness" class="ai-sw-box weakness">
                <div style="font-family:var(--ff-mono);font-size:0.6rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-bottom:4px;">⚠ Needs Work</div>
                {{ review.weakness }}
              </div>
            </div>

            <!-- Footer -->
            <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid var(--border);">
              <span style="font-family:var(--ff-mono);font-size:0.68rem;color:var(--muted);">Anonymous · {{ timeAgo(review.created_at) }}</span>
              <span style="font-family:var(--ff-mono);font-size:0.68rem;color:var(--muted);">{{ review.helpful || 0 }} found this helpful</span>
            </div>
          </div>
        </div>

        <!-- AI Feedback -->
        <div v-if="work.ai_feedback" style="margin-top:24px;border:1px solid var(--border);border-radius:6px;overflow:hidden;">
          <div style="padding:14px 20px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border);background:var(--cream);">
            <span class="ai-badge">◈ AI REVIEW</span>
            <span style="font-family:var(--ff-mono);font-size:0.65rem;color:var(--muted);">Generated · Always public · Clearly labeled</span>
          </div>
          <div style="padding:20px;">
            <div class="ai-critique">{{ work.ai_feedback.critique }}</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
              <span v-for="(val, key) in work.ai_feedback.scores" :key="key" style="font-family:var(--ff-mono);font-size:0.65rem;padding:3px 10px;border-radius:2px;background:rgba(15,14,12,0.06);border:1px solid rgba(15,14,12,0.15);">{{ key }} {{ val }}/10</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div class="ai-sw-box strength"><div style="font-family:var(--ff-mono);font-size:0.6rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-bottom:4px;">✦ Strength</div>{{ work.ai_feedback.strength }}</div>
              <div class="ai-sw-box weakness"><div style="font-family:var(--ff-mono);font-size:0.6rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-bottom:4px;">⚠ Needs Work</div>{{ work.ai_feedback.weakness }}</div>
            </div>
          </div>
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
const work = ref(null)
const reviews = ref([])
const loading = ref(true)
const copied = ref(false)

const typeColors = { design: '#2a6496', writing: '#5a3e6b', music: '#2e6b4f', film: '#8b4513' }
const typeLabels = { design: 'Design', writing: 'Writing', music: 'Music', film: 'Photography' }

onMounted(async () => {
  const id = route.params.id
  const { data, error } = await supabase
    .from('works')
    .select('*, reviews(*)')
    .eq('id', id)
    .single()
  if (error || !data) { loading.value = false; return }
  work.value = data
  reviews.value = data.reviews || []
  loading.value = false
})

function timeAgo(ts) {
  const d = Date.now() - new Date(ts).getTime()
  if (d < 3600000) return Math.floor(d / 60000) + 'm ago'
  if (d < 86400000) return Math.floor(d / 3600000) + 'h ago'
  return Math.floor(d / 86400000) + 'd ago'
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2500)
}

function requireAuth() {
  router.push('/auth')
}
</script>

<style scoped>
@media(max-width: 768px) {
  div[style*="padding: 60px 60px"] { padding: 40px 24px !important; }
  div[style*="padding: 40px 60px"] { padding: 24px 16px !important; }
  div[style*="grid-template-columns:1fr 1fr"] { grid-template-columns: 1fr !important; }
}
</style>