<template>
  <div class="users-root">
    <Sidebar v-model="sidebarOpen" />

    <div class="users-body">
      <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="users-main">
        <div class="users-inner">

          <!-- ── TOP BAR ── -->
          <div class="topbar">
            <div class="topbar-left">
              <div class="page-eyebrow">
                <span class="eyebrow-dot"></span>
                Admin
              </div>
              <h1 class="page-title">Manajemen <span class="highlight">User</span></h1>
              <p class="page-sub">Kelola akun pengguna sistem</p>
            </div>
            <div class="topbar-right">
              <button @click="openAddModal" class="btn-primary-action">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah User
              </button>
            </div>
          </div>

          <!-- ── STAT STRIP ── -->
          <div class="stat-strip">
            <div class="stat-chip stat-chip--blue">
              <div class="stat-chip-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p class="stat-chip-val">{{ users.length }}</p>
                <p class="stat-chip-lbl">Total User</p>
              </div>
            </div>
            <div class="stat-chip stat-chip--purple">
              <div class="stat-chip-icon stat-chip-icon--purple">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p class="stat-chip-val">{{ users.filter(u => u.role === 'admin').length }}</p>
                <p class="stat-chip-lbl">Administrator</p>
              </div>
            </div>
            <div class="stat-chip stat-chip--cyan">
              <div class="stat-chip-icon stat-chip-icon--cyan">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p class="stat-chip-val">{{ users.filter(u => u.role === 'user').length }}</p>
                <p class="stat-chip-lbl">User Biasa</p>
              </div>
            </div>
          </div>

          <!-- ── MAIN CARD ── -->
          <div class="main-card">

            <!-- Card Header -->
            <div class="card-header">
              <div class="card-header-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div class="card-header-text">
                <h2 class="card-title">Daftar User</h2>
                <p class="card-subtitle">{{ filteredUsers.length }} user ditemukan</p>
              </div>

              <!-- Search in header -->
              <div class="search-wrap">
                <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Cari nama, username, atau role..."
                  class="search-input"
                />
              </div>
            </div>

            <!-- Table -->
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th @click="toggleSort" class="th-sortable">
                      <div class="th-inner">
                        ID
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path v-if="sortOrder === 'asc'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </th>
                    <th>User</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th class="th-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredUsers.length === 0">
                    <td colspan="5">
                      <div class="empty-state">
                        <div class="empty-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p class="empty-title">Belum ada user</p>
                        <p class="empty-sub">Tambah user pertama dengan klik tombol di atas</p>
                      </div>
                    </td>
                  </tr>
                  <tr v-for="u in filteredUsers" :key="u.id" class="table-row">
                    <td>
                      <span class="id-badge">{{ u.id }}</span>
                    </td>
                    <td>
                      <div class="user-cell">
                        <div class="user-avatar" :class="u.role === 'admin' ? 'avatar--admin' : 'avatar--user'">
                          {{ (u.name || u.username || '?').charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <p class="user-name">{{ u.name }}</p>
                          <p class="user-id-hint">#{{ u.id }}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="username-pill">@{{ u.username }}</span>
                    </td>
                    <td>
                      <span class="role-badge" :class="u.role === 'admin' ? 'role-badge--admin' : 'role-badge--user'">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path v-if="u.role === 'admin'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {{ u.role === 'admin' ? 'Administrator' : 'User' }}
                      </span>
                    </td>
                    <td>
                      <div class="action-btns">
                        <button @click="openEditModal(u)" class="action-btn action-btn--edit" title="Edit User">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          @click="confirmDelete(u)"
                          class="action-btn action-btn--delete"
                          title="Hapus User"
                          :disabled="u.id === currentUserId"
                          :class="u.id === currentUserId ? 'action-btn--disabled' : ''"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </main>
    </div>

    <!-- ── ADD / EDIT MODAL ── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <div class="modal-panel">

            <!-- Modal Header -->
            <div class="modal-header" :class="editingUser ? 'modal-header--edit' : 'modal-header--add'">
              <div class="modal-header-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="editingUser" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h3 class="modal-title">{{ editingUser ? 'Edit User' : 'Tambah User Baru' }}</h3>
                <p class="modal-subtitle">{{ editingUser ? `Perbarui data akun ${editingUser.name}` : 'Buat akun pengguna baru' }}</p>
              </div>
              <button @click="showModal = false" class="modal-close">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Form -->
            <form @submit.prevent="handleSave" class="modal-form">

              <div v-if="errorMsg" class="modal-alert">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errorMsg }}
              </div>

              <div class="form-row">
                <div class="field-group">
                  <label class="field-label">Username <span class="required">*</span></label>
                  <div class="input-wrap">
                    <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <input v-model="form.username" type="text" placeholder="contoh: john_doe" class="form-input" required />
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Nama Lengkap <span class="required">*</span></label>
                  <div class="input-wrap">
                    <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input v-model="form.name" type="text" placeholder="Nama lengkap..." class="form-input" required />
                  </div>
                </div>
              </div>

              <div class="field-divider"></div>

              <div class="form-row">
                <div class="field-group">
                  <label class="field-label">
                    Password
                    <span v-if="!editingUser" class="required">*</span>
                    <span v-else class="field-hint">(kosongkan jika tidak diubah)</span>
                  </label>
                  <div class="input-wrap">
                    <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input v-model="form.password" type="password" placeholder="••••••••" class="form-input" :required="!editingUser" />
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Role <span class="required">*</span></label>
                  <div class="input-wrap">
                    <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <select v-model="form.role" class="form-input form-select" required>
                      <option value="" disabled>Pilih role...</option>
                      <option value="admin">Administrator</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Role preview -->
              <div v-if="form.role" class="role-preview" :class="form.role === 'admin' ? 'role-preview--admin' : 'role-preview--user'">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ form.role === 'admin'
                  ? 'Administrator memiliki akses penuh ke seluruh modul sistem'
                  : 'User memiliki akses terbatas sesuai kebijakan sistem' }}
              </div>

              <!-- Footer -->
              <div class="modal-footer">
                <button type="button" @click="showModal = false" class="btn-cancel">Batal</button>
                <button type="submit" class="btn-save" :disabled="saving">
                  <svg v-if="!saving" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="spin-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {{ saving ? 'Menyimpan...' : (editingUser ? 'Simpan Perubahan' : 'Tambah User') }}
                </button>
              </div>
            </form>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── DELETE CONFIRM MODAL ── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
          <div class="modal-panel modal-panel--sm">

            <div class="delete-body">
              <div class="delete-icon-wrap">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 class="delete-title">Hapus User?</h3>
              <p class="delete-desc">
                Tindakan ini tidak dapat dibatalkan.<br>
                User <strong>{{ deletingUser?.name }}</strong> akan dihapus permanen.
              </p>
            </div>

            <div class="delete-footer">
              <button @click="showDeleteModal = false" class="btn-cancel">Batal</button>
              <button @click="handleDelete" class="btn-danger">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Ya, Hapus
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { api } from '../api'

