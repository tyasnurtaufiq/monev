<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <Sidebar v-model="sidebarOpen" />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      
      <main class="flex-1 overflow-y-auto p-3 lg:p-6">
        <div class="max-w-4xl mx-auto">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Kalender Monitoring</h1>
              <p class="text-gray-500 dark:text-gray-400 mt-1">Lihat progress monitoring dan event per bulan</p>
            </div>
            <button 
              v-if="isAdmin" 
              @click="openAddModal()" 
              class="btn-accent flex items-center gap-2 self-start sm:self-auto"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Event
            </button>
          </div>

          <!-- Month Navigation -->
          <div class="card dark:bg-gray-800 dark:border-gray-700 p-6 mb-6">
            <div class="flex items-center justify-between mb-6">
              <button @click="prevMonth" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ monevStore.bulanNames[currentMonth - 1] }} {{ currentYear }}
              </h2>
              <button @click="nextMonth" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Calendar Grid -->
            <div class="grid grid-cols-7 gap-1">
              <!-- Day Headers -->
              <div v-for="day in ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']" :key="day"
                class="p-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                {{ day }}
              </div>

              <!-- Empty Cells -->
              <div v-for="n in startDay" :key="'empty-' + n" class="p-2"></div>

              <!-- Day Cells -->
              <div 
                v-for="d in daysInMonth" :key="d"
                class="p-1.5 lg:p-2 min-h-[50px] lg:min-h-[70px] rounded-lg border transition-colors cursor-pointer"
                :class="[
                  d === today && currentMonth === todayMonth && currentYear === todayYear
                    ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-600'
                    : isDayInWindow(d)
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400'
                      : 'border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-600'
                ]"
                @click="isAdmin && openAddModal(d)"
              >
                <div class="flex items-center gap-1">
                  <span class="text-sm font-medium" :class="d === today && currentMonth === todayMonth && currentYear === todayYear ? 'text-purple-700 dark:text-purple-400' : isDayInWindow(d) ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'">
                    {{ d }}
                  </span>
                  <span v-if="isDayInWindow(d)" class="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                </div>
                <!-- Event dots -->
                <div class="mt-1 space-y-0.5">
                  <div 
                    v-for="ev in getEventsForDay(d)" :key="ev.id"
                    @click.stop="openEventDetail(ev)"
                    class="text-xs px-1.5 py-0.5 rounded truncate font-medium cursor-pointer"
                    :class="eventColorClass(ev.color)"
                  >
                    {{ ev.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reporting Window Timer -->
          <div class="card dark:bg-gray-800 dark:border-gray-700 p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Jadwal Pelaporan</h2>
              <span 
                class="px-3 py-1 text-xs font-semibold rounded-full"
                :class="windowStatus.is_open ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'"
              >
                {{ windowStatus.is_open ? '● Dibuka' : '● Ditutup' }}
              </span>
            </div>

            <!-- Current Window Info -->
            <div v-if="windowStatus.id" class="p-4 rounded-xl mb-4" :class="windowStatus.is_open ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'">
              <p class="font-medium text-gray-900 dark:text-white mb-1">{{ windowStatus.title || 'Periode Pelaporan' }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ formatDateFull(windowStatus.start_date) }} — {{ formatDateFull(windowStatus.end_date) }}
              </p>
              <div v-if="windowStatus.is_open && countdown" class="mt-3">
                <p class="text-xs text-gray-500 mb-1">Sisa waktu:</p>
                <p class="text-lg font-bold text-emerald-700">{{ countdown }}</p>
              </div>
              <div v-else-if="!windowStatus.is_open && windowStatus.id" class="mt-2">
                <p class="text-sm text-red-600 font-medium">Periode pelaporan sudah ditutup</p>
              </div>
            </div>

            <div v-else class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-4 text-center">
              <p class="text-gray-500 text-sm">Belum ada jadwal pelaporan yang dibuat</p>
            </div>

            <!-- Admin: Set Window Form -->
            <div v-if="isAdmin" class="border-t border-gray-100 dark:border-gray-700 pt-4">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Atur Jadwal Pelaporan</h3>
              <form @submit.prevent="saveWindow" class="space-y-3">
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Judul</label>
                  <input v-model="windowForm.title" type="text" placeholder="Contoh: Periode Pelaporan Maret 2026" class="input-field" required />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tanggal Buka</label>
                    <input v-model="windowForm.start_date" type="date" class="input-field" required />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tanggal Tutup</label>
                    <input v-model="windowForm.end_date" type="date" class="input-field" required />
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button type="submit" class="btn-primary" :disabled="savingWindow">
                    {{ savingWindow ? 'Menyimpan...' : (windowStatus.id ? 'Update Jadwal' : 'Buat Jadwal') }}
                  </button>
                  <button 
                    v-if="windowStatus.id" 
                    type="button" 
                    @click="deleteWindow" 
                    class="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Monthly Summary -->
          <div class="card dark:bg-gray-800 dark:border-gray-700 p-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Ringkasan {{ monevStore.bulanNames[currentMonth - 1] }}
            </h2>

            <div v-if="monthlyRekap.length > 0" class="space-y-3">
              <div 
                v-for="item in monthlyRekap" :key="item.output_id" 
                class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <p class="font-medium text-gray-900 dark:text-gray-100 text-sm">{{ item.nama_output }}</p>
                  <div class="flex items-center gap-3 text-xs">
                    <span class="text-emerald-600 font-medium">Fisik: {{ item.realisasi_fisik }}%</span>
                    <span class="text-blue-600 font-medium">Keuangan: {{ formatCurrency(item.realisasi_keuangan) }}</span>
                  </div>
                </div>
                <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    :style="{ width: item.realisasi_fisik + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
              <p class="font-medium">Belum ada data monitoring bulan ini</p>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Add/Edit Event Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showModal = false"></div>
        <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">
              {{ editingEvent ? 'Edit Event' : 'Tambah Event' }}
            </h3>
            <button @click="showModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSave" class="p-6 space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Judul Event <span class="text-red-500">*</span></label>
              <input v-model="form.title" type="text" placeholder="Judul event..." class="input-field" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Tanggal <span class="text-red-500">*</span></label>
              <input v-model="form.event_date" type="date" class="input-field" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
              <textarea v-model="form.description" rows="3" placeholder="Deskripsi event (opsional)..." class="input-field"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Warna</label>
              <div class="flex items-center gap-3">
                <button 
                  v-for="c in colorOptions" :key="c.value"
                  type="button"
                  @click="form.color = c.value"
                  class="w-8 h-8 rounded-full border-2 transition-all"
                  :class="[c.bg, form.color === c.value ? 'border-gray-900 scale-110' : 'border-transparent']"
                ></button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMsg" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ errorMsg }}</p>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" @click="showModal = false" class="btn-secondary">Batal</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Menyimpan...' : (editingEvent ? 'Simpan' : 'Tambah') }}
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
            <h3 class="text-xl font-bold text-gray-900 mb-2">Hapus Event</h3>
            <p class="text-gray-600">Yakin ingin menghapus <strong>{{ deletingEvent?.title }}</strong>?</p>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useMonevStore } from '../stores/monev'
