<template>
  <div class="dashboard-root">
    <Sidebar v-model="sidebarOpen" />

    <div class="dashboard-body">
      <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="dashboard-main">
        <div class="dashboard-inner">

          <!-- ── TOP BAR ── -->
          <div class="topbar">
            <div class="topbar-left">
              <div class="page-eyebrow">
                <span class="eyebrow-dot"></span>
                Dashboard
              </div>
              <h1 class="page-title">
                Selamat datang, <span class="highlight">{{ authStore.user?.name || 'Admin' }}</span>
              </h1>
              <p class="page-sub">Monitoring &amp; Evaluasi Kegiatan DISHUB DIY</p>
            </div>

            <div class="topbar-right">
              <!-- Custom Tahun Dropdown -->
              <div class="tahun-dropdown" :class="{ 'tahun-dropdown--open': tahunDropdownOpen }" ref="tahunDropdownRef">
                <button class="tahun-trigger" @click="tahunDropdownOpen = !tahunDropdownOpen">
                  <span class="trigger-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span class="trigger-label">Tahun</span>
                  <span class="trigger-value">{{ monevStore.selectedTahun?.tahun || '—' }}</span>
                  <svg class="trigger-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <Transition name="dropdown">
                  <div v-if="tahunDropdownOpen" class="tahun-menu">
                    <div class="tahun-menu-inner">
                      <button
                        v-for="t in monevStore.tahunList"
                        :key="t.id"
                        class="tahun-option"
                        :class="{ 'tahun-option--active': t.id === selectedTahunId }"
                        @click="selectTahun(t)"
                      >
                        <span class="option-year">{{ t.tahun }}</span>
                        <svg v-if="t.id === selectedTahunId" class="option-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <!-- ── STAT CARDS ── -->
          <div class="stat-grid">

            <!-- Realisasi Fisik -->
            <div class="stat-card stat-card--green">
              <div class="stat-top">
                <div class="stat-icon-wrap stat-icon-wrap--green">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span class="stat-badge stat-badge--green">Fisik</span>
              </div>
              <div class="stat-value">{{ avgFisikTotal }}<span class="stat-unit">%</span></div>
              <p class="stat-label">Rata-rata Realisasi Fisik</p>
              <div class="stat-bar-wrap">
                <div class="stat-bar stat-bar--green" :style="{ width: Math.min(avgFisikTotal, 100) + '%' }"></div>
              </div>
            </div>

            <!-- Realisasi Keuangan -->
            <div class="stat-card stat-card--blue">
              <div class="stat-top">
                <div class="stat-icon-wrap stat-icon-wrap--blue">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span class="stat-badge stat-badge--blue">Keuangan</span>
              </div>
              <div class="stat-value stat-value--sm">{{ formatCurrency(totalRealisasiKeuangan) }}</div>
              <p class="stat-label">Realisasi Keuangan</p>
              <div class="stat-bar-wrap">
                <div class="stat-bar stat-bar--blue"
                  :style="{ width: monevStore.totalPagu ? Math.min((totalRealisasiKeuangan / monevStore.totalPagu) * 100, 100) + '%' : '0%' }">
                </div>
              </div>
            </div>

            <!-- Total Pagu -->
            <div class="stat-card stat-card--amber">
              <div class="stat-top">
                <div class="stat-icon-wrap stat-icon-wrap--amber">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="stat-badge stat-badge--amber">Anggaran</span>
              </div>
              <div class="stat-value stat-value--sm">{{ formatCurrency(monevStore.totalPagu) }}</div>
              <p class="stat-label">Total Pagu Anggaran</p>
              <div class="stat-bar-wrap">
                <div class="stat-bar stat-bar--amber" style="width: 100%"></div>
              </div>
            </div>

          </div>

          <!-- ── CHART SECTION ── -->
          <div class="chart-section">

            <!-- Main Bar Chart -->
            <div class="chart-card chart-card--main">
              <div class="chart-header">
                <div>
                  <h2 class="chart-title">Realisasi per Program</h2>
                  <p class="chart-sub">Perbandingan Fisik &amp; Keuangan seluruh program</p>
                </div>
                <div class="chart-legend">
                  <span class="legend-dot legend-dot--fisik"></span><span class="legend-label">Fisik</span>
                  <span class="legend-dot legend-dot--keu"></span><span class="legend-label">Keuangan</span>
                </div>
              </div>

              <!-- Loading -->
              <div v-if="monevStore.loading" class="empty-state">
                <div class="spinner"></div>
                <p>Memuat data...</p>
              </div>

              <!-- Empty -->
              <div v-else-if="progressData.length === 0" class="empty-state">
                <div class="empty-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p class="empty-title">Belum ada data monitoring</p>
                <p class="empty-sub">Input monitoring melalui halaman Laporan</p>
              </div>

              <!-- Chart -->
              <div v-else class="apex-wrap">
                <apexchart
                  type="bar"
                  :height="chartHeight"
                  :options="barChartOptions"
                  :series="barChartSeries"
                />
              </div>
            </div>

            <!-- Donut Summary -->
            <div class="chart-card chart-card--side" v-if="!monevStore.loading && progressData.length > 0">
              <div class="chart-header">
                <div>
                  <h2 class="chart-title">Ringkasan</h2>
                  <p class="chart-sub">Rata-rata keseluruhan program</p>
                </div>
              </div>
              <div class="donut-wrap">
                <div class="donut-item">
                  <apexchart
                    type="radialBar"
                    height="160"
                    :options="donutFisikOptions"
                    :series="[avgFisikTotal]"
                  />
                  <p class="donut-label">Realisasi Fisik</p>
                </div>
                <div class="donut-item">
                  <apexchart
                    type="radialBar"
                    height="160"
                    :options="donutKeuOptions"
                    :series="[avgKeuanganTotal]"
                  />
                  <p class="donut-label">Realisasi Keuangan</p>
                </div>
              </div>
              <!-- Status badge -->
              <div class="status-badge-wrap">
                <div class="status-badge" :class="getStatusClass(avgFisikTotal)">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ getStatusLabel(avgFisikTotal) }}
                </div>
              </div>
            </div>
          </div>

          <!-- ── PROGRAM SUMMARY CARDS ── -->
          <div class="section-header">
            <h2 class="section-title">Daftar Program</h2>
            <p class="section-sub">Klik "Lihat Detail" untuk melihat rincian kegiatan</p>
          </div>

          <div v-if="monevStore.loading" class="empty-state card-empty">
            <div class="spinner"></div>
            <p>Memuat data...</p>
          </div>

          <div v-else-if="progressData.length === 0" class="empty-state card-empty">
            <p class="empty-title">Belum ada data program</p>
          </div>

          <div v-else class="prog-cards">
            <div v-for="prog in progressData" :key="prog.id" class="prog-summary-card">
              <div class="prog-card-left">
                <div class="prog-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div class="prog-card-info">
                  <span class="prog-card-kode">{{ prog.kode_program }}</span>
                  <h3 class="prog-card-nama">{{ prog.nama_program }}</h3>
                  <div class="prog-card-meta">
                    <span>{{ prog.kegiatan?.length || 0 }} Kegiatan</span>
                  </div>
                </div>
              </div>

              <div class="prog-card-right">
                <div class="prog-mini-bars">
                  <div class="mini-bar-row">
                    <span class="mini-bar-label">Fisik</span>
                    <div class="mini-bar-track">
                      <div class="mini-bar-fill mini-bar-fill--fisik"
                        :style="{ width: Math.min(prog.avgFisik, 100) + '%' }">
                      </div>
                    </div>
                    <span class="mini-bar-val" :class="getPctColor(prog.avgFisik)">{{ prog.avgFisik }}%</span>
                  </div>
                  <div class="mini-bar-row">
                    <span class="mini-bar-label">Keuangan</span>
                    <div class="mini-bar-track">
                      <div class="mini-bar-fill mini-bar-fill--keu"
                        :style="{ width: Math.min(prog.pctKeuangan, 100) + '%' }">
                      </div>
                    </div>
                    <span class="mini-bar-val" :class="getPctColor(prog.pctKeuangan)">{{ prog.pctKeuangan }}%</span>
                  </div>
                </div>

                <button class="btn-detail" @click="openDetail(prog)">
                  Lihat Detail
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>

    <!-- ── DETAIL MODAL ── -->
    <Transition name="modal">
      <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetail">
        <div class="modal-panel">

          <!-- Modal Header -->
          <div class="modal-header">
            <div class="modal-header-left">
              <span class="modal-kode">{{ selectedProgram?.kode_program }}</span>
              <div>
                <h2 class="modal-title">{{ selectedProgram?.nama_program }}</h2>
                <p class="modal-sub">Detail Kegiatan &amp; Realisasi</p>
              </div>
            </div>
            <button class="modal-close" @click="closeDetail">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Summary Badges -->
          <div class="modal-summary">
            <div class="modal-badge modal-badge--fisik">
              <span class="modal-badge-label">Realisasi Fisik</span>
              <span class="modal-badge-val">{{ selectedProgram?.avgFisik }}%</span>
            </div>
            <div class="modal-badge modal-badge--keu">
              <span class="modal-badge-label">Realisasi Keuangan</span>
              <span class="modal-badge-val">{{ selectedProgram?.pctKeuangan }}%</span>
            </div>
            <div class="modal-badge modal-badge--pagu">
              <span class="modal-badge-label">Total Pagu</span>
              <span class="modal-badge-val">{{ formatCurrency(selectedProgram?.totalPagu) }}</span>
            </div>
          </div>

          <!-- Modal Body: Kegiatan List -->
          <div class="modal-body">
            <div v-if="!selectedProgram?.kegiatan?.length" class="empty-state">
              <p class="empty-title">Tidak ada kegiatan</p>
            </div>

            <div v-for="keg in selectedProgram?.kegiatan" :key="keg.id" class="modal-keg-block">

              <!-- Kegiatan Header -->
              <div class="modal-keg-header">
                <div class="modal-keg-left">
                  <span class="modal-keg-kode">{{ keg.kode_kegiatan }}</span>
                  <span class="modal-keg-nama">{{ keg.nama_kegiatan }}</span>
                </div>
                <div class="modal-keg-badges">
                  <span class="modal-keg-badge modal-keg-badge--f">F: {{ keg.avgFisik }}%</span>
                  <span class="modal-keg-badge modal-keg-badge--k">K: {{ keg.pctKeuangan }}%</span>
                </div>
              </div>

              <!-- Kegiatan Progress bars -->
              <div class="modal-keg-bars">
                <div class="modal-bar-row">
                  <span class="modal-bar-lbl">Fisik</span>
                  <div class="modal-bar-track">
                    <div class="modal-bar-fill modal-bar-fill--f" :class="barGradient(keg.avgFisik)"
                      :style="{ width: Math.min(keg.avgFisik, 100) + '%' }"></div>
                  </div>
                  <span class="modal-bar-pct">{{ keg.avgFisik }}%</span>
                </div>
                <div class="modal-bar-row">
                  <span class="modal-bar-lbl">Keuangan</span>
                  <div class="modal-bar-track">
                    <div class="modal-bar-fill" :class="barGradient(keg.pctKeuangan)"
                      :style="{ width: Math.min(keg.pctKeuangan, 100) + '%' }"></div>
                  </div>
                  <span class="modal-bar-pct">{{ keg.pctKeuangan }}%</span>
                </div>
              </div>

              <!-- Sub Kegiatan -->
              <div v-if="keg.subKegiatan?.length" class="modal-sk-list">
                <div v-for="sk in keg.subKegiatan" :key="sk.id" class="modal-sk-block">

                  <div class="modal-sk-header">
                    <span class="modal-sk-kode">{{ sk.kode_sub_kegiatan }}</span>
                    <span class="modal-sk-nama">{{ sk.nama_sub_kegiatan }}</span>
                    <div class="modal-sk-badges">
                      <span class="modal-keg-badge modal-keg-badge--f" style="font-size:0.63rem">F: {{ sk.avgFisik }}%</span>
                      <span class="modal-keg-badge modal-keg-badge--k" style="font-size:0.63rem">K: {{ sk.pctKeuangan }}%</span>
                    </div>
                  </div>

                  <!-- Outputs -->
                  <div v-if="sk.outputs?.length" class="modal-out-list">
                    <div v-for="out in sk.outputs" :key="out.id" class="modal-out-row">
                      <!-- Output header -->
                      <div class="modal-out-name-row">
                        <div class="modal-out-name-left">
                          <span class="modal-out-kode" v-if="out.kode">{{ out.kode }}</span>
                          <span class="modal-out-name">{{ out.nama_output }}</span>
                        </div>
                        <span class="modal-out-pagu">{{ formatCurrency(out.pagu) }}</span>
                      </div>
                      <!-- Progress bars output -->
                      <div class="modal-out-bars">
                        <div class="modal-out-bar-row">
                          <span class="modal-out-lbl">Fisik</span>
                          <div class="modal-out-track">
                            <div class="modal-out-fill" :class="barGradient(out.avgFisik)"
                              :style="{ width: Math.min(out.avgFisik, 100) + '%' }">
                            </div>
                            <span class="modal-out-text" :class="out.avgFisik > 45 ? 'out-text--light' : 'out-text--dark'">
                              {{ out.avgFisik }}%
                            </span>
                          </div>
                        </div>
                        <div class="modal-out-bar-row">
                          <span class="modal-out-lbl">Keu.</span>
                          <div class="modal-out-track">
                            <div class="modal-out-fill" :class="barGradient(out.pctKeuangan)"
                              :style="{ width: Math.min(out.pctKeuangan, 100) + '%' }">
                            </div>
                            <span class="modal-out-text" :class="out.pctKeuangan > 45 ? 'out-text--light' : 'out-text--dark'">
                              {{ formatCurrency(out.totalKeuangan) }} ({{ out.pctKeuangan }}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- ── Daftar Belanja ── -->
                      <div class="modal-blj-section">
                        <div class="modal-blj-title">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Komponen Belanja
                          <span class="modal-blj-count">{{ (belanjaMap[out.id] || []).length }}</span>
                        </div>

                        <!-- Loading belanja -->
                        <div v-if="detailLoading" class="modal-blj-loading">
                          <div class="spinner-sm"></div>
                          <span>Memuat belanja...</span>
                        </div>

                        <!-- Empty belanja -->
                        <div v-else-if="!belanjaMap[out.id] || belanjaMap[out.id].length === 0" class="modal-blj-empty">
                          Belum ada komponen belanja
                        </div>

                        <!-- Belanja table -->
                        <div v-else class="modal-blj-table">
                          <div class="modal-blj-thead">
                            <span class="blj-col-kode">Kode</span>
                            <span class="blj-col-nama">Nama Belanja</span>
                            <span class="blj-col-pagu">Pagu</span>
                            <span class="blj-col-pct">% Pagu</span>
                          </div>
                          <div v-for="blj in belanjaMap[out.id]" :key="blj.id" class="modal-blj-row">
                            <span class="blj-col-kode">
                              <span class="blj-kode-badge">{{ blj.kode || '-' }}</span>
                            </span>
                            <span class="blj-col-nama">{{ blj.nama_belanja }}</span>
                            <span class="blj-col-pagu">{{ formatCurrency(blj.pagu) }}</span>
                            <span class="blj-col-pct">
                              <span class="blj-pct-bar-wrap">
                                <span class="blj-pct-bar"
                                  :style="{ width: out.pagu > 0 ? Math.min((parseFloat(blj.pagu) / parseFloat(out.pagu)) * 100, 100) + '%' : '0%' }"
                                ></span>
                              </span>
                              <span class="blj-pct-val">{{ out.pagu > 0 ? Math.round((parseFloat(blj.pagu) / parseFloat(out.pagu)) * 1000) / 10 : 0 }}%</span>
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

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button class="btn-close-modal" @click="closeDetail">Tutup</button>
          </div>

        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { api } from '../api'
import { useAuthStore } from '../stores/auth'
import { useMonevStore } from '../stores/monev'
import VueApexCharts from 'vue3-apexcharts'

import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'

const apexchart = VueApexCharts

const authStore = useAuthStore()
const monevStore = useMonevStore()

const sidebarOpen = ref(false)
const selectedTahunId = ref(monevStore.selectedTahunId)

// Tahun custom dropdown
const tahunDropdownOpen = ref(false)
const tahunDropdownRef = ref(null)

const selectTahun = (t) => {
  selectedTahunId.value = t.id
  tahunDropdownOpen.value = false
  monevStore.loadAllForTahun(t.id)
}

const onClickOutside = (e) => {
  if (tahunDropdownRef.value && !tahunDropdownRef.value.contains(e.target)) {
    tahunDropdownOpen.value = false
  }
}

// Modal state
const showDetailModal = ref(false)
const selectedProgram = ref(null)
const detailLoading = ref(false)
const belanjaMap = ref({}) // { [output_id]: belanja[] }

// ── Helpers ──────────────────────────────────────────────
const formatCurrency = (value) => {
  if (!value) return 'Rp 0'
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(value)
}

const latestMonitoring = (monArr) => {
  if (!monArr || monArr.length === 0) return null
  return monArr.reduce((latest, m) => (!latest || m.bulan > latest.bulan) ? m : latest, null)
}

const latestFisikFromMonitoring = (monArr) => {
  const latest = latestMonitoring(monArr)
  return latest ? parseFloat(latest.realisasi_fisik || 0) : 0
}

const latestKeuanganFromMonitoring = (monArr) => {
  const latest = latestMonitoring(monArr)
  return latest ? parseFloat(latest.realisasi_keuangan || 0) : 0
}

const pctOf = (value, total) => {
  if (!total || total === 0) return 0
  return Math.round((value / total) * 10000) / 100
}

const barGradient = (pct) => {
  if (pct >= 80) return 'fill--green'
  if (pct >= 50) return 'fill--amber'
  if (pct > 0)  return 'fill--red'
  return 'fill--gray'
}

const getPctColor = (pct) => {
  if (pct >= 80) return 'pct--green'
  if (pct >= 50) return 'pct--amber'
  if (pct > 0)  return 'pct--red'
  return 'pct--gray'
}

const getStatusClass = (pct) => {
  if (pct >= 80) return 'status--green'
  if (pct >= 50) return 'status--amber'
  return 'status--red'
}

const getStatusLabel = (pct) => {
  if (pct >= 80) return 'Progres Baik'
  if (pct >= 50) return 'Progres Cukup'
  return 'Perlu Perhatian'
}

// ── Computed: Progress Data ───────────────────────────────
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
        const skFisik = outputs.length ? Math.round(outputs.reduce((s, o) => s + o.avgFisik, 0) / outputs.length * 100) / 100 : 0
        const skTotalKeu = outputs.reduce((s, o) => s + o.totalKeuangan, 0)
        const skTotalPagu = outputs.reduce((s, o) => s + parseFloat(o.pagu || 0), 0)
        const skPctKeu = pctOf(skTotalKeu, skTotalPagu)
        return { ...sk, outputs, avgFisik: skFisik, totalKeuangan: skTotalKeu, totalPagu: skTotalPagu, pctKeuangan: skPctKeu }
      })
      const kegFisik = subKegiatan.length ? Math.round(subKegiatan.reduce((s, sk) => s + sk.avgFisik, 0) / subKegiatan.length * 100) / 100 : 0
      const kegTotalKeu = subKegiatan.reduce((s, sk) => s + sk.totalKeuangan, 0)
      const kegTotalPagu = subKegiatan.reduce((s, sk) => s + sk.totalPagu, 0)
      const kegPctKeu = pctOf(kegTotalKeu, kegTotalPagu)
      return { ...keg, subKegiatan, avgFisik: kegFisik, totalKeuangan: kegTotalKeu, totalPagu: kegTotalPagu, pctKeuangan: kegPctKeu }
    })
    const progFisik = kegiatan.length ? Math.round(kegiatan.reduce((s, k) => s + k.avgFisik, 0) / kegiatan.length * 100) / 100 : 0
    const progTotalKeu = kegiatan.reduce((s, k) => s + k.totalKeuangan, 0)
    const progTotalPagu = kegiatan.reduce((s, k) => s + k.totalPagu, 0)
    const progPctKeu = pctOf(progTotalKeu, progTotalPagu)
    return { ...prog, kegiatan, avgFisik: progFisik, totalKeuangan: progTotalKeu, totalPagu: progTotalPagu, pctKeuangan: progPctKeu }
  })
})

