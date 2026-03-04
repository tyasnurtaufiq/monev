<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />
      
      <main class="flex-1 overflow-y-auto p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Welcome Section -->
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">
              Hi, {{ authStore.user?.name || 'Admin' }}! 👋
            </h1>
            <p class="text-gray-500 mt-1">Dashboard Monitoring & Evaluasi Kegiatan</p>
          </div>

          <!-- Tahun Selector -->
          <div class="flex items-center gap-4 mb-8">
            <label class="text-sm font-medium text-gray-700">Tahun Anggaran:</label>
            <select
              v-model="selectedTahunId"
              @change="onTahunChange"
              class="input-field w-auto"
            >
              <option v-for="t in monevStore.tahunList" :key="t.id" :value="t.id">
                {{ t.tahun }}
              </option>
            </select>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="card p-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ monevStore.rekapStats.latestFisik }}%</p>
                  <p class="text-sm text-gray-500">Realisasi Fisik</p>
                </div>
              </div>
            </div>

            <div class="card p-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalRealisasiKeuangan) }}</p>
                  <p class="text-sm text-gray-500">Realisasi Keuangan</p>
                </div>
              </div>
            </div>

            <div class="card p-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(monevStore.totalPagu) }}</p>
                  <p class="text-sm text-gray-500">Total Pagu</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Realisasi Chart -->
          <div class="card overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Progres Realisasi Total (%)</h2>
                <p class="text-sm text-gray-500 mt-1">Program → Kegiatan → Sub Kegiatan → Output</p>
              </div>
              <select v-model="selectedProgramFilter" class="input-field w-auto">
                <option value="">Semua Program</option>
                <option v-for="p in monevStore.programs" :key="p.id" :value="p.id">{{ p.kode_program }} — {{ p.nama_program }}</option>
              </select>
            </div>

            <div v-if="monevStore.loading" class="text-center py-12 text-gray-500">
              <svg class="w-8 h-8 animate-spin mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memuat data...
            </div>

            <div v-else-if="filteredProgressData.length > 0" class="p-6 space-y-6">
              <!-- Iterate Programs -->
              <div 
                v-for="prog in filteredProgressData" :key="prog.id"
                class="rounded-xl border border-gray-200 overflow-hidden"
              >
                <!-- Program Header -->
                <div class="bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <span class="text-xs font-mono bg-white/20 text-white px-2 py-0.5 rounded">{{ prog.kode_program }}</span>
                      <h3 class="font-bold text-white text-sm">{{ prog.nama_program }}</h3>
                    </div>
                    <div class="flex items-center gap-3 text-white text-sm">
                      <span>Fisik: <strong>{{ prog.avgFisik }}%</strong></span>
                      <span class="opacity-50">|</span>
                      <span>Keuangan: <strong>{{ formatCurrency(prog.totalKeuangan) }}</strong> / {{ formatCurrency(prog.totalPagu) }} ({{ prog.pctKeuangan }}%)</span>
                    </div>
                  </div>
                  <!-- Program-level bar -->
                  <div class="mt-3 flex gap-2">
                    <div class="flex-1">
                      <div class="h-2.5 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          class="h-full rounded-full transition-all duration-700" 
                          :class="barColor(prog.avgFisik)" 
                          :style="{ width: Math.min(prog.avgFisik, 100) + '%' }"
                        ></div>
                      </div>
                    </div>
                    <div class="flex-1">
                      <div class="h-2.5 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          class="h-full rounded-full transition-all duration-700" 
                          :class="barColor(prog.pctKeuangan)" 
                          :style="{ width: Math.min(prog.pctKeuangan, 100) + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-2 mt-1">
                    <span class="flex-1 text-[10px] text-white/70">Fisik</span>
                    <span class="flex-1 text-[10px] text-white/70">Keuangan</span>
                  </div>
                </div>

                <!-- Kegiatan -->
                <div class="bg-white divide-y divide-gray-100">
                  <div v-for="keg in prog.kegiatan" :key="keg.id" class="px-5 py-4">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{{ keg.kode_kegiatan }}</span>
                        <span class="text-sm font-semibold text-gray-800">{{ keg.nama_kegiatan }}</span>
                      </div>
                      <div class="flex items-center gap-3 text-xs text-gray-500">
                        <span>F: <strong class="text-gray-700">{{ keg.avgFisik }}%</strong></span>
                        <span>K: <strong class="text-gray-700">{{ formatCurrency(keg.totalKeuangan) }}</strong> ({{ keg.pctKeuangan }}%)</span>
                      </div>
                    </div>
                    <!-- Kegiatan bars -->
                    <div class="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            class="h-full rounded-full transition-all duration-700" 
                            :class="barColorSolid(keg.avgFisik)" 
                            :style="{ width: Math.min(keg.avgFisik, 100) + '%' }"
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            class="h-full rounded-full transition-all duration-700" 
                            :class="barColorSolid(keg.pctKeuangan)" 
                            :style="{ width: Math.min(keg.pctKeuangan, 100) + '%' }"
                          ></div>
                        </div>
                      </div>
                    </div>

                    <!-- Sub Kegiatan -->
                    <div class="ml-4 space-y-3">
                      <div v-for="sk in keg.subKegiatan" :key="sk.id" class="bg-gray-50 rounded-lg p-3">
                        <div class="flex items-center justify-between mb-2">
                          <div class="flex items-center gap-2">
                            <span class="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{{ sk.kode_sub_kegiatan }}</span>
                            <span class="text-xs font-medium text-gray-700">{{ sk.nama_sub_kegiatan }}</span>
                          </div>
                          <div class="flex items-center gap-3 text-[10px] text-gray-500">
                            <span>F: <strong class="text-gray-700">{{ sk.avgFisik }}%</strong></span>
                            <span>K: <strong class="text-gray-700">{{ formatCurrency(sk.totalKeuangan) }}</strong> ({{ sk.pctKeuangan }}%)</span>
                          </div>
                        </div>

                        <!-- Outputs as horizontal bar chart -->
                        <div class="space-y-2 ml-2">
                          <div v-for="out in sk.outputs" :key="out.id">
                            <div class="flex items-center justify-between mb-1">
                              <span class="text-xs text-gray-600 truncate flex-1 mr-2">{{ out.nama_output }}</span>
                              <div class="flex items-center gap-2 text-[10px] whitespace-nowrap">
                                <span class="text-gray-500">Pagu: {{ formatCurrency(out.pagu) }}</span>
                              </div>
                            </div>
                            <!-- Fisik bar -->
                            <div class="flex items-center gap-2 mb-1">
                              <span class="text-[10px] text-gray-400 w-8">Fisik</span>
                              <div class="flex-1 h-4 bg-gray-200 rounded overflow-hidden relative">
                                <div 
                                  class="h-full rounded transition-all duration-700" 
                                  :class="barColorSolid(out.avgFisik)" 
                                  :style="{ width: Math.min(out.avgFisik, 100) + '%' }"
                                ></div>
                                <span class="absolute inset-0 flex items-center justify-center text-[10px] font-bold" :class="out.avgFisik > 50 ? 'text-white' : 'text-gray-600'">
                                  {{ out.avgFisik }}%
                                </span>
                              </div>
                            </div>
                            <!-- Keuangan bar -->
                            <div class="flex items-center gap-2">
                              <span class="text-[10px] text-gray-400 w-8">Keu.</span>
                              <div class="flex-1 h-4 bg-gray-200 rounded overflow-hidden relative">
                                <div 
                                  class="h-full rounded transition-all duration-700" 
                                  :class="barColorSolid(out.pctKeuangan)" 
                                  :style="{ width: Math.min(out.pctKeuangan, 100) + '%' }"
                                ></div>
                                <span class="absolute inset-0 flex items-center justify-center text-[10px] font-bold" :class="out.pctKeuangan > 50 ? 'text-white' : 'text-gray-600'">
                                  {{ formatCurrency(out.totalKeuangan) }} ({{ out.pctKeuangan }}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-12 text-gray-500">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="font-medium">Belum ada data monitoring</p>
              <p class="text-sm">Input monitoring melalui halaman Laporan</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useMonevStore } from '../stores/monev'

