<template>
  <header class="app-header">
    <!-- Left: Hamburger + Window Status -->
    <div class="header-left">
      <!-- Hamburger (mobile only) -->
      <button class="hamburger-btn" @click="$emit('toggle-sidebar')">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Reporting Window Status -->
      <div class="window-status">
        <span class="status-badge" :class="windowStatus.is_open ? 'status-badge--open' : 'status-badge--closed'">
          <span class="status-dot"></span>
          {{ windowStatus.is_open ? 'Dibuka' : 'Ditutup' }}
        </span>

        <div v-if="windowStatus.is_open && countdown" class="countdown-wrap">
          <span class="countdown-label">Sisa waktu</span>
          <span class="countdown-value">{{ countdown }}</span>
        </div>
        <div v-else-if="!windowStatus.is_open" class="closed-text">
          Pelaporan Ditutup
        </div>
      </div>
    </div>

    <!-- Right -->
    <div class="header-right">
      <!-- Dark Mode Toggle -->
      <button class="icon-btn" @click="toggleTheme" :title="isDark ? 'Light Mode' : 'Dark Mode'">
        <svg v-if="isDark" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="icon-sun">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" class="icon-moon">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <!-- User Menu -->
      <div class="user-menu-wrap" ref="userMenuRef">
        <button class="user-btn" @click="showMenu = !showMenu">
          <div class="user-avatar">{{ userInitials }}</div>
          <span class="user-name">{{ authStore.user?.name || 'User' }}</span>
          <svg class="chevron-icon" :class="{ 'chevron-icon--open': showMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown -->
        <transition name="dropdown">
          <div v-if="showMenu" class="dropdown-menu">
            <div class="dropdown-header">
              <div class="dropdown-avatar">{{ userInitials }}</div>
              <div class="dropdown-user-info">
                <span class="dropdown-name">{{ authStore.user?.name || 'User' }}</span>
                <span class="dropdown-role">{{ authStore.user?.role || 'user' }}</span>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <router-link to="/settings" class="dropdown-item" @click="showMenu = false">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Pengaturan
            </router-link>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item dropdown-item--danger" @click="handleLogout">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </transition>
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

/* ==============================
   HEADER SHELL
============================== */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 60px;
  padding: 0 20px;
  background: white;
  border-bottom: 1px solid #f1f5f9;
  font-family: 'DM Sans', sans-serif;
  position: sticky;
  top: 0;
  z-index: 30;
}

/* ==============================
   LEFT SIDE
============================== */
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

/* Hamburger */
.hamburger-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f8fafc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.18s;
  flex-shrink: 0;
}

.hamburger-btn:hover {
  background: #eff6ff;
  color: #2563eb;
}

.hamburger-btn svg { width: 18px; height: 18px; }

@media (min-width: 1024px) {
  .hamburger-btn { display: none; }
}

/* Window Status */
.window-status {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 50px;
  font-family: 'Sora', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  flex-shrink: 0;
}

.status-badge--open {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.status-badge--closed {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-badge--open .status-dot {
  background: #4ade80;
  box-shadow: 0 0 5px rgba(74, 222, 128, 0.7);
  animation: pulseAnim 2s ease-in-out infinite;
}

.status-badge--closed .status-dot {
  background: #f87171;
}

@keyframes pulseAnim {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.7); }
}

.countdown-wrap {
  display: flex;
  align-items: center;
  gap: 5px;
}

.countdown-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 400;
}

.countdown-value {
  font-family: 'Sora', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  color: #16a34a;
  letter-spacing: 0.02em;
}

.closed-text {
  font-size: 0.78rem;
  color: #ef4444;
  font-weight: 500;
}

@media (max-width: 639px) {
  .countdown-wrap,
  .closed-text { display: none; }
}

/* ==============================
   RIGHT SIDE
============================== */
.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

/* Icon button (theme toggle) */
.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f8fafc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s;
  color: #64748b;
}

.icon-btn:hover {
  background: #eff6ff;
  color: #2563eb;
}

.icon-sun  { width: 18px; height: 18px; color: #f59e0b; }
.icon-moon { width: 18px; height: 18px; }

/* User button */
.user-menu-wrap {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px 5px 5px;
  background: #f8fafc;
  border: 1px solid #e8edf5;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.18s;
}

.user-btn:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Sora', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  letter-spacing: 0.03em;
}

.user-name {
  font-family: 'Sora', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #1e293b;
  max-width: 110px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 639px) {
  .user-name { display: none; }
}

.chevron-icon {
  width: 14px;
  height: 14px;
  color: #94a3b8;
  transition: transform 0.2s ease;
}

.chevron-icon--open {
  transform: rotate(180deg);
}

@media (max-width: 639px) {
  .chevron-icon { display: none; }
}

/* ==============================
   DROPDOWN
============================== */
.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 210px;
  background: white;
  border: 1px solid #e8edf5;
  border-radius: 16px;
  box-shadow:
    0 10px 32px rgba(0, 0, 0, 0.10),
    0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  z-index: 50;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 12px;
}

.dropdown-avatar {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Sora', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  letter-spacing: 0.03em;
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.dropdown-name {
  font-family: 'Sora', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-role {
  font-size: 0.68rem;
  color: #94a3b8;
  text-transform: capitalize;
}

.dropdown-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 10px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: #475569;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s;
  text-align: left;
}

.dropdown-item svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  color: #94a3b8;
  transition: color 0.15s;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #1e293b;
}

.dropdown-item:hover svg {
  color: #2563eb;
}

.dropdown-item--danger { color: #dc2626; }
.dropdown-item--danger svg { color: #fca5a5; }

.dropdown-item--danger:hover {
  background: #fef2f2;
  color: #b91c1c;
}

.dropdown-item--danger:hover svg {
  color: #ef4444;
}

/* ==============================
   DROPDOWN TRANSITION
============================== */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>