const totalRealisasiKeuangan = computed(() =>
  progressData.value.reduce((sum, p) => sum + (p.totalKeuangan || 0), 0)
)

const avgFisikTotal = computed(() => {
  if (!progressData.value.length) return 0
  return Math.round(progressData.value.reduce((s, p) => s + p.avgFisik, 0) / progressData.value.length * 100) / 100
})

const avgKeuanganTotal = computed(() => {
  if (!progressData.value.length) return 0
  return Math.round(progressData.value.reduce((s, p) => s + p.pctKeuangan, 0) / progressData.value.length * 100) / 100
})

// ── ApexCharts: Horizontal Grouped Bar ──────────────────
const chartHeight = computed(() => {
  const min = 200
  const perRow = 52
  return Math.max(min, progressData.value.length * perRow + 80)
})

const barChartSeries = computed(() => [
  {
    name: 'Realisasi Fisik (%)',
    data: progressData.value.map(p => p.avgFisik)
  },
  {
    name: 'Realisasi Keuangan (%)',
    data: progressData.value.map(p => p.pctKeuangan)
  }
])

const barChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: "'DM Sans', 'Plus Jakarta Sans', sans-serif",
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 700,
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '60%',
      borderRadius: 6,
      dataLabels: { position: 'right' }
    }
  },
  dataLabels: {
    enabled: true,
    textAnchor: 'start',
    style: {
      fontSize: '11px',
      fontWeight: '700',
      colors: ['#1e40af', '#065f46']
    },
    formatter: (val) => `${val}%`,
    offsetX: 6,
    dropShadow: { enabled: false }
  },
  stroke: {
    show: false
  },
  xaxis: {
    categories: progressData.value.map(p => {
      const name = p.nama_program || ''
      return name.length > 32 ? name.slice(0, 32) + '…' : name
    }),
    max: 100,
    labels: {
      formatter: (val) => `${val}%`,
      style: { fontSize: '11px', colors: '#94a3b8' }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      style: { fontSize: '11.5px', fontWeight: '600', colors: '#475569' },
      maxWidth: 220,
      trim: false
    }
  },
  colors: ['#2563eb', '#10b981'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'horizontal',
      shadeIntensity: 0.15,
      gradientToColors: ['#0284c7', '#34d399'],
      stops: [0, 100]
    }
  },
  grid: {
    borderColor: '#e2e8f0',
    strokeDashArray: 4,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
    padding: { top: 0, right: 40, bottom: 0, left: 10 }
  },
  legend: { show: false },
  tooltip: {
    theme: 'light',
    y: { formatter: (val) => `${val}%` },
    style: { fontSize: '12px' }
  }
}))

