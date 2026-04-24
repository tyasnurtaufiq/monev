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
                <span class="eyebrow-dot"></span>
                Rekapitulasi
              </div>
              <h1 class="page-title">Rekap <span class="highlight">Per Program</span></h1>
              <p class="page-sub">Daftar rekapitulasi progress fisik dan keuangan per program</p>
            </div>
            <div class="topbar-right">
              <div class="tahun-dropdown" :class="{ 'tahun-dropdown--open': tahunDropdownOpen }" ref="tahunDropdownRef">
                <button class="tahun-trigger" @click="tahunDropdownOpen = !tahunDropdownOpen" type="button">
                  <span class="trigger-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span class="trigger-label">Tahun</span>
                  <span class="trigger-value">{{ monevStore.selectedTahun?.tahun || selectedTahunId || '—' }}</span>
                  <svg class="trigger-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <Transition name="dropdown">
                  <div v-if="tahunDropdownOpen" class="tahun-menu">
                    <div class="tahun-menu-inner">
                      <button
                        v-for="t in monevStore.tahunList" :key="t.id"
                        class="tahun-option"
                        :class="{ 'tahun-option--active': t.id === selectedTahunId }"
                        @click="selectTahun(t)" type="button"
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

          <!-- Rekap Cards -->
          <div v-if="monevStore.rekapByProgram.length > 0" class="prog-list">
            <div v-for="prog in monevStore.rekapByProgram" :key="prog.id" class="prog-block">

              <!-- Program Header -->
              <div class="prog-header">
                <div class="prog-header-left">
                  <span class="prog-kode">{{ prog.kode_program }}</span>
                  <h3 class="prog-nama">{{ prog.nama_program }}</h3>
                </div>
              </div>

              <!-- Kegiatan -->
              <div class="prog-body">
                <div v-for="keg in prog.kegiatan" :key="keg.id" class="keg-block">
                  <div class="keg-header">
                    <span class="keg-kode">{{ keg.kode_kegiatan }}</span>
                    <span class="keg-nama">{{ keg.nama_kegiatan }}</span>
                  </div>

                  <!-- Sub Kegiatan -->
                  <div class="sk-list">
                    <div v-for="sk in keg.subKegiatan" :key="sk.id" class="sk-block">
                      <p class="sk-label">
                        <span class="sk-kode">{{ sk.kode_sub_kegiatan }}</span>
                        {{ sk.nama_sub_kegiatan }}
                      </p>

                      <!-- Outputs -->
                      <div class="out-list">
                        <div v-for="out in sk.outputs" :key="out.id" class="out-card">
                          <div class="out-card-top">
                            <span class="out-name">Output: {{ out.kode ? out.kode + ' — ' + out.nama_output : out.nama_output }}</span>
                            <span class="out-pagu">Pagu: {{ formatCurrency(out.pagu) }}</span>
                          </div>

                          <!-- Belanja under output -->
                          <div v-if="rekapBelanjaPerOutput[out.id]?.length > 0" class="belanja-list">
                            <div v-for="b in rekapBelanjaPerOutput[out.id]" :key="b.id" class="belanja-row">
                              <span class="belanja-name">{{ b.kode ? b.kode + ' — ' + b.nama_belanja : b.nama_belanja }}</span>
                              <span class="belanja-pagu">{{ formatCurrency(b.pagu) }}</span>
                            </div>
                          </div>

                          <!-- Monitoring rows -->
                          <div v-if="out.monitoring.length > 0" class="mon-list">
                            <div v-for="mon in out.monitoring" :key="mon.id" class="mon-row">
                              <div class="mon-top">
                                <span class="mon-bulan">{{ monevStore.bulanNames[mon.bulan - 1]?.slice(0, 3) }}</span>
                                <div class="mon-stats">
                                  <span class="mon-stat mon-stat--fisik">Target Fisik: {{ mon.target_fisik }}%</span>
                                  <span class="mon-stat mon-stat--fisik">Realisasi: {{ mon.realisasi_fisik }}%</span>
                                  <span class="mon-stat mon-stat--dev">Dev: {{ formatDeviasiFisik(mon.target_fisik, mon.realisasi_fisik) }}</span>
                                  <span class="mon-stat mon-stat--keu">Target Keu: {{ formatCurrency(mon.target_keuangan) }}</span>
                                  <span class="mon-stat mon-stat--keu">Real Keu: {{ formatCurrency(mon.realisasi_keuangan) }}</span>
                                </div>
                              </div>

                              <!-- Belanja Keuangan Detail -->
                              <div v-if="rekapBelanjaPerOutput[out.id]?.length > 0" class="belanja-detail">
                                <div v-for="b in rekapBelanjaPerOutput[out.id]" :key="b.id" class="belanja-detail-row">
                                  <span class="bd-name">{{ b.kode ? b.kode + ' — ' + b.nama_belanja : b.nama_belanja }}:</span>
                                  <span class="bd-stat">Target: {{ formatCurrency(rekapMonitoringBelanjaMap[b.id]?.[mon.periode_id]?.target_keuangan || 0) }}</span>
                                  <span class="bd-stat">Real: {{ formatCurrency(rekapMonitoringBelanjaMap[b.id]?.[mon.periode_id]?.realisasi_keuangan || 0) }}</span>
                                  <span class="bd-stat bd-stat--dev">Dev: {{ formatDeviasiComputed(
                                    b.pagu > 0 ? ((rekapMonitoringBelanjaMap[b.id]?.[mon.periode_id]?.target_keuangan || 0) / b.pagu) * 100 : 0,
                                    (rekapMonitoringBelanjaMap[b.id]?.[mon.periode_id]?.target_keuangan || 0) > 0 ? ((rekapMonitoringBelanjaMap[b.id]?.[mon.periode_id]?.realisasi_keuangan || 0) / (rekapMonitoringBelanjaMap[b.id]?.[mon.periode_id]?.target_keuangan || 0)) * 100 : 0
                                  ) }}</span>
                                </div>
                              </div>

                              <!-- Keterangan -->
                              <div v-if="mon.progress || mon.hambatan || mon.pendorong" class="mon-notes">
                                <div v-if="mon.progress" class="mon-note">
                                  <span class="note-label note-label--progress">Tahapan:</span>
                                  <span class="note-text">{{ mon.progress }}</span>
                                </div>
                                <div v-if="mon.hambatan" class="mon-note">
                                  <span class="note-label note-label--hambatan">Penghambat:</span>
                                  <span class="note-text">{{ mon.hambatan }}</span>
                                </div>
                                <div v-if="mon.pendorong" class="mon-note">
                                  <span class="note-label note-label--pendorong">Pendukung:</span>
                                  <span class="note-text">{{ mon.pendorong }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p v-else class="no-mon">Belum ada data monitoring</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else class="view-card">
            <div class="empty-state">
              <div class="empty-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p class="empty-title">Belum ada data rekap</p>
              <p class="empty-sub">Data akan muncul setelah monitoring diinput</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useMonevStore } from '../stores/monev'
