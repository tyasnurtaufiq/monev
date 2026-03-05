<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <Sidebar v-model="sidebarOpen" />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      
      <main class="flex-1 overflow-y-auto p-3 lg:p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Page Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Laporan Monitoring</h1>
              <p class="text-gray-500 dark:text-gray-400 mt-1">Rekapitulasi progress fisik dan keuangan</p>
            </div>
            <div class="flex items-center gap-3">
              <button @click="exportToExcel" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Excel
              </button>
              <select v-model="selectedTahunId" @change="onTahunChange" class="input-field w-auto">
                <option v-for="t in monevStore.tahunList" :key="t.id" :value="t.id">{{ t.tahun }}</option>
              </select>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="card dark:bg-gray-800 dark:border-gray-700 p-6 border-l-4 border-purple-500">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Program</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ monevStore.totalProgram }}</p>
            </div>
            <div class="card dark:bg-gray-800 dark:border-gray-700 p-6 border-l-4 border-blue-500">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Pagu</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(monevStore.totalPagu) }}</p>
            </div>
            <div class="card dark:bg-gray-800 dark:border-gray-700 p-6 border-l-4 border-emerald-500">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Realisasi Fisik</p>
              <p class="text-3xl font-bold text-emerald-600">{{ monevStore.rekapStats.latestFisik }}%</p>
            </div>
            <div class="card dark:bg-gray-800 dark:border-gray-700 p-6 border-l-4 border-yellow-500">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Realisasi Keuangan</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(monevStore.rekapStats.totalRealisasi) }}</p>
            </div>
          </div>

          <!-- Reporting Window Closed Warning -->
          <div v-if="!isAdmin && !windowOpen" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <svg class="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="font-medium text-red-700">Periode pelaporan ditutup</p>
              <p class="text-sm text-red-600">Anda tidak dapat menginput laporan saat ini. Hubungi admin untuk membuka periode pelaporan.</p>
            </div>
          </div>

          <!-- Monitoring Input per Bulan -->
          <div class="card dark:bg-gray-800 dark:border-gray-700 p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Input & Monitoring Bulanan</h2>

            <!-- Cascading Filters -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div>
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Program</label>
                <select v-model="selectedProgramId" @change="onProgramChange" class="input-field w-full">
                  <option value="">Pilih Program</option>
                  <option v-for="p in monevStore.programs" :key="p.id" :value="p.id">{{ p.kode_program }} — {{ p.nama_program }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Kegiatan</label>
                <select v-model="selectedKegiatanId" @change="onKegiatanChange" class="input-field w-full" :disabled="!selectedProgramId">
                  <option value="">Pilih Kegiatan</option>
                  <option v-for="k in localKegiatanList" :key="k.id" :value="k.id">{{ k.kode_kegiatan }} — {{ k.nama_kegiatan }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Sub Kegiatan</label>
                <select v-model="selectedSubKegiatanId" @change="onSubKegiatanChange" class="input-field w-full" :disabled="!selectedKegiatanId">
                  <option value="">Pilih Sub Kegiatan</option>
                  <option v-for="sk in localSubKegiatanList" :key="sk.id" :value="sk.id">{{ sk.kode_sub_kegiatan }} — {{ sk.nama_sub_kegiatan }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Bulan</label>
                <select v-model="selectedBulan" class="input-field w-full">
                  <option v-for="(name, idx) in monevStore.bulanNames" :key="idx" :value="idx + 1">{{ name }}</option>
                </select>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="loadingOutputs" class="text-center py-12 text-gray-500">
              <svg class="w-8 h-8 animate-spin mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memuat data...
            </div>

            <!-- Monitoring Cards (Form Layout) -->
            <div v-else-if="outputsForMonitoring.length > 0" class="space-y-6">
              <div 
                v-for="out in outputsForMonitoring" :key="out.id"
                class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
              >
                <!-- Output Header -->
                <div class="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 class="font-semibold text-gray-900 dark:text-white text-sm">{{ out.nama_output }}</h4>
                    <span class="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full self-start sm:self-auto">
                      Pagu: {{ formatCurrency(out.pagu) }}
                    </span>
                  </div>
                </div>

                <div class="p-4 space-y-5">
                  <!-- Fisik Section -->
                  <div>
                    <h5 class="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Fisik
                    </h5>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Target (%)</label>
                        <input 
                          v-model="monitoringForm[out.id].target_fisik" 
                          type="number" step="0.01" min="0" max="100"
                          class="input-field text-center w-full"
                          :disabled="!isAdmin && !windowOpen"
                        />
                      </div>
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Bln Lalu (%)</label>
                        <div class="px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-center text-gray-600">
                          {{ prevMonthData[out.id]?.realisasi_fisik ?? '-' }}
                        </div>
                      </div>
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Realisasi (%)</label>
                        <input 
                          v-model="monitoringForm[out.id].realisasi_fisik" 
                          type="number" step="0.01" min="0" max="100"
                          class="input-field text-center w-full"
                          :disabled="!isAdmin && !windowOpen"
                        />
                      </div>
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Deviasi (%)</label>
                        <div class="px-3 py-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-center font-semibold"
                          :class="deviasiColor(calcDeviasi(monitoringForm[out.id].realisasi_fisik, monitoringForm[out.id].target_fisik))"
                        >
                          {{ formatDeviasi(monitoringForm[out.id].realisasi_fisik, monitoringForm[out.id].target_fisik) }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Keuangan Section -->
                  <div>
                    <h5 class="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Keuangan
                    </h5>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Target (Rp)</label>
                        <input 
                          v-model="monitoringForm[out.id].target_keuangan" 
                          type="number" step="0.01" min="0"
                          class="input-field text-center w-full"
                          :disabled="!isAdmin && !windowOpen"
                        />
                      </div>
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Bln Lalu</label>
                        <div class="px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-center text-gray-600 truncate">
                          {{ prevMonthData[out.id]?.realisasi_keuangan != null ? formatCurrency(prevMonthData[out.id].realisasi_keuangan) : '-' }}
                        </div>
                      </div>
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Realisasi (Rp)</label>
                        <input 
                          v-model="monitoringForm[out.id].realisasi_keuangan" 
                          type="number" step="0.01" min="0"
                          class="input-field text-center w-full"
                          :disabled="!isAdmin && !windowOpen"
                        />
                      </div>
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Deviasi (%)</label>
                        <div class="px-3 py-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-center font-semibold"
                          :class="deviasiColor(calcDeviasi(monitoringForm[out.id].realisasi_keuangan, monitoringForm[out.id].target_keuangan))"
                        >
                          {{ formatDeviasi(monitoringForm[out.id].realisasi_keuangan, monitoringForm[out.id].target_keuangan) }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Keterangan Section -->
                  <div>
                    <h5 class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
                      Keterangan
                    </h5>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Tahapan Pekerjaan (Fisik)</label>
                        <textarea 
                          v-model="monitoringForm[out.id].progress" 
                          rows="3"
                          placeholder="Tulis tahapan pekerjaan..."
                          class="input-field w-full text-sm resize-none"
                          :disabled="!isAdmin && !windowOpen"
                        ></textarea>
                      </div>
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Faktor Penghambat</label>
                        <textarea 
                          v-model="monitoringForm[out.id].hambatan" 
                          rows="3"
                          placeholder="Tulis faktor penghambat..."
                          class="input-field w-full text-sm resize-none"
                          :disabled="!isAdmin && !windowOpen"
                        ></textarea>
                      </div>
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Faktor Pendukung</label>
                        <textarea 
                          v-model="monitoringForm[out.id].pendorong" 
                          rows="3"
                          placeholder="Tulis faktor pendukung..."
                          class="input-field w-full text-sm resize-none"
                          :disabled="!isAdmin && !windowOpen"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <!-- Save Button -->
                  <div class="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
                    <button 
                      @click="saveMonitoringRow(out)"
                      class="px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
                      :disabled="savingOutputId === out.id || (!isAdmin && !windowOpen)"
                    >
                      {{ savingOutputId === out.id ? 'Menyimpan...' : 'Simpan' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-12 text-gray-500">
              <p class="font-medium">Pilih Sub Kegiatan untuk input monitoring</p>
              <p class="text-sm">Monitoring per bulan untuk setiap output pada sub kegiatan</p>
            </div>
          </div>

          <!-- Rekap Per Program -->
          <div class="card dark:bg-gray-800 dark:border-gray-700 p-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Rekap Per Program</h2>
            
            <div v-if="monevStore.rekapByProgram.length > 0" class="space-y-6">
              <div v-for="prog in monevStore.rekapByProgram" :key="prog.id" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h3 class="font-bold text-gray-900 dark:text-white mb-3">
                  <span class="text-xs font-mono text-purple-600 bg-purple-100 px-2 py-0.5 rounded mr-2">{{ prog.kode_program }}</span>
                  {{ prog.nama_program }}
                </h3>

                <div v-for="keg in prog.kegiatan" :key="keg.id" class="ml-4 mb-3">
                  <p class="font-medium text-gray-800 dark:text-gray-200 text-sm mb-2">
                    <span class="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mr-1.5">{{ keg.kode_kegiatan }}</span> Kegiatan
                    {{ keg.nama_kegiatan }}
                  </p>
                  
                  <div v-for="sk in keg.subKegiatan" :key="sk.id" class="ml-4 mb-2">
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">{{ sk.kode_sub_kegiatan }} — Sub Kegiatan {{ sk.nama_sub_kegiatan }}</p>
                    
                    <div v-for="out in sk.outputs" :key="out.id" class="ml-4 bg-white dark:bg-gray-800 rounded-lg p-3 mb-1">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Output : {{ out.nama_output }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">Pagu: {{ formatCurrency(out.pagu) }}</span>
                      </div>
                      
                      <div v-if="out.monitoring.length > 0" class="space-y-2">
                        <div 
                          v-for="mon in out.monitoring" :key="mon.id"
                          class="text-xs bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2"
                        >
                          <div class="flex items-center gap-2 mb-1">
                            <span class="font-semibold text-gray-700 dark:text-gray-300">{{ monevStore.bulanNames[mon.bulan - 1]?.slice(0, 3) }}:</span>
                            <span class="text-emerald-600">Target Fisik: {{ mon.target_fisik }}%</span>
                            <span class="text-emerald-600">Realisasi Fisik: {{ mon.realisasi_fisik }}%</span>
                            <span class="text-blue-600">Target Keuangan: Rp.{{ formatCurrency(mon.target_keuangan) }}</span>
                            <span class="text-blue-600">Realisasi Keuangan: Rp.{{ formatCurrency(mon.realisasi_keuangan) }}</span>
                          </div>
                          <div v-if="mon.progress || mon.hambatan || mon.pendorong" class="grid grid-cols-3 gap-2 mt-1 pt-1 border-t border-gray-100 dark:border-gray-600">
                            <div v-if="mon.progress">
                              <span class="font-semibold text-purple-600">Tahapan Pekerjaan:</span>
                              <span class="text-gray-600 dark:text-gray-400 ml-1">{{ mon.progress }}</span>
                            </div>
                            <div v-if="mon.hambatan">
                              <span class="font-semibold text-red-500">Faktor Penghambat:</span>
                              <span class="text-gray-600 dark:text-gray-400 ml-1">{{ mon.hambatan }}</span>
                            </div>
                            <div v-if="mon.pendorong">
                              <span class="font-semibold text-teal-600">Faktor Pendukung:</span>
                              <span class="text-gray-600 dark:text-gray-400 ml-1">{{ mon.pendorong }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p v-else class="text-xs text-gray-400 italic">Belum ada monitoring</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-12 text-gray-500">
              <p class="font-medium">Belum ada data rekap</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useMonevStore } from '../stores/monev'
import { useAuthStore } from '../stores/auth'
import { api } from '../api'
import * as XLSX from 'xlsx-js-style'

import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'

const monevStore = useMonevStore()
const authStore = useAuthStore()

const sidebarOpen = ref(false)
const isAdmin = computed(() => authStore.user?.role === 'admin')
const windowOpen = ref(false)

const selectedTahunId = ref(monevStore.selectedTahunId)
const selectedProgramId = ref('')
const selectedKegiatanId = ref('')
const selectedSubKegiatanId = ref('')
const selectedBulan = ref(new Date().getMonth() + 1)
const savingOutputId = ref(null)
const loadingOutputs = ref(false)

// Local lists for cascading dropdowns (separate from store to avoid conflicts)
const localKegiatanList = ref([])
const localSubKegiatanList = ref([])

// Outputs for the selected sub kegiatan's monitoring
const outputsForMonitoring = ref([])
const prevMonthData = ref({})
const monitoringForm = ref({})

const formatCurrency = (value) => {
  if (!value) return 'Rp 0'
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(value)
}

const calcDeviasi = (realisasi, target) => {
  const r = parseFloat(realisasi) || 0
  const t = parseFloat(target) || 0
  if (t === 0) return null
  return Math.round((r / t) * 10000) / 100
}

const formatDeviasi = (realisasi, target) => {
  const d = calcDeviasi(realisasi, target)
  if (d === null) return '-'
  return d.toFixed(2) + '%'
}

const deviasiColor = (d) => {
  if (d === null) return 'text-gray-400'
  if (d >= 100) return 'text-emerald-600'
  if (d >= 75) return 'text-amber-600'
  return 'text-red-600'
}

const onTahunChange = async () => {
  // Reset cascading selections
  selectedProgramId.value = ''
  selectedKegiatanId.value = ''
  selectedSubKegiatanId.value = ''
  localKegiatanList.value = []
  localSubKegiatanList.value = []
  outputsForMonitoring.value = []
  monitoringForm.value = {}
  await monevStore.loadAllForTahun(selectedTahunId.value)
}

const onProgramChange = async () => {
  // Reset downstream selections
  selectedKegiatanId.value = ''
  selectedSubKegiatanId.value = ''
  localSubKegiatanList.value = []
  outputsForMonitoring.value = []
  monitoringForm.value = {}

  if (!selectedProgramId.value) {
    localKegiatanList.value = []
    return
  }

  // Fetch kegiatan for selected program
  localKegiatanList.value = await api.get(`/kegiatan?program_id=${selectedProgramId.value}`)
}

const onKegiatanChange = async () => {
  // Reset downstream
  selectedSubKegiatanId.value = ''
  outputsForMonitoring.value = []
  monitoringForm.value = {}

  if (!selectedKegiatanId.value) {
    localSubKegiatanList.value = []
    return
  }

  // Fetch sub kegiatan for selected kegiatan
  localSubKegiatanList.value = await api.get(`/subkegiatan?kegiatan_id=${selectedKegiatanId.value}`)
}

const onSubKegiatanChange = async () => {
  if (!selectedSubKegiatanId.value) {
    outputsForMonitoring.value = []
    monitoringForm.value = {}
    return
  }
  await loadOutputsForSubKegiatan()
}

const loadOutputsForSubKegiatan = async () => {
  loadingOutputs.value = true
  try {
    // Fetch outputs for selected sub kegiatan
    const outputs = await api.get(`/output?sub_kegiatan_id=${selectedSubKegiatanId.value}`)
    outputsForMonitoring.value = outputs

    // Find the period for selected month + year
    const periode = monevStore.periodeList.find(
      p => p.bulan === selectedBulan.value
    )

    // Find previous month period
    const prevBulan = selectedBulan.value - 1
    const periodePrev = prevBulan >= 1
      ? monevStore.periodeList.find(p => p.bulan === prevBulan)
      : null

    // Load existing monitoring data + previous month
    const formData = {}
    const prevData = {}
    for (const out of outputs) {
      formData[out.id] = {
        target_fisik: 0,
        realisasi_fisik: 0,
        target_keuangan: 0,
        realisasi_keuangan: 0,
        progress: '',
        hambatan: '',
        pendorong: ''
      }
      prevData[out.id] = null

      // Current month
      if (periode) {
        try {
          const existing = await api.get(`/monitoring?output_id=${out.id}&periode_id=${periode.id}`)
          if (existing.length > 0) {
            formData[out.id] = {
              target_fisik: existing[0].target_fisik || 0,
              realisasi_fisik: existing[0].realisasi_fisik || 0,
              target_keuangan: existing[0].target_keuangan || 0,
              realisasi_keuangan: existing[0].realisasi_keuangan || 0,
              progress: existing[0].progress || '',
              hambatan: existing[0].hambatan || '',
              pendorong: existing[0].pendorong || ''
            }
          }
        } catch (e) { /* ignore */ }
      }

      // Previous month
      if (periodePrev) {
        try {
          const prev = await api.get(`/monitoring?output_id=${out.id}&periode_id=${periodePrev.id}`)
          if (prev.length > 0) {
            prevData[out.id] = {
              realisasi_fisik: prev[0].realisasi_fisik || 0,
              realisasi_keuangan: prev[0].realisasi_keuangan || 0
            }
          }
        } catch (e) { /* ignore */ }
      }
    }
    monitoringForm.value = formData
    prevMonthData.value = prevData
  } finally {
    loadingOutputs.value = false
  }
}

watch(selectedBulan, () => {
  if (selectedSubKegiatanId.value) {
    loadOutputsForSubKegiatan()
  }
})

const saveMonitoringRow = async (output) => {
  savingOutputId.value = output.id
  try {
    // Ensure periode exists
    if (monevStore.periodeList.length === 0) {
      await monevStore.generatePeriode(selectedTahunId.value)
    }

    const periode = monevStore.periodeList.find(p => p.bulan === selectedBulan.value)
    if (!periode) {
      alert('Periode tidak ditemukan. Coba generate ulang.')
      return
    }

    const formRow = monitoringForm.value[output.id]
    await monevStore.saveMonitoring({
      output_id: output.id,
      periode_id: periode.id,
      target_fisik: parseFloat(formRow.target_fisik) || 0,
      realisasi_fisik: parseFloat(formRow.realisasi_fisik) || 0,
      target_keuangan: parseFloat(formRow.target_keuangan) || 0,
      realisasi_keuangan: parseFloat(formRow.realisasi_keuangan) || 0,
      progress: formRow.progress || '',
      hambatan: formRow.hambatan || '',
      pendorong: formRow.pendorong || ''
    })

    // Refresh rekap
    await monevStore.fetchRekap(selectedTahunId.value)
  } catch (err) {
    alert(err.message)
  } finally {
    savingOutputId.value = null
  }
}

onMounted(async () => {
  await monevStore.fetchTahun()
  if (monevStore.selectedTahunId) {
    selectedTahunId.value = monevStore.selectedTahunId
    await monevStore.loadAllForTahun(monevStore.selectedTahunId)
  }
  // Fetch window status
  try {
    const ws = await api.get('/reporting-window/status')
    windowOpen.value = ws.is_open === true
  } catch (e) {
    windowOpen.value = false
  }
})

// ======== STYLED EXPORT TO EXCEL ========
const TOTAL_COLS = 14

// Style definitions
const border = {
  top: { style: 'thin', color: { rgb: '000000' } },
  bottom: { style: 'thin', color: { rgb: '000000' } },
  left: { style: 'thin', color: { rgb: '000000' } },
  right: { style: 'thin', color: { rgb: '000000' } }
}

const titleStyle = {
  font: { bold: true, sz: 14, color: { rgb: '1B3A5C' } },
  alignment: { horizontal: 'center', vertical: 'center' }
}

const headerStyle = {
  font: { bold: true, sz: 10, color: { rgb: 'FFFFFF' } },
  fill: { fgColor: { rgb: '1B3A5C' } },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border
}

const headerStyle2 = {
  font: { bold: true, sz: 9, color: { rgb: 'FFFFFF' } },
  fill: { fgColor: { rgb: '2D5F8A' } },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border
}

const progStyle = (isNum = false) => ({
  font: { bold: true, sz: 10 },
  fill: { fgColor: { rgb: 'E8DEF8' } },
  alignment: { horizontal: isNum ? 'center' : 'left', vertical: 'center', wrapText: true },
  border
})

const kegStyle = (isNum = false) => ({
  font: { bold: true, sz: 9 },
  fill: { fgColor: { rgb: 'DBEAFE' } },
  alignment: { horizontal: isNum ? 'center' : 'left', vertical: 'center', wrapText: true },
  border
})

const skStyle = (isNum = false) => ({
  font: { sz: 9 },
  fill: { fgColor: { rgb: 'F3F4F6' } },
  alignment: { horizontal: isNum ? 'center' : 'left', vertical: 'center', wrapText: true },
  border
})

const dataStyle = (isNum = false) => ({
  font: { sz: 9 },
  alignment: { horizontal: isNum ? 'center' : 'left', vertical: 'center', wrapText: true },
  border
})

const deviasiStyle = (val) => {
  let bgColor = 'FFFFFF'
  if (val >= 100) bgColor = 'D1FAE5'       // green
  else if (val >= 75) bgColor = 'FEF3C7'   // yellow
  else if (val > 0) bgColor = 'FEE2E2'     // red
  return {
    font: { bold: true, sz: 9 },
    fill: { fgColor: { rgb: bgColor } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border
  }
}

const currencyStyle = (styleFn) => ({
  ...styleFn(true),
  numFmt: '#,##0'
})

const makeStyledRow = (vals, styleFn) => {
  return vals.map((v, i) => {
    const isNumCol = i >= 3 && i <= 10
    const isDeviasi = (i === 6 || i === 10) && typeof v === 'number' && v > 0
    const isCurrency = (i === 3 || i === 7 || i === 9)
    
    if (isDeviasi) return { v, s: deviasiStyle(v) }
    if (isCurrency && typeof v === 'number') return { v, s: currencyStyle(styleFn) }
    return { v: v ?? '', s: styleFn(isNumCol) }
  })
}

const exportToExcel = () => {
  const programs = monevStore.rekapByProgram
  if (!programs || programs.length === 0) {
    alert('Tidak ada data untuk di-export')
    return
  }

  const tahun = monevStore.tahunList.find(t => t.id === selectedTahunId.value)?.tahun || ''
  const bulanNames = monevStore.bulanNames

  const rows = []

  // Row 0: Title
  const titleRow = Array(TOTAL_COLS).fill(null).map(() => ({ v: '', s: titleStyle }))
  titleRow[0] = { v: `Laporan Realisasi Program/Kegiatan/Sub Kegiatan APBD Tahun Anggaran ${tahun}`, s: titleStyle }
  rows.push(titleRow)

  // Row 1: Empty spacer
  rows.push(Array(TOTAL_COLS).fill({ v: '', s: {} }))

  // Row 2: Header group row
  const h1Labels = ['No', 'Kode', 'Program / Kegiatan / Sub Kegiatan', 'Pagu',
    'Fisik', '', '', 'Keuangan', '', '', '',
    'Keterangan Progres Bulan', '', '']
  rows.push(h1Labels.map(v => ({ v, s: headerStyle })))

  // Row 3: Header detail row
  const h2Labels = ['', '', '', '',
    'Target (%)', 'Realisasi (%)', 'Deviasi (%)',
    'Target (Rp)', 'Realisasi (%)', 'Realisasi (Rp)', 'Deviasi (%)',
    'Tahapan Pekerjaan (Fisik)', 'Faktor Penghambat', 'Faktor Pendukung']
  rows.push(h2Labels.map(v => ({ v, s: headerStyle2 })))

  // Helper
  const getLatest = (monArr) => {
    if (!monArr || monArr.length === 0) return null
    return monArr.reduce((l, m) => (!l || m.bulan > l.bulan) ? m : l, null)
  }

  let progNo = 0
  for (const prog of programs) {
    progNo++
    let progPagu = 0, progTF = 0, progRF = 0, progFC = 0, progTK = 0, progRK = 0
    const kegList = prog.kegiatan || []
    for (const keg of kegList) {
      for (const sk of (keg.subKegiatan || [])) {
        for (const out of (sk.outputs || [])) {
          progPagu += parseFloat(out.pagu || 0)
          const lat = getLatest(out.monitoring)
          if (lat) {
            progTF += parseFloat(lat.target_fisik || 0)
            progRF += parseFloat(lat.realisasi_fisik || 0)
            progFC++
            progTK += parseFloat(lat.target_keuangan || 0)
            progRK += parseFloat(lat.realisasi_keuangan || 0)
          }
        }
      }
    }
    const pDevF = progFC && progTF ? Math.round((progRF / progTF) * 10000) / 100 : 0
    const pRKPct = progPagu ? Math.round((progRK / progPagu) * 10000) / 100 : 0
    const pDevK = progTK ? Math.round((progRK / progTK) * 10000) / 100 : 0

    rows.push(makeStyledRow([
      progNo, prog.kode_program, prog.nama_program?.toUpperCase(), progPagu,
      progFC ? Math.round((progTF / progFC) * 100) / 100 : 0,
      progFC ? Math.round((progRF / progFC) * 100) / 100 : 0,
      pDevF, progTK, pRKPct, progRK, pDevK, '', '', ''
    ], progStyle))

    let kegNo = 0
    for (const keg of kegList) {
      kegNo++
      let kP = 0, kTF = 0, kRF = 0, kFC = 0, kTK = 0, kRK = 0
      for (const sk of (keg.subKegiatan || [])) {
        for (const out of (sk.outputs || [])) {
          kP += parseFloat(out.pagu || 0)
          const lat = getLatest(out.monitoring)
          if (lat) { kTF += parseFloat(lat.target_fisik || 0); kRF += parseFloat(lat.realisasi_fisik || 0); kFC++; kTK += parseFloat(lat.target_keuangan || 0); kRK += parseFloat(lat.realisasi_keuangan || 0) }
        }
      }
      const kDevF = kFC && kTF ? Math.round((kRF / kTF) * 10000) / 100 : 0
      const kRKPct = kP ? Math.round((kRK / kP) * 10000) / 100 : 0
      const kDevK = kTK ? Math.round((kRK / kTK) * 10000) / 100 : 0

      rows.push(makeStyledRow([
        `${progNo}.${kegNo}`, keg.kode_kegiatan, keg.nama_kegiatan, kP,
        kFC ? Math.round((kTF / kFC) * 100) / 100 : 0,
        kFC ? Math.round((kRF / kFC) * 100) / 100 : 0,
        kDevF, kTK, kRKPct, kRK, kDevK, '', '', ''
      ], kegStyle))

      let skNo = 0
      for (const sk of (keg.subKegiatan || [])) {
        skNo++
        let sP = 0, sTF = 0, sRF = 0, sFC = 0, sTK = 0, sRK = 0
        for (const out of (sk.outputs || [])) {
          sP += parseFloat(out.pagu || 0)
          const lat = getLatest(out.monitoring)
          if (lat) { sTF += parseFloat(lat.target_fisik || 0); sRF += parseFloat(lat.realisasi_fisik || 0); sFC++; sTK += parseFloat(lat.target_keuangan || 0); sRK += parseFloat(lat.realisasi_keuangan || 0) }
        }
        const sDevF = sFC && sTF ? Math.round((sRF / sTF) * 10000) / 100 : 0
        const sRKPct = sP ? Math.round((sRK / sP) * 10000) / 100 : 0
        const sDevK = sTK ? Math.round((sRK / sTK) * 10000) / 100 : 0

        rows.push(makeStyledRow([
          `${progNo}.${kegNo}.${skNo}`, sk.kode_sub_kegiatan, sk.nama_sub_kegiatan, sP,
          sFC ? Math.round((sTF / sFC) * 100) / 100 : 0,
          sFC ? Math.round((sRF / sFC) * 100) / 100 : 0,
          sDevF, sTK, sRKPct, sRK, sDevK, '', '', ''
        ], skStyle))

        for (const out of (sk.outputs || [])) {
          const lat = getLatest(out.monitoring)
          const tf = lat ? parseFloat(lat.target_fisik || 0) : 0
          const rf = lat ? parseFloat(lat.realisasi_fisik || 0) : 0
          const devF = tf ? Math.round((rf / tf) * 10000) / 100 : 0
          const tk = lat ? parseFloat(lat.target_keuangan || 0) : 0
          const rk = lat ? parseFloat(lat.realisasi_keuangan || 0) : 0
          const oP = parseFloat(out.pagu || 0)
          const rkPct = oP ? Math.round((rk / oP) * 10000) / 100 : 0
          const devK = tk ? Math.round((rk / tk) * 10000) / 100 : 0
          const progress = lat?.progress || ''
          const hambatan = lat?.hambatan || ''
          const pendorong = lat?.pendorong || ''

          rows.push(makeStyledRow([
            '', '', `Output: ${out.nama_output}`, oP,
            tf, rf, devF, tk, rkPct, rk, devK,
            progress ? `\n${progress}` : '',
            hambatan ? `\n${hambatan}` : '',
            pendorong ? `\n${pendorong}` : ''
          ], dataStyle))
        }
      }
    }
  }

  // Create worksheet from styled array
  const ws = XLSX.utils.aoa_to_sheet(rows)

  // Merge cells
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } },  // Title
    { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } },    // No
    { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } },    // Kode
    { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } },    // Program/Kegiatan
    { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } },    // Pagu
    { s: { r: 2, c: 4 }, e: { r: 2, c: 6 } },    // Fisik group
    { s: { r: 2, c: 7 }, e: { r: 2, c: 10 } },   // Keuangan group
    { s: { r: 2, c: 11 }, e: { r: 2, c: 13 } },  // Keterangan group
  ]

  // Column widths
  ws['!cols'] = [
    { wch: 8 }, { wch: 20 }, { wch: 40 }, { wch: 18 },
    { wch: 12 }, { wch: 14 }, { wch: 12 },
    { wch: 18 }, { wch: 14 }, { wch: 18 }, { wch: 12 },
    { wch: 40 }, { wch: 30 }, { wch: 30 }
  ]

  // Row heights for headers
  ws['!rows'] = [{ hpt: 30 }, {}, { hpt: 25 }, { hpt: 35 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Laporan Realisasi')
  XLSX.writeFile(wb, `Laporan_Realisasi_${tahun}.xlsx`)
}
</script>