// ── ApexCharts: Radial Bar (Donut) ──────────────────────
const baseRadialOptions = {
  chart: {
    type: 'radialBar',
    toolbar: { show: false },
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  plotOptions: {
    radialBar: {
      startAngle: -130,
      endAngle: 130,
      hollow: {
        margin: 0,
        size: '62%',
      },
      track: {
        background: '#f1f5f9',
        strokeWidth: '100%',
        margin: 0,
      },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: '20px',
          fontWeight: '800',
          color: '#0f172a',
          offsetY: 8,
          formatter: (val) => `${val}%`
        }
      }
    }
  },
  stroke: { lineCap: 'round' },
  labels: [''],
}

const donutFisikOptions = computed(() => ({
  ...baseRadialOptions,
  colors: ['#2563eb'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'diagonal1',
      gradientToColors: ['#0284c7'],
      stops: [0, 100]
    }
  }
}))

const donutKeuOptions = computed(() => ({
  ...baseRadialOptions,
  colors: ['#10b981'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'diagonal1',
      gradientToColors: ['#34d399'],
      stops: [0, 100]
    }
  }
}))

// ── Modal ────────────────────────────────────────────────
const openDetail = async (prog) => {
  selectedProgram.value = prog
  showDetailModal.value = true
  document.body.style.overflow = 'hidden'

  // Kumpulkan semua output_id unik dalam program ini
  const outputIds = []
  ;(prog.kegiatan || []).forEach(keg => {
    ;(keg.subKegiatan || []).forEach(sk => {
      ;(sk.outputs || []).forEach(out => {
        outputIds.push(out.id)
      })
    })
  })

  if (outputIds.length === 0) return

  detailLoading.value = true
  belanjaMap.value = {}
  try {
    // Fetch belanja untuk tiap output (paralel)
    const results = await Promise.all(
      outputIds.map(oid =>
        api.get(`/belanja?output_id=${oid}`)
          .then(rows => ({ oid, rows }))
          .catch(() => ({ oid, rows: [] }))
      )
    )
    const map = {}
    results.forEach(({ oid, rows }) => {
      map[oid] = rows
    })
    belanjaMap.value = map
  } finally {
    detailLoading.value = false
  }
}

