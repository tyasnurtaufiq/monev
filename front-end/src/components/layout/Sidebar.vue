<template>
  <!-- Mobile backdrop -->
  <div
    v-if="modelValue"
    class="mobile-backdrop"
    @click="$emit('update:modelValue', false)"
  ></div>

  <aside
    class="sidebar"
    :class="{ 'sidebar--open': modelValue }"
  >
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <div class="logo-text-block">
        <span class="logo-name">MONEV <strong>DISHUB</strong></span>
        <span class="logo-sub">Monitoring &amp; Evaluasi</span>
      </div>
      <!-- Close button mobile -->
      <button class="close-btn" @click="$emit('update:modelValue', false)">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Nav label -->
    <div class="nav-section-label">MENU UTAMA</div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ 'nav-item--active': $route.path === item.to }"
        @click="$emit('update:modelValue', false)"
      >
        <span class="nav-icon">
          <component :is="item.icon" />
        </span>
        <span class="nav-label">{{ item.label }}</span>
        <span v-if="$route.path === item.to" class="nav-active-dot"></span>
      </router-link>
    </nav>

    <!-- Status badge -->
    <div class="sidebar-status">
      <span class="pulse-dot"></span>
      <span>Sistem Aktif</span>
    </div>

    <!-- User -->
    <div class="sidebar-user">
      <div class="user-avatar">{{ userInitials }}</div>
      <div class="user-info">
        <span class="user-name">{{ authStore.user?.name || 'User' }}</span>
        <span class="user-role">{{ authStore.user?.role || 'user' }}</span>
      </div>
      <div class="user-indicator"></div>
    </div>
  </aside>
</template>

<script setup>
import { computed, h } from 'vue'
import { useAuthStore } from '../../stores/auth'

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const authStore = useAuthStore()

const userInitials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const DashboardIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' })
  ])
}

const KegiatanIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' })
  ])
}

const LaporanIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
  ])
}

const RekapIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' })
  ])
}

const KalenderIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
  ])
}

const SettingsIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
  ])
}

const UsersIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
  ])
}

const allNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { to: '/kegiatan', label: 'Kegiatan', icon: KegiatanIcon, adminOnly: true },
  { to: '/laporan', label: 'Laporan', icon: LaporanIcon },
  { to: '/rekap', label: 'Rekap', icon: RekapIcon },
  { to: '/kalender', label: 'Kalender', icon: KalenderIcon },
  { to: '/users', label: 'Kelola User', icon: UsersIcon, adminOnly: true },
  { to: '/settings', label: 'Pengaturan', icon: SettingsIcon }
]

const navItems = computed(() => {
  const role = authStore.user?.role
  return allNavItems.filter(item => !item.adminOnly || role === 'admin')
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

/* ==============================
   BACKDROP
============================== */
.mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 40;
  backdrop-filter: blur(2px);
}

@media (min-width: 1024px) {
  .mobile-backdrop { display: none; }
}

/* ==============================
   SIDEBAR SHELL
============================== */
.sidebar {
  position: fixed;
  inset-y: 0;
  left: 0;
  width: 248px;
  background: white;
  border-right: 1px solid #e8edf5;
  display: flex;
  flex-direction: column;
  z-index: 50;
  transform: translateX(-100%);
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'DM Sans', sans-serif;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.06);
}

@media (min-width: 1024px) {
  .sidebar {
    position: relative;
    transform: translateX(0);
    box-shadow: none;
  }
}

.sidebar--open {
  transform: translateX(0);
}

/* ==============================
   LOGO
============================== */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 18px;
  border-bottom: 1px solid #f1f5f9;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: #eff6ff;
  border-radius: 10px;
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

.logo-text-block {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.logo-name {
  font-family: 'Sora', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: #64748b;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.logo-name strong {
  color: #1e293b;
  font-weight: 700;
}

.logo-sub {
  font-size: 0.68rem;
  color: #b0bec5;
  white-space: nowrap;
}

.close-btn {
  margin-left: auto;
  width: 28px;
  height: 28px;
  border: none;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.18s;
  flex-shrink: 0;
}

.close-btn:hover {
  background: #fee2e2;
  color: #ef4444;
}

.close-btn svg { width: 15px; height: 15px; }

@media (min-width: 1024px) {
  .close-btn { display: none; }
}

/* ==============================
   NAV SECTION LABEL
============================== */
.nav-section-label {
  padding: 16px 18px 6px;
  font-family: 'Sora', sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #cbd5e1;
  text-transform: uppercase;
}

/* ==============================
   NAV ITEMS
============================== */
.sidebar-nav {
  flex: 1;
  padding: 4px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.sidebar-nav::-webkit-scrollbar { width: 0; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 0.855rem;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: all 0.18s ease;
  position: relative;
}

.nav-item:hover {
  background: #f8fafc;
  color: #1e293b;
}

.nav-item:hover .nav-icon {
  color: #2563eb;
}

/* Active state */
.nav-item--active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.nav-item--active .nav-icon {
  color: #2563eb;
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #b0bec5;
  transition: color 0.18s;
}

.nav-icon svg {
  width: 18px;
  height: 18px;
}

.nav-label {
  flex: 1;
}

.nav-active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2563eb;
  flex-shrink: 0;
}

/* ==============================
   STATUS BADGE
============================== */
.sidebar-status {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 10px 8px;
  padding: 8px 12px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #16a34a;
  letter-spacing: 0.02em;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  background: #4ade80;
  border-radius: 50%;
  box-shadow: 0 0 6px #4ade80;
  animation: pulseAnim 2s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes pulseAnim {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.7); }
}

/* ==============================
   USER FOOTER
============================== */
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid #f1f5f9;
  background: #fafbfd;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Sora', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  letter-spacing: 0.03em;
}

.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.user-name {
  font-family: 'Sora', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.68rem;
  color: #94a3b8;
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 5px rgba(74, 222, 128, 0.6);
  flex-shrink: 0;
}
</style>