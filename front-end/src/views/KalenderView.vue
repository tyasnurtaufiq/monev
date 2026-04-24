<template>
  <div class="dashboard-root">
    <Sidebar v-model="sidebarOpen" />

    <div class="dashboard-body">
      <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="dashboard-main">
        <div class="dashboard-inner">

          <!-- TOP BAR -->
          <div class="topbar">
            <div class="topbar-left">
              <div class="page-eyebrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="eyebrow-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Kalender
              </div>
              <h1 class="page-title">Kalender <span class="highlight">Monitoring</span></h1>
              <p class="page-sub">Jadwal kegiatan dan periode pelaporan bulanan</p>
            </div>
            <div class="topbar-right">
              <button v-if="isAdmin" @click="openAddModal()" class="btn-primary-action">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Event
              </button>
            </div>
          </div>

          <!-- MAIN GRID: Calendar (left) + Jadwal Pelaporan (right) -->
          <div class="main-grid">

            <!-- ══ LEFT: CALENDAR ══ -->
            <div class="cal-card">

              <!-- Cal Header -->
              <div class="cal-header">
                <div class="cal-header-left">
                  <div class="cal-month-display">
                    <span class="cal-month-name">{{ monevStore.bulanNames[currentMonth - 1] }}</span>
                    <span class="cal-year-name">{{ currentYear }}</span>
                  </div>
                  <div class="cal-header-meta">
                    <span class="event-count-badge">{{ totalEventsThisMonth }} event</span>
                    <span class="cal-header-sub">bulan ini</span>
                  </div>
                </div>
                <div class="cal-nav">
                  <button @click="prevMonth" class="cal-nav-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button @click="goToToday" class="cal-today-btn">Hari Ini</button>
                  <button @click="nextMonth" class="cal-nav-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Day name strip -->
              <div class="cal-daynames">
                <span v-for="d in ['SEN','SEL','RAB','KAM','JUM','SAB','MIN']" :key="d" class="cal-dayname">{{ d }}</span>
              </div>

              <!-- Calendar Grid -->
              <div class="cal-grid-wrap">
                <div class="cal-grid">
                  <div v-for="n in startDay" :key="'e'+n" class="cal-cell cal-cell--empty"></div>
                  <div
                    v-for="d in daysInMonth" :key="d"
                    class="cal-cell"
                    :class="{
                      'cal-cell--today':   d === today && currentMonth === todayMonth && currentYear === todayYear,
                      'cal-cell--window':  isDayInWindow(d) && !(d === today && currentMonth === todayMonth && currentYear === todayYear),
                      'cal-cell--weekend': isWeekend(d),
                    }"
                    @click="isAdmin && openAddModal(d)"
                  >
                    <span class="cal-day-num">{{ d }}</span>
                    <div class="cal-dots">
                      <span
                        v-for="ev in getEventsForDay(d).slice(0,3)" :key="ev.id"
                        class="cal-dot"
                        :class="'dot--'+ev.color"
                        @click.stop="openEventDetail(ev)"
                        :title="ev.title"
                      ></span>
                      <span v-if="getEventsForDay(d).length > 3" class="cal-dot-more">+{{ getEventsForDay(d).length - 3 }}</span>
                    </div>
                    <span v-if="isDayInWindow(d)" class="window-stripe"></span>
                  </div>
                </div>
              </div>

              <!-- Cal Footer: legend + event list -->
              <div class="cal-footer">
                <div class="legend-row">
                  <div class="legend-item">
                    <span class="legend-swatch legend-swatch--today"></span>
                    <span>Hari ini</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-swatch legend-swatch--window"></span>
                    <span>Periode laporan</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-swatch legend-swatch--weekend"></span>
                    <span>Akhir pekan</span>
                  </div>
                </div>

                <div v-if="totalEventsThisMonth > 0" class="event-list">
                  <div class="event-list-title">Event Bulan Ini</div>
                  <div
                    v-for="ev in allEventsThisMonth" :key="ev.id"
                    class="event-list-item"
                    @click="isAdmin && openEventDetail(ev)"
                  >
                    <span class="event-list-dot" :class="'dot--'+ev.color"></span>
                    <div class="event-list-info">
                      <span class="event-list-name">{{ ev.title }}</span>
                      <span class="event-list-date">{{ formatShortDate(ev.event_date) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ══ RIGHT: JADWAL PELAPORAN ══ -->
            <div class="jadwal-card">

              <!-- Banner -->
              <div class="jadwal-banner" :class="windowStatus.is_open ? 'jadwal-banner--open' : 'jadwal-banner--closed'">
                <div class="jadwal-banner-left">
                  <div class="jadwal-banner-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p class="jadwal-banner-label">Jadwal Pelaporan</p>
                    <p class="jadwal-banner-title">{{ windowStatus.title || 'Belum ada periode aktif' }}</p>
                  </div>
                </div>
                <span class="status-pill" :class="windowStatus.is_open ? 'status-pill--open' : 'status-pill--closed'">
                  <span class="status-dot" :class="windowStatus.is_open ? 'status-dot--open' : ''"></span>
                  {{ windowStatus.is_open ? 'Dibuka' : 'Ditutup' }}
                </span>
              </div>

              <div class="jadwal-body">

                <!-- Window exists -->
                <div v-if="windowStatus.id">
                  <!-- Date Range -->
                  <div class="date-range-row">
                    <div class="date-range-block">
                      <div class="date-range-icon date-range-icon--start">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p class="date-range-label">Dibuka</p>
                        <p class="date-range-value">{{ formatDateMedium(windowStatus.start_date) }}</p>
                      </div>
                    </div>
                    <div class="date-range-arrow">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                    <div class="date-range-block">
                      <div class="date-range-icon date-range-icon--end">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p class="date-range-label">Ditutup</p>
                        <p class="date-range-value">{{ formatDateMedium(windowStatus.end_date) }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Countdown -->
                  <div v-if="windowStatus.is_open && countdownParts.length" class="countdown-section">
                    <p class="countdown-heading">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Sisa Waktu Pelaporan
                    </p>
                    <div class="countdown-grid">
                      <div v-for="(p, i) in countdownParts" :key="i" class="cdown-box">
                        <span class="cdown-num">{{ p.value }}</span>
                        <span class="cdown-lbl">{{ p.label }}</span>
                      </div>
                    </div>
                    <div class="countdown-bar-wrap">
                      <div class="countdown-bar" :style="{ width: windowProgressPct + '%' }"></div>
                    </div>
                    <p class="countdown-bar-label">{{ Math.round(windowProgressPct) }}% waktu telah berlalu</p>
                  </div>

                  <!-- Closed notice -->
                  <div v-else-if="!windowStatus.is_open" class="closed-notice">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p class="closed-notice-title">Periode Pelaporan Ditutup</p>
                      <p class="closed-notice-sub">Laporan sudah tidak dapat dikirimkan untuk periode ini.</p>
                    </div>
                  </div>
                </div>

                <!-- No window -->
                <div v-else class="no-window">
                  <div class="no-window-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p class="no-window-title">Belum ada jadwal pelaporan</p>
                  <p class="no-window-sub">Gunakan form di bawah untuk membuat jadwal baru</p>
                </div>

                <!-- Divider -->
                <div class="section-divider"></div>

                <!-- Admin form -->
                <div v-if="isAdmin" class="admin-section">
                  <div class="admin-section-header">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Atur Jadwal Pelaporan
                  </div>
                  <form @submit.prevent="saveWindow" class="admin-form">
                    <div class="form-group">
                      <label class="form-label">Judul Periode</label>
                      <input v-model="windowForm.title" type="text" placeholder="Contoh: Periode Pelaporan April 2026" class="form-input" required />
                    </div>
                    <div class="form-row-2">
                      <div class="form-group">
                        <label class="form-label">Tanggal Buka</label>
                        <div class="input-icon-wrap">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="input-icon">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <input v-model="windowForm.start_date" type="date" class="form-input form-input--icon" required />
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Tanggal Tutup</label>
                        <div class="input-icon-wrap">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="input-icon">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <input v-model="windowForm.end_date" type="date" class="form-input form-input--icon" required />
                        </div>
                      </div>
                    </div>
                    <div class="form-actions">
                      <button type="submit" class="btn-save" :disabled="savingWindow">
                        <svg v-if="savingWindow" class="btn-spinner" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10"></circle>
                        </svg>
                        <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:14px;height:14px;">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {{ savingWindow ? 'Menyimpan...' : (windowStatus.id ? 'Update Jadwal' : 'Buat Jadwal') }}
                      </button>
                      <button v-if="windowStatus.id" type="button" @click="deleteWindow" class="btn-danger-outline">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>

          </div>
          <!-- end main-grid -->

        </div>
      </main>
    </div>

    <!-- Add/Edit Event Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-backdrop" @click="showModal = false"></div>
        <div class="modal-box">
          <div class="modal-header">
            <div class="modal-header-left">
              <div class="modal-icon-wrap">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="modal-title">{{ editingEvent ? 'Edit Event' : 'Tambah Event' }}</h3>
            </div>
            <button @click="showModal = false" class="modal-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form @submit.prevent="handleSave" class="modal-form">
            <div class="form-group">
              <label class="form-label">Judul Event <span class="required">*</span></label>
              <input v-model="form.title" type="text" placeholder="Judul event..." class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Tanggal <span class="required">*</span></label>
              <input v-model="form.event_date" type="date" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Deskripsi</label>
              <textarea v-model="form.description" rows="3" placeholder="Deskripsi event (opsional)..." class="form-input form-textarea"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Warna Label</label>
              <div class="color-picker">
                <button v-for="c in colorOptions" :key="c.value" type="button" @click="form.color = c.value"
                  class="color-swatch" :class="[c.bgClass, form.color === c.value ? 'color-swatch--active' : '']"></button>
              </div>
            </div>
            <div v-if="errorMsg" class="error-msg">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errorMsg }}
            </div>
            <div class="modal-footer">
              <button type="button" @click="showModal = false" class="btn-cancel">Batal</button>
              <button type="submit" class="btn-save" :disabled="saving">
                <svg v-if="saving" class="btn-spinner" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10"></circle>
                </svg>
                {{ saving ? 'Menyimpan...' : (editingEvent ? 'Simpan' : 'Tambah') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-backdrop" @click="showDeleteModal = false"></div>
        <div class="modal-box modal-box--sm">
          <div class="delete-modal-body">
            <div class="delete-icon-wrap">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="delete-title">Hapus Event</h3>
            <p class="delete-desc">Yakin ingin menghapus <strong>{{ deletingEvent?.title }}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <div class="delete-footer">
            <button @click="showDeleteModal = false" class="btn-cancel">Batal</button>
            <button @click="handleDelete" class="btn-danger">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
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

const events = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingEvent = ref(null)
const deletingEvent = ref(null)
const saving = ref(false)
const errorMsg = ref('')

const form = ref({ title: '', event_date: '', description: '', color: 'blue' })

const colorOptions = [
  { value: 'blue',   bgClass: 'bg-blue' },
  { value: 'green',  bgClass: 'bg-green' },
  { value: 'amber',  bgClass: 'bg-amber' },
  { value: 'red',    bgClass: 'bg-red' },
  { value: 'purple', bgClass: 'bg-purple' },
  { value: 'pink',   bgClass: 'bg-pink' },
]

const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value, 0).getDate())
const startDay = computed(() => {
  const day = new Date(currentYear.value, currentMonth.value - 1, 1).getDay()
  return day === 0 ? 6 : day - 1
})
const allEventsThisMonth = computed(() => events.value.slice().sort((a, b) => new Date(a.event_date) - new Date(b.event_date)))
const totalEventsThisMonth = computed(() => allEventsThisMonth.value.length)

const getEventsForDay = (day) =>
  events.value.filter(ev => {
    const d = new Date(ev.event_date)
    return d.getDate() === day && (d.getMonth() + 1) === currentMonth.value && d.getFullYear() === currentYear.value
  })

const isWeekend = (day) => {
  const dow = new Date(currentYear.value, currentMonth.value - 1, day).getDay()
  return dow === 0 || dow === 6
}

const isDayInWindow = (day) => {
  if (!windowStatus.value.start_date || !windowStatus.value.end_date) return false
  const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  const d = new Date(dateStr), start = new Date(windowStatus.value.start_date), end = new Date(windowStatus.value.end_date)
  start.setHours(0,0,0,0); end.setHours(23,59,59,999); d.setHours(12,0,0,0)
  return d >= start && d <= end
}

const fetchEvents = async () => {
  try { events.value = await api.get(`/events?month=${currentMonth.value}&year=${currentYear.value}`) }
  catch (err) { console.error('Failed to fetch events:', err) }
}

const prevMonth = () => { if (currentMonth.value === 1) { currentMonth.value = 12; currentYear.value-- } else currentMonth.value-- }
const nextMonth = () => { if (currentMonth.value === 12) { currentMonth.value = 1; currentYear.value++ } else currentMonth.value++ }
const goToToday = () => { currentMonth.value = todayMonth; currentYear.value = todayYear }

watch([currentMonth, currentYear], fetchEvents)

const openAddModal = (day) => {
  editingEvent.value = null; errorMsg.value = ''
  const month = String(currentMonth.value).padStart(2,'0')
  const dayStr = day ? String(day).padStart(2,'0') : String(today).padStart(2,'0')
  form.value = { title: '', event_date: `${currentYear.value}-${month}-${dayStr}`, description: '', color: 'blue' }
  showModal.value = true
}
const openEditModal = (ev) => {
  editingEvent.value = ev; errorMsg.value = ''
  form.value = { title: ev.title, event_date: ev.event_date.split('T')[0], description: ev.description || '', color: ev.color || 'blue' }
  showModal.value = true
}
const openEventDetail = (ev) => { if (isAdmin.value) openEditModal(ev) }

const handleSave = async () => {
  saving.value = true; errorMsg.value = ''
  try {
    if (editingEvent.value) await api.put(`/events/${editingEvent.value.id}`, form.value)
    else await api.post('/events', form.value)
    showModal.value = false; await fetchEvents()
  } catch (err) { errorMsg.value = err.message }
  finally { saving.value = false }
}

const handleDelete = async () => {
  if (!deletingEvent.value) return
  try {
    await api.delete(`/events/${deletingEvent.value.id}`)
    showDeleteModal.value = false; deletingEvent.value = null; await fetchEvents()
  } catch (err) { alert(err.message) }
}

// Reporting window
const windowStatus = ref({ is_open: false })
const windowForm = ref({ title: '', start_date: '', end_date: '' })
const savingWindow = ref(false)
const countdownParts = ref([])
let countdownInterval = null

const windowProgressPct = computed(() => {
  if (!windowStatus.value.start_date || !windowStatus.value.end_date) return 0
  const start = new Date(windowStatus.value.start_date).getTime()
  const end = new Date(windowStatus.value.end_date); end.setHours(23,59,59,999)
  const total = end.getTime() - start
  const elapsed = Date.now() - start
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
})

const fetchWindowStatus = async () => {
  try {
    windowStatus.value = await api.get('/reporting-window/status')
    if (windowStatus.value.id) {
      windowForm.value = {
        title: windowStatus.value.title || '',
        start_date: windowStatus.value.start_date?.split('T')[0] || '',
        end_date: windowStatus.value.end_date?.split('T')[0] || ''
      }
    }
    startCountdown()
  } catch (err) { console.error('Failed to fetch window status:', err) }
}

const startCountdown = () => {
  if (countdownInterval) clearInterval(countdownInterval)
  countdownInterval = setInterval(() => {
    if (!windowStatus.value.is_open || !windowStatus.value.end_date) { countdownParts.value = []; return }
    const end = new Date(windowStatus.value.end_date); end.setHours(23,59,59,999)
    const diff = end - new Date()
    if (diff <= 0) { countdownParts.value = []; windowStatus.value.is_open = false; clearInterval(countdownInterval); return }
    const days = Math.floor(diff / 86400000), hours = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000), seconds = Math.floor((diff % 60000) / 1000)
    countdownParts.value = [
      { value: String(days).padStart(2,'0'), label: 'Hari' },
      { value: String(hours).padStart(2,'0'), label: 'Jam' },
      { value: String(minutes).padStart(2,'0'), label: 'Menit' },
      { value: String(seconds).padStart(2,'0'), label: 'Detik' },
    ]
  }, 1000)
}