const closeDetail = () => {
  showDetailModal.value = false
  selectedProgram.value = null
  belanjaMap.value = {}
  document.body.style.overflow = ''
}

// ── Lifecycle ────────────────────────────────────────────
const onTahunChange = () => {
  monevStore.loadAllForTahun(selectedTahunId.value)
}

onMounted(async () => {
  await monevStore.fetchTahun()
  if (monevStore.selectedTahunId) {
    selectedTahunId.value = monevStore.selectedTahunId
    await monevStore.loadAllForTahun(monevStore.selectedTahunId)
  }
  document.addEventListener('mousedown', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

/* ============================================================
   TOKENS
   ============================================================ */
:root {
  --c-bg:        #f0f6ff;
  --c-surface:   #ffffff;
  --c-border:    #dbeafe;
  --c-border-2:  #e2e8f0;
  --c-text-1:    #0f172a;
  --c-text-2:    #475569;
  --c-text-3:    #94a3b8;
  --c-accent:    #2563eb;
  --c-accent-2:  #0284c7;
  --c-blue-soft: #eff6ff;

  --radius-card: 16px;
  --radius-sm:   10px;
  --shadow-card: 0 1px 3px rgba(37,99,235,.04), 0 4px 16px rgba(37,99,235,.07);
  --shadow-hover: 0 8px 28px rgba(37,99,235,.13);
}

* { box-sizing: border-box; }

/* ============================================================
   LAYOUT
   ============================================================ */
.dashboard-root {
  display: flex;
  height: 100vh;
  background: var(--c-bg);
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
}

.dashboard-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-main {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
  background: var(--c-bg);
}

@media (min-width: 1024px) {
  .dashboard-main { padding: 32px 36px; }
}

.dashboard-inner {
  max-width: 1280px;
  margin: 0 auto;
}

/* ============================================================
   TOPBAR
   ============================================================ */
.topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.page-eyebrow {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--c-accent);
  margin-bottom: 6px;
}

.eyebrow-dot {
  width: 6px; height: 6px;
  background: var(--c-accent);
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(37,99,235,.15);
}

.page-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--c-text-1);
  line-height: 1.15;
  letter-spacing: -.025em;
  margin: 0 0 4px;
}

