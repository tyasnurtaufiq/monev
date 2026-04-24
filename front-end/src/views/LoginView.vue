<template>
  <div class="login-page">

    <!-- Main Card Wrapper -->
    <div class="main-card">

      <!-- LEFT PANEL: Form -->
      <div class="left-panel">

        <!-- Logo -->
        <div class="logo-row">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span class="logo-text">MONEV <strong>DISHUB</strong></span>
        </div>

        <!-- Heading -->
        <div class="form-heading">
          <center><b><h3 style="font-size: 1.5rem;">Selamat Datang</h3></b>
          <b><p>Sistem monitoring &amp; evaluasi kegiatan</p></b>
          <b><p>Dinas Perhubungan </p></b>
           <p><b>Daerah Istimewa Yogyakarta</b></p></center>
        </div>

        <!-- Error -->
        <div v-if="error" class="error-box">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ error }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="login-form">

          <!-- Username -->
          <div class="field-group">
            <div class="field-wrapper">
              <span class="field-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                v-model="username"
                type="text"
                placeholder="Username"
                required
                class="field-input"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="field-group">
            <div class="field-wrapper">
              <span class="field-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                required
                class="field-input field-input-pr"
              />
              <button type="button" @click="showPassword = !showPassword" class="toggle-pw">
                <svg v-if="showPassword" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button type="submit" :disabled="loading" class="submit-btn">
            <template v-if="loading">
              <svg class="btn-spinner" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10"></circle>
              </svg>
              Memproses...
            </template>
            <template v-else>
              Masuk Sekarang
            </template>
          </button>

        </form>

        <!-- Footer -->
        <div class="left-footer">
          <div class="user-avatars">
            <div class="avatar av1"></div>
            <div class="avatar av2"></div>
            <div class="avatar av3"></div>
          </div>
          <div class="user-info">
            <span class="user-count">DINAS PERHUBUNGAN DIY</span>
            <span class="user-sub">© 2026 Noervix</span>
          </div>
          <a href="#" class="arrow-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>

      </div>

      <!-- RIGHT PANEL: Branding + Stats Visual -->
      <div class="right-panel">

        <div class="right-content">
          <center><h2 class="right-title">Monitoring &amp; Evaluasi kegiatan </h2>
          <h2 class="right-title">DINAS PERHUBUNGAN DIY</h2></center>

          <!-- Inline Stats Visualization -->
          <div class="stats-visual">
            <!-- Chart area -->
            <div class="chart-card">
              <div class="chart-header">
                <span class="chart-title">Progres Realisasi Kegiatan</span>
                <span class="chart-period">Tahun Anggaran 2026</span>
              </div>
              <div class="bar-chart">
                <div class="bar-group">
                  <div class="bar-wrap">
                    <div class="bar-fill" style="height: 55%; background: rgba(255,255,255,0.9);"></div>
                  </div>
                  <span class="bar-label">Jan</span>
                </div>
                <div class="bar-group">
                  <div class="bar-wrap">
                    <div class="bar-fill" style="height: 70%; background: rgba(255,255,255,0.9);"></div>
                  </div>
                  <span class="bar-label">Feb</span>
                </div>
                <div class="bar-group">
                  <div class="bar-wrap">
                    <div class="bar-fill" style="height: 45%; background: rgba(255,255,255,0.9);"></div>
                  </div>
                  <span class="bar-label">Mar</span>
                </div>
                <div class="bar-group">
                  <div class="bar-wrap">
                    <div class="bar-fill" style="height: 85%; background: rgba(255,255,255,0.9);"></div>
                  </div>
                  <span class="bar-label">Apr</span>
                </div>
                <div class="bar-group">
                  <div class="bar-wrap">
                    <div class="bar-fill" style="height: 60%; background: rgba(255,255,255,0.4);"></div>
                  </div>
                  <span class="bar-label">Mei</span>
                </div>
                <div class="bar-group">
                  <div class="bar-wrap">
                    <div class="bar-fill" style="height: 35%; background: rgba(255,255,255,0.4);"></div>
                  </div>
                  <span class="bar-label">Jun</span>
                </div>
                <div class="bar-group">
                  <div class="bar-wrap">
                    <div class="bar-fill" style="height: 25%; background: rgba(255,255,255,0.3);"></div>
                  </div>
                  <span class="bar-label">Jul</span>
                </div>
              </div>
              <!-- Progress ring -->
              <div class="ring-stat">
                <svg viewBox="0 0 80 80" class="ring-svg">
                  <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.15)" stroke-width="7" fill="none"/>
                  <circle cx="40" cy="40" r="32" stroke="white" stroke-width="7" fill="none"
                    stroke-dasharray="201" stroke-dashoffset="50" stroke-linecap="round"
                    transform="rotate(-90 40 40)"/>
                </svg>
                <div class="ring-label">
                  <span class="ring-pct">75%</span>
                  <span class="ring-sub">Target</span>
                </div>
              </div>
            </div>

            <!-- Metric cards row -->
            <div class="metric-row">
              <div class="metric-card">
                <span class="metric-val">24/7</span>
                <span class="metric-lbl">Monitoring</span>
              </div>
              <div class="metric-card">
                <span class="metric-val">100%</span>
                <span class="metric-lbl">Terpercaya</span>
              </div>
            </div>
          </div>

          <!-- Bottom pill + nav -->
          <div class="right-bottom">
            <div class="status-pill">
              <span class="pulse-dot"></span>
              Data Real-time
            </div>
            <div class="nav-btns">
              <button class="nav-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button class="nav-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Feature blurb -->
          <p class="right-desc">
            Pantau realisasi fisik &amp; keuangan kegiatan secara terpusat dengan laporan bulanan terstruktur.
          </p>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(username.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Login gagal. Periksa username dan password.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

/* ==============================
   PAGE BACKGROUND
============================== */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8edf5;
  font-family: 'DM Sans', sans-serif;
  padding: 24px;
}