import { useAuthStore } from '../stores/auth'
import { api } from '../api'

import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'

const monevStore = useMonevStore()
const authStore = useAuthStore()

const isAdmin = computed(() => authStore.user?.role === 'admin')

const sidebarOpen = ref(false)

const now = new Date()
const currentMonth = ref(now.getMonth() + 1)
const currentYear = ref(now.getFullYear())
const today = now.getDate()
const todayMonth = now.getMonth() + 1
const todayYear = now.getFullYear()

// Events state
const events = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingEvent = ref(null)
const deletingEvent = ref(null)
const saving = ref(false)
const errorMsg = ref('')

const form = ref({
  title: '',
  event_date: '',
  description: '',
  color: 'purple'
})

const colorOptions = [
  { value: 'purple', bg: 'bg-purple-500' },
  { value: 'blue', bg: 'bg-blue-500' },
  { value: 'green', bg: 'bg-emerald-500' },
  { value: 'red', bg: 'bg-red-500' },
  { value: 'yellow', bg: 'bg-amber-500' },
  { value: 'pink', bg: 'bg-pink-500' }
]

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 0).getDate()
})

const startDay = computed(() => {
  const day = new Date(currentYear.value, currentMonth.value - 1, 1).getDay()
  return day === 0 ? 6 : day - 1
})

const monthlyRekap = computed(() => {
  return monevStore.rekapData.filter(r => 
    r.monitoring_id !== null && r.bulan === currentMonth.value
  )
})

const monthEvents = computed(() => {
  return events.value.sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
})

const getEventsForDay = (day) => {
  return events.value.filter(ev => {
    const d = new Date(ev.event_date)
    return d.getDate() === day && (d.getMonth() + 1) === currentMonth.value && d.getFullYear() === currentYear.value
  })
}

const eventColorClass = (color) => {
  const map = {
    purple: 'bg-purple-100 text-purple-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-emerald-100 text-emerald-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-amber-100 text-amber-700',
    pink: 'bg-pink-100 text-pink-700'
  }
  return map[color] || map.purple
}