import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'

const authStore = useAuthStore()
const monevStore = useMonevStore()

const selectedTahunId = ref(monevStore.selectedTahunId)

const selectedProgramFilter = ref('')

const totalKegiatanCount = computed(() => {
  return monevStore.rekapByProgram.reduce((sum, p) => sum + (p.kegiatan?.length || 0), 0)
})

const totalRealisasiKeuangan = computed(() => {
  return progressData.value.reduce((sum, p) => sum + (p.totalKeuangan || 0), 0)
})

const formatCurrency = (value) => {
  if (!value) return 'Rp 0'
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(value)
}

// Get the latest month's monitoring entry
const latestMonitoring = (monArr) => {
  if (!monArr || monArr.length === 0) return null
  return monArr.reduce((latest, m) => (!latest || m.bulan > latest.bulan) ? m : latest, null)
}

// Get realisasi fisik from the latest month
const latestFisikFromMonitoring = (monArr) => {
  const latest = latestMonitoring(monArr)
  return latest ? parseFloat(latest.realisasi_fisik || 0) : 0
}

// Get realisasi keuangan from the latest month
const latestKeuanganFromMonitoring = (monArr) => {
  const latest = latestMonitoring(monArr)
  return latest ? parseFloat(latest.realisasi_keuangan || 0) : 0
}