const formatDateMedium = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
const formatShortDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const saveWindow = async () => {
  savingWindow.value = true
  try {
    if (windowStatus.value.id) await api.put(`/reporting-window/${windowStatus.value.id}`, windowForm.value)
    else await api.post('/reporting-window', windowForm.value)
    await fetchWindowStatus()
  } catch (err) { alert(err.message) }
  finally { savingWindow.value = false }
}

const deleteWindow = async () => {
  if (!windowStatus.value.id) return
  if (!confirm('Yakin ingin menghapus jadwal pelaporan ini?')) return
  try {
    await api.delete(`/reporting-window/${windowStatus.value.id}`)
    windowStatus.value = { is_open: false }; windowForm.value = { title: '', start_date: '', end_date: '' }; countdownParts.value = []
  } catch (err) { alert(err.message) }
}

onMounted(async () => {
  await monevStore.fetchTahun()
  if (monevStore.selectedTahunId) await monevStore.loadAllForTahun(monevStore.selectedTahunId)
  await fetchEvents(); await fetchWindowStatus()
})
onBeforeUnmount(() => { if (countdownInterval) clearInterval(countdownInterval) })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

/* ── TOKENS ── */
:root {
  --c-bg:        #e8edf5;
  --c-surface:   #ffffff;
  --c-border:    #e2e8f0;
  --c-text-1:    #0f172a;
  --c-text-2:    #475569;
  --c-text-3:    #94a3b8;
  --c-accent:    #2563eb;
  --radius-card: 20px;
  --shadow-card: 0 4px 20px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.05);
}
* { box-sizing: border-box; margin: 0; padding: 0; }