.highlight {
  background: linear-gradient(135deg, #1d4ed8, #0284c7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-sub {
  font-size: 0.875rem;
  color: var(--c-text-2);
  margin: 0;
}

/* ============================================================
   TAHUN CUSTOM DROPDOWN
   ============================================================ */
.tahun-dropdown {
  position: relative;
  user-select: none;
}

/* Trigger button */
.tahun-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px 9px 12px;
  background: #ffffff;
  border: 1.5px solid var(--c-border);
  border-radius: 12px;
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: border-color .2s, box-shadow .2s, background .2s;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--c-text-1);
  white-space: nowrap;
}

.tahun-trigger:hover {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(37,99,235,.08), var(--shadow-card);
  background: #fafcff;
}

.tahun-dropdown--open .tahun-trigger {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,.12), var(--shadow-card);
  background: #eff6ff;
}

.trigger-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--c-blue-soft);
  border-radius: 8px;
  color: var(--c-accent);
  flex-shrink: 0;
}
.trigger-icon svg { width: 14px; height: 14px; }

.trigger-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--c-text-3);
}

.trigger-value {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--c-text-1);
  letter-spacing: -.02em;
}

.trigger-chevron {
  width: 14px;
  height: 14px;
  color: var(--c-text-3);
  transition: transform .25s cubic-bezier(.34,1.56,.64,1);
  flex-shrink: 0;
}

.tahun-dropdown--open .trigger-chevron {
  transform: rotate(180deg);
  color: var(--c-accent);
}

/* Dropdown menu */
.tahun-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: #ffffff;
  border: 1.5px solid #dbeafe;
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(15,23,42,.16), 0 2px 8px rgba(37,99,235,.08);
  z-index: 500;
  overflow: hidden;
}