/* ==============================
   MAIN CARD
============================== */
.main-card {
  display: flex;
  width: 100%;
  max-width: 920px;
  min-height: 580px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.08);
}

/* ==============================
   LEFT PANEL
============================== */
.left-panel {
  flex: 1;
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Logo Row */
.logo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}

.logo-icon {
  width: 34px;
  height: 34px;
  background: #eff6ff;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-icon svg {
  width: 18px;
  height: 18px;
  color: #2563eb;
}

.logo-text {
  font-family: 'Sora', sans-serif;
  font-size: 0.88rem;
  color: #64748b;
  letter-spacing: 0.05em;
}

.logo-text strong {
  color: #1e293b;
  font-weight: 700;
}

/* Heading */
.form-heading {
  margin-bottom: 24px;
}

.form-heading h1 {
  font-family: 'Sora', sans-serif;
  font-size: 1.95rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
  letter-spacing: -0.03em;
  margin-bottom: 8px;
}

.form-heading p {
  font-size: 0.825rem;
  color: #94a3b8;
  line-height: 1.5;
  max-width: 280px;
}

/* Error box */
.error-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  font-size: 0.82rem;
  color: #dc2626;
  font-weight: 500;
  margin-bottom: 16px;
}

.error-box svg { width: 16px; height: 16px; flex-shrink: 0; }

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.field-group { display: flex; flex-direction: column; }

.field-wrapper { position: relative; }

.field-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: #cbd5e1;
  pointer-events: none;
  transition: color 0.2s;
}

.field-icon svg { width: 17px; height: 17px; }

.field-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  background: #f8fafc;
  border: 1.5px solid #e8edf5;
  border-radius: 50px;
  color: #0f172a;
  font-size: 0.88rem;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: all 0.2s ease;
}

