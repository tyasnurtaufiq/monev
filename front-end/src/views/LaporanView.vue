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
              <!-- Export Program Selection -->
              <select v-model="selectedProgramExportId" class="input-field py-1.5 px-2 text-sm w-40 sm:w-48 truncate border-gray-300 dark:border-gray-600" title="Pilih program untuk dicetak">
                <option value="all">Semua Program</option>
                <option v-for="p in monevStore.rekapByProgram" :key="p.id" :value="p.id">
                  {{ p.kode_program }} — {{ p.nama_program }}
                </option>
              </select>

              <!-- Export Bulan Dropdown & Select -->
              <div class="flex items-center gap-1 bg-teal-50 dark:bg-teal-900/20 p-1 rounded-lg border border-teal-100 dark:border-teal-800">
                <select v-model="selectedBulanExport" class="input-field py-1.5 px-2 text-sm border-none bg-transparent focus:ring-0 text-teal-800 dark:text-teal-200 font-semibold cursor-pointer w-auto">
                  <option v-for="(name, idx) in monevStore.bulanNames" :key="idx" :value="idx + 1">{{ name }}</option>
                </select>
                <!-- Export Bulan Dropdown -->
                <div class="relative">
                  <button @click="exportBulanDropdownOpen = !exportBulanDropdownOpen" title="Export Laporan Per Bulan" class="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Export
                    <svg class="w-3 h-3 transition-transform duration-200" :class="{'rotate-180': exportBulanDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div v-if="exportBulanDropdownOpen" @click="exportBulanDropdownOpen = false" class="fixed inset-0 z-40"></div>
                  <div v-if="exportBulanDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl shadow-teal-500/10 dark:shadow-none border border-gray-100 dark:border-gray-700 z-50 py-1 fade-in">
                    <button @click="exportToExcel(true); exportBulanDropdownOpen = false" class="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Format Excel
                    </button>
                    <button @click="exportToHTML(true); exportBulanDropdownOpen = false" class="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      Format HTML/Cetak
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Export Dropdown -->
              <div class="relative">
                <button @click="exportDropdownOpen = !exportDropdownOpen" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Export Laporan
                  <svg class="w-4 h-4 transition-transform duration-200" :class="{'rotate-180': exportDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <!-- Overlay to close dropdown -->
                <div v-if="exportDropdownOpen" @click="exportDropdownOpen = false" class="fixed inset-0 z-40"></div>
                
                <!-- Dropdown Menu -->
                <div v-if="exportDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl shadow-indigo-500/10 dark:shadow-none border border-gray-100 dark:border-gray-700 z-50 py-1 fade-in">
                  <button @click="exportToExcel(); exportDropdownOpen = false" class="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Excel
                  </button>
                  <button @click="exportToHTML(); exportDropdownOpen = false" class="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Export HTML/Cetak
                  </button>
                </div>
              </div>
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
                    <h4 class="font-semibold text-gray-900 dark:text-white text-sm">{{ out.kode ? out.kode + ' — ' + out.nama_output : out.nama_output }}</h4>
                    <span class="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full self-start sm:self-auto">
                      Total Pagu: {{ formatCurrency(out.pagu) }}
                    </span>
                  </div>
                </div>

                <div class="p-4 space-y-5">
                  <!-- Keuangan Section Per Belanja -->
                  <div v-if="belanjaPerOutput[out.id] && belanjaPerOutput[out.id].length > 0" class="space-y-4 mb-2">
                    <div class="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                      
                      <!-- Header and Dropdown -->
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-blue-100 dark:border-blue-800 pb-3">
                        <div class="flex-1 w-full">
                          <label class="block text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Keuangan
                          </label>
                          <select 
                            v-if="belanjaPerOutput[out.id].length > 1"
                            v-model="selectedBelanjaPerOutput[out.id]" 
                            class="input-field w-full text-sm font-medium bg-white dark:bg-gray-800 dark:text-gray-200"
                          >
                            <option v-for="b in belanjaPerOutput[out.id]" :key="b.id" :value="b.id">
                              {{ b.kode ? b.kode + ' — ' + b.nama_belanja : b.nama_belanja }} - Pagu: {{ formatCurrency(b.pagu) }}
                            </option>
                          </select>
                          <div v-else class="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {{ belanjaPerOutput[out.id][0].kode ? belanjaPerOutput[out.id][0].kode + ' — ' + belanjaPerOutput[out.id][0].nama_belanja : belanjaPerOutput[out.id][0].nama_belanja }} 
                            <span class="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded ml-2">Pagu: {{ formatCurrency(belanjaPerOutput[out.id][0].pagu) }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Selected Belanja Keuangan Form -->
                      <div v-for="b in belanjaPerOutput[out.id]" :key="b.id">
                          <div v-if="selectedBelanjaPerOutput[out.id] === b.id" class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <div>
                              <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Target Bulan ini (Rp)</label>
                              <input 
                                v-if="monitoringBelanjaForm[b.id]"
                                :value="getBelanjaDisplay(b.id, 'target_keuangan')"
                                @input="e => onInputRibuan(e, b.id, 'target_keuangan')" 
                                type="text"
                                class="input-field text-center w-full focus:ring-2 focus:ring-blue-500"
                                :disabled="!isAdmin"
                              />
                              <p v-if="monitoringBelanjaForm[b.id] && !isAdmin" class="text-xs text-center text-gray-500 mt-1">Hanya dapat diubah oleh Admin</p>
                            </div>
                            <div>
                              <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Target Hingga Bulan Ini</label>
                              <div v-if="monitoringBelanjaForm[b.id]" class="px-3 py-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-center text-indigo-700 truncate font-semibold">
                                {{ formatCurrency(getPrevKumulatif(b.id, 'target_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].target_keuangan) || 0)) }}
                              </div>
                            </div>
                            <div>
                              <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Akumulasi S.d Bulan Lalu</label>
                              <div class="px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-center text-gray-600 truncate">
                                {{ formatCurrency(getPrevKumulatif(b.id, 'realisasi_keuangan')) }}
                              </div>
                            </div>
                            <div>
                              <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1" title="Realisasi (Rp) Bulan Ini">Realisasi (Rp) Bulan Ini</label>
                              <input 
                                v-if="monitoringBelanjaForm[b.id]"
                                :value="getBelanjaDisplay(b.id, 'realisasi_keuangan')"
                                @input="e => onInputRibuan(e, b.id, 'realisasi_keuangan')" 
                                type="text"
                                class="input-field text-center w-full focus:ring-2 focus:ring-blue-500"
                                :disabled="!isAdmin && !windowOpen"
                              />
                            </div>
                            <div>
                              <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Realisasi Hingga Bulan Ini</label>
                              <div v-if="monitoringBelanjaForm[b.id]" class="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-center text-gray-600 truncate font-semibold">
                                {{ formatCurrency(getPrevKumulatif(b.id, 'realisasi_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].realisasi_keuangan) || 0)) }}
                              </div>
                            </div>

                            <!-- New Keuangan Columns: Target (%), Realisasi (%) -->
                            <div class="col-span-2 sm:col-span-5 grid grid-cols-3 gap-3 pt-2 border-t border-blue-100 dark:border-blue-800">
                              <div>
                                <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Target (%)</label>
                                <div v-if="monitoringBelanjaForm[b.id]" class="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-center text-gray-600">
                                  {{ b.pagu > 0 ? (((getPrevKumulatif(b.id, 'target_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].target_keuangan) || 0)) / b.pagu) * 100).toFixed(2) : 0 }}%
                                </div>
                              </div>
                              <div>
                                <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1" title="Realisasi (%) Hingga Bulan Ini">Realisasi (%) Hingga Bulan Ini</label>
                                <div v-if="monitoringBelanjaForm[b.id]" class="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-center text-gray-600">
                                  {{ b.pagu > 0 ? (((getPrevKumulatif(b.id, 'realisasi_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].realisasi_keuangan) || 0)) / b.pagu) * 100).toFixed(2) : 0 }}%
                                </div>
                              </div>
                              <div>
                                <label class="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Deviasi (%)</label>
                                <div v-if="monitoringBelanjaForm[b.id]"
                                  class="px-3 py-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-center font-semibold"
                                  :class="deviasiColorComputedK(
                                    b.pagu > 0 ? (((getPrevKumulatif(b.id, 'target_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].target_keuangan) || 0)) / b.pagu) * 100) : 0, 
                                    b.pagu > 0 ? (((getPrevKumulatif(b.id, 'realisasi_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].realisasi_keuangan) || 0)) / b.pagu) * 100) : 0
                                  )"
                                >
                                  {{ 
                                    formatDeviasiComputed(
                                      b.pagu > 0 ? (((getPrevKumulatif(b.id, 'target_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].target_keuangan) || 0)) / b.pagu) * 100) : 0, 
                                      b.pagu > 0 ? (((getPrevKumulatif(b.id, 'realisasi_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].realisasi_keuangan) || 0)) / b.pagu) * 100) : 0
                                    ) 
                                  }}
                                </div>
                              </div>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
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
                          :disabled="!isAdmin"
                        />
                        <p v-if="!isAdmin" class="text-xs text-center text-gray-500 mt-1">Hanya dapat diubah oleh Admin</p>
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
                          :class="deviasiColorFisik(monitoringForm[out.id].target_fisik, monitoringForm[out.id].realisasi_fisik)"
                        >
                          {{ formatDeviasiFisik(monitoringForm[out.id].target_fisik, monitoringForm[out.id].realisasi_fisik) }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- End Keuangan Section -->

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

                </div>
              </div>

              <!-- Global Save Button -->
              <div class="flex justify-end pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
                <button 
                  @click="saveAllMonitoringRows"
                  class="px-8 py-2.5 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
                  :disabled="isSavingAll || (!isAdmin && !windowOpen)"
                >
                  {{ isSavingAll ? 'Menyimpan Semua...' : 'Simpan Semua' }}
                </button>
              </div>
            </div>

            <div v-else class="text-center py-12 text-gray-500">
              <p class="font-medium">Pilih Sub Kegiatan untuk input monitoring</p>
              <p class="text-sm">Monitoring per bulan untuk setiap output pada sub kegiatan</p>
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
import Swal from 'sweetalert2'

import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'

const monevStore = useMonevStore()
const authStore = useAuthStore()

const sidebarOpen = ref(false)
const exportDropdownOpen = ref(false)
const isAdmin = computed(() => authStore.user?.role === 'admin')
const windowOpen = ref(false)

const selectedProgramExportId = ref('all')
const filteredProgramsForExport = computed(() => {
  if (selectedProgramExportId.value === 'all') {
    return monevStore.rekapByProgram
  }
  return monevStore.rekapByProgram.filter(p => p.id === selectedProgramExportId.value)
})

const exportBulanDropdownOpen = ref(false)
const selectedBulanExport = ref(new Date().getMonth() + 1)

const selectedTahunId = ref(monevStore.selectedTahunId)
const selectedProgramId = ref('')
const selectedKegiatanId = ref('')
const selectedSubKegiatanId = ref('')
const selectedBulan = ref(new Date().getMonth() + 1)
const isSavingAll = ref(false)
const loadingOutputs = ref(false)

// Local lists for cascading dropdowns (separate from store to avoid conflicts)
const localKegiatanList = ref([])
const localSubKegiatanList = ref([])

// Outputs for the selected sub kegiatan's monitoring
const outputsForMonitoring = ref([])
const prevMonthData = ref({})
const monitoringForm = ref({})
const monitoringBelanjaForm = ref({})
const prevMonthBelanjaData = ref({})
const belanjaPerOutput = ref({})
const selectedBelanjaPerOutput = ref({})
const rekapBelanjaPerOutput = ref({})
const rekapMonitoringBelanjaMap = ref({})
const belanjaDisplayValues = ref({})

const formatCurrency = (value) => {
  if (!value) return 'Rp 0'
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(value)
}

const formatRibuan = (value) => {
  if (value === null || value === undefined || value === '' || value === 0) return '0'
  const num = typeof value === 'number' ? value : parseFloat(value)
  if (isNaN(num) || num === 0) return '0'
  return Math.round(num).toLocaleString('id-ID')
}

const getBelanjaDisplay = (bId, field) => {
  const key = bId + '_' + field
  if (belanjaDisplayValues.value[key] !== undefined) {
    return belanjaDisplayValues.value[key]
  }
  const numVal = monitoringBelanjaForm.value[bId]?.[field] || 0
  return formatRibuan(numVal)
}

const getPrevKumulatif = (bId, field) => {
  let sum = 0
  const pastPeriods = monevStore.periodeList.filter(p => p.bulan < selectedBulan.value)
  for (const p of pastPeriods) {
    const monData = rekapMonitoringBelanjaMap.value[bId]?.[p.id]
    if (monData) {
      sum += parseFloat(monData[field]) || 0
    }
  }
  return sum
}

const initBelanjaDisplay = (bId, field, numericValue) => {
  const key = bId + '_' + field
  belanjaDisplayValues.value[key] = formatRibuan(numericValue || 0)
}

const onInputRibuan = (event, bId, field) => {
  const raw = event.target.value.replace(/[^0-9]/g, '')
  const numeric = raw ? parseInt(raw, 10) : 0
  monitoringBelanjaForm.value[bId][field] = numeric
  
  // Update the display value ref - Vue handles the DOM update via :value binding
  const key = bId + '_' + field
  belanjaDisplayValues.value[key] = raw ? numeric.toLocaleString('id-ID') : ''
}

const calcDeviasi = (realisasi, target) => {
  const r = parseFloat(realisasi) || 0
  const t = parseFloat(target) || 0
  if (t === 0) return null
  return Math.round((r / t) * 10000) / 100
}

const formatDeviasiComputed = (targetPct, realisasiPct) => {
  const d = (parseFloat(targetPct) || 0) - (parseFloat(realisasiPct) || 0)
  return d.toFixed(2) + '%'
}

const deviasiColorComputedK = (targetPct, realisasiPct) => {
  const d = (parseFloat(targetPct) || 0) - (parseFloat(realisasiPct) || 0)
  if (d >= 10) return 'text-red-600'
  if (d >= 8) return 'text-amber-600'
  return 'text-emerald-600'
}

const formatDeviasiFisik = (targetPct, realisasiPct) => {
  const t = parseFloat(targetPct) || 0
  const r = parseFloat(realisasiPct) || 0
  if (t === 0) return '0.00%'
  const d = 100 - ((r / t) * 100)
  return d.toFixed(2) + '%'
}

const deviasiColorFisik = (targetPct, realisasiPct) => {
  const t = parseFloat(targetPct) || 0
  const r = parseFloat(realisasiPct) || 0
  if (t === 0) return 'text-emerald-600'
  const d = 100 - ((r / t) * 100)
  if (d >= 5) return 'text-red-600'
  if (d >= 3) return 'text-amber-600'
  return 'text-emerald-600' 
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
  monitoringBelanjaForm.value = {}
  belanjaDisplayValues.value = {}
  belanjaPerOutput.value = {}
  selectedBelanjaPerOutput.value = {}
  await monevStore.loadAllForTahun(selectedTahunId.value)
  await loadRekapBelanja()
}

const onProgramChange = async () => {
  // Reset downstream selections
  selectedKegiatanId.value = ''
  selectedSubKegiatanId.value = ''
  localSubKegiatanList.value = []
  outputsForMonitoring.value = []
  monitoringForm.value = {}
  monitoringBelanjaForm.value = {}
  belanjaDisplayValues.value = {}
  selectedBelanjaPerOutput.value = {}

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
  monitoringBelanjaForm.value = {}
  belanjaDisplayValues.value = {}
  selectedBelanjaPerOutput.value = {}

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
    monitoringBelanjaForm.value = {}
    belanjaDisplayValues.value = {}
    selectedBelanjaPerOutput.value = {}
    return
  }
  await loadOutputsForSubKegiatan()
}

const loadOutputsForSubKegiatan = async () => {
  loadingOutputs.value = true
  try {
    const outputs = await api.get(`/output?sub_kegiatan_id=${selectedSubKegiatanId.value}`)
    outputsForMonitoring.value = outputs

    // Fetch belanja for each output
    const belanjaData = {}
    const initSelectedBelanja = {}
    for (const out of outputs) {
      try {
        const belanjas = await api.get(`/belanja?output_id=${out.id}`)
        belanjaData[out.id] = belanjas
        if (belanjas.length > 0) {
          initSelectedBelanja[out.id] = belanjas[0].id
        }
      } catch (e) {
        belanjaData[out.id] = []
      }
    }
    belanjaPerOutput.value = belanjaData
    selectedBelanjaPerOutput.value = initSelectedBelanja

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
    const formBelanjaData = {}
    const prevBlnBelanjaData = {}
    
    for (const out of outputs) {
      formData[out.id] = {
        target_fisik: 0,
        realisasi_fisik: 0,
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
              realisasi_fisik: prev[0].realisasi_fisik || 0
            }
          }
        } catch (e) { /* ignore */ }
      }
      
      // Load Belanja monitoring data
      const belanjas = belanjaData[out.id] || []
      for (const b of belanjas) {
        formBelanjaData[b.id] = {
          target_keuangan: 0,
          realisasi_keuangan: 0
        }
        prevBlnBelanjaData[b.id] = null
        
        if (periode) {
          try {
            const existingB = await api.get(`/monitoring/belanja?belanja_id=${b.id}&periode_id=${periode.id}`)
            if (existingB.length > 0) {
              formBelanjaData[b.id] = {
                target_keuangan: existingB[0].target_keuangan || 0,
                realisasi_keuangan: existingB[0].realisasi_keuangan || 0
              }
            }
          } catch(e) {}
        }
        
        if (periodePrev) {
          try {
            const prevB = await api.get(`/monitoring/belanja?belanja_id=${b.id}&periode_id=${periodePrev.id}`)
            if (prevB.length > 0) {
              prevBlnBelanjaData[b.id] = {
                realisasi_keuangan: prevB[0].realisasi_keuangan || 0
              }
            }
          } catch(e) {}
        }
      }
    }
    monitoringForm.value = formData
    prevMonthData.value = prevData
    monitoringBelanjaForm.value = formBelanjaData
    prevMonthBelanjaData.value = prevBlnBelanjaData
    
    // Initialize display values for all belanja fields
    const displayInit = {}
    for (const bId in formBelanjaData) {
      displayInit[bId + '_target_keuangan'] = formatRibuan(formBelanjaData[bId].target_keuangan)
      displayInit[bId + '_realisasi_keuangan'] = formatRibuan(formBelanjaData[bId].realisasi_keuangan)
    }
    belanjaDisplayValues.value = displayInit
  } finally {
    loadingOutputs.value = false
  }
}

watch(selectedBulan, () => {
  if (selectedSubKegiatanId.value) {
    loadOutputsForSubKegiatan()
  }
})

const saveAllMonitoringRows = async () => {
  isSavingAll.value = true
  try {
    // Ensure periode exists
    if (monevStore.periodeList.length === 0) {
      await monevStore.generatePeriode(selectedTahunId.value)
    }

    const periode = monevStore.periodeList.find(p => p.bulan === selectedBulan.value)
    if (!periode) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Periode tidak ditemukan. Coba generate ulang.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    const promises = []

    for (const output of outputsForMonitoring.value) {
      const formRow = monitoringForm.value[output.id]
      
      // Save output monitoring (Fisik)
      const fisikPromise = monevStore.saveMonitoring({
        output_id: output.id,
        periode_id: periode.id,
        target_fisik: parseFloat(formRow.target_fisik) || 0,
        realisasi_fisik: parseFloat(formRow.realisasi_fisik) || 0,
        progress: formRow.progress || '',
        hambatan: formRow.hambatan || '',
        pendorong: formRow.pendorong || ''
      })
      promises.push(fisikPromise)
      
      // Save belanja monitoring (Keuangan) separately for each belanja under this output
      const belanjas = belanjaPerOutput.value[output.id] || []
      belanjas.forEach(b => {
         const formBelanjaRow = monitoringBelanjaForm.value[b.id]
         if (formBelanjaRow) {
           promises.push(monevStore.saveMonitoringBelanja({
             belanja_id: b.id,
             periode_id: periode.id,
             target_keuangan: parseFloat(formBelanjaRow.target_keuangan) || 0,
             realisasi_keuangan: parseFloat(formBelanjaRow.realisasi_keuangan) || 0
           }))
         }
      })
    }
    
    await Promise.all(promises)

    // Refresh rekap
    await monevStore.fetchRekap(selectedTahunId.value)
    
    // Show success message
    Swal.fire({
      title: 'Berhasil!',
      text: 'Semua data monitoring berhasil disimpan.',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#9333ea'
    })
  } catch (err) {
    Swal.fire({
      title: 'Gagal!',
      text: err.message || 'Terjadi kesalahan saat menyimpan data.',
      icon: 'error',
      confirmButtonText: 'Tutup',
      confirmButtonColor: '#ef4444'
    })
  } finally {
    isSavingAll.value = false
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
  // Load belanja for rekap
  await loadRekapBelanja()
})

const getOutputPagu = (outputId) => {
  const items = belanjaPerOutput.value[outputId] || []
  return items.reduce((sum, b) => sum + parseFloat(b.pagu || 0), 0)
}

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

const deviasiStyle = (val, isKeuangan) => {
  let bgColor = 'D1FAE5' // default green
  if (isKeuangan) {
    if (val >= 10) bgColor = 'FEE2E2' // red
    else if (val >= 8) bgColor = 'FEF3C7' // yellow
  } else {
    if (val >= 5) bgColor = 'FEE2E2' // red
    else if (val >= 3) bgColor = 'FEF3C7' // yellow
  }
  return {
    font: { bold: true, sz: 9 },
    fill: { fgColor: { rgb: bgColor } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border
  }
}

const currencyStyle = (styleFn) => ({
  ...styleFn(true)
})

const makeStyledRow = (vals, styleFn) => {
  return vals.map((v, i) => {
    const isNumCol = i >= 3 && i <= 10
    const isDeviasi = (i === 6 || i === 10) && typeof v === 'number'
    const isCurrency = (i === 3 || i === 7 || i === 9)
    
    if (isDeviasi) return { v, t: 'n', s: deviasiStyle(v, i === 10), z: '0.00' }
    if (isCurrency && typeof v === 'number') return { v, t: 'n', s: styleFn(true), z: '#,##0' }
    return { v: v ?? '', t: typeof v === 'number' ? 'n' : 's', s: styleFn(isNumCol), z: isNumCol && typeof v === 'number' && !isCurrency ? '0.00' : undefined }
  })
}

const exportToExcel = (isPerBulan = false) => {
  const programs = filteredProgramsForExport.value
  if (!programs || programs.length === 0) {
    Swal.fire({
      title: 'Tidak Ada Data!',
      text: 'Tidak ada data rekap program untuk diexport.',
      icon: 'warning',
      confirmButtonText: 'Tutup'
    })
    return
  }

  const tahun = monevStore.tahunList.find(t => t.id === selectedTahunId.value)?.tahun || ''
  const bulanNames = monevStore.bulanNames

  const rows = []

  let minBulan = 12
  let maxBulan = 1
  let hasMonitoring = false

  for (const p of programs) {
    for (const k of (p.kegiatan || [])) {
      for (const sk of (k.subKegiatan || [])) {
        for (const out of (sk.outputs || [])) {
          for (const m of (out.monitoring || [])) {
            hasMonitoring = true
            if (m.bulan < minBulan) minBulan = m.bulan
            if (m.bulan > maxBulan) maxBulan = m.bulan
          }
        }
      }
    }
  }

  const rangeString = isPerBulan
    ? ` (Bulan ${bulanNames[selectedBulanExport.value - 1] || selectedBulanExport.value})`
    : (hasMonitoring
      ? ` (Bulan ${bulanNames[minBulan - 1] || minBulan} s.d. ${bulanNames[maxBulan - 1] || maxBulan})`
      : '')

  // Row 0: Title
  const titleRow = Array(TOTAL_COLS).fill(null).map(() => ({ v: '', s: titleStyle }))
  titleRow[0] = { v: `Laporan Realisasi Program/Kegiatan/Sub Kegiatan Dinas Perhubungan DIY Tahun Anggaran ${tahun}${rangeString}`, s: titleStyle }
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
    if (isPerBulan) {
      return monArr.find(m => m.bulan === selectedBulanExport.value) || null
    }
    return monArr.reduce((l, m) => (!l || m.bulan > l.bulan) ? m : l, null)
  }

  const getKumulatifMonitoring = (monArr, field, upToBulan) => {
    if (!monArr) return 0;
    return monArr.filter(m => m.bulan <= upToBulan).reduce((sum, m) => sum + (parseFloat(m[field]) || 0), 0)
  }

  const getKumulatifBelanja = (bId, field, upToBulan) => {
    let sum = 0
    const periods = monevStore.periodeList.filter(p => p.bulan <= upToBulan)
    for (const p of periods) {
      const monData = rekapMonitoringBelanjaMap.value[bId]?.[p.id]
      if (monData) sum += parseFloat(monData[field]) || 0
    }
    return sum
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
            progTK += getKumulatifMonitoring(out.monitoring, 'target_keuangan', lat.bulan)
            progRK += getKumulatifMonitoring(out.monitoring, 'realisasi_keuangan', lat.bulan)
          }
        }
      }
    }
    const pRKPct = progPagu > 0 ? Math.round((progRK / progPagu) * 10000) / 100 : 0
    const pTKPct = progPagu > 0 ? Math.round((progTK / progPagu) * 10000) / 100 : 0
    const pDevK = pTKPct - pRKPct
    const pFisikTarget = progFC > 0 ? Math.round((progTF / progFC) * 100) / 100 : 0
    const pFisikReal = progFC > 0 ? Math.round((progRF / progFC) * 100) / 100 : 0
    const pDevF = pFisikTarget > 0 ? Math.round((100 - (pFisikReal / pFisikTarget * 100)) * 100) / 100 : 0

    rows.push(makeStyledRow([
      progNo, prog.kode_program, prog.nama_program?.toUpperCase(), progPagu,
      pFisikTarget,
      pFisikReal,
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
          if (lat) { kTF += parseFloat(lat.target_fisik || 0); kRF += parseFloat(lat.realisasi_fisik || 0); kFC++; kTK += getKumulatifMonitoring(out.monitoring, 'target_keuangan', lat.bulan); kRK += getKumulatifMonitoring(out.monitoring, 'realisasi_keuangan', lat.bulan) }
        }
      }
      const kRKPct = kP > 0 ? Math.round((kRK / kP) * 10000) / 100 : 0
      const kTKPct = kP > 0 ? Math.round((kTK / kP) * 10000) / 100 : 0
      const kDevK = kTKPct - kRKPct
      const kFisikTarget = kFC > 0 ? Math.round((kTF / kFC) * 100) / 100 : 0
      const kFisikReal = kFC > 0 ? Math.round((kRF / kFC) * 100) / 100 : 0
      const kDevF = kFisikTarget > 0 ? Math.round((100 - (kFisikReal / kFisikTarget * 100)) * 100) / 100 : 0

      rows.push(makeStyledRow([
        `${progNo}.${kegNo}`, keg.kode_kegiatan, keg.nama_kegiatan, kP,
        kFisikTarget,
        kFisikReal,
        kDevF, kTK, kRKPct, kRK, kDevK, '', '', ''
      ], kegStyle))

      let skNo = 0
      for (const sk of (keg.subKegiatan || [])) {
        skNo++
        let sP = 0, sTF = 0, sRF = 0, sFC = 0, sTK = 0, sRK = 0
        for (const out of (sk.outputs || [])) {
          sP += parseFloat(out.pagu || 0)
          const lat = getLatest(out.monitoring)
          if (lat) { sTF += parseFloat(lat.target_fisik || 0); sRF += parseFloat(lat.realisasi_fisik || 0); sFC++; sTK += getKumulatifMonitoring(out.monitoring, 'target_keuangan', lat.bulan); sRK += getKumulatifMonitoring(out.monitoring, 'realisasi_keuangan', lat.bulan) }
        }
        const sRKPct = sP > 0 ? Math.round((sRK / sP) * 10000) / 100 : 0
        const sTKPct = sP > 0 ? Math.round((sTK / sP) * 10000) / 100 : 0
        const sDevK = sTKPct - sRKPct
        const sFisikTarget = sFC > 0 ? Math.round((sTF / sFC) * 100) / 100 : 0
        const sFisikReal = sFC > 0 ? Math.round((sRF / sFC) * 100) / 100 : 0
        const sDevF = sFisikTarget > 0 ? Math.round((100 - (sFisikReal / sFisikTarget * 100)) * 100) / 100 : 0

        rows.push(makeStyledRow([
          `${progNo}.${kegNo}.${skNo}`, sk.kode_sub_kegiatan, sk.nama_sub_kegiatan, sP,
          sFisikTarget,
          sFisikReal,
          sDevF, sTK, sRKPct, sRK, sDevK, '', '', ''
        ], skStyle))

        const sortedOutputs = [...(sk.outputs || [])].sort((a, b) => String(a.kode || '').localeCompare(String(b.kode || '')))
        for (const out of sortedOutputs) {
          const lat = getLatest(out.monitoring)
          const tf = lat ? parseFloat(lat.target_fisik || 0) : 0
          const rf = lat ? parseFloat(lat.realisasi_fisik || 0) : 0
          const devF = tf > 0 ? Math.round((100 - (rf / tf * 100)) * 100) / 100 : 0
          const tk = lat ? getKumulatifMonitoring(out.monitoring, 'target_keuangan', lat.bulan) : 0
          const rk = lat ? getKumulatifMonitoring(out.monitoring, 'realisasi_keuangan', lat.bulan) : 0
          const oP = parseFloat(out.pagu || 0)
          const rkPct = oP > 0 ? Math.round((rk / oP) * 10000) / 100 : 0
          const tkPct = oP > 0 ? Math.round((tk / oP) * 10000) / 100 : 0
          const devK = tkPct - rkPct
          const progress = lat?.progress || ''
          const hambatan = lat?.hambatan || ''
          const pendorong = lat?.pendorong || ''

          rows.push(makeStyledRow([
            '', out.kode || '', `Output: ${out.nama_output}`, oP,
            tf, rf, devF, tk, rkPct, rk, devK,
            progress ? `\n${progress}` : '',
            hambatan ? `\n${hambatan}` : '',
            pendorong ? `\n${pendorong}` : ''
          ], dataStyle))

          // Add Belanja Detail in Excel
          const belanjas = [...(rekapBelanjaPerOutput.value[out.id] || [])].sort((a,b) => String(a.kode || '').localeCompare(String(b.kode || '')))
          for (const b of belanjas) {
            const bPagu = parseFloat(b.pagu || 0)
            const bMon = rekapMonitoringBelanjaMap.value[b.id]?.[lat?.periode_id]
            const bTk = getKumulatifBelanja(b.id, 'target_keuangan', lat?.bulan || 12)
            const bRk = getKumulatifBelanja(b.id, 'realisasi_keuangan', lat?.bulan || 12)
            const bRkPct = bPagu > 0 ? Math.round((bRk / bPagu) * 10000) / 100 : 0
            const bTkPct = bPagu > 0 ? Math.round((bTk / bPagu) * 10000) / 100 : 0
            const bDevK = bTkPct - bRkPct
            
            rows.push(makeStyledRow([
              '', b.kode || '', `  - Belanja: ${b.nama_belanja}`, bPagu,
              '', '', '', bTk, bRkPct, bRk, bDevK, '', '', ''
            ], dataStyle))
          }
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

const exportToHTML = (isPerBulan = false) => {
  const programs = filteredProgramsForExport.value
  if (!programs || programs.length === 0) {
    Swal.fire({
      title: 'Tidak Ada Data!',
      text: 'Tidak ada data rekap program untuk diexport.',
      icon: 'warning',
      confirmButtonText: 'Tutup'
    })
    return
  }

  const tahun = monevStore.tahunList.find(t => t.id === selectedTahunId.value)?.tahun || ''
  
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Browser memblokir popup. Izinkan popup untuk mencetak laporan.')
    return
  }

  const getLatest = (monArr) => {
    if (!monArr || monArr.length === 0) return null
    if (isPerBulan) {
      return monArr.find(m => m.bulan === selectedBulanExport.value) || null
    }
    return monArr.reduce((l, m) => (!l || m.bulan > l.bulan) ? m : l, null)
  }

  const getKumulatifMonitoring = (monArr, field, upToBulan) => {
    if (!monArr) return 0;
    return monArr.filter(m => m.bulan <= upToBulan).reduce((sum, m) => sum + (parseFloat(m[field]) || 0), 0)
  }

  const getKumulatifBelanja = (bId, field, upToBulan) => {
    let sum = 0
    const periods = monevStore.periodeList.filter(p => p.bulan <= upToBulan)
    for (const p of periods) {
      const monData = rekapMonitoringBelanjaMap.value[bId]?.[p.id]
      if (monData) sum += parseFloat(monData[field]) || 0
    }
    return sum
  }

  let minBulan = 12
  let maxBulan = 1
  let hasMonitoring = false

  for (const p of programs) {
    for (const k of (p.kegiatan || [])) {
      for (const sk of (k.subKegiatan || [])) {
        for (const out of (sk.outputs || [])) {
          for (const m of (out.monitoring || [])) {
            hasMonitoring = true
            if (m.bulan < minBulan) minBulan = m.bulan
            if (m.bulan > maxBulan) maxBulan = m.bulan
          }
        }
      }
    }
  }

  const bulanNames = monevStore.bulanNames
  const rangeString = isPerBulan
    ? `<br><span style="font-size: 14px; font-weight: normal;">(Bulan ${bulanNames[selectedBulanExport.value - 1] || selectedBulanExport.value})</span>`
    : (hasMonitoring
      ? `<br><span style="font-size: 14px; font-weight: normal;">(Bulan ${bulanNames[minBulan - 1] || minBulan} s.d. ${bulanNames[maxBulan - 1] || maxBulan})</span>`
      : '')

  const formatNum = (num) => parseFloat(num || 0).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  const formatRp = (num) => parseFloat(num || 0).toLocaleString('id-ID')

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Laporan Realisasi Dinas Perhubungan DIY ${tahun}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11px; margin: 20px; color: #333; }
        h2 { text-align: center; font-size: 16px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #333; padding: 6px; text-align: left; vertical-align: top; }
        th { background-color: #1b3a5c; color: white; text-align: center; font-weight: bold; }
        .th-sub { background-color: #2d5f8a; color: white; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bg-prog { background-color: #e8def8; font-weight: bold; }
        .bg-keg { background-color: #dbeafe; font-weight: bold; }
        .bg-sk { background-color: #f3f4f6; }
        .bg-dev-danger { background-color: #fee2e2; }
        .bg-dev-warning { background-color: #fef3c7; }
        .bg-dev-success { background-color: #d1fae5; }
        @media print {
          @page { size: landscape; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          th { color: black !important; background-color: #ddd !important; }
          .th-sub { color: black !important; background-color: #eee !important; }
        }
      </style>
    </head>
    <body>
      <h2>Laporan Realisasi Program/Kegiatan/Sub Kegiatan<br>Dinas Perhubungan DIY Tahun Anggaran ${tahun}${rangeString}</h2>
      <table>
        <thead>
          <tr>
            <th rowspan="2">No</th>
            <th rowspan="2">Kode</th>
            <th rowspan="2">Program / Kegiatan / Sub Kegiatan</th>
            <th rowspan="2">Pagu</th>
            <th colspan="3">Fisik</th>
            <th colspan="4">Keuangan</th>
            <th colspan="3">Keterangan Progres Bulan</th>
          </tr>
          <tr>
            <th class="th-sub">Target (%)</th>
            <th class="th-sub">Realisasi (%)</th>
            <th class="th-sub">Deviasi (%)</th>
            <th class="th-sub">Target (Rp)</th>
            <th class="th-sub">Realisasi (%)</th>
            <th class="th-sub">Realisasi (Rp)</th>
            <th class="th-sub">Deviasi (%)</th>
            <th class="th-sub">Tahapan Pekerjaan (Fisik)</th>
            <th class="th-sub">Faktor Penghambat</th>
            <th class="th-sub">Faktor Pendukung</th>
          </tr>
        </thead>
        <tbody>
  `

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
            progTK += getKumulatifMonitoring(out.monitoring, 'target_keuangan', lat.bulan)
            progRK += getKumulatifMonitoring(out.monitoring, 'realisasi_keuangan', lat.bulan)
          }
        }
      }
    }
    const pRKPct = progPagu > 0 ? Math.round((progRK / progPagu) * 10000) / 100 : 0
    const pTKPct = progPagu > 0 ? Math.round((progTK / progPagu) * 10000) / 100 : 0
    const pDevK = pTKPct - pRKPct
    const pFisikTarget = progFC > 0 ? Math.round((progTF / progFC) * 100) / 100 : 0
    const pFisikReal = progFC > 0 ? Math.round((progRF / progFC) * 100) / 100 : 0
    const pDevF = pFisikTarget > 0 ? Math.round((100 - (pFisikReal / pFisikTarget * 100)) * 100) / 100 : 0

    const getDevColorFisik = (val) => val >= 5 ? 'bg-dev-danger' : val >= 3 ? 'bg-dev-warning' : 'bg-dev-success'
    const getDevColorKeuangan = (val) => val >= 10 ? 'bg-dev-danger' : val >= 8 ? 'bg-dev-warning' : 'bg-dev-success'

    htmlContent += `
      <tr class="bg-prog">
        <td class="text-center">${progNo}</td>
        <td>${prog.kode_program || ''}</td>
        <td>${prog.nama_program?.toUpperCase() || ''}</td>
        <td class="text-right">${formatRp(progPagu)}</td>
        <td class="text-center">${formatNum(pFisikTarget)}</td>
        <td class="text-center">${formatNum(pFisikReal)}</td>
        <td class="text-center ${getDevColorFisik(pDevF)}">${formatNum(pDevF)}</td>
        <td class="text-right">${formatRp(progTK)}</td>
        <td class="text-center">${formatNum(pRKPct)}</td>
        <td class="text-right">${formatRp(progRK)}</td>
        <td class="text-center ${getDevColorKeuangan(pDevK)}">${formatNum(pDevK)}</td>
        <td></td><td></td><td></td>
      </tr>
    `

    let kegNo = 0
    for (const keg of kegList) {
      kegNo++
      let kP = 0, kTF = 0, kRF = 0, kFC = 0, kTK = 0, kRK = 0
      for (const sk of (keg.subKegiatan || [])) {
        for (const out of (sk.outputs || [])) {
          kP += parseFloat(out.pagu || 0)
          const lat = getLatest(out.monitoring)
          if (lat) { kTF += parseFloat(lat.target_fisik || 0); kRF += parseFloat(lat.realisasi_fisik || 0); kFC++; kTK += getKumulatifMonitoring(out.monitoring, 'target_keuangan', lat.bulan); kRK += getKumulatifMonitoring(out.monitoring, 'realisasi_keuangan', lat.bulan) }
        }
      }
      const kRKPct = kP > 0 ? Math.round((kRK / kP) * 10000) / 100 : 0
      const kTKPct = kP > 0 ? Math.round((kTK / kP) * 10000) / 100 : 0
      const kDevK = kTKPct - kRKPct
      const kFisikTarget = kFC > 0 ? Math.round((kTF / kFC) * 100) / 100 : 0
      const kFisikReal = kFC > 0 ? Math.round((kRF / kFC) * 100) / 100 : 0
      const kDevF = kFisikTarget > 0 ? Math.round((100 - (kFisikReal / kFisikTarget * 100)) * 100) / 100 : 0

      htmlContent += `
        <tr class="bg-keg">
          <td class="text-center">${progNo}.${kegNo}</td>
          <td>${keg.kode_kegiatan || ''}</td>
          <td>${keg.nama_kegiatan || ''}</td>
          <td class="text-right">${formatRp(kP)}</td>
          <td class="text-center">${formatNum(kFisikTarget)}</td>
          <td class="text-center">${formatNum(kFisikReal)}</td>
          <td class="text-center ${getDevColorFisik(kDevF)}">${formatNum(kDevF)}</td>
          <td class="text-right">${formatRp(kTK)}</td>
          <td class="text-center">${formatNum(kRKPct)}</td>
          <td class="text-right">${formatRp(kRK)}</td>
          <td class="text-center ${getDevColorKeuangan(kDevK)}">${formatNum(kDevK)}</td>
          <td></td><td></td><td></td>
        </tr>
      `

      let skNo = 0
      for (const sk of (keg.subKegiatan || [])) {
        skNo++
        let sP = 0, sTF = 0, sRF = 0, sFC = 0, sTK = 0, sRK = 0
        for (const out of (sk.outputs || [])) {
          sP += parseFloat(out.pagu || 0)
          const lat = getLatest(out.monitoring)
          if (lat) { sTF += parseFloat(lat.target_fisik || 0); sRF += parseFloat(lat.realisasi_fisik || 0); sFC++; sTK += getKumulatifMonitoring(out.monitoring, 'target_keuangan', lat.bulan); sRK += getKumulatifMonitoring(out.monitoring, 'realisasi_keuangan', lat.bulan) }
        }
        const sRKPct = sP > 0 ? Math.round((sRK / sP) * 10000) / 100 : 0
        const sTKPct = sP > 0 ? Math.round((sTK / sP) * 10000) / 100 : 0
        const sDevK = sTKPct - sRKPct
        const sFisikTarget = sFC > 0 ? Math.round((sTF / sFC) * 100) / 100 : 0
        const sFisikReal = sFC > 0 ? Math.round((sRF / sFC) * 100) / 100 : 0
        const sDevF = sFisikTarget > 0 ? Math.round((100 - (sFisikReal / sFisikTarget * 100)) * 100) / 100 : 0

        htmlContent += `
          <tr class="bg-sk">
            <td class="text-center">${progNo}.${kegNo}.${skNo}</td>
            <td>${sk.kode_sub_kegiatan || ''}</td>
            <td>${sk.nama_sub_kegiatan || ''}</td>
            <td class="text-right">${formatRp(sP)}</td>
            <td class="text-center">${formatNum(sFisikTarget)}</td>
            <td class="text-center">${formatNum(sFisikReal)}</td>
            <td class="text-center ${getDevColorFisik(sDevF)}">${formatNum(sDevF)}</td>
            <td class="text-right">${formatRp(sTK)}</td>
            <td class="text-center">${formatNum(sRKPct)}</td>
            <td class="text-right">${formatRp(sRK)}</td>
            <td class="text-center ${getDevColorKeuangan(sDevK)}">${formatNum(sDevK)}</td>
            <td></td><td></td><td></td>
          </tr>
        `

        const sortedOutputs = [...(sk.outputs || [])].sort((a, b) => String(a.kode || '').localeCompare(String(b.kode || '')))
        for (const out of sortedOutputs) {
          const lat = getLatest(out.monitoring)
          const tf = lat ? parseFloat(lat.target_fisik || 0) : 0
          const rf = lat ? parseFloat(lat.realisasi_fisik || 0) : 0
          const devF = tf > 0 ? Math.round((100 - (rf / tf * 100)) * 100) / 100 : 0
          const tk = lat ? getKumulatifMonitoring(out.monitoring, 'target_keuangan', lat.bulan) : 0
          const rk = lat ? getKumulatifMonitoring(out.monitoring, 'realisasi_keuangan', lat.bulan) : 0
          const oP = parseFloat(out.pagu || 0)
          const rkPct = oP > 0 ? Math.round((rk / oP) * 10000) / 100 : 0
          const tkPct = oP > 0 ? Math.round((tk / oP) * 10000) / 100 : 0
          const devK = tkPct - rkPct

          htmlContent += `
            <tr>
              <td></td>
              <td class="text-left font-mono">${out.kode ? out.kode : ''}</td>
              <td>Output: ${out.nama_output || ''}</td>
              <td class="text-right">${formatRp(oP)}</td>
              <td class="text-center">${formatNum(tf)}</td>
              <td class="text-center">${formatNum(rf)}</td>
              <td class="text-center ${getDevColorFisik(devF)}">${formatNum(devF)}</td>
              <td class="text-right">${formatRp(tk)}</td>
              <td class="text-center">${formatNum(rkPct)}</td>
              <td class="text-right">${formatRp(rk)}</td>
              <td class="text-center ${getDevColorKeuangan(devK)}">${formatNum(devK)}</td>
              <td>${lat?.progress || ''}</td>
              <td>${lat?.hambatan || ''}</td>
              <td>${lat?.pendorong || ''}</td>
            </tr>
          `

          const belanjas = [...(rekapBelanjaPerOutput.value[out.id] || [])].sort((a,b) => String(a.kode || '').localeCompare(String(b.kode || '')))
          for (const b of belanjas) {
            const bPagu = parseFloat(b.pagu || 0)
            const bMon = rekapMonitoringBelanjaMap.value[b.id]?.[lat?.periode_id]
            const bTk = getKumulatifBelanja(b.id, 'target_keuangan', lat?.bulan || 12)
            const bRk = getKumulatifBelanja(b.id, 'realisasi_keuangan', lat?.bulan || 12)
            const bRkPct = bPagu > 0 ? Math.round((bRk / bPagu) * 10000) / 100 : 0
            const bTkPct = bPagu > 0 ? Math.round((bTk / bPagu) * 10000) / 100 : 0
            const bDevK = bTkPct - bRkPct
            
            htmlContent += `
              <tr>
                <td></td>
                <td class="text-left font-mono">${b.kode ? b.kode : ''}</td>
                <td>&nbsp;&nbsp;&nbsp;- Belanja: ${b.nama_belanja}</td>
                <td class="text-right">${formatRp(bPagu)}</td>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-right">${formatRp(bTk)}</td>
                <td class="text-center">${formatNum(bRkPct)}</td>
                <td class="text-right">${formatRp(bRk)}</td>
                <td class="text-center ${getDevColorKeuangan(bDevK)}">${formatNum(bDevK)}</td>
                <td></td><td></td><td></td>
              </tr>
            `
          }
        }
      }
    }
  }

  htmlContent += `
        </tbody>
      </table>
      <script>
        window.onload = function() { window.print(); }
      <\/script>
    </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(htmlContent)
  printWindow.document.close()
}
</script>

