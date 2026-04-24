<template>
  <div class="settings-root">
    <Sidebar v-model="sidebarOpen" />

    <div class="settings-body">
      <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="settings-main">
        <div class="settings-inner">

          <!-- ── TOP BAR ── -->
          <div class="topbar">
            <div class="topbar-left">
              <div class="page-eyebrow">
                <span class="eyebrow-dot"></span>
                Akun
              </div>
              <h1 class="page-title">Pengaturan <span class="highlight">Profil</span></h1>
              <p class="page-sub">Kelola profil dan akun Anda</p>
            </div>
          </div>

          <!-- ── CONTENT LAYOUT ── -->
          <div class="settings-layout">

            <!-- ─── LEFT: Navigation / Quick Info ─── -->
            <aside class="settings-aside">
              <!-- User Avatar Card -->
              <div class="aside-card aside-card--profile">
                <div class="aside-avatar">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="aside-user-info">
                  <p class="aside-user-name">{{ authStore.user?.name || 'Administrator' }}</p>
                  <p class="aside-user-username">@{{ authStore.user?.username || 'admin' }}</p>
                  <span class="aside-role-badge" :class="authStore.user?.role === 'admin' ? 'badge--admin' : 'badge--user'">
                    {{ authStore.user?.role || 'user' }}
                  </span>
                </div>
              </div>

              <!-- Nav Links -->
              <nav class="aside-nav">
                <a href="#section-profile" class="aside-nav-item aside-nav-item--active">
                  <div class="nav-icon nav-icon--blue">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span>Informasi Profil</span>
                </a>
                <a href="#section-password" class="aside-nav-item">
                  <div class="nav-icon nav-icon--purple">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span>Ubah Password</span>
                </a>
                <a href="#section-logout" class="aside-nav-item aside-nav-item--danger">
                  <div class="nav-icon nav-icon--red">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span>Keluar</span>
                </a>
              </nav>
            </aside>

            <!-- ─── RIGHT: Content Cards ─── -->
            <div class="settings-content">

              <!-- ── SECTION: Informasi Profil ── -->
              <section id="section-profile" class="settings-card">
                <div class="card-header card-header--blue">
                  <div class="card-header-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="card-title">Informasi Profil</h2>
                    <p class="card-subtitle">Data akun yang sedang login</p>
                  </div>
                </div>

                <div class="card-body">
                  <div class="field-row">
                    <div class="field-group">
                      <label class="field-label">Username</label>
                      <div class="field-static">
                        <svg class="field-static-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{{ authStore.user?.username || '—' }}</span>
                      </div>
                    </div>

                    <div class="field-group">
                      <label class="field-label">Nama Lengkap</label>
                      <div class="field-static">
                        <svg class="field-static-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{{ authStore.user?.name || '—' }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="field-divider"></div>

                  <div class="field-group">
                    <label class="field-label">Role / Hak Akses</label>
                    <div class="role-display">
                      <span class="role-badge" :class="authStore.user?.role === 'admin' ? 'role-badge--admin' : 'role-badge--user'">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {{ authStore.user?.role === 'admin' ? 'Administrator' : 'User' }}
                      </span>
                      <p class="role-desc">
                        {{ authStore.user?.role === 'admin'
                          ? 'Memiliki akses penuh ke seluruh modul sistem'
                          : 'Akses terbatas sesuai kebijakan sistem' }}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- ── SECTION: Ubah Password ── -->
              <section id="section-password" class="settings-card">
                <div class="card-header card-header--purple">
                  <div class="card-header-icon card-header-icon--purple">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="card-title">Ubah Password</h2>
                    <p class="card-subtitle">Perbarui kata sandi akun Anda secara berkala</p>
                  </div>
                </div>

                <div class="card-body">
                  <!-- Alert Messages -->
                  <div v-if="successMsg" class="alert alert--success">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ successMsg }}
                  </div>
                  <div v-if="errorMsg" class="alert alert--error">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ errorMsg }}
                  </div>

                  <form @submit.prevent="handleChangePassword" class="settings-form">
                    <div class="field-group">
                      <label class="field-label">
                        Password Lama
                        <span class="required">*</span>
                      </label>
                      <div class="input-wrap">
                        <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        <input v-model="passwordForm.currentPassword" type="password"
                          placeholder="Masukkan password lama" class="form-input" required />
                      </div>
                    </div>

                    <div class="field-divider"></div>

                    <div class="field-row">
                      <div class="field-group">
                        <label class="field-label">
                          Password Baru
                          <span class="required">*</span>
                        </label>
                        <div class="input-wrap">
                          <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <input v-model="passwordForm.newPassword" type="password"
                            placeholder="Min. 6 karakter" class="form-input" required />
                        </div>
                      </div>
                      <div class="field-group">
                        <label class="field-label">
                          Konfirmasi Password Baru
                          <span class="required">*</span>
                        </label>
                        <div class="input-wrap">
                          <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <input v-model="passwordForm.confirmPassword" type="password"
                            placeholder="Ulangi password baru" class="form-input" required />
                        </div>
                      </div>
                    </div>

                    <div class="form-action">
                      <button type="submit" class="btn-save" :disabled="savingPassword">
                        <svg v-if="!savingPassword" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-else class="spin-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {{ savingPassword ? 'Menyimpan...' : 'Simpan Password Baru' }}
                      </button>
                    </div>
                  </form>
                </div>
              </section>

              <!-- ── SECTION: Logout ── -->
              <section id="section-logout" class="settings-card settings-card--danger">
                <div class="card-header card-header--red">
                  <div class="card-header-icon card-header-icon--red">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="card-title card-title--danger">Keluar dari Sistem</h2>
                    <p class="card-subtitle">Akhiri sesi login Anda saat ini</p>
                  </div>
                </div>

                <div class="card-body">
                  <div class="logout-info">
                    <div class="logout-info-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p class="logout-desc">
                      Pastikan semua perubahan telah disimpan sebelum logout. Anda akan diarahkan ke halaman login setelah sesi berakhir.
                    </p>
                  </div>
                  <div class="logout-action">
                    <button @click="handleLogout" class="btn-logout">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout Sekarang
                    </button>
                  </div>
                </div>
              </section>

            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { api } from '../api'

