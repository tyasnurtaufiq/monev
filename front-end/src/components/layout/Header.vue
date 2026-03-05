<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 lg:px-6 py-3 flex items-center justify-between gap-3 transition-colors">
    <!-- Left: Hamburger + Reporting Window Status -->
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <!-- Hamburger (mobile only) -->
      <button 
        class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden flex-shrink-0"
        @click="$emit('toggle-sidebar')"
      >
        <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div class="flex items-center gap-3 min-w-0">
        <span 
          class="px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0"
          :class="windowStatus.is_open ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'"
        >
          {{ windowStatus.is_open ? '● Dibuka' : '● Ditutup' }}
        </span>
        <div v-if="windowStatus.is_open && countdown" class="text-sm hidden sm:block">
          <span class="text-gray-500 dark:text-gray-400">Sisa waktu:</span>
          <span class="font-semibold text-emerald-700 dark:text-emerald-400 ml-1">{{ countdown }}</span>
        </div>
        <div v-else-if="!windowStatus.is_open" class="text-sm text-red-600 dark:text-red-400 font-medium hidden sm:block">
          Pelaporan Ditutup
        </div>
      </div>
    </div>

    <!-- Right -->
    <div class="flex items-center gap-3 flex-shrink-0">
      <!-- Dark Mode Toggle -->
      <button 
        @click="toggleTheme"
        class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        :title="isDark ? 'Light Mode' : 'Dark Mode'"
      >
        <!-- Sun icon (shown in dark mode) -->
        <svg v-if="isDark" class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <!-- Moon icon (shown in light mode) -->
        <svg v-else class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <div class="relative" ref="userMenuRef">
        <button 
          @click="showMenu = !showMenu"
          class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            {{ userInitials }}
          </div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{{ authStore.user?.name || 'User' }}</span>
          <svg class="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown -->
        <div 
          v-if="showMenu"
          class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50"
        >
          <router-link 
            to="/settings" 
            class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            @click="showMenu = false"
          >
            Pengaturan
          </router-link>
          <button 
            @click="handleLogout"
            class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useTheme } from '../../composables/useTheme'
import { api } from '../../api'

defineEmits(['toggle-sidebar'])

const router = useRouter()
const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()

const showMenu = ref(false)
const userMenuRef = ref(null)
const windowStatus = ref({ is_open: false })
const countdown = ref('')
let countdownInterval = null

const userInitials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const handleLogout = () => {
  authStore.logout()
  showMenu.value = false
  router.push('/login')
}

const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showMenu.value = false
  }
}

const fetchWindowStatus = async () => {
  try {
    windowStatus.value = await api.get('/reporting-window/status')
    startCountdown()
  } catch (err) {
    windowStatus.value = { is_open: false }
  }
}

const startCountdown = () => {
  if (countdownInterval) clearInterval(countdownInterval)
  countdownInterval = setInterval(() => {
    if (!windowStatus.value.is_open || !windowStatus.value.end_date) {
      countdown.value = ''
      return
    }
    const end = new Date(windowStatus.value.end_date)
    end.setHours(23, 59, 59, 999)
    const now = new Date()
    const diff = end - now
    if (diff <= 0) {
      countdown.value = ''
      windowStatus.value.is_open = false
      clearInterval(countdownInterval)
      return
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    countdown.value = `${days}h ${hours}j ${minutes}m ${seconds}d`
  }, 1000)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchWindowStatus()
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>