import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'

const authStore = useAuthStore()
const currentUserId = computed(() => authStore.user?.id)
const sidebarOpen = ref(false)

const users = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingUser = ref(null)
const deletingUser = ref(null)
const saving = ref(false)
const errorMsg = ref('')
const searchQuery = ref('')
const sortOrder = ref('asc')

const filteredUsers = computed(() => {
  let result = [...users.value]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    )
  }
  result.sort((a, b) => sortOrder.value === 'asc' ? a.id - b.id : b.id - a.id)
  return result
})

const toggleSort = () => { sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc' }

const form = ref({ username: '', name: '', password: '', role: '' })

const fetchUsers = async () => {
  try { users.value = await api.get('/auth/users') }
  catch (err) { console.error('Failed to fetch users:', err) }
}

const openAddModal = () => {
  editingUser.value = null; errorMsg.value = ''
  form.value = { username: '', name: '', password: '', role: 'user' }
  showModal.value = true
}

const openEditModal = (user) => {
  editingUser.value = user; errorMsg.value = ''
  form.value = { username: user.username, name: user.name, password: '', role: user.role }
  showModal.value = true
}

const handleSave = async () => {
  saving.value = true; errorMsg.value = ''
  try {
    if (editingUser.value) {
      const payload = { username: form.value.username, name: form.value.name, role: form.value.role }
      if (form.value.password.trim()) payload.password = form.value.password
      await api.put(`/auth/users/${editingUser.value.id}`, payload)
    } else {
      await api.post('/auth/register', { username: form.value.username, name: form.value.name, password: form.value.password, role: form.value.role })
    }
    showModal.value = false; await fetchUsers()
  } catch (err) { errorMsg.value = err.message }
  finally { saving.value = false }
}

const confirmDelete = (user) => { deletingUser.value = user; showDeleteModal.value = true }

const handleDelete = async () => {
  if (!deletingUser.value) return
  try {
    await api.delete(`/auth/users/${deletingUser.value.id}`)
    showDeleteModal.value = false; deletingUser.value = null; await fetchUsers()
  } catch (err) { alert(err.message) }
}

onMounted(fetchUsers)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

* { box-sizing: border-box; }

/* ============================================================
   ROOT LAYOUT
   ============================================================ */
.users-root {
  display: flex;
  height: 100vh;
  background: #f0f6ff;
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
}

.users-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.users-main {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
}

@media (min-width: 1024px) {
  .users-main { padding: 32px 36px; }
}

.users-inner {
  max-width: 1280px;
  margin: 0 auto;
}

/* ============================================================
   TOPBAR
   ============================================================ */
.topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
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

/* Primary Button */
.btn-primary-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 11px 22px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(14,165,233,.3);
  transition: transform .18s, box-shadow .18s;
}
.btn-primary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(14,165,233,.4);
}
.btn-primary-action svg { width: 15px; height: 15px; }

