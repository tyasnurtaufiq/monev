<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white">MONEV Dashboard</h1>
        <p class="text-purple-200 mt-1">Monitoring & Evaluasi Kegiatan</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Masuk ke akun Anda</h2>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
            <input 
              id="username"
              v-model="username" 
              type="text" 
              placeholder="Username" 
              required
              class="input-field" 
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div class="relative">
              <input 
                id="password"
                v-model="password" 
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••" 
                required
                class="input-field pr-12" 
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
            <span v-else>Masuk</span>
          </button>
        </form>
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