/* ── LAYOUT ── */
.dashboard-root { display: flex; height: 100vh; background: var(--c-bg); font-family: 'DM Sans', sans-serif; }
.dashboard-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.dashboard-main { flex: 1; overflow-y: auto; padding: 24px 20px; }
@media (min-width: 1024px) { .dashboard-main { padding: 32px 36px; } }
.dashboard-inner { max-width: 1280px; margin: 0 auto; }

/* ── TOPBAR ── */
.topbar { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 28px; }
.page-eyebrow { display: inline-flex; align-items: center; gap: 6px; font-family: 'Sora', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--c-accent); margin-bottom: 5px; }
.eyebrow-icon { width: 12px; height: 12px; }
.page-title { font-family: 'Sora', sans-serif; font-size: 1.65rem; font-weight: 800; color: var(--c-text-1); line-height: 1.15; letter-spacing: -.03em; margin-bottom: 4px; }
.highlight { background: linear-gradient(135deg, #2563eb, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.page-sub { font-size: 0.85rem; color: var(--c-text-2); }
.btn-primary-action { display: inline-flex; align-items: center; gap: 8px; background: #2563eb; color: white; border: none; border-radius: 50px; padding: 10px 22px; font-family: 'Sora', sans-serif; font-size: 0.875rem; font-weight: 600; cursor: pointer; box-shadow: 0 4px 14px rgba(37,99,235,.35); transition: all .22s; }
.btn-primary-action:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(37,99,235,.42); }
.btn-primary-action svg { width: 15px; height: 15px; }

/* ════════════════
   MAIN GRID
════════════════ */
.main-grid { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: start; }
@media (min-width: 960px)  { .main-grid { grid-template-columns: 1fr 370px; } }
@media (min-width: 1200px) { .main-grid { grid-template-columns: 1fr 410px; } }

/* ════════════════
   CALENDAR CARD
════════════════ */
.cal-card { background: var(--c-surface); border-radius: var(--radius-card); border: 1px solid var(--c-border); box-shadow: var(--shadow-card); overflow: hidden; }

/* Header */
.cal-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 20px 24px 16px; border-bottom: 1px solid var(--c-border); }
.cal-header-left { display: flex; flex-direction: column; gap: 4px; }
.cal-month-display { display: flex; align-items: baseline; gap: 8px; }
.cal-month-name { font-family: 'Sora', sans-serif; font-size: 1.4rem; font-weight: 800; color: var(--c-text-1); letter-spacing: -.03em; }
.cal-year-name { font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 400; color: var(--c-text-3); }
.cal-header-meta { display: flex; align-items: center; gap: 6px; }
.event-count-badge { background: #eff6ff; color: #2563eb; font-family: 'Sora', sans-serif; font-size: 0.68rem; font-weight: 700; padding: 2px 9px; border-radius: 50px; border: 1px solid #bfdbfe; }
.cal-header-sub { font-size: 0.75rem; color: var(--c-text-3); }

.cal-nav { display: flex; align-items: center; gap: 6px; }
.cal-nav-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: 1.5px solid var(--c-border); background: white; border-radius: 50%; cursor: pointer; color: var(--c-text-2); transition: all .18s; }
.cal-nav-btn:hover { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
.cal-nav-btn svg { width: 14px; height: 14px; }
.cal-today-btn { padding: 6px 14px; background: white; border: 1.5px solid var(--c-border); border-radius: 50px; font-family: 'Sora', sans-serif; font-size: 0.72rem; font-weight: 600; color: var(--c-text-2); cursor: pointer; transition: all .18s; white-space: nowrap; }
.cal-today-btn:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }

/* Day names */
.cal-daynames { display: grid; grid-template-columns: repeat(7, 1fr); padding: 8px 16px 6px; background: #f8fafc; border-bottom: 1px solid var(--c-border); }
.cal-dayname { text-align: center; font-family: 'Sora', sans-serif; font-size: 0.62rem; font-weight: 700; color: var(--c-text-3); letter-spacing: .1em; text-transform: uppercase; padding: 3px 0; }

/* Grid */
.cal-grid-wrap { padding: 10px 14px 6px; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }

.cal-cell {
  position: relative; min-height: 68px; border-radius: 10px;
  border: 1.5px solid transparent; padding: 6px 7px;
  cursor: default; transition: all .15s; overflow: hidden;
}
.cal-cell--empty { min-height: 68px; }
.cal-cell--normal { border-color: var(--c-border); background: #fafbfc; }
.cal-cell--normal:hover { border-color: #93c5fd; background: #f0f9ff; cursor: pointer; }
.cal-cell--weekend { background: #f8f8f8; border-color: #f1f5f9; }
.cal-cell--weekend:hover { background: #f0f4f8; border-color: #e2e8f0; }
.cal-cell--today { background: linear-gradient(145deg, #eff6ff, #dbeafe); border-color: #93c5fd; box-shadow: 0 0 0 2px rgba(147,197,253,.25); }
.cal-cell--window { background: linear-gradient(145deg, #f0fdf4, #dcfce7); border-color: #86efac; }
.cal-cell--window:hover { border-color: #4ade80; cursor: pointer; }

/* Corner stripe on window days */
.window-stripe { position: absolute; top: 0; right: 0; width: 0; height: 0; border-top: 12px solid #22c55e; border-left: 12px solid transparent; border-radius: 0 8px 0 0; opacity: .5; }

/* Day number */
.cal-day-num { display: block; font-family: 'Sora', sans-serif; font-size: 0.78rem; font-weight: 600; color: var(--c-text-2); margin-bottom: 5px; line-height: 1; }
.cal-cell--today .cal-day-num { display: inline-flex; align-items: center; justify-content: center; background: #2563eb; color: white; width: 22px; height: 22px; border-radius: 50%; font-size: 0.7rem; font-weight: 800; }
.cal-cell--window .cal-day-num { color: #15803d; font-weight: 700; }
.cal-cell--weekend .cal-day-num { color: #b0bec5; }

/* Dots */
.cal-dots { display: flex; gap: 3px; flex-wrap: wrap; }
.cal-dot { width: 7px; height: 7px; border-radius: 50%; cursor: pointer; transition: transform .12s; flex-shrink: 0; }
.cal-dot:hover { transform: scale(1.35); }
.cal-dot-more { font-size: 0.55rem; font-weight: 700; color: var(--c-text-3); align-self: center; line-height: 1; }
.dot--blue   { background: #3b82f6; }
.dot--green  { background: #22c55e; }
.dot--amber  { background: #f59e0b; }
.dot--red    { background: #ef4444; }
.dot--purple { background: #8b5cf6; }
.dot--pink   { background: #ec4899; }

/* Footer */
.cal-footer { padding: 12px 18px 18px; border-top: 1px solid var(--c-border); }
.legend-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 14px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.7rem; color: var(--c-text-3); }
.legend-swatch { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
.legend-swatch--today { background: linear-gradient(135deg, #dbeafe, #bfdbfe); border: 1.5px solid #93c5fd; }
.legend-swatch--window { background: linear-gradient(135deg, #dcfce7, #bbf7d0); border: 1.5px solid #86efac; }
.legend-swatch--weekend { background: #f8f8f8; border: 1.5px solid #e2e8f0; }

.event-list { display: flex; flex-direction: column; gap: 5px; }
.event-list-title { font-family: 'Sora', sans-serif; font-size: 0.65rem; font-weight: 700; color: var(--c-text-3); text-transform: uppercase; letter-spacing: .09em; margin-bottom: 5px; }
.event-list-item { display: flex; align-items: center; gap: 10px; padding: 7px 11px; border-radius: 9px; background: #f8fafc; border: 1px solid var(--c-border); cursor: pointer; transition: all .14s; }
.event-list-item:hover { background: #eff6ff; border-color: #bfdbfe; }
.event-list-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.event-list-info { display: flex; flex: 1; justify-content: space-between; align-items: center; gap: 8px; min-width: 0; }
.event-list-name { font-size: 0.8rem; font-weight: 600; color: var(--c-text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.event-list-date { font-size: 0.68rem; color: var(--c-text-3); flex-shrink: 0; font-family: 'Sora', sans-serif; }

/* ════════════════════════
   JADWAL PELAPORAN CARD
════════════════════════ */
.jadwal-card { background: var(--c-surface); border-radius: var(--radius-card); border: 1px solid var(--c-border); box-shadow: var(--shadow-card); overflow: hidden; display: flex; flex-direction: column; }

/* Banner */
.jadwal-banner { padding: 20px 22px; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.jadwal-banner--open  { background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); }
.jadwal-banner--closed { background: linear-gradient(135deg, #64748b, #475569); }
.jadwal-banner-left { display: flex; align-items: flex-start; gap: 12px; }
.jadwal-banner-icon { width: 40px; height: 40px; background: rgba(255,255,255,.18); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(255,255,255,.25); }
.jadwal-banner-icon svg { width: 20px; height: 20px; color: white; }
.jadwal-banner-label { font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,.7); text-transform: uppercase; letter-spacing: .09em; margin-bottom: 4px; font-family: 'Sora', sans-serif; }
.jadwal-banner-title { font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 700; color: white; line-height: 1.35; }

.status-pill { display: inline-flex; align-items: center; gap: 6px; font-family: 'Sora', sans-serif; font-size: 0.68rem; font-weight: 700; padding: 5px 12px; border-radius: 50px; white-space: nowrap; flex-shrink: 0; background: rgba(255,255,255,.2); color: white; border: 1px solid rgba(255,255,255,.3); }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.6); }
.status-dot--open { background: #4ade80; box-shadow: 0 0 0 2px rgba(74,222,128,.35); animation: pulseAnim 2s ease-in-out infinite; }
@keyframes pulseAnim { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.75)} }

/* Body */
.jadwal-body { flex: 1; padding: 20px 22px; display: flex; flex-direction: column; }

/* Date range */
.date-range-row { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.date-range-block { flex: 1; display: flex; align-items: center; gap: 10px; background: #f8fafc; border: 1px solid var(--c-border); border-radius: 12px; padding: 11px 12px; }
.date-range-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.date-range-icon--start { background: #eff6ff; }
.date-range-icon--start svg { width: 15px; height: 15px; color: #2563eb; }
.date-range-icon--end { background: #fef2f2; }
.date-range-icon--end svg { width: 15px; height: 15px; color: #dc2626; }
.date-range-label { font-size: 0.62rem; font-weight: 700; color: var(--c-text-3); text-transform: uppercase; letter-spacing: .05em; margin-bottom: 2px; font-family: 'Sora', sans-serif; }
.date-range-value { font-size: 0.75rem; font-weight: 600; color: var(--c-text-1); line-height: 1.2; }
.date-range-arrow { flex-shrink: 0; }
.date-range-arrow svg { width: 14px; height: 14px; color: var(--c-text-3); }

/* Countdown */
.countdown-section { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 16px; margin-bottom: 16px; }
.countdown-heading { display: flex; align-items: center; gap: 6px; font-family: 'Sora', sans-serif; font-size: 0.65rem; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 12px; }
.countdown-heading svg { width: 12px; height: 12px; }
.countdown-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; margin-bottom: 13px; }
.cdown-box { background: white; border: 1px solid #bbf7d0; border-radius: 10px; padding: 10px 4px; text-align: center; display: flex; flex-direction: column; gap: 3px; }
.cdown-num { font-family: 'Sora', sans-serif; font-size: 1.35rem; font-weight: 800; color: #16a34a; line-height: 1; }
.cdown-lbl { font-size: 0.58rem; font-weight: 700; color: #4ade80; text-transform: uppercase; letter-spacing: .05em; }
.countdown-bar-wrap { height: 5px; background: #bbf7d0; border-radius: 99px; overflow: hidden; margin-bottom: 6px; }
.countdown-bar { height: 100%; background: linear-gradient(90deg, #4ade80, #16a34a); border-radius: 99px; transition: width 1s linear; }
.countdown-bar-label { font-size: 0.65rem; color: #15803d; font-weight: 500; text-align: right; }

/* Closed */
.closed-notice { display: flex; align-items: flex-start; gap: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 14px 16px; margin-bottom: 16px; }
.closed-notice svg { width: 20px; height: 20px; color: #dc2626; flex-shrink: 0; margin-top: 1px; }
.closed-notice-title { font-family: 'Sora', sans-serif; font-size: 0.82rem; font-weight: 700; color: #dc2626; margin-bottom: 3px; }
.closed-notice-sub { font-size: 0.73rem; color: #f87171; line-height: 1.4; }

/* No window */
.no-window { text-align: center; padding: 22px 14px; background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 14px; margin-bottom: 16px; }
.no-window-icon { width: 42px; height: 42px; background: #eff6ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; }
.no-window-icon svg { width: 20px; height: 20px; color: #93c5fd; }
.no-window-title { font-family: 'Sora', sans-serif; font-size: 0.85rem; font-weight: 700; color: var(--c-text-2); margin-bottom: 3px; }
.no-window-sub { font-size: 0.73rem; color: var(--c-text-3); }

.section-divider { height: 1px; background: var(--c-border); margin-bottom: 16px; }

/* Admin section */
.admin-section-header { display: flex; align-items: center; gap: 7px; font-family: 'Sora', sans-serif; font-size: 0.68rem; font-weight: 700; color: var(--c-text-2); text-transform: uppercase; letter-spacing: .09em; margin-bottom: 13px; }
.admin-section-header svg { width: 13px; height: 13px; color: var(--c-accent); }
.admin-form { display: flex; flex-direction: column; gap: 11px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-label { font-family: 'Sora', sans-serif; font-size: 0.68rem; font-weight: 600; color: var(--c-text-2); text-transform: uppercase; letter-spacing: .05em; }
.form-input { width: 100%; padding: 9px 14px; border: 1.5px solid var(--c-border); border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: var(--c-text-1); background: #f8fafc; outline: none; transition: all .2s; }
.form-input::placeholder { color: var(--c-text-3); }
.form-input:focus { background: white; border-color: var(--c-accent); box-shadow: 0 0 0 3px rgba(37,99,235,.1); }
.form-textarea { border-radius: 14px; resize: vertical; }
input[type="date"].form-input { color-scheme: light; }
.input-icon-wrap { position: relative; }
.input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: var(--c-text-3); pointer-events: none; }
.form-input--icon { padding-left: 36px; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.form-actions { display: flex; gap: 9px; flex-wrap: wrap; padding-top: 2px; }

/* Buttons */
.btn-save { display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 50px; font-family: 'Sora', sans-serif; font-size: 0.875rem; font-weight: 600; cursor: pointer; box-shadow: 0 4px 14px rgba(37,99,235,.35); transition: all .22s; }
.btn-save:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(37,99,235,.42); }
.btn-save:disabled { opacity: .6; cursor: not-allowed; }
.btn-cancel { padding: 10px 20px; background: #f1f5f9; color: var(--c-text-2); border: 1.5px solid var(--c-border); border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all .2s; }
.btn-cancel:hover { background: #e2e8f0; }
.btn-danger-outline { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; background: #fff1f2; color: #dc2626; border: 1.5px solid #fecdd3; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all .2s; }
.btn-danger-outline svg { width: 13px; height: 13px; }
.btn-danger-outline:hover { background: #fee2e2; border-color: #fca5a5; }
.btn-danger { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 50px; font-family: 'Sora', sans-serif; font-size: 0.875rem; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(220,38,38,.3); transition: all .2s; }
.btn-danger svg { width: 13px; height: 13px; }
.btn-danger:hover { background: #b91c1c; }
.btn-spinner { width: 14px; height: 14px; animation: spin .75s linear infinite; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

/* Modal */
.modal-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 16px; }
.modal-backdrop { position: absolute; inset: 0; background: rgba(15,23,42,.5); backdrop-filter: blur(6px); }
.modal-box { position: relative; width: 100%; max-width: 480px; background: white; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.08); overflow: hidden; }
.modal-box--sm { max-width: 400px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--c-border); }
.modal-header-left { display: flex; align-items: center; gap: 10px; }
.modal-icon-wrap { width: 36px; height: 36px; background: #eff6ff; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.modal-icon-wrap svg { width: 17px; height: 17px; color: #2563eb; }
.modal-title { font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 700; color: var(--c-text-1); }
.modal-close { display: flex; padding: 6px; border: 1.5px solid var(--c-border); background: transparent; border-radius: 8px; cursor: pointer; transition: all .2s; }
.modal-close:hover { background: #f1f5f9; border-color: #cbd5e1; }
.modal-close svg { width: 16px; height: 16px; color: var(--c-text-3); }
.modal-form { padding: 22px 24px; display: flex; flex-direction: column; gap: 15px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; border-top: 1px solid var(--c-border); }
.error-msg { display: flex; align-items: center; gap: 7px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 10px 14px; font-size: 0.82rem; color: #dc2626; font-weight: 500; }
.error-msg svg { width: 15px; height: 15px; flex-shrink: 0; }
.required { color: #ef4444; }

/* Delete modal */
.delete-modal-body { padding: 32px 24px 20px; text-align: center; }
.delete-icon-wrap { width: 64px; height: 64px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 4px 14px rgba(220,38,38,.2); }
.delete-icon-wrap svg { width: 28px; height: 28px; color: #dc2626; }
.delete-title { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--c-text-1); margin-bottom: 8px; }
.delete-desc { font-size: 0.875rem; color: var(--c-text-2); line-height: 1.5; }
.delete-footer { display: flex; justify-content: center; gap: 12px; padding: 16px 24px; background: #f8fafc; border-top: 1px solid var(--c-border); }

/* Color picker */
.color-picker { display: flex; gap: 10px; flex-wrap: wrap; }
.color-swatch { width: 28px; height: 28px; border-radius: 50%; border: 2.5px solid transparent; cursor: pointer; transition: transform .15s, box-shadow .15s; }
.color-swatch:hover { transform: scale(1.1); }
.color-swatch--active { border-color: var(--c-text-1); transform: scale(1.15); box-shadow: 0 0 0 2px white, 0 0 0 4px var(--c-text-1); }
.bg-blue   { background: #3b82f6; }
.bg-green  { background: #22c55e; }
.bg-amber  { background: #f59e0b; }
.bg-red    { background: #ef4444; }
.bg-purple { background: #8b5cf6; }
.bg-pink   { background: #ec4899; }
</style>