import { api } from '../api'

import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'

const monevStore = useMonevStore()
const sidebarOpen = ref(false)
const selectedTahunId = ref(monevStore.selectedTahunId)
const rekapBelanjaPerOutput = ref({})
const rekapMonitoringBelanjaMap = ref({})

// Tahun custom dropdown
const tahunDropdownOpen = ref(false)
const tahunDropdownRef = ref(null)

const selectTahun = async (t) => {
  selectedTahunId.value = t.id
  tahunDropdownOpen.value = false
  await monevStore.fetchTahun()
  await monevStore.loadAllForTahun(t.id)
  await loadRekapBelanja()
}

const onClickOutsideTahun = (e) => {
  if (tahunDropdownRef.value && !tahunDropdownRef.value.contains(e.target)) {
    tahunDropdownOpen.value = false
  }
}

const loadRekapBelanja = async () => {
  const programs = monevStore.rekapByProgram
  const belanjaMap = {}
  for (const prog of programs)
    for (const keg of (prog.kegiatan || []))
      for (const sk of (keg.subKegiatan || []))
        for (const out of (sk.outputs || []))
          try { belanjaMap[out.id] = await api.get(`/belanja?output_id=${out.id}`) }
          catch (e) { belanjaMap[out.id] = [] }
  rekapBelanjaPerOutput.value = belanjaMap

  try {
    const allMonBelanjaRaw = await api.get('/monitoring/belanja')
    const allMonBelanjaMap = {}
    for (const row of allMonBelanjaRaw) {
      if (!allMonBelanjaMap[row.belanja_id]) allMonBelanjaMap[row.belanja_id] = {}
      allMonBelanjaMap[row.belanja_id][row.periode_id] = row
    }
    rekapMonitoringBelanjaMap.value = allMonBelanjaMap
  } catch (e) { console.error('Gagal fetch rekap monitoring belanja', e) }
}

