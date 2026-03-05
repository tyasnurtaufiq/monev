<template>
  <!-- Mobile backdrop -->
  <div 
    v-if="modelValue" 
    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    @click="$emit('update:modelValue', false)"
  ></div>

  <aside 
    class="bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col h-full z-50
           fixed inset-y-0 left-0 w-64 transform transition-all duration-300 lg:relative lg:translate-x-0"
    :class="modelValue ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Logo -->
    <div class="p-6 border-b border-gray-100 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 class="font-bold text-gray-900 dark:text-white whitespace-nowrap text-sm">MONEV <span class="text-purple-600 dark:text-purple-400">DISHUB DIY</span></h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">Monitoring & Evaluasi</p>
        </div>
        <!-- Close button (mobile only) -->
        <button 
          class="ml-auto p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
          @click="$emit('update:modelValue', false)"
        >
          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1">
      <router-link 
        v-for="item in navItems" :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
        :class="$route.path === item.to 
          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'"
        @click="$emit('update:modelValue', false)"
      >
        <component :is="item.icon" class="w-5 h-5" />
        {{ item.label }}
      </router-link>
    </nav>

    <!-- User -->
    <div class="p-4 border-t border-gray-100 dark:border-gray-700">
      <div class="flex items-center gap-3 px-4 py-3">
        <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ authStore.user?.name || 'User' }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ authStore.user?.role || 'user' }}</p>
        </div>
      </div>
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
