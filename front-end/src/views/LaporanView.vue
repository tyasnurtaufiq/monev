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
                Monitoring
              </div>
              <h1 class="page-title">Laporan <span class="highlight">Monitoring</span></h1>
              <p class="page-sub">Rekapitulasi progress fisik dan keuangan</p>
            </div>
            
          </div>
<div class="topbar-right">
              <!-- Export Controls -->
              <div class="export-group">

                <!-- Program Filter -->
                <div class="flt-dd" :class="{'flt-dd--open': exportProgDD}" ref="exportProgRef">
                  <button class="flt-btn" type="button" @click="exportProgDD = !exportProgDD" style="width:500px">
                    <span class="flt-val" style="max-width:450px">{{ selectedProgramExportId === 'all' ? 'Semua Program' : (monevStore.rekapByProgram.find(p=>p.id===selectedProgramExportId)?.kode_program + ' — ' + monevStore.rekapByProgram.find(p=>p.id===selectedProgramExportId)?.nama_program) }}</span>
                    <svg class="flt-chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="exportProgDD" class="flt-menu flt-menu--wide">
                      <div class="flt-menu-inner">
                        <button class="flt-opt" :class="{'flt-opt--active': selectedProgramExportId==='all'}" type="button" @click="selectedProgramExportId='all'; exportProgDD=false"><span>Semua Program</span><svg v-if="selectedProgramExportId==='all'" class="flt-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></button>
                        <button v-for="p in monevStore.rekapByProgram" :key="p.id" class="flt-opt" :class="{'flt-opt--active': selectedProgramExportId===p.id}" type="button" @click="selectedProgramExportId=p.id; exportProgDD=false"><span>{{ p.kode_program }} — {{ p.nama_program }}</span><svg v-if="selectedProgramExportId===p.id" class="flt-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></button>
                      </div>
                    </div>
                  </Transition>
                </div>

                <!-- Bulan Export -->
                <div class="flt-dd" :class="{'flt-dd--open': exportBulanDD}" ref="exportBulanRef">
                  <button class="flt-btn" type="button" @click="exportBulanDD = !exportBulanDD">
                    <span class="trigger-icon" style="width:22px;height:22px;border-radius:6px;background:#dcfce7;color:#10b981;flex-shrink:0"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:12px;height:12px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></span>
                    <span style="font-size:.63rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8">Bulan</span>
                    <span style="font-size:.9rem;font-weight:800;color:#0f172a">{{ monevStore.bulanNames[selectedBulanExport - 1] }}</span>
                    <svg class="flt-chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="exportBulanDD" class="flt-menu">
                      <div class="flt-menu-inner">
                        <button v-for="(name, idx) in monevStore.bulanNames" :key="idx" class="flt-opt" :class="{'flt-opt--active': selectedBulanExport===idx+1}" type="button" @click="selectedBulanExport=idx+1; exportBulanDD=false"><span>{{ name }}</span><svg v-if="selectedBulanExport===idx+1" class="flt-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></button>
                      </div>
                    </div>
                  </Transition>
                </div>

                <!-- Export Bulan -->
                <div class="exp-action-dd" ref="exportBulanActionRef">
                  <button @click="exportBulanActionOpen = !exportBulanActionOpen" class="btn-export btn-export--teal" type="button">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Export Bulan
                    <svg class="flt-chev" style="margin-left:2px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="exportBulanActionOpen" class="exp-action-menu">
                      <button @click="exportToExcel(true); exportBulanActionOpen=false" class="exp-action-item exp-action-item--excel">📊 Format Excel</button>
                      <button @click="exportToHTML(true); exportBulanActionOpen=false" class="exp-action-item exp-action-item--html">🖨️ Format HTML/Cetak</button>
                    </div>
                  </Transition>
                </div>

                <!-- Export Laporan -->
                <div class="exp-action-dd" ref="exportLaporanRef">
                  <button @click="exportLaporanOpen = !exportLaporanOpen" class="btn-export btn-export--accent" type="button">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Export Laporan
                    <svg class="flt-chev" style="margin-left:2px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="exportLaporanOpen" class="exp-action-menu">
                      <button @click="exportToExcel(); exportLaporanOpen=false" class="exp-action-item exp-action-item--excel">📊 Export Excel</button>
                      <button @click="exportToHTML(); exportLaporanOpen=false" class="exp-action-item exp-action-item--html">🖨️ Export HTML/Cetak</button>
                    </div>
                  </Transition>
                </div>

                <!-- Tahun Selector -->
                <div class="tahun-dropdown" :class="{ 'tahun-dropdown--open': tahunDropdownOpen }" ref="tahunDropdownRef">
                  <button class="tahun-trigger" @click="tahunDropdownOpen = !tahunDropdownOpen" type="button">
                    <span class="trigger-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </span>
                    <span class="trigger-label">Tahun</span>
                    <span class="trigger-value">{{ monevStore.selectedTahun?.tahun || monevStore.tahunList.find(t=>t.id===selectedTahunId)?.tahun || '—' }}</span>
                    <svg class="trigger-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="tahunDropdownOpen" class="tahun-menu">
                      <div class="tahun-menu-inner">
                        <button v-for="t in monevStore.tahunList" :key="t.id" class="tahun-option" :class="{ 'tahun-option--active': t.id === selectedTahunId }" @click="selectTahun(t)" type="button">
                          <span class="option-year">{{ t.tahun }}</span>
                          <svg v-if="t.id === selectedTahunId" class="option-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                        </button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          <!-- Stats Cards -->
          <div class="stat-grid">
            <div class="stat-card stat-card--purple">
              <div class="stat-card-glow"></div>
              <div class="stat-top">
                <div class="stat-icon-wrap stat-icon-wrap--purple">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <span class="stat-badge stat-badge--purple">Program</span>
              </div>
              <div class="stat-value">{{ monevStore.totalProgram }}</div>
              <p class="stat-label">Total Program</p>
            </div>
            <div class="stat-card stat-card--amber">
              <div class="stat-card-glow"></div>
              <div class="stat-top">
                <div class="stat-icon-wrap stat-icon-wrap--amber">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span class="stat-badge stat-badge--amber">Anggaran</span>
              </div>
              <div class="stat-value stat-value--sm">{{ formatCurrency(monevStore.totalPagu) }}</div>
              <p class="stat-label">Total Pagu Anggaran</p>
            </div>
            <div class="stat-card stat-card--green">
              <div class="stat-card-glow"></div>
              <div class="stat-top">
                <div class="stat-icon-wrap stat-icon-wrap--green">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <span class="stat-badge stat-badge--green">Fisik</span>
              </div>
              <div class="stat-value">{{ monevStore.rekapStats.latestFisik }}<span class="stat-unit">%</span></div>
              <p class="stat-label">Realisasi Fisik</p>
            </div>
            <div class="stat-card stat-card--blue">
              <div class="stat-card-glow"></div>
              <div class="stat-top">
                <div class="stat-icon-wrap stat-icon-wrap--blue">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <span class="stat-badge stat-badge--blue">Keuangan</span>
              </div>
              <div class="stat-value stat-value--sm">{{ formatCurrency(monevStore.rekapStats.totalRealisasi) }}</div>
              <p class="stat-label">Total Realisasi Keuangan</p>
            </div>
          </div>

          <!-- Reporting Window Closed Warning -->
          <div v-if="!isAdmin && !windowOpen" class="alert-closed">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="alert-title">Periode pelaporan ditutup</p>
              <p class="alert-sub">Anda tidak dapat menginput laporan saat ini. Hubungi admin untuk membuka periode pelaporan.</p>
            </div>
          </div>

          <!-- Monitoring Input per Bulan -->
          <div class="view-card">
            <div class="view-card-header">
              <div>
                <h2 class="view-card-title">Input &amp; Monitoring Bulanan</h2>
                <p class="view-card-sub">Input realisasi fisik dan keuangan per output</p>
              </div>
            </div>
            <div class="view-card-body">

            <!-- Cascading Filters -->
            <div class="cascade-filters">
              <div class="filter-item">
                <label class="filter-label">Program</label>
                <div class="flt-dd" :class="{'flt-dd--open': cascDD.program}" ref="cascProgRef">
                  <button class="flt-btn flt-btn--full" type="button" @click="toggleCascDD('program')">
                    <span class="flt-val">{{ monevStore.programs.find(p=>p.id===selectedProgramId) ? monevStore.programs.find(p=>p.id===selectedProgramId).kode_program+' — '+monevStore.programs.find(p=>p.id===selectedProgramId).nama_program : 'Pilih Program' }}</span>
                    <svg class="flt-chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="cascDD.program" class="flt-menu flt-menu--wide">
                      <div class="flt-menu-inner">
                        <button class="flt-opt" :class="{'flt-opt--active': !selectedProgramId}" type="button" @click="selectCascProgram('')"><span>Pilih Program</span></button>
                        <button v-for="p in monevStore.programs" :key="p.id" class="flt-opt" :class="{'flt-opt--active': selectedProgramId===p.id}" type="button" @click="selectCascProgram(p.id)"><span>{{ p.kode_program }} — {{ p.nama_program }}</span></button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
              <div class="filter-item">
                <label class="filter-label">Kegiatan</label>
                <div class="flt-dd" :class="{'flt-dd--open': cascDD.kegiatan, 'flt-dd--disabled': !selectedProgramId}" ref="cascKegRef">
                  <button class="flt-btn flt-btn--full" type="button" @click="selectedProgramId && toggleCascDD('kegiatan')" :disabled="!selectedProgramId">
                    <span class="flt-val">{{ localKegiatanList.find(k=>k.id===selectedKegiatanId) ? localKegiatanList.find(k=>k.id===selectedKegiatanId).kode_kegiatan+' — '+localKegiatanList.find(k=>k.id===selectedKegiatanId).nama_kegiatan : 'Pilih Kegiatan' }}</span>
                    <svg class="flt-chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="cascDD.kegiatan" class="flt-menu flt-menu--wide">
                      <div class="flt-menu-inner">
                        <button class="flt-opt" :class="{'flt-opt--active': !selectedKegiatanId}" type="button" @click="selectCascKegiatan('')"><span>Pilih Kegiatan</span></button>
                        <button v-for="k in localKegiatanList" :key="k.id" class="flt-opt" :class="{'flt-opt--active': selectedKegiatanId===k.id}" type="button" @click="selectCascKegiatan(k.id)"><span>{{ k.kode_kegiatan }} — {{ k.nama_kegiatan }}</span></button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
              <div class="filter-item">
                <label class="filter-label">Sub Kegiatan</label>
                <div class="flt-dd" :class="{'flt-dd--open': cascDD.subkegiatan, 'flt-dd--disabled': !selectedKegiatanId}" ref="cascSkRef">
                  <button class="flt-btn flt-btn--full" type="button" @click="selectedKegiatanId && toggleCascDD('subkegiatan')" :disabled="!selectedKegiatanId">
                    <span class="flt-val">{{ localSubKegiatanList.find(s=>s.id===selectedSubKegiatanId) ? localSubKegiatanList.find(s=>s.id===selectedSubKegiatanId).kode_sub_kegiatan+' — '+localSubKegiatanList.find(s=>s.id===selectedSubKegiatanId).nama_sub_kegiatan : 'Pilih Sub Kegiatan' }}</span>
                    <svg class="flt-chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="cascDD.subkegiatan" class="flt-menu flt-menu--wide">
                      <div class="flt-menu-inner">
                        <button class="flt-opt" :class="{'flt-opt--active': !selectedSubKegiatanId}" type="button" @click="selectCascSk('')"><span>Pilih Sub Kegiatan</span></button>
                        <button v-for="sk in localSubKegiatanList" :key="sk.id" class="flt-opt" :class="{'flt-opt--active': selectedSubKegiatanId===sk.id}" type="button" @click="selectCascSk(sk.id)"><span>{{ sk.kode_sub_kegiatan }} — {{ sk.nama_sub_kegiatan }}</span></button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
              <div class="filter-item">
                <label class="filter-label">Output</label>
                <div class="flt-dd" :class="{'flt-dd--open': cascDD.output, 'flt-dd--disabled': !selectedSubKegiatanId || !outputsForMonitoring.length}" ref="cascOutRef">
                  <button class="flt-btn flt-btn--full" type="button" @click="(selectedSubKegiatanId && outputsForMonitoring.length) && toggleCascDD('output')" :disabled="!selectedSubKegiatanId || !outputsForMonitoring.length">
                    <span class="flt-val">{{ outputsForMonitoring.find(o=>o.id===selectedOutputId) ? (outputsForMonitoring.find(o=>o.id===selectedOutputId).kode||'')+(outputsForMonitoring.find(o=>o.id===selectedOutputId).kode?' — ':'')+outputsForMonitoring.find(o=>o.id===selectedOutputId).nama_output : 'Pilih Output' }}</span>
                    <svg class="flt-chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="cascDD.output" class="flt-menu flt-menu--wide">
                      <div class="flt-menu-inner">
                        <button class="flt-opt" :class="{'flt-opt--active': !selectedOutputId}" type="button" @click="selectCascOutput('')"><span>Pilih Output</span></button>
                        <button v-for="out in outputsForMonitoring" :key="out.id" class="flt-opt" :class="{'flt-opt--active': selectedOutputId===out.id}" type="button" @click="selectCascOutput(out.id)"><span>{{ out.kode ? out.kode+' — '+out.nama_output : out.nama_output }}</span></button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
              <div class="filter-item">
                <label class="filter-label">Bulan</label>
                <div class="flt-dd" :class="{'flt-dd--open': cascDD.bulan}" ref="cascBulanRef">
                  <button class="flt-btn flt-btn--full" type="button" @click="toggleCascDD('bulan')">
                    <span class="flt-val">{{ monevStore.bulanNames[selectedBulan - 1] || 'Pilih Bulan' }}</span>
                    <svg class="flt-chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="cascDD.bulan" class="flt-menu">
                      <div class="flt-menu-inner">
                        <button v-for="(name, idx) in monevStore.bulanNames" :key="idx" class="flt-opt" :class="{'flt-opt--active': selectedBulan===idx+1}" type="button" @click="selectCascBulan(idx+1)"><span>{{ name }}</span><svg v-if="selectedBulan===idx+1" class="flt-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>

            <div v-if="loadingOutputs" class="empty-state">
              <div class="spinner"></div>
              <p>Memuat data...</p>
            </div>
            <div v-else-if="selectedOutputId && selectedOutputObj" class="mon-output-card">
              <!-- Output Header -->
              <div class="mon-output-header">
                <h4 class="mon-output-name">{{ selectedOutputObj.kode ? selectedOutputObj.kode + ' — ' + selectedOutputObj.nama_output : selectedOutputObj.nama_output }}</h4>
                <span class="mon-output-pagu">Total Pagu: {{ formatCurrency(selectedOutputObj.pagu) }}</span>
              </div>

              <div class="mon-output-body">
                <!-- Keuangan: semua belanja ditampilkan sekaligus -->
                <div v-if="belanjaPerOutput[selectedOutputObj.id] && belanjaPerOutput[selectedOutputObj.id].length > 0" class="keu-section">
                   <div
                      v-for="b in belanjaPerOutput[selectedOutputObj.id]" :key="b.id"
                      class="keu-block"
                      :class="{ 'keu-block--selesai': isBelanjaSelesai(b) }"
                      style="margin-bottom:12px"
                    >
                    <!-- Belanja Header -->
                    <div class="keu-block-header">
                      <div class="keu-block-title-wrap" :class="{ 'keu-block-title-wrap--selesai': isBelanjaSelesai(b) }">
                        <label class="section-label section-label--blue">
                          <span class="section-dot section-dot--blue"></span>
                          Keuangan
                        </label>
                        <div class="belanja-single-name">
                          {{ b.kode ? b.kode + ' — ' + b.nama_belanja : b.nama_belanja }}
                          <span class="belanja-pagu-badge">Pagu: {{ formatCurrency(b.pagu) }}</span>
                        </div>
                      </div>
                      <!-- Badge Terpenuhi 100% -->
                      <div v-if="isBelanjaSelesai(b)" class="badge-selesai">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Terpenuhi 100%
                      </div>
                    </div>
                    <!-- Keuangan Input Fields -->
                    <div class="keu-grid">
                      <div class="col-input">
                        <label class="mini-label">Target Bulan ini (Rp)</label>
                        <input
                          v-if="monitoringBelanjaForm[b.id]"
                          :value="getBelanjaDisplay(b.id, 'target_keuangan')"
                          @input="e => onInputRibuan(e, b.id, 'target_keuangan')"
                          type="text" class="form-input form-input--center" :disabled="!isAdmin"
                        />
                        <p v-if="monitoringBelanjaForm[b.id] && !isAdmin" class="admin-only-hint">Hanya dapat diubah oleh Admin</p>
                      </div>
                      <div class="col-readonly">
                        <label class="mini-label">Target Hingga Bulan Ini</label>
                        <div v-if="monitoringBelanjaForm[b.id]" class="readonly-field readonly-field--indigo">
                          {{ formatCurrency(getPrevKumulatif(b.id, 'target_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].target_keuangan) || 0)) }}
                        </div>
                      </div>
                      <div class="col-readonly">
                        <label class="mini-label">Akumulasi S.d Bulan Lalu</label>
                        <div class="readonly-field readonly-field--amber">
                          {{ formatCurrency(getPrevKumulatif(b.id, 'realisasi_keuangan')) }}
                        </div>
                      </div>
                      <div class="col-input">
                        <label class="mini-label">Realisasi (Rp) Bulan Ini</label>
                        <input
                          v-if="monitoringBelanjaForm[b.id]"
                          :value="getBelanjaDisplay(b.id, 'realisasi_keuangan')"
                          @input="e => onInputRibuan(e, b.id, 'realisasi_keuangan')"
                          type="text" class="form-input form-input--center" :disabled="!isAdmin && !windowOpen"
                        />
                      </div>
                      <div class="col-readonly">
                        <label class="mini-label">Realisasi Hingga Bulan Ini</label>
                        <div v-if="monitoringBelanjaForm[b.id]" class="readonly-field">
                          {{ formatCurrency(getPrevKumulatif(b.id, 'realisasi_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].realisasi_keuangan) || 0)) }}
                        </div>
                      </div>
                    </div>
                    <!-- Keuangan % -->
                    <div class="keu-pct-grid">
                      <div class="col-readonly">
                        <label class="mini-label">Target (%)</label>
                        <div v-if="monitoringBelanjaForm[b.id]" class="readonly-field">
                          {{ b.pagu > 0 ? (((getPrevKumulatif(b.id, 'target_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].target_keuangan) || 0)) / b.pagu) * 100).toFixed(2) : 0 }}%
                        </div>
                      </div>
                      <div class="col-readonly">
                        <label class="mini-label">Realisasi (%) Hingga Bulan Ini</label>
                        <div v-if="monitoringBelanjaForm[b.id]" class="readonly-field">
                          {{ b.pagu > 0 ? (((getPrevKumulatif(b.id, 'realisasi_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].realisasi_keuangan) || 0)) / b.pagu) * 100).toFixed(2) : 0 }}%
                        </div>
                      </div>
                      <div class="col-readonly">
                        <label class="mini-label">Deviasi (%)</label>
                        <div v-if="monitoringBelanjaForm[b.id]"
                          class="readonly-field readonly-field--indigo"
                          :class="deviasiColorComputedK(
                            b.pagu > 0 ? (((getPrevKumulatif(b.id, 'target_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].target_keuangan) || 0)) / b.pagu) * 100) : 0,
                            b.pagu > 0 ? (((getPrevKumulatif(b.id, 'realisasi_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].realisasi_keuangan) || 0)) / b.pagu) * 100) : 0
                          )"
                        >
                          {{ formatDeviasiComputed(
                            b.pagu > 0 ? (((getPrevKumulatif(b.id, 'target_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].target_keuangan) || 0)) / b.pagu) * 100) : 0,
                            b.pagu > 0 ? (((getPrevKumulatif(b.id, 'realisasi_keuangan') + (parseFloat(monitoringBelanjaForm[b.id].realisasi_keuangan) || 0)) / b.pagu) * 100) : 0
                          ) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Fisik Section -->
                <div class="fisik-section">
                  <h5 class="section-label section-label--green">
                    <span class="section-dot section-dot--green"></span>
                    Fisik
                  </h5>
                  <div class="fisik-grid">
                    <div class="col-input">
                      <label class="mini-label">Target (%)</label>
                      <input v-model="monitoringForm[selectedOutputObj.id].target_fisik"
                        type="number" step="0.01" min="0" max="100"
                        class="form-input form-input--center" :disabled="!isAdmin" />
                      <p v-if="!isAdmin" class="admin-only-hint">Hanya dapat diubah oleh Admin</p>
                    </div>
                    <div class="col-readonly">
                      <label class="mini-label">Bln Lalu (%)</label>
                      <div class="readonly-field readonly-field--amber">{{ prevMonthData[selectedOutputObj.id]?.realisasi_fisik ?? '-' }}</div>
                    </div>
                    <div class="col-input">
                      <label class="mini-label">Realisasi (%)</label>
                      <input v-model="monitoringForm[selectedOutputObj.id].realisasi_fisik"
                        type="number" step="0.01" min="0" max="100"
                        class="form-input form-input--center" :disabled="!isAdmin && !windowOpen" />
                    </div>
                    <div class="col-readonly">
                      <label class="mini-label">Deviasi (%)</label>
                      <div class="readonly-field readonly-field--indigo"
                        :class="deviasiColorFisik(monitoringForm[selectedOutputObj.id].target_fisik, monitoringForm[selectedOutputObj.id].realisasi_fisik)">
                        {{ formatDeviasiFisik(monitoringForm[selectedOutputObj.id].target_fisik, monitoringForm[selectedOutputObj.id].realisasi_fisik) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Keterangan Section -->
                <div class="ket-section">
                  <h5 class="section-label section-label--gray">
                    <span class="section-dot section-dot--gray"></span>
                    Keterangan
                  </h5>
                  <div class="ket-grid">
                    <div>
                      <label class="mini-label">Tahapan Pekerjaan (Fisik)</label>
                      <textarea v-model="monitoringForm[selectedOutputObj.id].progress"
                        rows="3" placeholder="Tulis tahapan pekerjaan..."
                        class="form-input form-input--textarea" :disabled="!isAdmin && !windowOpen"></textarea>
                    </div>
                    <div>
                      <label class="mini-label">Faktor Penghambat</label>
                      <textarea v-model="monitoringForm[selectedOutputObj.id].hambatan"
                        rows="3" placeholder="Tulis faktor penghambat..."
                        class="form-input form-input--textarea" :disabled="!isAdmin && !windowOpen"></textarea>
                    </div>
                    <div>
                      <label class="mini-label">Faktor Pendukung</label>
                      <textarea v-model="monitoringForm[selectedOutputObj.id].pendorong"
                        rows="3" placeholder="Tulis faktor pendukung..."
                        class="form-input form-input--textarea" :disabled="!isAdmin && !windowOpen"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div><!-- end mon-output-card v-else-if -->

            <div v-else class="empty-state">
              <div class="empty-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <p class="empty-title">Pilih Output untuk input monitoring</p>
              <p class="empty-sub">Semua belanja pada output yang dipilih akan ditampilkan</p>
            </div>

            <!-- Action Bar — selalu tampil di bawah, lebar penuh -->
            <div v-if="selectedOutputId && selectedOutputObj" class="save-all-row">
              <div class="save-all-info">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Pastikan semua data sudah benar sebelum menyimpan</span>
              </div>
              <button @click="saveAllMonitoringRows" class="btn-save-all"
                :disabled="isSavingAll || (!isAdmin && !windowOpen)">
                <svg v-if="!isSavingAll" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                <svg v-if="isSavingAll" class="spin-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                {{ isSavingAll ? 'Menyimpan...' : 'Simpan Data' }}
              </button>
            </div>

            </div><!-- end view-card-body -->
          </div><!-- end view-card -->

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch, computed } from 'vue'

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

// Export section custom dropdowns
const exportProgDD = ref(false)
const exportBulanDD = ref(false)
const exportBulanActionOpen = ref(false)
const exportLaporanOpen = ref(false)
const exportProgRef = ref(null)
const exportBulanRef = ref(null)
const exportBulanActionRef = ref(null)
const exportLaporanRef = ref(null)

const selectedTahunId = ref(monevStore.selectedTahunId)

// Tahun custom dropdown
const tahunDropdownOpen = ref(false)
const tahunDropdownRef = ref(null)

// Cascade filter custom dropdowns
const cascDD = reactive({ program: false, kegiatan: false, subkegiatan: false, output: false, bulan: false })
const cascProgRef = ref(null)
const cascKegRef = ref(null)
const cascSkRef = ref(null)
const cascOutRef = ref(null)
const cascBulanRef = ref(null)

const toggleCascDD = (name) => {
  Object.keys(cascDD).forEach(k => { if (k !== name) cascDD[k] = false })
  cascDD[name] = !cascDD[name]
}

const selectTahun = async (t) => {
  selectedTahunId.value = t.id
  tahunDropdownOpen.value = false
  await onTahunChange()
}

const selectCascProgram = async (id) => {
  selectedProgramId.value = id; cascDD.program = false; await onProgramChange()
}
const selectCascKegiatan = async (id) => {
  selectedKegiatanId.value = id; cascDD.kegiatan = false; await onKegiatanChange()
}
const selectCascSk = async (id) => {
  selectedSubKegiatanId.value = id; cascDD.subkegiatan = false; await onSubKegiatanChange()
}
const selectCascOutput = async (id) => {
  selectedOutputId.value = id; cascDD.output = false; await onOutputChange()
}
const selectCascBulan = (idx) => {
  selectedBulan.value = idx; cascDD.bulan = false
}

const onClickOutside = (e) => {
  if (tahunDropdownRef.value && !tahunDropdownRef.value.contains(e.target)) tahunDropdownOpen.value = false
  if (cascProgRef.value && !cascProgRef.value.contains(e.target)) cascDD.program = false
  if (cascKegRef.value && !cascKegRef.value.contains(e.target)) cascDD.kegiatan = false
  if (cascSkRef.value && !cascSkRef.value.contains(e.target)) cascDD.subkegiatan = false
  if (cascOutRef.value && !cascOutRef.value.contains(e.target)) cascDD.output = false
  if (cascBulanRef.value && !cascBulanRef.value.contains(e.target)) cascDD.bulan = false
  if (exportProgRef.value && !exportProgRef.value.contains(e.target)) exportProgDD.value = false
  if (exportBulanRef.value && !exportBulanRef.value.contains(e.target)) exportBulanDD.value = false
  if (exportBulanActionRef.value && !exportBulanActionRef.value.contains(e.target)) exportBulanActionOpen.value = false
  if (exportLaporanRef.value && !exportLaporanRef.value.contains(e.target)) exportLaporanOpen.value = false
}
const selectedProgramId = ref('')
const selectedKegiatanId = ref('')
const selectedSubKegiatanId = ref('')
const selectedOutputId = ref('')
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

// Computed: output object yang sedang dipilih
const selectedOutputObj = computed(() => {
  if (!selectedOutputId.value) return null
  return outputsForMonitoring.value.find(o => o.id === selectedOutputId.value) || null
})

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

// Cek apakah belanja sudah terpenuhi 100%
// Kondisi: Target Hingga Bulan Ini >= Pagu DAN Realisasi Hingga Bulan Ini >= 100% dari Pagu
const isBelanjaSelesai = (b) => {
  if (!monitoringBelanjaForm.value[b.id] || !b.pagu || b.pagu <= 0) return false
  const targetHingga = getPrevKumulatif(b.id, 'target_keuangan') + (parseFloat(monitoringBelanjaForm.value[b.id].target_keuangan) || 0)
  const realisasiHingga = getPrevKumulatif(b.id, 'realisasi_keuangan') + (parseFloat(monitoringBelanjaForm.value[b.id].realisasi_keuangan) || 0)
  const realisasiPct = (realisasiHingga / b.pagu) * 100
  return targetHingga >= b.pagu && realisasiPct >= 100
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
  selectedOutputId.value = ''
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

const onOutputChange = () => {
  // Output dipilih dari dropdown — data sudah dimuat oleh loadOutputsForSubKegiatan
  // Tidak perlu fetch ulang, cukup switch selectedOutputId
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

    // Auto-select output pertama jika ada
    if (outputs.length > 0) {
      selectedOutputId.value = outputs[0].id
    } else {
      selectedOutputId.value = ''
    }
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
  document.addEventListener('mousedown', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

:root {
  --c-bg:      #f0f6ff;
  --c-surface: #ffffff;
  --c-border:  #dbeafe;
  --c-border-strong: #bfdbfe;
  --c-text-1:  #0f172a;
  --c-text-2:  #475569;
  --c-text-3:  #94a3b8;
  --c-accent:  #0ea5e9;
  --radius-card: 18px;
  --shadow-card: 0 1px 3px rgba(37,99,235,.04), 0 4px 16px rgba(37,99,235,.07);
}
* { box-sizing: border-box; }

/* ==============================
   LAYOUT
============================== */
.dashboard-root { display: flex; height: 100vh; background: #f0f6ff; font-family: 'DM Sans', sans-serif; }
.dashboard-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.dashboard-main { flex: 1; overflow-y: auto; padding: 24px 20px; }
@media (min-width: 1024px) { .dashboard-main { padding: 32px 36px; } }
.dashboard-inner { max-width: 1280px; margin: 0 auto; }

/* ==============================
   TOP BAR
============================== */
.topbar { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 28px; position: relative; z-index: 100; }
.page-eyebrow {
  display: flex; align-items: center; gap: 7px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.7rem; font-weight: 700; letter-spacing: .14em;
  text-transform: uppercase; color: #0ea5e9; margin-bottom: 6px;
}
.eyebrow-dot { width: 6px; height: 6px; background: #0ea5e9; border-radius: 50%; box-shadow: 0 0 0 3px rgba(14,165,233,.15); }
.page-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.6rem; font-weight: 800; color: var(--c-text-1);
  line-height: 1.15; letter-spacing: -.025em; margin: 0 0 4px;
}
.highlight {
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.page-sub { font-size: 0.85rem; color: var(--c-text-3); margin: 0; }

/* ==============================
   EXPORT CONTROLS
============================== */
.export-group { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }

/* Tahun Custom Dropdown */
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
.tahun-menu { position: absolute; top: calc(100% + 8px); right: 0; min-width: 150px; background: #ffffff; border: 1.5px solid #dbeafe; border-radius: 14px; box-shadow: 0 16px 40px rgba(15,23,42,.16), 0 2px 8px rgba(14,165,233,.08); z-index: 600; overflow: hidden; }
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

/* Filter / Cascade Dropdown */
.flt-dd { position: relative; user-select: none; }
.flt-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 7px 11px 7px 13px;
  background: #ffffff; border: 1.5px solid #dbeafe; border-radius: 10px;
  box-shadow: 0 1px 3px rgba(37,99,235,.05);
  cursor: pointer; white-space: nowrap;
  font-family: 'DM Sans', sans-serif; color: #0f172a; font-size: 0.82rem; font-weight: 500;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.flt-btn--full { width: 100%; justify-content: space-between; white-space: normal; }
.flt-btn:hover:not(:disabled) { border-color: #94a3b8; }
.flt-dd--open .flt-btn { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,.1); background: #f0f9ff; }
.flt-dd--disabled .flt-btn { background: #f8fafc; color: #94a3b8; border-color: #e2e8f0; cursor: not-allowed; }
.flt-val { overflow: hidden; text-overflow: ellipsis; flex: 1; text-align: left; white-space: nowrap; }
.flt-chev { width: 13px; height: 13px; color: #94a3b8; transition: transform .22s cubic-bezier(.34,1.56,.64,1); flex-shrink: 0; }
.flt-dd--open .flt-chev { transform: rotate(180deg); color: #0ea5e9; }
.flt-menu {
  position: absolute; top: calc(100% + 6px); left: 0; min-width: 100%; width: max-content; max-width: 260px;
  background: #ffffff; border: 1.5px solid #dbeafe; border-radius: 12px;
  box-shadow: 0 14px 36px rgba(15,23,42,.14), 0 2px 8px rgba(14,165,233,.08);
  z-index: 700; overflow-y: auto; max-height: 240px;
}
.flt-menu--wide { max-width: 380px; }
.flt-menu-inner { padding: 5px; display: flex; flex-direction: column; gap: 2px; }
.flt-opt {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 9px 12px; border-radius: 8px; border: none; background: transparent;
  cursor: pointer; width: 100%; text-align: left;
  font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: #0f172a;
  transition: background .13s; white-space: normal; line-height: 1.35;
}
.flt-opt:hover { background: #f0f9ff; }
.flt-opt--active { background: linear-gradient(135deg,#dbeafe,#f0f9ff); font-weight: 700; color: #0284c7; }
.flt-opt--active:hover { background: linear-gradient(135deg,#bae6fd,#dbeafe); }
.flt-check { width: 14px; height: 14px; color: #0284c7; flex-shrink: 0; }

.export-select {
  padding: 8px 32px 8px 12px;
  border: 1.5px solid var(--c-border-strong);
  border-radius: 10px;
  font-size: 0.8rem; font-weight: 500; color: var(--c-text-1);
  background: var(--c-surface) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center;
  appearance: none;
  outline: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: border-color .2s, box-shadow .2s;
}
.export-select:focus {
  border-color: var(--c-accent);
  box-shadow: 0 0 0 3px rgba(37,99,235,.1);
}
.export-select:hover { border-color: #94a3b8; }
.bulan-export-wrap {
  display: flex; align-items: center; gap: 4px;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 12px; padding: 5px;
}
.bulan-export-wrap .export-select {
  background-color: transparent;
  border: none;
  box-shadow: none;
  padding-right: 24px;
  font-size: 0.78rem;
}
.bulan-export-wrap .export-select:focus {
  box-shadow: none;
  border: none;
}
.btn-export {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 16px; border: none; border-radius: 10px;
  font-size: 0.82rem; font-weight: 700; cursor: pointer;
  transition: opacity .2s, transform .15s, box-shadow .2s;
  font-family: 'DM Sans', sans-serif; white-space: nowrap;
}
.btn-export:hover { opacity: .92; transform: translateY(-1px); }
.btn-export svg { width: 14px; height: 14px; flex-shrink: 0; }
.btn-export--teal {
  background: linear-gradient(135deg, #0d9488, #059669);
  color: white; box-shadow: 0 4px 12px rgba(13,148,136,.28);
}
.btn-export--teal:hover { box-shadow: 0 6px 18px rgba(13,148,136,.38); }
.btn-export--accent {
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: white; box-shadow: 0 4px 12px rgba(37,99,235,.28);
}
.btn-export--accent:hover { box-shadow: 0 6px 18px rgba(37,99,235,.38); }

/* Export action dropdown (Export Bulan / Export Laporan) */
.exp-action-dd { position: relative; }
.exp-action-menu {
  position: absolute; right: 0; top: calc(100% + 8px); min-width: 200px;
  background: #ffffff; border: 1.5px solid #dbeafe; border-radius: 14px;
  box-shadow: 0 16px 40px rgba(15,23,42,.16), 0 2px 8px rgba(14,165,233,.08);
  z-index: 700; overflow: hidden;
}
.exp-action-item {
  display: flex; align-items: center; gap: 9px;
  width: 100%; text-align: left; padding: 11px 15px;
  font-family: 'DM Sans', sans-serif; font-size: 0.83rem; font-weight: 500;
  border: none; background: transparent; cursor: pointer;
  transition: background .13s, color .13s;
}
.exp-action-item:hover { background: #f8fafc; }
.exp-action-item--excel { color: #059669; }
.exp-action-item--excel:hover { background: #f0fdf4; color: #047857; }
.exp-action-item--html  { color: #0284c7; }
.exp-action-item--html:hover  { background: #eff6ff; color: #1d4ed8; }

.dropdown-wrap { position: relative; }
.dropdown-overlay { position: fixed; inset: 0; z-index: 40; }
.dropdown-menu {
  position: absolute; right: 0; top: calc(100% + 8px); min-width: 210px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border-strong);
  border-radius: 14px;
  box-shadow: 0 10px 32px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06);
  z-index: 50; overflow: hidden;
  animation: dropFadeIn .15s ease;
}
@keyframes dropFadeIn {
  from { opacity: 0; transform: translateY(-6px) scale(.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.dropdown-menu-header {
  padding: 10px 14px 8px;
  border-bottom: 1px solid var(--c-border);
  font-family: 'Sora', sans-serif;
  font-size: 0.65rem; font-weight: 700; letter-spacing: .08em;
  text-transform: uppercase; color: var(--c-text-3);
}
.dropdown-item {
  display: flex; align-items: center; gap: 9px;
  width: 100%; text-align: left; padding: 10px 14px;
  font-size: 0.82rem; font-weight: 500; border: none; background: transparent;
  cursor: pointer; transition: background .15s, color .15s;
  font-family: 'DM Sans', sans-serif; color: var(--c-text-2);
}
.dropdown-item:last-child { border-top: 1px solid var(--c-border); }
.dropdown-item:hover { background: #f8fafc; color: var(--c-text-1); }
.dropdown-item--excel { color: #059669; }
.dropdown-item--excel:hover { background: #f0fdf4; color: #047857; }
.dropdown-item--html  { color: #0284c7; }
.dropdown-item--html:hover  { background: #eff6ff; color: #1d4ed8; }

/* TAHUN SELECTOR */
.tahun-selector {
  display: flex; align-items: center; gap: 8px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border-strong);
  border-radius: 12px; padding: 7px 12px; box-shadow: var(--shadow-card);
  transition: border-color .2s, box-shadow .2s;
}
.tahun-selector:focus-within {
  border-color: var(--c-accent);
  box-shadow: 0 0 0 3px rgba(37,99,235,.1);
}
.selector-icon { display: flex; color: var(--c-accent); }
.selector-icon svg { width: 15px; height: 15px; }
.tahun-select {
  appearance: none; border: none; outline: none; background: transparent;
  font-size: 0.875rem; font-weight: 600; color: var(--c-text-1); cursor: pointer;
  font-family: 'Sora', sans-serif;
  padding-right: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0 center;
}

/* ==============================
   STAT CARDS
============================== */
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
.stat-card {
  background: var(--c-surface); border-radius: var(--radius-card);
  padding: 20px; box-shadow: var(--shadow-card);
  border: 1px solid var(--c-border); position: relative; overflow: hidden;
  transition: transform .2s, box-shadow .2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.1); }
.stat-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-radius: 4px 0 0 4px; }
.stat-card--green::before  { background: linear-gradient(180deg, #10b981, #34d399); }
.stat-card--blue::before   { background: linear-gradient(180deg, #2563eb, #0ea5e9); }
.stat-card--amber::before  { background: linear-gradient(180deg, #f59e0b, #fbbf24); }
.stat-card--purple::before { background: linear-gradient(180deg, #8b5cf6, #a78bfa); }
.stat-card-glow { position: absolute; inset: 0; opacity: .04; border-radius: inherit; pointer-events: none; }
.stat-card--green  .stat-card-glow { background: radial-gradient(circle at 20% 20%, #10b981, transparent); }
.stat-card--blue   .stat-card-glow { background: radial-gradient(circle at 20% 20%, #2563eb, transparent); }
.stat-card--amber  .stat-card-glow { background: radial-gradient(circle at 20% 20%, #f59e0b, transparent); }
.stat-card--purple .stat-card-glow { background: radial-gradient(circle at 20% 20%, #8b5cf6, transparent); }
.stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.stat-icon-wrap { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.stat-icon-wrap svg { width: 18px; height: 18px; }
.stat-icon-wrap--green  { background: #d1fae5; color: #059669; }
.stat-icon-wrap--blue   { background: #eff6ff; color: #2563eb; }
.stat-icon-wrap--amber  { background: #fef3c7; color: #d97706; }
.stat-icon-wrap--purple { background: #ede9fe; color: #7c3aed; }
.stat-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 2px 8px; border-radius: 50px; }
.stat-badge--green  { background: #d1fae5; color: #059669; }
.stat-badge--blue   { background: #eff6ff; color: #2563eb; }
.stat-badge--amber  { background: #fef3c7; color: #d97706; }
.stat-badge--purple { background: #ede9fe; color: #7c3aed; }
.stat-value { font-family: 'Sora', sans-serif; font-size: 2rem; font-weight: 800; color: var(--c-text-1); line-height: 1; margin-bottom: 4px; letter-spacing: -.03em; }
.stat-value--sm { font-size: 1.2rem; }
.stat-unit { font-size: 1.1rem; font-weight: 700; color: var(--c-text-3); margin-left: 2px; }
.stat-label { font-size: 0.75rem; color: var(--c-text-2); margin: 0; font-weight: 500; }

/* ==============================
   ALERT CLOSED
============================== */
.alert-closed {
  display: flex; align-items: flex-start; gap: 12px;
  background: #fff1f2; border: 1px solid #fecdd3;
  border-radius: 12px; padding: 14px 18px; margin-bottom: 20px;
}
.alert-closed svg { width: 20px; height: 20px; color: #ef4444; flex-shrink: 0; margin-top: 2px; }
.alert-title { font-family: 'Sora', sans-serif; font-size: 0.875rem; font-weight: 600; color: #dc2626; margin: 0 0 2px; }
.alert-sub { font-size: 0.8rem; color: #991b1b; margin: 0; }

/* ==============================
   VIEW CARD
============================== */
.view-card {
  background: var(--c-surface); border-radius: var(--radius-card);
  border: 1px solid var(--c-border); box-shadow: var(--shadow-card);
  overflow: visible; margin-bottom: 24px;
}
.view-card-header {
  display: flex; flex-wrap: wrap; align-items: flex-start;
  justify-content: space-between; gap: 12px;
  padding: 20px 24px 18px; border-bottom: 2px solid var(--c-border);
}
.view-card-title {
  font-family: 'Sora', sans-serif;
  font-size: 1rem; font-weight: 700; color: var(--c-text-1);
  margin: 0 0 3px; letter-spacing: -.02em;
}
.view-card-sub { font-size: 0.78rem; color: var(--c-text-3); margin: 0; }
.view-card-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 20px; }

/* ==============================
   CASCADE FILTERS
============================== */
.cascade-filters {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;
  padding: 16px; background: #f8fafc;
  border: 1.5px solid var(--c-border); border-radius: 12px;
}
.filter-item { display: flex; flex-direction: column; gap: 5px; }
.filter-label {
  font-family: 'Sora', sans-serif;
  font-size: 0.68rem; font-weight: 700; color: var(--c-text-3);
  text-transform: uppercase; letter-spacing: .07em;
}

/* ==============================
   FORM INPUTS  — border selalu terlihat
============================== */
.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid var(--c-border-strong);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--c-text-1);
  background: transparent;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
  font-family: 'DM Sans', sans-serif;
}
/* select khusus: tambah chevron custom dan padding kanan */
select.form-input {
  appearance: none;
  padding-right: 32px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
}
select.form-input:disabled {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
}
.form-input:focus {
  border-color: var(--c-accent);
  box-shadow: 0 0 0 3px rgba(37,99,235,.1);
}
.form-input:hover:not(:disabled):not(:focus) {
  border-color: #94a3b8;
}
.form-input:disabled {
  background-color: #f1f5f9;
  color: var(--c-text-3);
  border-color: var(--c-border);
  cursor: not-allowed;
}
.form-input::placeholder { color: #b0bec5; }
.form-input--center { text-align: center; }
.form-input--textarea { resize: none; font-size: 0.82rem; line-height: 1.5; }

/* ==============================
   MONITORING OUTPUT CARD
============================== */
.mon-cards { display: flex; flex-direction: column; gap: 16px; }
.mon-output-card {
  border: 2px solid #bfdbfe;
  border-radius: 16px; overflow: hidden;
}
.mon-output-header {
  display: flex; flex-wrap: wrap; justify-content: space-between;
  align-items: center; gap: 8px; padding: 14px 20px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-bottom: 1.5px solid #bfdbfe;
}
.mon-output-name {
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem; font-weight: 700; color: #1e40af; margin: 0;
}
.mon-output-pagu {
  font-size: 0.72rem; font-weight: 600; color: #2563eb;
  background: #dbeafe; padding: 2px 10px; border-radius: 50px; white-space: nowrap;
  border: 1px solid #bfdbfe;
}
.mon-output-body { padding: 20px; display: flex; flex-direction: column; gap: 18px; }

/* ==============================
   SECTION LABELS
============================== */
.section-label {
  display: flex; align-items: center; gap: 6px;
  font-family: 'Sora', sans-serif;
  font-size: 0.68rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .07em; margin-bottom: 10px;
}
.section-label--blue  { color: #2563eb; }
.section-label--green { color: #059669; }
.section-label--gray  { color: var(--c-text-2); }
.section-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.section-dot--blue  { background: #2563eb; }
.section-dot--green { background: #22c55e; }
.section-dot--gray  { background: #94a3b8; }

/* ==============================
   FIELDSET-STYLE GROUPS
   (label memotong border seperti gambar referensi)
============================== */
.keu-section { display: flex; flex-direction: column; gap: 14px; }

/* KEU BLOCK — fieldset legend style */
.keu-block {
  position: relative;
  background: transparent;
  --bg-color: #ffffff;
  border: 2px solid #bfdbfe;
  border-radius: 14px;
  padding: 22px 18px 16px;
  margin-top: 8px;
  transition: border-color .25s, box-shadow .25s;
}

/* State: Belanja Terpenuhi 100% */
.keu-block--selesai {
  border-color: #22c55e !important;
  box-shadow: 0 0 0 3px rgba(34,197,94,.12), 0 4px 16px rgba(34,197,94,.1);
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%);
}

/* Legend / judul belanja yang memotong border atas */
.keu-block-header {
  position: absolute;
  top: -13px;
  left: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
}
.keu-block-title-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  padding: 2px 10px 2px 6px;
  border-radius: 6px;
  border: 1.5px solid #bfdbfe;
  max-width: 100%;
  flex-shrink: 1;
  transition: border-color .25s;
}
/* Title chip ikut hijau saat selesai */
.keu-block-title-wrap--selesai {
  border-color: #22c55e;
  background: #f0fdf4;
}
.keu-block-title-wrap--selesai .section-label--blue {
  color: #16a34a;
}
.keu-block-title-wrap--selesai .section-dot--blue {
  background: #22c55e;
}

/* Badge Terpenuhi 100% */
.badge-selesai {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #dcfce7;
  color: #15803d;
  border: 1.5px solid #86efac;
  border-radius: 50px;
  padding: 2px 12px 2px 6px;
  font-family: 'Sora', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: .02em;
  white-space: nowrap;
  flex-shrink: 0;
  animation: fadeInScale .3s cubic-bezier(.34,1.56,.64,1);
}
.badge-selesai svg {
  width: 14px; height: 14px;
  color: #16a34a;
  flex-shrink: 0;
}
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(.8); }
  to   { opacity: 1; transform: scale(1); }
}

/* Dua baris grid keuangan — tampilan kolom dengan divider */
.keu-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 0;
  margin-bottom: 0;
  border: 1.5px solid #bfdbfe;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
}
.keu-grid > div {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  margin-top: 0;
  padding: 10px 12px 12px;
  border-right: 1.5px solid #bfdbfe;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.keu-grid > div:last-child {
  border-right: none;
}

/* Baris % keuangan — tampilan kolom dengan divider */
.keu-pct-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 0;
  padding-top: 0;
  border-top: none;
  margin-top: 10px;
  border: 1.5px solid #bfdbfe;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
}
.keu-pct-grid > div {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  margin-top: 0;
  padding: 10px 12px 12px;
  border-right: 1.5px solid #bfdbfe;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.keu-pct-grid > div:last-child {
  border-right: none;
}

/* FISIK — fieldset legend style */
.fisik-section {
  position: relative;
  background: transparent;
  --bg-color: #ffffff;
  border: 2px solid #86efac;
  border-radius: 14px;
  padding: 22px 18px 16px;
  margin-top: 8px;
}
.fisik-section > .section-label {
  position: absolute;
  top: -11px;
  left: 16px;
  background: #ffffff;
  padding: 1px 10px 1px 6px;
  border: 1.5px solid #86efac;
  border-radius: 6px;
  margin-bottom: 0;
}
.fisik-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 0;
  border: 1.5px solid #86efac;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
}
.fisik-grid > div {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  margin-top: 0;
  padding: 10px 12px 12px;
  border-right: 1.5px solid #86efac;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.fisik-grid > div:last-child {
  border-right: none;
}

/* KETERANGAN — fieldset legend style */
.ket-section {
  position: relative;
  background: transparent;
  --bg-color: #ffffff;
  border: 2px solid var(--c-border-strong);
  border-radius: 14px;
  padding: 22px 18px 16px;
  margin-top: 8px;
}
.ket-section > .section-label {
  position: absolute;
  top: -11px;
  left: 16px;
  background: #ffffff;
  padding: 1px 10px 1px 6px;
  border: 1.5px solid var(--c-border-strong);
  border-radius: 6px;
  margin-bottom: 0;
}
.ket-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.ket-grid > div {
  position: relative;
  flex: 1 1 180px;
  min-width: 160px;
  margin-top: 0;
}

/* ==============================
   COL-INPUT vs COL-READONLY
============================== */
/* Kolom yang menerima input aktif — latar putih, border kiri aksen */
.keu-grid > .col-input,
.keu-pct-grid > .col-input,
.fisik-grid > .col-input {
  background: #ffffff;
}
.keu-grid > .col-input > .mini-label,
.keu-pct-grid > .col-input > .mini-label,
.fisik-grid > .col-input > .mini-label {
  color: #2563eb;
  border-bottom-color: #93c5fd;
}

/* Kolom readonly/rumus — background abu-abu disable */
.keu-grid > .col-readonly,
.keu-pct-grid > .col-readonly,
.fisik-grid > .col-readonly {
  background: #f1f5f9;
  border-right-color: #cbd5e1 !important;
}
.keu-grid > .col-readonly > .mini-label,
.keu-pct-grid > .col-readonly > .mini-label,
.fisik-grid > .col-readonly > .mini-label {
  color: #94a3b8;
  border-bottom-color: #cbd5e1;
}
/* Border kiri sisi input setelah readonly juga perlu disesuaikan */
.keu-grid > .col-readonly + .col-input,
.fisik-grid > .col-readonly + .col-input {
  border-left: 1.5px solid #bfdbfe;
}
/* readonly-field di dalam col-readonly ikut abu-abu */
.col-readonly .readonly-field {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: var(--c-text-2);
}
.col-readonly .readonly-field--indigo {
  background: #f1f5f9;
  border-color: #c7d2fe;
}
.col-readonly .readonly-field--amber {
  background: #fefce8;
  border-color: #fde68a;
}

/* ==============================
   MINI LABEL  (header kolom)
============================== */
.mini-label {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0;
  padding-bottom: 6px;
  border-bottom: 1px solid #e2e8f0;
  transition: color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.keu-grid > div:focus-within .mini-label,
.keu-pct-grid > div:focus-within .mini-label,
.fisik-grid > div:focus-within .mini-label {
  color: #2563eb;
  border-bottom-color: #bfdbfe;
}
.ket-grid > div .mini-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: none;
  margin-bottom: 4px;
  padding-bottom: 0;
}

.admin-only-hint { font-size: 0.65rem; color: var(--c-text-3); text-align: left; margin: 4px 0 0; }

/* Form input & readonly dalam kolom grid */
.keu-grid .form-input,
.keu-pct-grid .form-input,
.fisik-grid .form-input {
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 0.875rem;
  text-align: center;
  font-weight: 600;
}
.keu-grid .readonly-field,
.keu-pct-grid .readonly-field,
.fisik-grid .readonly-field {
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 0.875rem;
  min-height: 38px;
}
/* Hilangkan border dashed pada readonly di dalam kolom grid */
.keu-grid .readonly-field,
.keu-pct-grid .readonly-field,
.fisik-grid .readonly-field {
  border: 1.5px solid #e2e8f0;
}

/* ==============================
   READONLY FIELD — border visible
============================== */
.readonly-field {
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  text-align: center;
  font-weight: 600;
  color: var(--c-text-2);
  background: transparent;
  border: 1.5px dashed var(--c-border-strong);
  font-family: 'DM Sans', sans-serif;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.readonly-field--indigo { border-color: #93c5fd; color: #1d4ed8; }
.readonly-field--amber  { border-color: #fcd34d; color: #b45309; }

/* ==============================
   BELANJA
============================== */
.belanja-single-name { font-size: 0.82rem; font-weight: 500; color: var(--c-text-1); }
.belanja-pagu-badge {
  font-size: 0.72rem; font-weight: 600; color: #2563eb;
  background: #eff6ff; padding: 2px 8px; border-radius: 50px;
  margin-left: 6px; border: 1px solid #bfdbfe;
}

/* ==============================
   SAVE ALL
============================== */
.save-all-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  margin-top: 8px;
  background: linear-gradient(135deg, #f8faff, #eff6ff);
  border: 1.5px solid #bfdbfe;
  border-radius: 14px;
}
.save-all-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  color: #64748b;
  font-style: italic;
}
.save-all-info svg {
  width: 16px; height: 16px;
  color: #94a3b8;
  flex-shrink: 0;
}
.btn-save-all {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 36px;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: white; border: none; border-radius: 50px;
  font-family: 'Sora', sans-serif;
  font-size: 0.875rem; font-weight: 700; cursor: pointer;
  transition: opacity .2s, transform .2s, box-shadow .2s;
  box-shadow: 0 4px 14px rgba(37,99,235,.35);
  white-space: nowrap;
  flex-shrink: 0;
}
.btn-save-all svg { width: 16px; height: 16px; flex-shrink: 0; }
.spin-icon { animation: spin .7s linear infinite; }
.btn-save-all:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,.45); }
.btn-save-all:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }

/* ==============================
   SPINNER / EMPTY
============================== */
.spinner {
  width: 32px; height: 32px;
  border: 3px solid var(--c-border);
  border-top-color: var(--c-accent);
  border-radius: 50%; animation: spin .7s linear infinite; margin-bottom: 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 40px 24px; color: var(--c-text-3); }
.empty-icon { width: 48px; height: 48px; color: #cbd5e1; margin-bottom: 12px; }
.empty-icon svg { width: 48px; height: 48px; }
.empty-title { font-family: 'Sora', sans-serif; font-size: .9rem; font-weight: 600; color: var(--c-text-2); margin: 0 0 4px; }
.empty-sub { font-size: .8rem; margin: 0; }

/* Tailwind color passthrough for deviasi */
.text-red-600    { color: #dc2626 !important; }
.text-amber-600  { color: #d97706 !important; }
.text-emerald-600{ color: #059669 !important; }
</style>