/* ============================================================
   STAT STRIP
   ============================================================ */
.stat-strip {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #dbeafe;
  border-radius: 14px;
  padding: 14px 18px;
  box-shadow: 0 1px 3px rgba(37,99,235,.04), 0 4px 12px rgba(37,99,235,.06);
  min-width: 140px;
  flex: 1;
  transition: transform .18s, box-shadow .18s;
}

.stat-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37,99,235,.1);
}

.stat-chip-icon {
  width: 40px; height: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #dbeafe;
  color: #2563eb;
}
.stat-chip-icon svg { width: 18px; height: 18px; }

.stat-chip-icon--purple { background: #ede9fe; color: #7c3aed; }
.stat-chip-icon--cyan   { background: #cffafe; color: #0891b2; }

.stat-chip-val {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.4rem;
  font-weight: 900;
  color: #0f172a;
  margin: 0 0 1px;
  line-height: 1;
  letter-spacing: -.03em;
}

.stat-chip-lbl {
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: .05em;
}

/* ============================================================
   MAIN CARD
   ============================================================ */
.main-card {
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #dbeafe;
  box-shadow: 0 1px 3px rgba(37,99,235,.04), 0 4px 16px rgba(37,99,235,.07);
  overflow: hidden;
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  border-bottom: 1px solid #dbeafe;
  background: linear-gradient(to right, #f8faff, #ffffff);
  flex-wrap: wrap;
}

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

.card-header-text { flex: 1; min-width: 0; }

.card-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 2px;
  letter-spacing: -.02em;
}

.card-subtitle {
  font-size: 0.77rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
}

/* Search in header */
.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8faff;
  border: 1.5px solid #dbeafe;
  border-radius: 11px;
  padding: 9px 14px;
  transition: border-color .2s, box-shadow .2s;
  min-width: 260px;
}

.search-wrap:focus-within {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14,165,233,.1);
}

