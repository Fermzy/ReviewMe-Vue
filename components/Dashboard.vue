<template>
  <main>
    <Navbar />

    <div style="padding: 40px 60px; max-width: 1200px; margin: 0 auto;">

      <!-- HEADER -->
      <div style="margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1.5px solid var(--border);">
        <div class="eyebrow">Dashboard</div>
        <h1 class="section-h2">Welcome back{{ userName ? ', ' + userName : '' }}</h1>
        <p style="color: var(--muted); font-size: 0.9rem;">Submit your work or write a review for someone else.</p>
      </div>

      <!-- TABS -->
      <div class="tab-row" style="margin-bottom: 32px;">
        <div :class="['tab', activeTab === 'submit' ? 'active' : '']" @click="activeTab = 'submit'">Submit Work</div>
        <div :class="['tab', activeTab === 'myworks' ? 'active' : '']" @click="activeTab = 'myworks'">My Submissions</div>
        <div :class="['tab', activeTab === 'review' ? 'active' : '']" @click="activeTab = 'review'">Write a Review</div>
      </div>

      <!-- SUBMIT WORK TAB -->
      <div v-if="activeTab === 'submit'">
        <div style="max-width: 680px;">

          <!-- Success state -->
          <div v-if="submitSuccess" style="text-align:center; padding: 60px 20px;">
            <div style="font-family: var(--ff-display); font-size: 1.8rem; font-weight: 900; margin-bottom: 12px;">Work Submitted!</div>
            <p style="color: var(--muted); margin-bottom: 28px;">Reviewers will find it shortly. Honest feedback is coming your way.</p>
            <div style="display: flex; gap: 12px; justify-content: center;">
              <button class="btn-main" @click="activeTab = 'myworks'">See My Submissions</button>
              <button class="btn-outline" @click="resetSubmit">Submit Another</button>
            </div>
          </div>

          <div v-else>
            <div class="form-group">
              <label class="form-label">Work Title</label>
              <input class="form-input" v-model="submitForm.title" type="text" placeholder="Give your work a clear title..." />
              <div class="form-error" v-if="submitErrors.title">{{ submitErrors.title }}</div>
            </div>

            <div class="form-group">
              <label class="form-label">Category</label>
              <div class="type-grid">
                <div
                  v-for="t in types" :key="t.value"
                  :class="['type-btn', submitForm.type === t.value ? 'active' : '']"
                  @click="submitForm.type = t.value"
                >
                  <span class="t-icon">
                    <svg v-if="t.value === 'film'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                    <svg v-if="t.value === 'design'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
                    <svg v-if="t.value === 'writing'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                    <svg v-if="t.value === 'music'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                  </span>
                  {{ t.label }}
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Link to Your Work</label>
              <input class="form-input" v-model="submitForm.link" type="url" placeholder="Paste a link (portfolio, VSCO, 500px, Instagram...)" />
              <div class="form-error" v-if="submitErrors.link">{{ submitErrors.link }}</div>
            </div>

            <div class="form-group">
              <label class="form-label">What would you like feedback on?</label>
              <textarea class="form-textarea" v-model="submitForm.context" placeholder="Be specific. E.g. 'Does the composition feel balanced?' or 'Is the mood consistent across the series?'"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Brief Description</label>
              <textarea class="form-textarea" v-model="submitForm.description" placeholder="Give reviewers context — what is this, what stage is it at?" style="min-height: 90px;"></textarea>
            </div>

            <button class="btn-main" style="width: 100%;" @click="handleSubmitWork" :disabled="submitting">
              {{ submitting ? 'Submitting...' : 'Submit for Review →' }}
            </button>
          </div>
        </div>
      </div>

      <!-- MY SUBMISSIONS TAB -->
      <div v-if="activeTab === 'myworks'">
        <div v-if="loadingWorks" class="empty">Loading your submissions...</div>
        <div v-else-if="myWorks.length === 0" class="empty">
          You haven't submitted any work yet.<br><br>
          <span style="color: var(--red); cursor: pointer;" @click="activeTab = 'submit'">Submit your first work →</span>
        </div>
        <div v-else class="review-wall">
          <div v-for="work in myWorks" :key="work.id" class="review-card">
            <div class="review-card-header">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span class="card-type" :style="{ background: typeColors[work.type] }">{{ typeLabels[work.type] }}</span>
                <span class="review-card-meta">{{ work.reviews?.length || 0 }} reviews</span>
              </div>
              <div class="review-card-title">{{ work.title }}</div>
              <div class="review-card-meta">{{ timeAgo(work.created_at) }}</div>
            </div>
            <div class="review-card-body">
              <div class="review-snippet">{{ work.description || 'No description.' }}</div>
              <div v-if="work.context" style="font-family:var(--ff-mono);font-size:0.7rem;color:var(--red);margin-bottom:8px;">❓ {{ work.context }}</div>
              <a v-if="work.link" :href="work.link" target="_blank" style="font-family:var(--ff-mono);font-size:0.7rem;color:var(--red);">View Work ↗</a>
            </div>
            <!-- Reviews on this work -->
            <div v-if="work.reviews?.length > 0" style="padding: 12px 20px; border-top: 1px solid var(--border);">
              <div style="font-family:var(--ff-mono);font-size:0.68rem;color:var(--muted);margin-bottom:10px;">REVIEWS RECEIVED</div>
              <div v-for="(review, i) in work.reviews" :key="i" style="padding: 10px; background: var(--cream); border-radius: 4px; margin-bottom: 8px;">
                <div style="font-size:0.83rem;line-height:1.6;margin-bottom:8px;">{{ review.text }}</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <span v-for="(val, key) in review.scores" :key="key" class="score-tag">{{ key }} {{ val }}/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- WRITE A REVIEW TAB -->
      <div v-if="activeTab === 'review'">
        <div style="max-width: 680px;">

          <div v-if="reviewSuccess" style="text-align:center; padding: 60px 20px;">
            <div style="font-family: var(--ff-display); font-size: 1.8rem; font-weight: 900; margin-bottom: 12px;">Review Submitted!</div>
            <p style="color: var(--muted); margin-bottom: 28px;">Thank you for being honest. Your credibility score just went up.</p>
            <button class="btn-main" @click="reviewSuccess = false">Write Another Review</button>
          </div>

          <div v-else>
            <div class="form-group">
              <label class="form-label">Select Work to Review</label>
              <select class="form-select" v-model="reviewForm.workId" @change="updateCriteria">
                <option value="">Choose a submission...</option>
                <option v-for="work in allWorks" :key="work.id" :value="work.id">{{ work.title }}</option>
              </select>
            </div>

            <div class="form-group" v-if="reviewForm.workId">
              <label class="form-label">Rate the Work</label>
              <div style="display:flex;gap:12px;flex-wrap:wrap;">
                <div v-for="criterion in currentCriteria" :key="criterion" style="text-align:center;flex:1;min-width:80px;">
                  <div style="font-family:var(--ff-mono);font-size:0.65rem;color:var(--muted);text-transform:uppercase;margin-bottom:6px;">{{ criterion }}</div>
                  <div style="display:flex;gap:2px;justify-content:center;flex-wrap:wrap;">
                    <span
                      v-for="n in 10" :key="n"
                      :style="{ color: reviewForm.scores[criterion] >= n ? 'var(--gold)' : 'var(--border)', cursor: 'pointer', fontSize: '1rem' }"
                      @click="reviewForm.scores[criterion] = n"
                    >★</span>
                  </div>
                  <div style="font-family:var(--ff-mono);font-size:0.65rem;color:var(--muted);margin-top:3px;">{{ reviewForm.scores[criterion] || '—' }}/10</div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Your Honest Review</label>
              <textarea class="form-textarea" v-model="reviewForm.text" placeholder="Be specific. What works? What doesn't? What would make it better?" style="min-height:140px;"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Biggest Strength</label>
              <input class="form-input" v-model="reviewForm.strength" type="text" placeholder="In one sentence..." />
            </div>

            <div class="form-group">
              <label class="form-label">Most Critical Improvement</label>
              <input class="form-input" v-model="reviewForm.weakness" type="text" placeholder="Be direct but constructive..." />
            </div>

            <div v-if="reviewError" style="color:var(--red);font-family:var(--ff-mono);font-size:0.78rem;margin-bottom:16px;">{{ reviewError }}</div>

            <button class="btn-main" style="width:100%;" @click="handleSubmitReview" :disabled="submittingReview">
              {{ submittingReview ? 'Submitting...' : 'Submit Anonymous Review →' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'
import Navbar from './Navbar.vue'

const router = useRouter()
const activeTab = ref('submit')
const userName = ref('')
const myWorks = ref([])
const allWorks = ref([])
const loadingWorks = ref(true)
const submitting = ref(false)
const submittingReview = ref(false)
const submitSuccess = ref(false)
const reviewSuccess = ref(false)
const reviewError = ref('')

const types = [
  { value: 'film', label: 'Photography' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing' },
  { value: 'music', label: 'Music' },
]

const typeColors = { design: '#2a6496', writing: '#5a3e6b', music: '#2e6b4f', film: '#8b4513' }
const typeLabels = { design: 'Design', writing: 'Writing', music: 'Music', film: 'Photography' }

const criteria = {
  film: ['Composition', 'Light', 'Story', 'Mood', 'Execution'],
  design: ['Concept', 'Execution', 'Originality'],
  writing: ['Voice', 'Pacing', 'Hook'],
  music: ['Mix', 'Mood', 'Structure']
}

const submitForm = ref({ title: '', type: 'film', link: '', context: '', description: '' })
const submitErrors = ref({ title: '', link: '' })
const reviewForm = ref({ workId: '', text: '', strength: '', weakness: '', scores: {} })
const currentCriteria = ref([])

function updateCriteria() {
  const work = allWorks.value.find(w => w.id === reviewForm.value.workId)
  if (work) {
    currentCriteria.value = criteria[work.type] || ['Overall', 'Craft', 'Impact']
    reviewForm.value.scores = {}
    currentCriteria.value.forEach(c => { reviewForm.value.scores[c] = 0 })
  }
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) { router.push('/auth'); return }
  userName.value = session.user.user_metadata?.full_name || ''

  // Load my works with reviews
  const { data: works } = await supabase
    .from('works')
    .select('*, reviews(*)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
  myWorks.value = works || []
  loadingWorks.value = false

  // Load all works for review dropdown
  const { data: all } = await supabase
    .from('works')
    .select('id, title, type')
    .neq('user_id', session.user.id)
    .order('created_at', { ascending: false })
  allWorks.value = all || []
})

function isValidUrl(str) {
  if (!str) return true
  try { const u = new URL(str); return u.protocol === 'http:' || u.protocol === 'https:' }
  catch (_) { return false }
}

async function handleSubmitWork() {
  submitErrors.value = { title: '', link: '' }
  let valid = true
  if (!submitForm.value.title.trim()) { submitErrors.value.title = 'Please add a title.'; valid = false }
  if (submitForm.value.link && !isValidUrl(submitForm.value.link)) { submitErrors.value.link = 'Please enter a valid URL.'; valid = false }
  if (!valid) return

  submitting.value = true
  const { data: { session } } = await supabase.auth.getSession()
  const { error } = await supabase.from('works').insert({
    title: submitForm.value.title,
    type: submitForm.value.type,
    link: submitForm.value.link,
    context: submitForm.value.context,
    description: submitForm.value.description,
    user_id: session.user.id
  })
  submitting.value = false
  if (error) { alert('Error submitting work: ' + error.message); return }
  submitSuccess.value = true

  // Reload my works
  const { data: works } = await supabase
    .from('works')
    .select('*, reviews(*)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
  myWorks.value = works || []
}

function resetSubmit() {
  submitForm.value = { title: '', type: 'film', link: '', context: '', description: '' }
  submitSuccess.value = false
}

async function handleSubmitReview() {
  reviewError.value = ''
  if (!reviewForm.value.workId) { reviewError.value = 'Please select a work to review.'; return }
  if (reviewForm.value.text.trim().length < 40) { reviewError.value = 'Please write a more detailed review.'; return }

  submittingReview.value = true
  const { data: { session } } = await supabase.auth.getSession()
  const { error } = await supabase.from('reviews').insert({
    work_id: reviewForm.value.workId,
    reviewer_id: session.user.id,
    text: reviewForm.value.text,
    strength: reviewForm.value.strength,
    weakness: reviewForm.value.weakness,
    scores: reviewForm.value.scores
  })
  submittingReview.value = false
  if (error) { reviewError.value = 'Error submitting review: ' + error.message; return }
  reviewSuccess.value = true
  reviewForm.value = { workId: '', text: '', strength: '', weakness: '', scores: {} }
}

function timeAgo(ts) {
  const d = Date.now() - new Date(ts).getTime()
  if (d < 3600000) return Math.floor(d / 60000) + 'm ago'
  if (d < 86400000) return Math.floor(d / 3600000) + 'h ago'
  return Math.floor(d / 86400000) + 'd ago'
}
</script>

<style scoped>
.tab-row{display:flex;border-bottom:1.5px solid var(--border);margin-bottom:0;}
.tab{padding:12px 24px;cursor:pointer;font-family:var(--ff-mono);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);border-bottom:2px solid transparent;margin-bottom:-1.5px;transition:all 0.2s;}
.tab.active{color:var(--red);border-bottom-color:var(--red);}
.type-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
.type-btn{padding:12px 8px;text-align:center;border:1.5px solid var(--border);border-radius:4px;cursor:pointer;transition:all 0.2s;background:var(--surface);font-family:var(--ff-body);font-size:0.8rem;font-weight:500;}
.type-btn:hover,.type-btn.active{border-color:var(--red);background:rgba(214,58,47,0.06);color:var(--red);}
.t-icon{display:flex;justify-content:center;align-items:center;margin-bottom:6px;height:28px;}
@media(max-width:768px){
  .type-grid{grid-template-columns:repeat(2,1fr);}
  div[style*="padding: 40px 60px"]{padding:24px 16px !important;}
}
</style>