// Calculate percentage: value / total * 100, rounded to 2 decimals
const pctOf = (value, total) => {
  if (!total || total === 0) return 0
  return Math.round((value / total) * 10000) / 100
}

// Build progress data with latest month values at each level
const progressData = computed(() => {
  return monevStore.rekapByProgram.map(prog => {
    const kegiatan = (prog.kegiatan || []).map(keg => {
      const subKegiatan = (keg.subKegiatan || []).map(sk => {
        const outputs = (sk.outputs || []).map(out => {
          const avgFisik = latestFisikFromMonitoring(out.monitoring)
          const totalKeuangan = latestKeuanganFromMonitoring(out.monitoring)
          const outPagu = parseFloat(out.pagu || 0)
          const pctKeuangan = pctOf(totalKeuangan, outPagu)
          return { ...out, avgFisik, totalKeuangan, pctKeuangan }
        })
        // Sub Kegiatan: average fisik, sum keuangan, sum pagu
        const skFisik = outputs.length ? Math.round(outputs.reduce((s, o) => s + o.avgFisik, 0) / outputs.length * 100) / 100 : 0
        const skTotalKeu = outputs.reduce((s, o) => s + o.totalKeuangan, 0)
        const skTotalPagu = outputs.reduce((s, o) => s + parseFloat(o.pagu || 0), 0)
        const skPctKeu = pctOf(skTotalKeu, skTotalPagu)
        return { ...sk, outputs, avgFisik: skFisik, totalKeuangan: skTotalKeu, totalPagu: skTotalPagu, pctKeuangan: skPctKeu }
      })
      // Kegiatan: average fisik, sum keuangan, sum pagu
      const kegFisik = subKegiatan.length ? Math.round(subKegiatan.reduce((s, sk) => s + sk.avgFisik, 0) / subKegiatan.length * 100) / 100 : 0
      const kegTotalKeu = subKegiatan.reduce((s, sk) => s + sk.totalKeuangan, 0)
      const kegTotalPagu = subKegiatan.reduce((s, sk) => s + sk.totalPagu, 0)
      const kegPctKeu = pctOf(kegTotalKeu, kegTotalPagu)
      return { ...keg, subKegiatan, avgFisik: kegFisik, totalKeuangan: kegTotalKeu, totalPagu: kegTotalPagu, pctKeuangan: kegPctKeu }
    })
    // Program: average fisik, sum keuangan, sum pagu
    const progFisik = kegiatan.length ? Math.round(kegiatan.reduce((s, k) => s + k.avgFisik, 0) / kegiatan.length * 100) / 100 : 0
    const progTotalKeu = kegiatan.reduce((s, k) => s + k.totalKeuangan, 0)
    const progTotalPagu = kegiatan.reduce((s, k) => s + k.totalPagu, 0)
    const progPctKeu = pctOf(progTotalKeu, progTotalPagu)
    return { ...prog, kegiatan, avgFisik: progFisik, totalKeuangan: progTotalKeu, totalPagu: progTotalPagu, pctKeuangan: progPctKeu }
  })
})

// Progress bar colors (for white/transparent backgrounds)
const filteredProgressData = computed(() => {
  if (!selectedProgramFilter.value) return progressData.value
  return progressData.value.filter(p => p.id === selectedProgramFilter.value)
})

// Progress bar colors (for white/transparent backgrounds)
const barColor = (pct) => {
  if (pct >= 80) return 'bg-emerald-400'
  if (pct >= 50) return 'bg-amber-400'
  if (pct > 0) return 'bg-red-400'
  return 'bg-gray-300'
}

const barColorSolid = (pct) => {
  if (pct >= 80) return 'bg-emerald-500'
  if (pct >= 50) return 'bg-amber-500'
  if (pct > 0) return 'bg-red-500'
  return 'bg-gray-300'
}

const onTahunChange = () => {
  monevStore.loadAllForTahun(selectedTahunId.value)
}

onMounted(async () => {
  await monevStore.fetchTahun()
  if (monevStore.selectedTahunId) {
    selectedTahunId.value = monevStore.selectedTahunId
    await monevStore.loadAllForTahun(monevStore.selectedTahunId)
  }
})
</script>
