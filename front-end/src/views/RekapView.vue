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
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Rekapitulasi Program</h1>
              <p class="text-gray-500 dark:text-gray-400 mt-1">Daftar rekapitulasi progress fisik dan keuangan per program</p>
            </div>
            <div class="flex items-center gap-3">
              <select v-model="selectedTahunId" @change="onTahunChange" class="input-field w-auto min-w-[120px]">
                <option v-for="t in monevStore.tahunList" :key="t.id" :value="t.id">{{ t.tahun }}</option>
              </select>
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
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Output : {{ out.kode ? out.kode + ' — ' + out.nama_output : out.nama_output }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">Total Pagu: {{ formatCurrency(out.pagu) }}</span>
                      </div>
                      
                      <!-- Belanja items under output in rekap -->
                      <div v-if="rekapBelanjaPerOutput[out.id] && rekapBelanjaPerOutput[out.id].length > 0" class="mb-2 ml-2 space-y-1">
                        <div v-for="b in rekapBelanjaPerOutput[out.id]" :key="b.id" class="flex items-center justify-between text-xs bg-yellow-50 dark:bg-yellow-900/20 rounded px-2 py-1">
                          <span class="text-gray-600 dark:text-gray-400">Belanja: {{ b.kode ? b.kode + ' — ' + b.nama_belanja : b.nama_belanja }}</span>
                          <span class="font-medium text-gray-700 dark:text-gray-300">{{ formatCurrency(b.pagu) }}</span>
                        </div>
                      </div>

                      <div v-if="out.monitoring.length > 0" class="space-y-2 mt-2">
                        <div 
                          v-for="mon in out.monitoring" :key="mon.id"
                          class="text-xs bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 border border-gray-100 dark:border-gray-600"
                        >
                          <div class="flex items-center gap-2 mb-1">
                            <span class="font-semibold text-gray-700 dark:text-gray-300">{{ monevStore.bulanNames[mon.bulan - 1]?.slice(0, 3) }}:</span>
                            <span class="text-emerald-600">Target Fisik: {{ mon.target_fisik }}%</span>
                            <span class="text-emerald-600">Realisasi Fisik: {{ mon.realisasi_fisik }}%</span>
                            <span class="text-indigo-600 font-medium">Deviasi Fisik: {{ formatDeviasiFisik(mon.target_fisik, mon.realisasi_fisik) }}</span>
                            <span class="text-blue-600 font-medium ml-2">Total Target Keuangan: {{ formatCurrency(mon.target_keuangan) }}</span>
                            <span class="text-blue-600 font-medium">Total Realisasi Keuangan: {{ formatCurrency(mon.realisasi_keuangan) }}</span>
                          </div>
                          
                          <!-- DETAIL BELANJA KEUANGAN -->
                          <div v-if="rekapBelanjaPerOutput[out.id] && rekapBelanjaPerOutput[out.id].length > 0" class="mt-2 ml-2 pl-2 border-l-2 border-blue-200 dark:border-blue-800/50 space-y-1">
                            <div v-for="b in rekapBelanjaPerOutput[out.id]" :key="b.id" class="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                               <span>- {{ b.kode ? b.kode + ' — ' + b.nama_belanja : b.nama_belanja }}:</span>
                               <span class="text-blue-500">Target: {{ formatCurrency(rekapMonitoringBelanjaMap[b.id]?.[mon.periode_id]?.target_keuangan || 0) }}</span>
                               <span class="text-blue-500">Realisasi: {{ formatCurrency(rekapMonitoringBelanjaMap[b.id]?.[mon.periode_id]?.realisasi_keuangan || 0) }}</span>
                               <span class="text-indigo-500 font-medium">
                                Deviasi: {{ formatDeviasiComputed(
                                  b.pagu > 0 ? ((rekapMonitoringBelanjaMap[b.id]?.[mon.periode_id]?.target_keuangan || 0) / b.pagu) * 100 : 0,
                                  (rekapMonitoringBelanjaMap[b.id]?.[mon.periode_id]?.target_keuangan || 0) > 0 ? ((rekapMonitoringBelanjaMap[b.id]?.[mon.periode_id]?.realisasi_keuangan || 0) / (rekapMonitoringBelanjaMap[b.id]?.[mon.periode_id]?.target_keuangan || 0)) * 100 : 0
                                ) }}
                               </span>
                            </div>
                          </div>

                          <div v-if="mon.progress || mon.hambatan || mon.pendorong" class="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
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
import { ref, onMounted } from 'vue'
import { useMonevStore } from '../stores/monev'
import { api } from '../api'

import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'

const monevStore = useMonevStore()

const sidebarOpen = ref(false)
const selectedTahunId = ref(monevStore.selectedTahunId)

const rekapBelanjaPerOutput = ref({})
const rekapMonitoringBelanjaMap = ref({})

const loadRekapBelanja = async () => {
  const programs = monevStore.rekapByProgram
  const belanjaMap = {}
  for (const prog of programs) {
    for (const keg of (prog.kegiatan || [])) {
      for (const sk of (keg.subKegiatan || [])) {
        for (const out of (sk.outputs || [])) {
          try {
            belanjaMap[out.id] = await api.get(`/belanja?output_id=${out.id}`)
          } catch (e) {
            belanjaMap[out.id] = []
          }
        }
      }
    }
  }
  rekapBelanjaPerOutput.value = belanjaMap

  // Load ALL monitoring_belanja data for rekap detail
  try {
    const allMonBelanjaRaw = await api.get('/monitoring/belanja')
    const allMonBelanjaMap = {}
    for (const row of allMonBelanjaRaw) {
      if (!allMonBelanjaMap[row.belanja_id]) allMonBelanjaMap[row.belanja_id] = {}
      allMonBelanjaMap[row.belanja_id][row.periode_id] = row
    }
    rekapMonitoringBelanjaMap.value = allMonBelanjaMap
  } catch(e) {
    console.error('Gagal fetch rekap monitoring belanja', e)
  }
}

const onTahunChange = async () => {
  if (selectedTahunId.value) {
    await monevStore.fetchTahun()
    // It's a simplfied load, but loadAllForTahun does it.
    await monevStore.loadAllForTahun(selectedTahunId.value)
    await loadRekapBelanja()
  }
}

onMounted(async () => {
  await monevStore.fetchTahun()
  if (monevStore.selectedTahunId) {
    selectedTahunId.value = monevStore.selectedTahunId
    await monevStore.loadAllForTahun(monevStore.selectedTahunId)
  }
  await loadRekapBelanja()
})

const formatCurrency = (value) => {
  if (!value) return 'Rp 0'
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(value)
}

const formatDeviasiComputed = (targetPct, realisasiPct) => {
  const d = (parseFloat(targetPct) || 0) - (parseFloat(realisasiPct) || 0)
  return d.toFixed(2) + '%'
}

const formatDeviasiFisik = (targetPct, realisasiPct) => {
  const t = parseFloat(targetPct) || 0
  const r = parseFloat(realisasiPct) || 0
  if (t === 0) return '0.00%'
  const v = 100 - ((r / t) * 100)
  return v.toFixed(2) + '%'
}
</script>
