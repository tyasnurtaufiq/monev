<template>
  <div class="login-page">
    <!-- Animated Background -->
    <div class="bg-layer"></div>
    <div class="bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex items-center justify-center min-h-screen p-4">
      <div class="w-full max-w-md">

        <!-- Logo & Branding -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl mb-5 animate-float">
            <svg class="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            MONEV <span class="text-purple-300">DISHUB DIY</span>
          </h1>
          <p class="text-purple-200/80 mt-2 text-sm font-medium">Sistem Monitoring & Evaluasi Kegiatan</p>
        </div>

        <!-- Login Card - Glassmorphism -->
        <div class="login-card">
          <div class="p-8">
            <h2 class="text-xl font-bold text-white mb-1 text-center">Selamat Datang!</h2>
            <p class="text-gray-400 text-sm mb-7 text-center">Masuk untuk mengakses dashboard monitoring</p>

            <!-- Error Message -->
            <div v-if="error" class="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-sm flex items-center gap-2">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ error }}
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">
              <!-- Username -->
              <div>
                <label for="username" class="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input 
                    id="username"
                    v-model="username" 
                    type="text" 
                    placeholder="Masukkan username" 
                    required
                    class="login-input pl-12"
                  />
                </div>
              </div>

              <!-- Password -->
              <div>
                <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input 
                    id="password"
                    v-model="password" 
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••" 
                    required
                    class="login-input pl-12 pr-12"
                  />
                  <button 
                    type="button" 
                    @click="showPassword = !showPassword"
                    class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
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

              <!-- Login Button -->
              <button 
                type="submit" 
                :disabled="loading"
                class="login-btn group"
              >
                <span v-if="loading" class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  Masuk
                  <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </form>
          </div>

          <!-- Footer -->
          <div class="px-8 py-4 border-t border-white/5 text-center">
            <p class="text-xs text-gray-500">Dinas Perhubungan DIY &copy; {{ new Date().getFullYear() }}</p>
          </div>
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
.login-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.bg-layer {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #0f0a1e 0%, #1a1145 25%, #200e4a 50%, #12082a 100%);
}

/* Animated floating shapes */
.bg-shapes {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float-shape 20s infinite ease-in-out;
}

.shape-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #7c3aed, #6366f1);
  top: -10%;
  right: -10%;
  animation-delay: 0s;
  animation-duration: 25s;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  bottom: -10%;
  left: -10%;
  animation-delay: -5s;
  animation-duration: 20s;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -10s;
  animation-duration: 30s;
}

.shape-4 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #8b5cf6, #d946ef);
  bottom: 20%;
  right: 20%;
  animation-delay: -7s;
  animation-duration: 22s;
}

@keyframes float-shape {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -40px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.95); }
  75% { transform: translate(40px, 30px) scale(1.05); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

/* Login card - glassmorphism */
.login-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Input styling */
.login-input {
  width: 100%;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-right: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.875rem;
  color: white;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  outline: none;
}

.login-input::placeholder {
  color: rgba(156, 163, 175, 0.6);
}

.login-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
}

/* Login button */
.login-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #7c3aed, #6366f1);
  color: white;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 10px 25px -5px rgba(124, 58, 237, 0.4),
    0 0 0 1px rgba(124, 58, 237, 0.2);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 
    0 15px 35px -5px rgba(124, 58, 237, 0.5),
    0 0 0 1px rgba(124, 58, 237, 0.3);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