import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'

const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const savingPassword = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const handleChangePassword = async () => {
  errorMsg.value = ''; successMsg.value = ''
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errorMsg.value = 'Password baru dan konfirmasi tidak cocok'; return
  }
  if (passwordForm.value.newPassword.length < 6) {
    errorMsg.value = 'Password baru minimal 6 karakter'; return
  }
  savingPassword.value = true
  try {
    const result = await api.put('/auth/change-password', {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    successMsg.value = result.message || 'Password berhasil diubah'
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (err) { errorMsg.value = err.message }
  finally { savingPassword.value = false }
}

const handleLogout = () => { authStore.logout(); router.push('/login') }

onMounted(async () => { await authStore.fetchProfile() })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

* { box-sizing: border-box; }

/* ============================================================
   ROOT LAYOUT
   ============================================================ */
.settings-root {
  display: flex;
  height: 100vh;
  background: #f0f6ff;
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
}

.settings-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.settings-main {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
}

@media (min-width: 1024px) {
  .settings-main { padding: 32px 36px; }
}

.settings-inner {
  max-width: 1100px;
  margin: 0 auto;
}

/* ============================================================
   TOPBAR
   ============================================================ */
.topbar {
  margin-bottom: 28px;
}

.page-eyebrow {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #0ea5e9;
  margin-bottom: 6px;
}

.eyebrow-dot {
  width: 6px; height: 6px;
  background: #0ea5e9;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(14,165,233,.15);
}

.page-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.65rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.15;
  letter-spacing: -.025em;
  margin: 0 0 4px;
}

.highlight {
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-sub {
  font-size: 0.875rem;
  color: #475569;
  margin: 0;
}

/* ============================================================
   SETTINGS LAYOUT (Sidebar + Content)
   ============================================================ */
.settings-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .settings-layout {
    grid-template-columns: 240px 1fr;
    align-items: start;
  }
}

/* ============================================================
   LEFT ASIDE
   ============================================================ */
.settings-aside {
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 0;
}

/* Profile Card in Aside */
.aside-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #dbeafe;
  box-shadow: 0 1px 3px rgba(37,99,235,.04), 0 4px 16px rgba(37,99,235,.07);
  overflow: hidden;
}

