<template>
  <aside class="w-80 bg-white border-l border-gray-100 h-screen overflow-y-auto scrollbar-thin p-6">
    <!-- Today's Schedule -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-gray-900">Today's Schedule</h3>
        <div class="flex items-center gap-2">
          <button class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Schedule Item -->
      <div class="space-y-4">
        <div class="p-4 bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-xl border border-primary-100">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-primary-600 font-medium">30 minute call with Team</span>
            <button class="text-xs text-primary-600 hover:text-primary-700">+ Invite</button>
          </div>
          <h4 class="font-semibold text-gray-900 mb-3">Project Review Meeting</h4>
          
          <!-- Timer -->
          <div class="flex items-center gap-3">
            <div class="flex -space-x-2">
              <div class="w-8 h-8 bg-pink-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium">A</div>
              <div class="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium">B</div>
              <div class="w-8 h-8 bg-accent-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium">C</div>
            </div>
            <div class="flex-1 bg-accent-500 text-white px-4 py-2 rounded-xl flex items-center justify-between">
              <span class="font-mono font-semibold">{{ formatTime(meetingTimer) }}</span>
              <button class="hover:bg-white/20 p-1 rounded transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 3l-6 6m0 0V4m0 5h5M3 21l6-6m0 0v5m0-5H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Stats -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-gray-900">Project Overview</h3>
        <button class="text-xs text-primary-600 hover:text-primary-700">See all</button>
      </div>

      <div class="p-4 bg-gray-50 rounded-xl">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900">Monitoring Kegiatan</h4>
            <p class="text-xs text-gray-500 flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
              In Progress
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ completedCount }}</p>
            <p class="text-xs text-gray-500">Completed</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-accent-600">{{ inProgressCount }}</p>
            <p class="text-xs text-gray-500">In Progress</p>
          </div>
          <div class="flex items-center justify-center">
            <div class="flex -space-x-2">
              <div class="w-7 h-7 bg-pink-400 rounded-full border-2 border-white text-white text-xs flex items-center justify-center">A</div>
              <div class="w-7 h-7 bg-blue-400 rounded-full border-2 border-white text-white text-xs flex items-center justify-center">B</div>
              <div class="w-7 h-7 bg-gray-300 rounded-full border-2 border-white text-gray-600 text-xs flex items-center justify-center">+3</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Add -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-gray-900">Quick Add</h3>
        <button class="text-gray-400 hover:text-gray-600">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="6" r="2"/>
            <circle cx="12" cy="12" r="2"/>
            <circle cx="12" cy="18" r="2"/>
          </svg>
        </button>
      </div>

      <div class="space-y-3">
        <div>
          <label class="text-xs text-gray-500 mb-1.5 block">Task Title</label>
          <input 
            v-model="quickTaskTitle"
            type="text" 
            placeholder="Create new task..."
            class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <!-- Quick emoji/icon picker -->
            <button 
              v-for="emoji in quickEmojis" 
              :key="emoji"
              @click="selectedEmoji = emoji"
              class="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded-lg transition-colors"
              :class="selectedEmoji === emoji ? 'bg-primary-100' : ''"
            >
              {{ emoji }}
            </button>
          </div>
          <button 
            @click="addQuickTask"
            :disabled="!quickTaskTitle.trim()"
            class="w-10 h-10 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-300 text-white rounded-full
                   flex items-center justify-center transition-colors shadow-lg shadow-accent-500/30"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useActivitiesStore } from '../../stores/activities'

const activitiesStore = useActivitiesStore()

const quickTaskTitle = ref('')
const selectedEmoji = ref('📋')
const quickEmojis = ['📋', '🎨', '🔧', '📊', '🚀', '💡', '🎯']

// Meeting timer (simulated)
const meetingTimer = ref(28 * 60 + 35) // 28:35

const completedCount = computed(() => activitiesStore.completedActivities.length)
const inProgressCount = computed(() => activitiesStore.activeActivities.length)

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const addQuickTask = () => {
  if (quickTaskTitle.value.trim()) {
    activitiesStore.addActivity({
      title: quickTaskTitle.value.trim(),
      description: `Quick task added from sidebar ${selectedEmoji.value}`,
      divisionId: 1,
      status: 'pending',
      priority: 'medium',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignees: ['Admin User']
    })
    quickTaskTitle.value = ''
  }
}

// Timer countdown
let timerInterval
onMounted(() => {
  timerInterval = setInterval(() => {
    if (meetingTimer.value > 0) {
      meetingTimer.value--
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timerInterval)
})
</script>