.field-input::placeholder { color: #b0bec5; }

.field-input:focus {
  background: white;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.field-wrapper:focus-within .field-icon { color: #2563eb; }

.field-input-pr { padding-right: 42px; }

.toggle-pw {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #b0bec5;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  padding: 2px;
}

.toggle-pw:hover { color: #2563eb; }
.toggle-pw svg { width: 17px; height: 17px; }

/* Submit */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px 1rem;
  background: #2563eb;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  letter-spacing: 0.01em;
  margin-top: 4px;
  transition: all 0.22s ease;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(37, 99, 235, 0.42);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-spinner {
  width: 18px; height: 18px;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Footer row */
.left-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
}

.user-avatars {
  display: flex;
  margin-right: 4px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid white;
  margin-left: -8px;
  background-size: cover;
}

.avatar:first-child { margin-left: 0; }
.av1 { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.av2 { background: linear-gradient(135deg, #06b6d4, #3b82f6); }
.av3 { background: linear-gradient(135deg, #f59e0b, #ef4444); }

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.user-count {
  font-family: 'Sora', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
}

.user-sub {
  font-size: 0.7rem;
  color: #94a3b8;
}

.arrow-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid #e2e8f0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #475569;
  transition: all 0.2s;
  text-decoration: none;
  flex-shrink: 0;
}

.arrow-btn:hover {
  background: #0f172a;
  border-color: #0f172a;
  color: white;
}

.arrow-btn svg { width: 16px; height: 16px; }

/* ==============================
   RIGHT PANEL
============================== */
.right-panel {
  width: 46%;
  background: linear-gradient(145deg, #0ea5e9 0%, #0284c7 40%, #0369a1 100%);
  border-radius: 20px;
  margin: 10px 10px 10px 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* Subtle noise/pattern overlay */
.right-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0,0,0,0.08) 0%, transparent 50%);
  pointer-events: none;
}

.right-content {
  position: relative;
  z-index: 1;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.right-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  line-height: 1.35;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

/* Stats Visual */
.stats-visual {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Chart Card */
.chart-card {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  font-family: 'Sora', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  letter-spacing: 0.03em;
}

.chart-period {
  font-size: 0.68rem;
  font-weight: 600;
  color: rgba(255,255,255,0.6);
  background: rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: 2px 8px;
}

/* Bar Chart */
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 7px;
  height: 80px;
  flex: 1;
}

.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
}

.bar-wrap {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  border-radius: 5px 5px 2px 2px;
  transition: height 0.6s ease;
}

.bar-label {
  font-size: 0.58rem;
  color: rgba(255,255,255,0.55);
  font-weight: 500;
  white-space: nowrap;
}

/* Ring stat (inside chart card) */
.ring-stat {
  position: relative;
  width: 64px;
  height: 64px;
  align-self: flex-end;
  margin-top: -72px;
  margin-right: 4px;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  display: none; /* hide on smaller panels, show below in metric row instead */
}

/* Metric Cards Row */
.metric-row {
  display: flex;
  gap: 10px;
}

.metric-card {
  flex: 1;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  backdrop-filter: blur(6px);
}

.metric-val {
  font-family: 'Sora', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
}

.metric-lbl {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.6);
  font-weight: 500;
}

/* Bottom row */
.right-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 50px;
  padding: 5px 12px;
  font-size: 0.72rem;
  font-weight: 600;
  color: white;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  background: #4ade80;
  border-radius: 50%;
  box-shadow: 0 0 6px #4ade80;
  animation: pulseAnim 2s ease-in-out infinite;
}

@keyframes pulseAnim {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.75); }
}

.nav-btns { display: flex; gap: 6px; }

.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255,255,255,0.75);
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}

.nav-btn:hover {
  background: rgba(255,255,255,0.25);
  color: white;
}

.nav-btn svg { width: 14px; height: 14px; }

.right-desc {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.6);
  line-height: 1.5;
  margin-top: 10px;
}

/* ==============================
   RESPONSIVE
============================== */
@media (max-width: 700px) {
  .main-card {
    flex-direction: column;
    max-width: 420px;
    min-height: unset;
  }
  .right-panel {
    width: auto;
    margin: 0 10px 10px;
    min-height: 260px;
  }
  .right-title { font-size: 1rem; }
}
</style>