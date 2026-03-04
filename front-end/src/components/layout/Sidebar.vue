<template>
  <aside class="w-64 bg-white border-r border-gray-100 flex flex-col h-full">
    <!-- Logo -->
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 class="font-bold text-gray-900">MONEV</h2>
          <p class="text-xs text-gray-500">Monitoring & Evaluasi</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1">
      <router-link 
        v-for="item in navItems" :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
        :class="$route.path === item.to 
          ? 'bg-purple-50 text-purple-700' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        {{ item.label }}
      </router-link>
    </nav>

    <!-- User -->
    <div class="p-4 border-t border-gray-100">
      <div class="flex items-center gap-3 px-4 py-3">
        <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user?.name || 'User' }}</p>
          <p class="text-xs text-gray-500 truncate">{{ authStore.user?.role || 'user' }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, h } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const userInitials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

// Simple SVG icon components
const DashboardIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' })
  ])
}

const KegiatanIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' })
  ])
}

const LaporanIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
  ])
}

const KalenderIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
  ])
}

const SettingsIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
  ])
}

const UsersIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
  ])
}

const allNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { to: '/kegiatan', label: 'Kegiatan', icon: KegiatanIcon, adminOnly: true },
  { to: '/laporan', label: 'Laporan', icon: LaporanIcon },
  { to: '/kalender', label: 'Kalender', icon: KalenderIcon },
  { to: '/users', label: 'Kelola User', icon: UsersIcon, adminOnly: true },
  { to: '/settings', label: 'Pengaturan', icon: SettingsIcon }
]

const navItems = computed(() => {
  const role = authStore.user?.role
  return allNavItems.filter(item => !item.adminOnly || role === 'admin')
})
</script>