.aside-card--profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px;
  gap: 12px;
  background: linear-gradient(160deg, #eff6ff 0%, #ffffff 60%);
  border-top: 3px solid #0ea5e9;
  text-align: center;
}

.aside-avatar {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0f2fe, #bae6fd);
  border: 3px solid #ffffff;
  box-shadow: 0 0 0 3px #bae6fd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0284c7;
}
.aside-avatar svg { width: 30px; height: 30px; }

.aside-user-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 2px;
}

.aside-user-username {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0 0 8px;
  font-weight: 500;
}

.aside-role-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  padding: 3px 12px;
  border-radius: 50px;
}

.badge--admin { background: #ede9fe; color: #7c3aed; }
.badge--user  { background: #e0f2fe; color: #0284c7; }

/* Aside Navigation */
.aside-nav {
  background: #ffffff;
  border: 1px solid #dbeafe;
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(37,99,235,.04), 0 4px 16px rgba(37,99,235,.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.aside-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  font-size: 0.83rem;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: background .15s, color .15s, border-color .15s;
  border-bottom: 1px solid #f0f6ff;
}

.aside-nav-item:last-child { border-bottom: none; }

.aside-nav-item:hover {
  background: #f8faff;
  color: #0f172a;
}

.aside-nav-item--active {
  background: #eff6ff;
  color: #2563eb;
  border-left-color: #2563eb;
  font-weight: 700;
}

.aside-nav-item--danger:hover { background: #fff1f2; color: #dc2626; }
.aside-nav-item--danger.aside-nav-item--active { color: #dc2626; border-left-color: #dc2626; }

.nav-icon {
  width: 30px; height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.nav-icon svg { width: 15px; height: 15px; }

.nav-icon--blue   { background: #dbeafe; color: #2563eb; }
.nav-icon--purple { background: #ede9fe; color: #7c3aed; }
.nav-icon--red    { background: #fee2e2; color: #dc2626; }

/* ============================================================
   RIGHT CONTENT
   ============================================================ */
.settings-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ============================================================
   SETTINGS CARD
   ============================================================ */
.settings-card {
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #dbeafe;
  box-shadow: 0 1px 3px rgba(37,99,235,.04), 0 4px 16px rgba(37,99,235,.07);
  overflow: hidden;
  transition: box-shadow .2s;
}

.settings-card:hover {
  box-shadow: 0 4px 24px rgba(37,99,235,.1);
}

.settings-card--danger {
  border-color: #fecdd3;
}

.settings-card--danger:hover {
  box-shadow: 0 4px 24px rgba(220,38,38,.08);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  border-bottom: 1px solid #dbeafe;
  background: linear-gradient(to right, #f8faff, #ffffff);
}

.card-header--purple { border-bottom-color: #e9d5ff; background: linear-gradient(to right, #faf5ff, #ffffff); }
.card-header--red    { border-bottom-color: #fecdd3; background: linear-gradient(to right, #fff5f5, #ffffff); }

.card-header-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #2563eb;
}
.card-header-icon svg { width: 20px; height: 20px; }

.card-header-icon--purple {
  background: linear-gradient(135deg, #ede9fe, #ddd6fe);
  border-color: #ddd6fe;
  color: #7c3aed;
}

.card-header-icon--red {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  border-color: #fecaca;
  color: #dc2626;
}

.card-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 3px;
  letter-spacing: -.02em;
}

.card-title--danger { color: #dc2626; }

.card-subtitle {
  font-size: 0.77rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
}

/* Card Body */
.card-body {
  padding: 22px 24px;
}

/* ============================================================
   FIELD COMPONENTS
   ============================================================ */
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 600px) {
  .field-row { grid-template-columns: 1fr; }
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.required { color: #ef4444; margin-left: 2px; }

/* Static field (read-only display) */
.field-static {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  color: #0f172a;
  font-size: 0.88rem;
  font-weight: 600;
}

.field-static-icon {
  width: 15px; height: 15px;
  color: #94a3b8;
  flex-shrink: 0;
}

/* Divider */
.field-divider {
  height: 1px;
  background: linear-gradient(to right, #dbeafe, transparent);
  margin: 18px 0;
  border-radius: 1px;
}

/* Role Display */
.role-display {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 7px 16px;
  border-radius: 50px;
  text-transform: capitalize;
}
.role-badge svg { width: 14px; height: 14px; }

.role-badge--admin { background: #ede9fe; color: #7c3aed; border: 1px solid #ddd6fe; }
.role-badge--user  { background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; }

.role-desc {
  font-size: 0.77rem;
  color: #94a3b8;
  margin: 0;
  font-style: italic;
}

/* ============================================================
   FORM INPUT
   ============================================================ */
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  width: 15px; height: 15px;
  color: #94a3b8;
  pointer-events: none;
  flex-shrink: 0;
}

.form-input {
  width: 100%;
  padding: 10px 14px 10px 38px;
  border: 1.5px solid #dbeafe;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
  background: #ffffff;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}

.form-input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14,165,233,.12);
}

.form-input::placeholder { color: #cbd5e1; }

/* ============================================================
   ALERTS
   ============================================================ */
.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  padding: 11px 15px;
  font-size: 0.83rem;
  font-weight: 600;
  margin-bottom: 18px;
}
.alert svg { width: 17px; height: 17px; flex-shrink: 0; }

.alert--success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
.alert--error   { background: #fff1f2; border: 1px solid #fecdd3; color: #dc2626; }

/* ============================================================
   BUTTONS
   ============================================================ */
.form-action {
  display: flex;
  justify-content: flex-start;
  padding-top: 4px;
}

.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 26px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  border: none;
  border-radius: 11px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform .15s, box-shadow .15s;
  box-shadow: 0 2px 10px rgba(14,165,233,.3);
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 18px rgba(14,165,233,.4);
}

.btn-save:disabled {
  opacity: .6;
  cursor: not-allowed;
  transform: none;
}

.btn-save svg { width: 15px; height: 15px; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin-icon { animation: spin .7s linear infinite; }

/* ============================================================
   LOGOUT SECTION
   ============================================================ */
.logout-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: #fff5f5;
  border: 1px solid #fecdd3;
  border-radius: 12px;
  margin-bottom: 18px;
}

.logout-info-icon {
  width: 34px; height: 34px;
  background: #fee2e2;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #dc2626;
}
.logout-info-icon svg { width: 17px; height: 17px; }

.logout-desc {
  font-size: 0.84rem;
  color: #991b1b;
  margin: 0;
  line-height: 1.6;
  font-weight: 500;
}

.logout-action { display: flex; justify-content: flex-start; }

.btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  background: #ffffff;
  color: #dc2626;
  border: 1.5px solid #fca5a5;
  border-radius: 11px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s, border-color .15s, transform .15s, box-shadow .15s;
}

.btn-logout:hover {
  background: #fee2e2;
  border-color: #f87171;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(220,38,38,.15);
}

.btn-logout svg { width: 16px; height: 16px; }
</style>