const onTahunChange = async () => {
  if (selectedTahunId.value) {
    await monevStore.fetchTahun()
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
  document.addEventListener('mousedown', onClickOutsideTahun)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutsideTahun)
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
  const t = parseFloat(targetPct) || 0, r = parseFloat(realisasiPct) || 0
  if (t === 0) return '0.00%'
  return (100 - ((r / t) * 100)).toFixed(2) + '%'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

* { box-sizing: border-box; }

.dashboard-root { display: flex; height: 100vh; background: #f0f6ff; font-family: 'DM Sans', sans-serif; }
.dashboard-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.dashboard-main { flex: 1; overflow-y: auto; padding: 24px 20px; }
@media (min-width: 1024px) { .dashboard-main { padding: 32px 36px; } }
.dashboard-inner { max-width: 1280px; margin: 0 auto; }

.topbar { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 28px; }
.page-eyebrow {
  display: flex; align-items: center; gap: 7px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.7rem; font-weight: 700; letter-spacing: .14em;
  text-transform: uppercase; color: #0ea5e9; margin-bottom: 6px;
}
.eyebrow-dot { width: 6px; height: 6px; background: #0ea5e9; border-radius: 50%; box-shadow: 0 0 0 3px rgba(14,165,233,.15); }
.page-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.65rem; font-weight: 800; color: #0f172a;
  line-height: 1.15; letter-spacing: -.025em; margin: 0 0 4px;
}
.highlight { background: linear-gradient(135deg, #0ea5e9, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.page-sub { font-size: 0.875rem; color: #475569; margin: 0; }

/* TAHUN CUSTOM DROPDOWN */
.tahun-dropdown { position: relative; user-select: none; }
.tahun-trigger {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 14px 9px 12px;
  background: #ffffff; border: 1.5px solid #dbeafe; border-radius: 12px;
  box-shadow: 0 1px 4px rgba(37,99,235,.07);
  cursor: pointer; white-space: nowrap;
  font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.tahun-trigger:hover { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(37,99,235,.08); background: #fafcff; }
.tahun-dropdown--open .tahun-trigger { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,.12); background: #f0f9ff; }
.trigger-icon { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #e0f2fe; border-radius: 7px; color: #0ea5e9; flex-shrink: 0; }
.trigger-icon svg { width: 13px; height: 13px; }
.trigger-label { font-size: 0.63rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #94a3b8; }
.trigger-value { font-size: 0.92rem; font-weight: 800; color: #0f172a; letter-spacing: -.02em; }
.trigger-chevron { width: 14px; height: 14px; color: #94a3b8; transition: transform .25s cubic-bezier(.34,1.56,.64,1); flex-shrink: 0; }
.tahun-dropdown--open .trigger-chevron { transform: rotate(180deg); color: #0ea5e9; }
.tahun-menu { position: absolute; top: calc(100% + 8px); right: 0; min-width: 150px; background: #ffffff; border: 1.5px solid #dbeafe; border-radius: 14px; box-shadow: 0 16px 40px rgba(15,23,42,.16), 0 2px 8px rgba(14,165,233,.08); z-index: 500; overflow: hidden; }
.tahun-menu-inner { padding: 6px; display: flex; flex-direction: column; gap: 2px; }
.tahun-option { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 14px; border-radius: 9px; border: none; background: transparent; cursor: pointer; width: 100%; text-align: left; font-family: 'Plus Jakarta Sans', sans-serif; transition: background .15s; }
.tahun-option:hover { background: #f0f9ff; }
.tahun-option--active { background: linear-gradient(135deg, #dbeafe, #f0f9ff); }
.tahun-option--active:hover { background: linear-gradient(135deg, #bae6fd, #dbeafe); }
.option-year { font-size: 0.92rem; font-weight: 700; color: #0f172a; }
.tahun-option--active .option-year { color: #0284c7; }
.option-check { width: 15px; height: 15px; color: #0284c7; flex-shrink: 0; }
.dropdown-enter-active { transition: opacity .18s ease, transform .22s cubic-bezier(.34,1.56,.64,1); }
.dropdown-leave-active { transition: opacity .15s ease, transform .15s ease; }
.dropdown-enter-from { opacity: 0; transform: translateY(-8px) scale(0.96); }
.dropdown-leave-to   { opacity: 0; transform: translateY(-4px) scale(0.97); }

/* PROG LIST */
.prog-list { display: flex; flex-direction: column; gap: 20px; }
.prog-block {
  background: #ffffff; border-radius: 18px;
  border: 1.5px solid #dbeafe;
  box-shadow: 0 1px 3px rgba(37,99,235,.04), 0 4px 16px rgba(37,99,235,.07);
  overflow: hidden;
  transition: box-shadow .2s;
}
.prog-block:hover {
  box-shadow: 0 4px 24px rgba(37,99,235,.1);
}

.prog-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 20px; background: linear-gradient(135deg, #0c2d6b 0%, #0a4a7a 100%); }
.prog-header-left { display: flex; align-items: center; gap: 10px; }
.prog-kode { font-size: 0.7rem; font-family: monospace; font-weight: 700; background: rgba(255,255,255,.15); color: rgba(255,255,255,.9); padding: 3px 9px; border-radius: 6px; }
.prog-nama { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.95rem; font-weight: 800; color: white; margin: 0; }

.prog-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 12px; background: #f8faff; }

.keg-block { border: 1px solid #dbeafe; border-radius: 12px; overflow: hidden; background: #ffffff; }
.keg-header { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #f0f9ff; border-bottom: 1px solid #e0f2fe; }
.keg-kode { font-size: 0.68rem; font-family: monospace; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 2px 7px; border-radius: 5px; flex-shrink: 0; }
.keg-nama { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.85rem; font-weight: 700; color: #0f172a; }

.sk-list { padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; background: #f0f6ff; }
.sk-block { background: #ffffff; border: 1px solid #dbeafe; border-radius: 10px; padding: 10px 12px; box-shadow: 0 1px 4px rgba(37,99,235,.05); }
.sk-label { font-size: 0.78rem; font-weight: 500; color: #475569; margin: 0 0 10px; display: flex; align-items: center; gap: 6px; }
.sk-kode { font-size: 0.63rem; font-family: monospace; font-weight: 700; color: #7c3aed; background: #ede9fe; padding: 2px 6px; border-radius: 4px; flex-shrink: 0; }

.out-list { display: flex; flex-direction: column; gap: 8px; }
.out-card { background: #ffffff; border: 1px solid #dbeafe; border-radius: 9px; padding: 10px 12px; box-shadow: 0 1px 3px rgba(37,99,235,.04); }
.out-card-top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 6px; margin-bottom: 8px; }
.out-name { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; font-weight: 700; color: #0f172a; }
.out-pagu { font-size: 0.72rem; color: #94a3b8; white-space: nowrap; }

.belanja-list { margin-bottom: 8px; display: flex; flex-direction: column; gap: 3px; }
.belanja-row { display: flex; justify-content: space-between; align-items: center; background: #fefce8; border: 1px solid #fef08a; border-radius: 5px; padding: 3px 8px; }
.belanja-name { font-size: 0.72rem; color: #475569; }
.belanja-pagu { font-size: 0.72rem; font-weight: 600; color: #0f172a; white-space: nowrap; }

.mon-list { display: flex; flex-direction: column; gap: 6px; }
.mon-row { background: #f8faff; border: 1px solid #dbeafe; border-radius: 8px; padding: 8px 10px; }
.mon-top { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 4px; }
.mon-bulan { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.72rem; font-weight: 700; color: #0f172a; background: #dbeafe; border-radius: 5px; padding: 2px 7px; }
.mon-stats { display: flex; flex-wrap: wrap; gap: 8px; }
.mon-stat { font-size: 0.7rem; font-weight: 500; }
.mon-stat--fisik { color: #059669; }
.mon-stat--dev   { color: #7c3aed; font-weight: 700; }
.mon-stat--keu   { color: #0284c7; }

.belanja-detail { border-left: 2px solid #bae6fd; padding-left: 10px; margin-top: 6px; display: flex; flex-direction: column; gap: 3px; }
.belanja-detail-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.bd-name { font-size: 0.68rem; color: #475569; }
.bd-stat { font-size: 0.68rem; color: #0284c7; }
.bd-stat--dev { color: #7c3aed; font-weight: 600; }

.mon-notes { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 6px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #dbeafe; }
.mon-note { display: flex; gap: 4px; font-size: 0.7rem; }
.note-label { font-weight: 700; flex-shrink: 0; }
.note-label--progress { color: #7c3aed; }
.note-label--hambatan { color: #dc2626; }
.note-label--pendorong { color: #059669; }
.note-text { color: #475569; }

.no-mon { font-size: 0.75rem; color: #94a3b8; font-style: italic; margin: 4px 0 0; }

/* VIEW CARD / EMPTY */
.view-card { background: #ffffff; border-radius: 18px; border: 1px solid #dbeafe; box-shadow: 0 1px 3px rgba(37,99,235,.04), 0 4px 16px rgba(37,99,235,.07); overflow: hidden; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px 24px; color: #94a3b8; }
.empty-icon { width: 52px; height: 52px; color: #bfdbfe; margin-bottom: 12px; }
.empty-icon svg { width: 52px; height: 52px; }
.empty-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: .95rem; font-weight: 700; color: #475569; margin: 0 0 4px; }
.empty-sub { font-size: .8rem; margin: 0; }
</style>