.search-icon {
  width: 16px; height: 16px;
  color: #94a3b8;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.84rem;
  font-weight: 500;
  color: #0f172a;
  background: transparent;
}
.search-input::placeholder { color: #cbd5e1; }

/* ============================================================
   TABLE
   ============================================================ */
.table-wrap { overflow-x: auto; }

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead tr {
  background: #f8faff;
  border-bottom: 1.5px solid #dbeafe;
}

.data-table th {
  padding: 12px 20px;
  text-align: left;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: .1em;
  white-space: nowrap;
}

.th-center { text-align: center; }

.th-sortable {
  cursor: pointer;
  user-select: none;
  transition: color .15s;
}
.th-sortable:hover { color: #0ea5e9; }

.th-inner {
  display: flex;
  align-items: center;
  gap: 4px;
}
.th-inner svg { width: 12px; height: 12px; }

.data-table td {
  padding: 14px 20px;
  vertical-align: middle;
  border-bottom: 1px solid #f0f6ff;
}

.table-row { transition: background .12s; }
.table-row:hover { background: #fafcff; }
.data-table tbody tr:last-child td { border-bottom: none; }

/* Id badge */
.id-badge {
  font-family: 'Plus Jakarta Sans', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  color: #0284c7;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  padding: 3px 9px;
  border-radius: 7px;
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 34px; height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 800;
  flex-shrink: 0;
}
.avatar--admin { background: #ede9fe; color: #7c3aed; }
.avatar--user  { background: #dbeafe; color: #2563eb; }

.user-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1px;
}

.user-id-hint {
  font-size: 0.68rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
}

/* Username */
.username-pill {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 3px 10px;
  border-radius: 7px;
  font-family: 'DM Sans', monospace;
}

/* Role badge */
.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: 50px;
  text-transform: capitalize;
  white-space: nowrap;
}
.role-badge svg { width: 11px; height: 11px; }

.role-badge--admin { background: #ede9fe; color: #7c3aed; border: 1px solid #ddd6fe; }
.role-badge--user  { background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; }

/* Action buttons */
.action-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1.5px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  background: transparent;
  transition: background .15s, color .15s, border-color .15s, transform .12s;
  white-space: nowrap;
}
.action-btn svg { width: 13px; height: 13px; }

.action-btn--edit {
  color: #475569;
  border-color: #e2e8f0;
  background: #f8fafc;
}
.action-btn--edit:hover {
  color: #0284c7;
  background: #e0f2fe;
  border-color: #bae6fd;
  transform: translateY(-1px);
}

.action-btn--delete {
  color: #475569;
  border-color: #e2e8f0;
  background: #f8fafc;
}
.action-btn--delete:hover:not(:disabled) {
  color: #dc2626;
  background: #fee2e2;
  border-color: #fecaca;
  transform: translateY(-1px);
}

.action-btn--disabled {
  opacity: .35;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 24px;
}

.empty-icon {
  width: 52px; height: 52px;
  color: #bfdbfe;
  margin-bottom: 12px;
}
.empty-icon svg { width: 52px; height: 52px; }

.empty-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: .92rem;
  font-weight: 700;
  color: #475569;
  margin: 0 0 4px;
}

.empty-sub {
  font-size: .78rem;
  color: #94a3b8;
  margin: 0;
}

/* ============================================================
   MODALS
   ============================================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(15,23,42,.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-panel {
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 24px 64px rgba(15,23,42,.25);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.modal-panel--sm {
  max-width: 400px;
}

/* Modal Transition */
.modal-enter-active, .modal-leave-active { transition: opacity .2s ease; }
.modal-enter-active .modal-panel, .modal-leave-active .modal-panel {
  transition: transform .22s cubic-bezier(.34,1.56,.64,1);
}
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-panel { transform: translateY(20px) scale(0.97); }
.modal-leave-to .modal-panel { transform: translateY(10px) scale(0.97); }

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px;
  border-bottom: 1px solid #dbeafe;
}

.modal-header--add { background: linear-gradient(135deg, #eff6ff, #f8faff); }
.modal-header--edit { background: linear-gradient(135deg, #faf5ff, #f8faff); }

.modal-header-icon {
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
.modal-header--edit .modal-header-icon {
  background: linear-gradient(135deg, #ede9fe, #ddd6fe);
  border-color: #ddd6fe;
  color: #7c3aed;
}
.modal-header-icon svg { width: 20px; height: 20px; }

.modal-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 2px;
  letter-spacing: -.02em;
}

.modal-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
}

.modal-close {
  margin-left: auto;
  width: 32px; height: 32px;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: background .15s;
  flex-shrink: 0;
}
.modal-close:hover { background: #e2e8f0; }
.modal-close svg { width: 16px; height: 16px; }

/* Modal Form */
.modal-form {
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Alert in modal */
.modal-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 0.83rem;
  font-weight: 600;
  color: #dc2626;
}
.modal-alert svg { width: 16px; height: 16px; flex-shrink: 0; }

/* Form fields */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
@media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: .07em;
}

.field-hint {
  font-size: 0.68rem;
  color: #94a3b8;
  font-weight: 500;
  margin-left: 4px;
  text-transform: none;
  letter-spacing: 0;
}

.required { color: #ef4444; }

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 11px;
  width: 15px; height: 15px;
  color: #94a3b8;
  pointer-events: none;
  flex-shrink: 0;
}

.form-input {
  width: 100%;
  padding: 10px 13px 10px 36px;
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
  box-shadow: 0 0 0 3px rgba(14,165,233,.1);
}

.form-input::placeholder { color: #cbd5e1; }

.form-select { cursor: pointer; }

/* Field Divider */
.field-divider {
  height: 1px;
  background: linear-gradient(to right, #dbeafe, transparent);
  border-radius: 1px;
  margin: 2px 0;
}

/* Role preview */
.role-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.79rem;
  font-weight: 600;
  line-height: 1.5;
}
.role-preview svg { width: 15px; height: 15px; flex-shrink: 0; }

.role-preview--admin { background: #faf5ff; border: 1px solid #e9d5ff; color: #7c3aed; }
.role-preview--user  { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; }

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding-top: 8px;
  border-top: 1px solid #f0f6ff;
}

/* Buttons */
.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 22px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  border: none;
  border-radius: 10px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(14,165,233,.3);
  transition: transform .15s, box-shadow .15s;
}
.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(14,165,233,.4);
}
.btn-save:disabled { opacity: .6; cursor: not-allowed; transform: none; }
.btn-save svg { width: 14px; height: 14px; }

.btn-cancel {
  padding: 10px 22px;
  background: #f1f5f9;
  color: #475569;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s, border-color .15s;
}
.btn-cancel:hover { background: #e2e8f0; border-color: #cbd5e1; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin-icon { animation: spin .7s linear infinite; }

/* ── DELETE MODAL ── */
.delete-body {
  padding: 32px 24px 20px;
  text-align: center;
  background: #ffffff;
}

.delete-icon-wrap {
  width: 68px; height: 68px;
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  border: 3px solid #ffffff;
  box-shadow: 0 0 0 4px #fecaca;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.delete-icon-wrap svg { width: 28px; height: 28px; color: #dc2626; }

.delete-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px;
  letter-spacing: -.02em;
}

.delete-desc {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

.delete-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  background: #f8faff;
  border-top: 1px solid #dbeafe;
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 22px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 10px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s, transform .15s, box-shadow .15s;
  box-shadow: 0 2px 10px rgba(220,38,38,.25);
}
.btn-danger:hover {
  background: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(220,38,38,.35);
}
.btn-danger svg { width: 14px; height: 14px; }
</style>
