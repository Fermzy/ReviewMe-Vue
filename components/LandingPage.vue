<template>
  <main>
    <Navbar />

    <!-- HERO WITH BACKGROUND IMAGE -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="eyebrow">Honest feedback, zero filter</div>
        <h1 class="hero-h1">Your photography deserves<br>the <em>truth.</em></h1>
        <p class="hero-desc">ReviewMe is the anonymous review platform for photographers who are done with empty praise. Submit your work. Get brutal, honest, constructive feedback from people who actually care about craft.</p>
        <div class="hero-cta">
          <button class="btn-main" @click="router.push('/auth?mode=signup')">Submit Your Work</button>
          <button class="btn-outline-light" @click="router.push('/browse')">Browse Reviews</button>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="stats-bar">
      <div class="stat"><div class="stat-num">{{ stats.works }}</div><div class="stat-lbl">Works Submitted</div></div>
      <div class="stat"><div class="stat-num">{{ stats.reviews }}</div><div class="stat-lbl">Reviews Written</div></div>
      <div class="stat"><div class="stat-num">{{ stats.reviewers }}</div><div class="stat-lbl">Reviewers</div></div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="section">
      <div class="section-tag">Process</div>
      <h2 class="section-h2">How ReviewMe works</h2>
      <p class="section-sub">Three simple steps between you and the honest feedback that moves your craft forward.</p>
      <div class="steps">
        <div class="step">
          <div class="step-num">01</div>
          <div class="step-title">Submit your work</div>
          <div class="step-desc">Paste a link or upload your photo. Tell reviewers exactly what you want feedback on — no vague requests.</div>
        </div>
        <div class="step">
          <div class="step-num">02</div>
          <div class="step-title">Get anonymous reviews</div>
          <div class="step-desc">Real photographers review your work with no social pressure attached. Just honest craft critique.</div>
        </div>
        <div class="step">
          <div class="step-num">03</div>
          <div class="step-title">Build credibility</div>
          <div class="step-desc">Review others to earn credibility points. Better reviewers get more visibility on the platform.</div>
        </div>
      </div>
    </section>

    <!-- CREDIBILITY -->
    <section class="section section-dark">
      <div class="section-tag">Integrity System</div>
      <h2 class="section-h2" style="color:var(--paper);">Why reviewers <em style="color:var(--red);font-family:var(--ff-display);">earn trust</em></h2>
      <p class="section-sub">Anonymous doesn't mean unaccountable. Our credibility system separates thoughtful critics from drive-by comments.</p>
      <div class="cred-grid">
        <div class="cred-card">
          <div class="cred-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c8963e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
          </div>
          <div class="cred-title">Credibility Score</div>
          <div class="cred-desc">Every reviewer earns a score based on helpfulness votes. High-cred reviewers are flagged so you know whose opinion to weigh most.</div>
        </div>
        <div class="cred-card">
          <div class="cred-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a09880" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
          </div>
          <div class="cred-title">Helpful / Not Helpful</div>
          <div class="cred-desc">Submitters vote on every review. Consistently unhelpful reviewers lose standing. The community self-moderates.</div>
        </div>
        <div class="cred-card">
          <div class="cred-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a09880" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <div class="cred-title">Full Anonymity</div>
          <div class="cred-desc">Reviewer identities are never revealed to submitters. Structurally enforced — not just a policy.</div>
        </div>
        <div class="cred-card">
          <div class="cred-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a09880" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="cred-title">Critique Guidelines</div>
          <div class="cred-desc">Reviews must be specific and constructive. Vague negativity gets flagged. Brutal honesty, not cruelty.</div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section" style="text-align:center;background:var(--cream);">
      <h2 class="section-h2">Ready for honest feedback?</h2>
      <p class="section-sub" style="margin:0 auto 32px;">Join photographers who chose growth over comfort.</p>
      <button class="btn-main" @click="router.push('/auth?mode=signup')">Create Free Account</button>
    </section>

    <!-- FOOTER -->
    <footer>
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="nav-logo">Review<em>Me</em></div>
          <div class="footer-tagline">Honest feedback for photographers who are done with empty praise.</div>
        </div>
        <div>
          <div class="footer-col-title">Platform</div>
          <div class="footer-links">
            <span class="footer-link" @click="router.push('/browse')">Browse Works</span>
            <span class="footer-link" @click="router.push('/auth?mode=signup')">Submit Work</span>
            <span class="footer-link" @click="router.push('/auth')">Write a Review</span>
          </div>
        </div>
        <div>
          <div class="footer-col-title">Principles</div>
          <div class="footer-links">
            <span class="footer-link">Full Anonymity</span>
            <span class="footer-link">Credibility System</span>
            <span class="footer-link">Critique Guidelines</span>
            <span class="footer-link">AI-Assisted Feedback</span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 ReviewMe. Built for creatives who want the truth.</span>
        <span style="color:var(--red);">◈ Honest by design.</span>
      </div>
    </footer>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'
import Navbar from './Navbar.vue'

const router = useRouter()
const stats = ref({ works: '—', reviews: '—', reviewers: '—' })

onMounted(async () => {
  const [{ count: worksCount }, { count: reviewsCount }] = await Promise.all([
    supabase.from('works').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('*', { count: 'exact', head: true })
  ])
  stats.value.works = worksCount ?? '—'
  stats.value.reviews = reviewsCount ?? '—'
  stats.value.reviewers = '—'
})
</script>

<style scoped>
.hero-section{position:relative;min-height:90vh;display:flex;align-items:center;justify-content:center;background-image:url('/hero.jpg');background-size:cover;background-position:center;background-attachment:fixed;}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,9,8,0.55) 0%,rgba(10,9,8,0.45) 60%,rgba(10,9,8,0.7) 100%);}
.hero-content{position:relative;z-index:1;max-width:780px;padding:100px 40px;text-align:center;}
.hero-content .eyebrow{color:rgba(255,255,255,0.7);}
.hero-content .hero-h1{color:#ffffff;}
.hero-content .hero-desc{color:rgba(255,255,255,0.82);}
.btn-outline-light{background:transparent;color:white;border:1.5px solid rgba(255,255,255,0.6);padding:13px 28px;font-family:var(--ff-body);font-weight:600;font-size:0.9rem;letter-spacing:0.05em;text-transform:uppercase;cursor:pointer;border-radius:3px;transition:all 0.2s;}
.btn-outline-light:hover{background:rgba(255,255,255,0.15);border-color:white;}
.cred-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
.cred-card{border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:28px;background:rgba(255,255,255,0.03);}
.cred-icon{margin-bottom:14px;}
.cred-title{font-family:var(--ff-display);font-size:1.1rem;font-weight:700;margin-bottom:8px;color:var(--paper);}
.cred-desc{font-size:0.85rem;color:#a09880;line-height:1.6;}
@media(max-width:768px){
  .cred-grid{grid-template-columns:1fr;}
  .hero-section{background-attachment:scroll;min-height:80vh;}
  .hero-content{padding:60px 24px;}
}
</style>
