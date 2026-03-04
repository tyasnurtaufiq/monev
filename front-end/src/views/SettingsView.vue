<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />
      
      <main class="flex-1 overflow-y-auto p-6">
        <div class="max-w-2xl mx-auto">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Pengaturan</h1>
          <p class="text-gray-500 mb-8">Kelola profil dan akun Anda</p>

          <!-- Profile Card -->
          <div class="card p-6 mb-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Profil</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                <input :value="authStore.user?.username || ''" type="text" class="input-field bg-gray-50" disabled />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama</label>
                <input :value="authStore.user?.name || ''" type="text" class="input-field bg-gray-50" disabled />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <input :value="authStore.user?.role || 'user'" type="text" class="input-field bg-gray-50" disabled />
              </div>
            </div>
          </div>

          <!-- Change Password Card -->
          <div class="card p-6 mb-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Ubah Password</h2>
            
            <!-- Success Message -->
            <div v-if="successMsg" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {{ successMsg }}
            </div>
            <!-- Error Message -->
            <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {{ errorMsg }}
            </div>

            <form @submit.prevent="handleChangePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Password Lama <span class="text-red-500">*</span></label>
                <input v-model="passwordForm.currentPassword" type="password" placeholder="Masukkan password lama" class="input-field" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Password Baru <span class="text-red-500">*</span></label>
                <input v-model="passwordForm.newPassword" type="password" placeholder="Masukkan password baru" class="input-field" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password Baru <span class="text-red-500">*</span></label>
                <input v-model="passwordForm.confirmPassword" type="password" placeholder="Ulangi password baru" class="input-field" required />
              </div>
              <button 
                type="submit" 
                :disabled="savingPassword"
                class="btn-primary"
              >
                {{ savingPassword ? 'Menyimpan...' : 'Ubah Password' }}
              </button>
            </form>
          </div>

          <!-- Actions -->
          <div class="card p-6">
            <button @click="handleLogout" class="w-full py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors">
              Logout
            </button>
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

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const savingPassword = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const handleChangePassword = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errorMsg.value = 'Password baru dan konfirmasi tidak cocok'
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    errorMsg.value = 'Password baru minimal 6 karakter'
    return
  }

  savingPassword.value = true
  try {
    const result = await api.put('/auth/change-password', {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    successMsg.value = result.message || 'Password berhasil diubah'
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    savingPassword.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  await authStore.fetchProfile()
})
</script>