const eventDotClass = (color) => {
  const map = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    red: 'bg-red-500',
    yellow: 'bg-amber-500',
    pink: 'bg-pink-500'
  }
  return map[color] || map.purple
}

const formatCurrency = (value) => {
  if (!value) return 'Rp 0'
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(value)
}

const isDayInWindow = (day) => {
  if (!windowStatus.value.start_date || !windowStatus.value.end_date) return false
  const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const d = new Date(dateStr)
  const start = new Date(windowStatus.value.start_date)
  const end = new Date(windowStatus.value.end_date)
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)
  d.setHours(12, 0, 0, 0)
  return d >= start && d <= end
}

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

// Fetch events for current month
const fetchEvents = async () => {
  try {
    events.value = await api.get(`/events?month=${currentMonth.value}&year=${currentYear.value}`)
  } catch (err) {
    console.error('Failed to fetch events:', err)
  }
}

const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// Watch month/year changes to refetch events
watch([currentMonth, currentYear], fetchEvents)

// Modal handlers
const openAddModal = (day) => {
  editingEvent.value = null
  errorMsg.value = ''
  const month = String(currentMonth.value).padStart(2, '0')
  const dayStr = day ? String(day).padStart(2, '0') : String(today).padStart(2, '0')
  form.value = {
    title: '',
    event_date: `${currentYear.value}-${month}-${dayStr}`,
    description: '',
    color: 'purple'
  }
  showModal.value = true
}

const openEditModal = (ev) => {
  editingEvent.value = ev
  errorMsg.value = ''
  form.value = {
    title: ev.title,
    event_date: ev.event_date.split('T')[0],
    description: ev.description || '',
    color: ev.color || 'purple'
  }
  showModal.value = true
}

const openEventDetail = (ev) => {
  if (isAdmin.value) {
    openEditModal(ev)
  }
}

const handleSave = async () => {
  saving.value = true
  errorMsg.value = ''
  try {
    if (editingEvent.value) {
      await api.put(`/events/${editingEvent.value.id}`, form.value)
    } else {
      await api.post('/events', form.value)
    }
    showModal.value = false
    await fetchEvents()
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    saving.value = false
  }
}

const confirmDelete = (ev) => {
  deletingEvent.value = ev
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!deletingEvent.value) return
  try {
    await api.delete(`/events/${deletingEvent.value.id}`)
    showDeleteModal.value = false
    deletingEvent.value = null
    await fetchEvents()
  } catch (err) {
    alert(err.message)
  }
}

// ========= REPORTING WINDOW =========
const windowStatus = ref({ is_open: false })
const windowForm = ref({ title: '', start_date: '', end_date: '' })
const savingWindow = ref(false)
const countdown = ref('')
let countdownInterval = null

const fetchWindowStatus = async () => {
  try {
    windowStatus.value = await api.get('/reporting-window/status')
    // Pre-fill form if window exists
    if (windowStatus.value.id) {
      windowForm.value = {
        title: windowStatus.value.title || '',
        start_date: windowStatus.value.start_date?.split('T')[0] || '',
        end_date: windowStatus.value.end_date?.split('T')[0] || ''
      }
    }
    startCountdown()
  } catch (err) {
    console.error('Failed to fetch window status:', err)
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
    countdown.value = `${days} hari ${hours} jam ${minutes} menit ${seconds} detik`
  }, 1000)
}

const formatDateFull = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const saveWindow = async () => {
  savingWindow.value = true
  try {
    if (windowStatus.value.id) {
      await api.put(`/reporting-window/${windowStatus.value.id}`, windowForm.value)
    } else {
      await api.post('/reporting-window', windowForm.value)
    }
    await fetchWindowStatus()
  } catch (err) {
    alert(err.message)
  } finally {
    savingWindow.value = false
  }
}

const deleteWindow = async () => {
  if (!windowStatus.value.id) return
  if (!confirm('Yakin ingin menghapus jadwal pelaporan ini?')) return
  try {
    await api.delete(`/reporting-window/${windowStatus.value.id}`)
    windowStatus.value = { is_open: false }
    windowForm.value = { title: '', start_date: '', end_date: '' }
    countdown.value = ''
  } catch (err) {
    alert(err.message)
  }
}

onMounted(async () => {
  await monevStore.fetchTahun()
  if (monevStore.selectedTahunId) {
    await monevStore.loadAllForTahun(monevStore.selectedTahunId)
  }
  await fetchEvents()
  await fetchWindowStatus()
})
</script>