.tahun-menu-inner {
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Individual option */
.tahun-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 9px;
  border: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background .15s, color .15s;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.tahun-option:hover {
  background: #eff6ff;
}

.tahun-option--active {
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
}

.tahun-option--active:hover {
  background: linear-gradient(135deg, #bfdbfe, #dbeafe);
}

.option-year {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--c-text-1);
  letter-spacing: -.01em;
}

.tahun-option--active .option-year {
  color: #1d4ed8;
}

.option-check {
  width: 15px;
  height: 15px;
  color: #2563eb;
  flex-shrink: 0;
}

/* Dropdown animation */
.dropdown-enter-active {
  transition: opacity .18s ease, transform .22s cubic-bezier(.34,1.56,.64,1);
}
.dropdown-leave-active {
  transition: opacity .15s ease, transform .15s ease;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}

/* ============================================================
   STAT CARDS
   ============================================================ */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--c-surface);
  border-radius: var(--radius-card);
  padding: 22px 22px 18px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--c-border);
  position: relative;
  overflow: hidden;
  transition: transform .2s, box-shadow .2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.stat-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  border-radius: 4px 0 0 4px;
}

.stat-card--green::before { background: linear-gradient(180deg, #10b981, #34d399); }
.stat-card--blue::before  { background: linear-gradient(180deg, #2563eb, #0284c7); }
.stat-card--amber::before { background: linear-gradient(180deg, #f59e0b, #fbbf24); }

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.stat-icon-wrap {
  width: 40px; height: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-icon-wrap svg { width: 19px; height: 19px; }

.stat-icon-wrap--green { background: #d1fae5; color: #059669; }
.stat-icon-wrap--blue  { background: #dbeafe; color: #1d4ed8; }
.stat-icon-wrap--amber { background: #fef3c7; color: #d97706; }

.stat-badge {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 50px;
}

.stat-badge--green { background: #d1fae5; color: #059669; }
.stat-badge--blue  { background: #dbeafe; color: #1d4ed8; }
.stat-badge--amber { background: #fef3c7; color: #d97706; }

.stat-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2.1rem;
  font-weight: 900;
  color: var(--c-text-1);
  line-height: 1;
  margin-bottom: 4px;
  letter-spacing: -.03em;
}

.stat-value--sm { font-size: 1.3rem; }

.stat-unit {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-text-3);
  margin-left: 2px;
}

.stat-label {
  font-size: 0.78rem;
  color: var(--c-text-2);
  margin: 0 0 14px;
  font-weight: 500;
}

.stat-bar-wrap {
  height: 5px;
  background: var(--c-bg);
  border-radius: 99px;
  overflow: hidden;
}

.stat-bar {
  height: 100%;
  border-radius: 99px;
  transition: width .8s cubic-bezier(.22,1,.36,1);
}

.stat-bar--green { background: linear-gradient(90deg, #10b981, #34d399); }
.stat-bar--blue  { background: linear-gradient(90deg, #2563eb, #0284c7); }
.stat-bar--amber { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

/* ============================================================
   CHART SECTION
   ============================================================ */
.chart-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  margin-bottom: 28px;
}

@media (min-width: 900px) {
  .chart-section {
    grid-template-columns: 1fr 280px;
  }
}

.chart-card {
  background: var(--c-surface);
  border-radius: var(--radius-card);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.chart-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 22px 14px;
  border-bottom: 1px solid var(--c-border);
  background: linear-gradient(to bottom, #fafcff, #ffffff);
}

.chart-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: var(--c-text-1);
  margin: 0 0 3px;
  letter-spacing: -.02em;
}

.chart-sub {
  font-size: 0.75rem;
  color: var(--c-text-3);
  margin: 0;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.legend-dot {
  display: inline-block;
  width: 10px; height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}
.legend-dot--fisik { background: linear-gradient(135deg, #2563eb, #0284c7); }
.legend-dot--keu   { background: linear-gradient(135deg, #10b981, #34d399); }

.legend-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-text-2);
}

.apex-wrap {
  padding: 12px 8px;
}

/* Side card donut */
.chart-card--side {
  display: flex;
  flex-direction: column;
}

.donut-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  flex: 1;
}

.donut-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.donut-label {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--c-text-2);
  margin: -4px 0 8px;
  text-align: center;
}

.status-badge-wrap {
  padding: 0 16px 18px;
  display: flex;
  justify-content: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 50px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
}
.status-badge svg { width: 15px; height: 15px; }

.status--green { background: #d1fae5; color: #059669; }
.status--amber { background: #fef3c7; color: #d97706; }
.status--red   { background: #fee2e2; color: #dc2626; }

/* ============================================================
   LOADING / EMPTY
   ============================================================ */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  color: var(--c-text-3);
}

.card-empty {
  background: var(--c-surface);
  border-radius: var(--radius-card);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-card);
}

.spinner {
  width: 30px; height: 30px;
  border: 2.5px solid var(--c-border);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: spin .7s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-icon { width: 48px; height: 48px; color: #bfdbfe; margin-bottom: 10px; }
.empty-icon svg { width: 48px; height: 48px; }
.empty-title { font-size: .92rem; font-weight: 600; color: var(--c-text-2); margin: 0 0 4px; }
.empty-sub   { font-size: .78rem; margin: 0; }

/* ============================================================
   SECTION HEADER
   ============================================================ */
.section-header {
  margin-bottom: 14px;
}

.section-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--c-text-1);
  margin: 0 0 3px;
  letter-spacing: -.02em;
}

.section-sub {
  font-size: 0.77rem;
  color: var(--c-text-3);
  margin: 0;
}

/* ============================================================
   PROGRAM SUMMARY CARDS
   ============================================================ */
.prog-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.prog-summary-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 16px 20px;
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  transition: transform .18s, box-shadow .18s;
}

.prog-summary-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}

.prog-card-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.prog-icon {
  width: 42px; height: 42px;
  background: var(--c-blue-soft);
  border: 1.5px solid var(--c-border);
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--c-accent);
}
.prog-icon svg { width: 20px; height: 20px; }

.prog-card-info { min-width: 0; }

.prog-card-kode {
  display: inline-block;
  font-size: 0.65rem;
  font-family: 'Plus Jakarta Sans', monospace;
  font-weight: 700;
  color: var(--c-accent);
  background: var(--c-blue-soft);
  border: 1px solid var(--c-border);
  padding: 2px 8px;
  border-radius: 5px;
  margin-bottom: 4px;
  letter-spacing: .02em;
}

.prog-card-nama {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--c-text-1);
  margin: 0 0 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prog-card-meta {
  font-size: 0.72rem;
  color: var(--c-text-3);
  font-weight: 500;
}

.prog-card-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.prog-mini-bars {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 220px;
}

.mini-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mini-bar-label {
  font-size: 0.67rem;
  font-weight: 600;
  color: var(--c-text-3);
  width: 52px;
  flex-shrink: 0;
}

.mini-bar-track {
  flex: 1;
  height: 7px;
  background: var(--c-bg);
  border-radius: 99px;
  overflow: hidden;
}

.mini-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width .9s cubic-bezier(.22,1,.36,1);
}

.mini-bar-fill--fisik { background: linear-gradient(90deg, #2563eb, #0284c7); }
.mini-bar-fill--keu   { background: linear-gradient(90deg, #10b981, #34d399); }

.mini-bar-val {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  width: 36px;
  text-align: right;
  flex-shrink: 0;
}

.pct--green { color: #059669; }
.pct--amber { color: #d97706; }
.pct--red   { color: #dc2626; }
.pct--gray  { color: #94a3b8; }

/* Button Lihat Detail */
.btn-detail {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: white;
  border: none;
  border-radius: 10px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: transform .15s, box-shadow .15s, background .15s;
  box-shadow: 0 2px 8px rgba(37,99,235,.25);
}

.btn-detail:hover {
  background: linear-gradient(135deg, #1e40af, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(37,99,235,.35);
}

.btn-detail:active { transform: translateY(0); }
.btn-detail svg { width: 14px; height: 14px; }

/* ============================================================
   MODAL
   ============================================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  overflow: hidden;
}

.modal-panel {
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 820px;
  height: 92vh;
  max-height: 92vh;
  box-shadow: 0 24px 64px rgba(15,23,42,.30);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity .22s ease;
}
.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform .22s cubic-bezier(.34,1.56,.64,1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-panel {
  transform: translateY(24px) scale(0.97);
}
.modal-leave-to .modal-panel {
  transform: translateY(16px) scale(0.97);
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 55%, #0369a1 100%);
  flex-shrink: 0;
}

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.modal-kode {
  font-size: 0.7rem;
  font-family: 'Plus Jakarta Sans', monospace;
  font-weight: 700;
  background: rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.95);
  padding: 4px 10px;
  border-radius: 7px;
  flex-shrink: 0;
  letter-spacing: .03em;
}

.modal-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: white;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal-sub {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.65);
  margin: 0;
}

.modal-close {
  width: 34px; height: 34px;
  background: rgba(255,255,255,0.15);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background .15s;
  flex-shrink: 0;
}
.modal-close:hover { background: rgba(255,255,255,0.25); }
.modal-close svg { width: 17px; height: 17px; }

/* Modal Summary Badges */
.modal-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid #dbeafe;
  background: #eff6ff;
  flex-shrink: 0;
}

.modal-badge {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 16px;
  border-radius: 12px;
  min-width: 130px;
}

.modal-badge--fisik { background: #dbeafe; border: 1px solid #bfdbfe; }
.modal-badge--keu   { background: #d1fae5; border: 1px solid #a7f3d0; }
.modal-badge--pagu  { background: #fef3c7; border: 1px solid #fde68a; }

.modal-badge-label {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--c-text-3);
}

.modal-badge-val {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--c-text-1);
}

/* Modal Body */
.modal-body {
  padding: 20px 24px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8faff;
  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #bfdbfe #eff6ff;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #eff6ff;
  border-radius: 99px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #bfdbfe;
  border-radius: 99px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #93c5fd;
}

/* Kegiatan block in modal */
.modal-keg-block {
  border: 1.5px solid #dbeafe;
  border-radius: 12px;
  background: #ffffff;
}

.modal-keg-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 16px;
  background: linear-gradient(to right, #eff6ff, #f8faff);
  border-bottom: 1px solid var(--c-border);
}

.modal-keg-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.modal-keg-kode {
  font-size: 0.66rem;
  font-family: 'Plus Jakarta Sans', monospace;
  font-weight: 700;
  color: #1d4ed8;
  background: #dbeafe;
  padding: 2px 8px;
  border-radius: 5px;
  flex-shrink: 0;
}

.modal-keg-nama {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal-keg-badges {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.modal-keg-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 6px;
}

.modal-keg-badge--f { background: #dbeafe; color: #1d4ed8; }
.modal-keg-badge--k { background: #d1fae5; color: #059669; }

/* Kegiatan progress bars */
.modal-keg-bars {
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #ffffff;
  border-bottom: 1px solid #dbeafe;
}

.modal-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-bar-lbl {
  font-size: 0.67rem;
  font-weight: 600;
  color: var(--c-text-3);
  width: 56px;
  flex-shrink: 0;
}

.modal-bar-track {
  flex: 1;
  height: 7px;
  background: #dbeafe;
  border-radius: 99px;
  overflow: hidden;
}

.modal-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width .8s cubic-bezier(.22,1,.36,1);
}

.modal-bar-pct {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--c-text-1);
  width: 36px;
  text-align: right;
  flex-shrink: 0;
}

/* Sub Kegiatan in modal */
.modal-sk-list {
  padding: 10px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f0f6ff;
}

.modal-sk-block {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 10px 13px;
  box-shadow: 0 1px 4px rgba(37,99,235,.05);
}

.modal-sk-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  margin-bottom: 9px;
}

.modal-sk-kode {
  font-size: 0.63rem;
  font-family: 'Plus Jakarta Sans', monospace;
  font-weight: 700;
  color: #0284c7;
  background: #e0f2fe;
  padding: 2px 7px;
  border-radius: 4px;
  flex-shrink: 0;
}

.modal-sk-nama {
  font-size: 0.79rem;
  font-weight: 600;
  color: var(--c-text-1);
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal-sk-badges {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
}

/* Output rows in modal */
.modal-out-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.modal-out-row {
  padding-top: 8px;
  border-top: 1px dashed #e2e8f0;
}
.modal-out-row:first-child { padding-top: 0; border-top: none; }

.modal-out-name-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 5px;
}

.modal-out-name {
  font-size: 0.76rem;
  font-weight: 500;
  color: var(--c-text-2);
  flex: 1;
  line-height: 1.4;
}

.modal-out-pagu {
  font-size: 0.67rem;
  color: var(--c-text-3);
  white-space: nowrap;
  flex-shrink: 0;
}

.modal-out-bars { display: flex; flex-direction: column; gap: 3px; }

.modal-out-bar-row {
  display: flex;
  align-items: center;
  gap: 7px;
}

.modal-out-lbl {
  font-size: 0.61rem;
  color: var(--c-text-3);
  width: 28px;
  flex-shrink: 0;
  font-weight: 600;
}

.modal-out-track {
  flex: 1;
  height: 16px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.modal-out-fill {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  border-radius: 6px;
  transition: width .8s cubic-bezier(.22,1,.36,1);
}

.modal-out-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0 6px;
  white-space: nowrap;
  overflow: hidden;
}

.out-text--light { color: white; }
.out-text--dark  { color: #475569; }

/* Modal Footer */
.modal-footer {
  padding: 14px 24px;
  border-top: 1px solid #dbeafe;
  background: #eff6ff;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.btn-close-modal {
  padding: 9px 22px;
  background: #ffffff;
  border: 1.5px solid #dbeafe;
  border-radius: 10px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: border-color .15s, color .15s, background .15s;
}

.btn-close-modal:hover {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
}

/* ============================================================
   BAR FILL COLORS
   ============================================================ */
.fill--green { background: linear-gradient(90deg, #059669, #10b981); }
.fill--amber { background: linear-gradient(90deg, #d97706, #f59e0b); }
.fill--red   { background: linear-gradient(90deg, #dc2626, #ef4444); }
.fill--gray  { background: #cbd5e1; }

/* ============================================================
   OUTPUT: KODE TAG & NAME ROW
   ============================================================ */
.modal-out-name-left {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.modal-out-kode {
  font-size: 0.6rem;
  font-family: 'Plus Jakarta Sans', monospace;
  font-weight: 700;
  color: #0284c7;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  padding: 1px 6px;
  border-radius: 4px;
  flex-shrink: 0;
  white-space: nowrap;
}

/* ============================================================
   BELANJA SECTION
   ============================================================ */
.modal-blj-section {
  margin-top: 8px;
  border: 1px solid #e0f2fe;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f9ff;
}

.modal-blj-title {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 11px;
  font-size: 0.68rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  color: #0369a1;
  background: #e0f2fe;
  border-bottom: 1px solid #bae6fd;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.modal-blj-title svg {
  width: 13px;
  height: 13px;
  color: #0284c7;
  flex-shrink: 0;
}

.modal-blj-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #0284c7;
  color: white;
  border-radius: 50px;
  font-size: 0.6rem;
  font-weight: 800;
  margin-left: 2px;
}

.modal-blj-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  font-size: 0.72rem;
  color: #64748b;
}

.spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid #bae6fd;
  border-top-color: #0284c7;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  flex-shrink: 0;
}

.modal-blj-empty {
  padding: 10px 12px;
  font-size: 0.72rem;
  color: #94a3b8;
  font-style: italic;
}

/* Belanja table */
.modal-blj-table {
  display: flex;
  flex-direction: column;
}

.modal-blj-thead {
  display: grid;
  grid-template-columns: 80px 1fr 130px 110px;
  gap: 6px;
  padding: 6px 11px;
  background: #f0f9ff;
  border-bottom: 1px solid #e0f2fe;
}

.modal-blj-thead span {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: #64748b;
}

.modal-blj-row {
  display: grid;
  grid-template-columns: 80px 1fr 130px 110px;
  gap: 6px;
  padding: 7px 11px;
  align-items: center;
  border-bottom: 1px solid #e0f2fe;
  transition: background .12s;
}

.modal-blj-row:last-child {
  border-bottom: none;
}

.modal-blj-row:hover {
  background: #e0f2fe;
}

.blj-col-kode {
  display: flex;
  align-items: center;
}

.blj-kode-badge {
  font-size: 0.6rem;
  font-family: 'Plus Jakarta Sans', monospace;
  font-weight: 700;
  color: #0369a1;
  background: #bae6fd;
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
  max-width: 72px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.blj-col-nama {
  font-size: 0.72rem;
  font-weight: 500;
  color: #334155;
  line-height: 1.35;
}

.blj-col-pagu {
  font-size: 0.68rem;
  font-weight: 700;
  color: #0f172a;
  font-family: 'Plus Jakarta Sans', sans-serif;
  text-align: right;
}

.blj-col-pct {
  display: flex;
  align-items: center;
  gap: 5px;
}

.blj-pct-bar-wrap {
  flex: 1;
  height: 5px;
  background: #cbd5e1;
  border-radius: 99px;
  overflow: hidden;
}

.blj-pct-bar {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #0284c7, #38bdf8);
  border-radius: 99px;
  transition: width .7s cubic-bezier(.22,1,.36,1);
}

.blj-pct-val {
  font-size: 0.63rem;
  font-weight: 700;
  color: #0369a1;
  width: 28px;
  text-align: right;
  flex-shrink: 0;
}
</style>