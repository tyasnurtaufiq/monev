<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <Sidebar v-model="sidebarOpen" />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      
      <main class="flex-1 overflow-y-auto p-3 lg:p-6">
        <div class="max-w-5xl mx-auto">
          <!-- Page Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Manajemen User</h1>
              <p class="text-gray-500 dark:text-gray-400 mt-1">Kelola akun pengguna sistem</p>
            </div>
            <button @click="openAddModal" class="btn-accent flex items-center gap-2 self-start sm:self-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah User
            </button>
          </div>

          <!-- Search Bar -->
          <div class="card dark:bg-gray-800 dark:border-gray-700 p-4 mb-6">
            <div class="relative">
              <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Cari user berdasarkan nama, username, atau role..." 
                class="input-field pl-10" 
              />
            </div>
          </div>

          <!-- Users Table -->
          <div class="card dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th 
                    @click="toggleSort" 
                    class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-purple-600 select-none"
                  >
                    <div class="flex items-center gap-1">
                      ID
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="sortOrder === 'asc'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Nama</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Username</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Role</th>
                  <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td class="px-6 py-4">
                    <span class="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded">{{ u.id }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <p class="font-medium text-gray-900 dark:text-gray-100">{{ u.name }}</p>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ u.username }}</td>
                  <td class="px-6 py-4">
                    <span 
                      class="px-2.5 py-1 text-xs font-semibold rounded-full"
                      :class="u.role === 'admin' 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'"
                    >
                      {{ u.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center gap-2">
                      <button @click="openEditModal(u)" class="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        @click="confirmDelete(u)" 
                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        :disabled="u.id === currentUserId"
                        :class="u.id === currentUserId ? 'opacity-30 cursor-not-allowed' : ''"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>

            <div v-if="filteredUsers.length === 0" class="text-center py-12">
              <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p class="text-gray-500 font-medium">Belum ada user</p>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showModal = false"></div>
        <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">
              {{ editingUser ? 'Edit User' : 'Tambah User Baru' }}
            </h3>
            <button @click="showModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSave" class="p-6 space-y-5">
            <!-- Username -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Username <span class="text-red-500">*</span></label>
              <input v-model="form.username" type="text" placeholder="Username..." class="input-field" required />
            </div>

            <!-- Nama -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama <span class="text-red-500">*</span></label>
              <input v-model="form.name" type="text" placeholder="Nama lengkap..." class="input-field" required />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Password 
                <span v-if="!editingUser" class="text-red-500">*</span>
                <span v-else class="text-gray-400 text-xs">(kosongkan jika tidak diubah)</span>
              </label>
              <input v-model="form.password" type="password" placeholder="••••••••" class="input-field" :required="!editingUser" />
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Role <span class="text-red-500">*</span></label>
              <select v-model="form.role" class="input-field" required>
                <option value="" disabled>Pilih role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <!-- Error Message -->
            <div v-if="errorMsg" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ errorMsg }}</p>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" @click="showModal = false" class="btn-secondary">Batal</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Menyimpan...' : (editingUser ? 'Simpan' : 'Tambah') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showDeleteModal = false"></div>
        <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="p-6 text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Hapus User</h3>
            <p class="text-gray-600">Yakin ingin menghapus <strong>{{ deletingUser?.name }}</strong>?</p>
          </div>
          <div class="px-6 py-4 bg-gray-50 flex items-center justify-center gap-3">
            <button @click="showDeleteModal = false" class="btn-secondary min-w-[100px]">Batal</button>
            <button @click="handleDelete" class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors min-w-[100px]">
              Hapus
            </button>
          </div>
        </div>
      </div>
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

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    )
  }

  // Sort by ID
  result.sort((a, b) => sortOrder.value === 'asc' ? a.id - b.id : b.id - a.id)

  return result
})

const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const form = ref({
  username: '',
  name: '',
  password: '',
  role: ''
})

const fetchUsers = async () => {
  try {
    users.value = await api.get('/auth/users')
  } catch (err) {
    console.error('Failed to fetch users:', err)
  }
}

const openAddModal = () => {
  editingUser.value = null
  errorMsg.value = ''
  form.value = { username: '', name: '', password: '', role: 'user' }
  showModal.value = true
}

const openEditModal = (user) => {
  editingUser.value = user
  errorMsg.value = ''
  form.value = {
    username: user.username,
    name: user.name,
    password: '',
    role: user.role
  }
  showModal.value = true
}

const handleSave = async () => {
  saving.value = true
  errorMsg.value = ''
  try {
    if (editingUser.value) {
      // Update
      const payload = {
        username: form.value.username,
        name: form.value.name,
        role: form.value.role
      }
      if (form.value.password.trim()) {
        payload.password = form.value.password
      }
      await api.put(`/auth/users/${editingUser.value.id}`, payload)
    } else {
      // Register
      await api.post('/auth/register', {
        username: form.value.username,
        name: form.value.name,
        password: form.value.password,
        role: form.value.role
      })
    }
    showModal.value = false
    await fetchUsers()
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    saving.value = false
  }
}

const confirmDelete = (user) => {
  deletingUser.value = user
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!deletingUser.value) return
  try {
    await api.delete(`/auth/users/${deletingUser.value.id}`)
    showDeleteModal.value = false
    deletingUser.value = null
    await fetchUsers()
  } catch (err) {
    alert(err.message)
  }
}

onMounted(fetchUsers)
</script>
