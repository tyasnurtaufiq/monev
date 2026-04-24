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
                Manajemen
              </div>
              <h1 class="page-title">Data <span class="highlight">Kegiatan</span></h1>
              <p class="page-sub">Kelola program, kegiatan, sub kegiatan, output, dan belanja</p>
            </div>
            <div class="topbar-right">
              <button @click="openAddModal" class="btn-primary-action">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah {{ levelLabel }}
              </button>
            </div>
          </div>

          <!-- Filter Card -->
          <div class="filter-card">
            <div class="filter-bar">
              <!-- Tahun Selector -->
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

              <!-- Level Tabs -->
              <div class="level-tabs">
                <button
                  v-for="level in levels" :key="level.key"
                  @click="currentLevel = level.key"
                  class="level-tab"
                  :class="currentLevel === level.key ? 'level-tab--active' : ''"
                >{{ level.label }}</button>
              </div>

              <!-- Breadcrumb Filters -->
              <template v-if="currentLevel !== 'program'">
                <div class="flt-dd" :class="{'flt-dd--open': filterDD.program}" ref="filterProgRef">
                  <button class="flt-btn" type="button" @click="toggleFltDD('program')">
                    <span class="flt-val">{{ monevStore.programs.find(p=>p.id===filterProgramId)?.nama_program || 'Semua Program' }}</span>
                    <svg class="flt-chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="filterDD.program" class="flt-menu">
                      <div class="flt-menu-inner">
                        <button class="flt-opt" :class="{'flt-opt--active': filterProgramId===''}" type="button" @click="selectFltProgram('')"><span>Semua Program</span><svg v-if="filterProgramId===''" class="flt-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></button>
                        <button v-for="p in monevStore.programs" :key="p.id" class="flt-opt" :class="{'flt-opt--active': filterProgramId===p.id}" type="button" @click="selectFltProgram(p.id)"><span>{{ p.nama_program }}</span><svg v-if="filterProgramId===p.id" class="flt-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </template>
              <template v-if="currentLevel === 'subkegiatan' || currentLevel === 'output' || currentLevel === 'belanja'">
                <div class="flt-dd" :class="{'flt-dd--open': filterDD.kegiatan}" ref="filterKegRef">
                  <button class="flt-btn" type="button" @click="toggleFltDD('kegiatan')">
                    <span class="flt-val">{{ monevStore.kegiatanList.find(k=>k.id===filterKegiatanId)?.nama_kegiatan || 'Semua Kegiatan' }}</span>
                    <svg class="flt-chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="filterDD.kegiatan" class="flt-menu">
                      <div class="flt-menu-inner">
                        <button class="flt-opt" :class="{'flt-opt--active': filterKegiatanId===''}" type="button" @click="selectFltKegiatan('')"><span>Semua Kegiatan</span><svg v-if="filterKegiatanId===''" class="flt-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></button>
                        <button v-for="k in monevStore.kegiatanList" :key="k.id" class="flt-opt" :class="{'flt-opt--active': filterKegiatanId===k.id}" type="button" @click="selectFltKegiatan(k.id)"><span>{{ k.nama_kegiatan }}</span><svg v-if="filterKegiatanId===k.id" class="flt-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </template>
              <template v-if="currentLevel === 'output' || currentLevel === 'belanja'">
                <div class="flt-dd" :class="{'flt-dd--open': filterDD.subkegiatan}" ref="filterSkRef">
                  <button class="flt-btn" type="button" @click="toggleFltDD('subkegiatan')">
                    <span class="flt-val">{{ monevStore.subKegiatanList.find(s=>s.id===filterSubKegiatanId)?.nama_sub_kegiatan || 'Semua Sub Kegiatan' }}</span>
                    <svg class="flt-chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="filterDD.subkegiatan" class="flt-menu">
                      <div class="flt-menu-inner">
                        <button class="flt-opt" :class="{'flt-opt--active': filterSubKegiatanId===''}" type="button" @click="selectFltSk('')"><span>Semua Sub Kegiatan</span><svg v-if="filterSubKegiatanId===''" class="flt-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></button>
                        <button v-for="sk in monevStore.subKegiatanList" :key="sk.id" class="flt-opt" :class="{'flt-opt--active': filterSubKegiatanId===sk.id}" type="button" @click="selectFltSk(sk.id)"><span>{{ sk.nama_sub_kegiatan }}</span><svg v-if="filterSubKegiatanId===sk.id" class="flt-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </template>
              <template v-if="currentLevel === 'belanja'">
                <div class="flt-dd" :class="{'flt-dd--open': filterDD.output}" ref="filterOutRef">
                  <button class="flt-btn" type="button" @click="toggleFltDD('output')">
                    <span class="flt-val">{{ monevStore.outputList.find(o=>o.id===filterOutputId)?.nama_output || 'Semua Output' }}</span>
                    <svg class="flt-chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="filterDD.output" class="flt-menu">
                      <div class="flt-menu-inner">
                        <button class="flt-opt" :class="{'flt-opt--active': filterOutputId===''}" type="button" @click="selectFltOutput('')"><span>Semua Output</span><svg v-if="filterOutputId===''" class="flt-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></button>
                        <button v-for="o in monevStore.outputList" :key="o.id" class="flt-opt" :class="{'flt-opt--active': filterOutputId===o.id}" type="button" @click="selectFltOutput(o.id)"><span>{{ o.nama_output }}</span><svg v-if="filterOutputId===o.id" class="flt-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </template>
            </div>
          </div>

          <!-- Data Table Card -->
          <div class="main-card">
            <div class="card-header">
              <div class="card-header-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 class="card-title">Daftar {{ levelLabel }}</h2>
                <p class="card-subtitle">{{ tableData.length }} data ditemukan</p>
              </div>
            </div>
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th v-if="currentLevel === 'belanja'">Pagu</th>
                    <th>Parent</th>
                    <th class="th-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="tableData.length === 0">
                    <td :colspan="currentLevel === 'belanja' ? 5 : 4">
                      <div class="empty-state">
                        <div class="empty-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <p class="empty-title">Belum ada data {{ levelLabel }}</p>
                        <p class="empty-sub">Klik tombol "Tambah" untuk menambah data baru</p>
                      </div>
                    </td>
                  </tr>
                  <tr v-for="item in tableData" :key="item.id" class="table-row">
                    <td>
                      <span class="kode-badge">{{ item.kode || '-' }}</span>
                    </td>
                    <td>
                      <p class="nama-text">{{ item.nama }}</p>
                    </td>
                    <td v-if="currentLevel === 'belanja'" class="pagu-text">
                      {{ formatCurrency(item.pagu) }}
                    </td>
                    <td class="parent-text">{{ item.parentName || '-' }}</td>
                    <td>
                      <div class="action-btns">
                        <button @click="openEditModal(item)" class="action-btn action-btn--edit" title="Edit">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button @click="confirmDelete(item)" class="action-btn action-btn--delete" title="Hapus">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-backdrop" @click="showModal = false"></div>
        <div class="modal-box">
          <div class="modal-header">
            <div class="modal-icon-wrap">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div class="modal-title-group">
              <h3 class="modal-title">{{ editingItem ? 'Edit' : 'Tambah' }} {{ levelLabel }}</h3>
              <p class="modal-subtitle">{{ editingItem ? 'Perbarui data ' : 'Isi data ' }}{{ levelLabel.toLowerCase() }} di bawah ini</p>
            </div>
            <button @click="showModal = false" class="modal-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form @submit.prevent="handleSave" class="modal-form">
            <!-- Parent selectors -->
            <div v-if="currentLevel === 'kegiatan'" class="form-group">
              <label class="form-label">Program <span class="required">*</span></label>
              <select v-model="form.parent_id" class="form-input" required>
                <option value="" disabled>Pilih program</option>
                <option v-for="p in monevStore.programs" :key="p.id" :value="p.id">{{ p.nama_program }}</option>
              </select>
            </div>
            <div v-if="currentLevel === 'subkegiatan'" class="form-group">
              <label class="form-label">Kegiatan <span class="required">*</span></label>
              <select v-model="form.parent_id" class="form-input" required>
                <option value="" disabled>Pilih kegiatan</option>
                <option v-for="k in monevStore.kegiatanList" :key="k.id" :value="k.id">{{ k.nama_kegiatan }}</option>
              </select>
            </div>
            <div v-if="currentLevel === 'output'" class="form-group">
              <label class="form-label">Sub Kegiatan <span class="required">*</span></label>
              <select v-model="form.parent_id" class="form-input" required>
                <option value="" disabled>Pilih sub kegiatan</option>
                <option v-for="sk in monevStore.subKegiatanList" :key="sk.id" :value="sk.id">{{ sk.nama_sub_kegiatan }}</option>
              </select>
            </div>
            <div v-if="currentLevel === 'belanja'" class="form-group">
              <label class="form-label">Output <span class="required">*</span></label>
              <select v-model="form.parent_id" class="form-input" required>
                <option value="" disabled>Pilih output</option>
                <option v-for="o in monevStore.outputList" :key="o.id" :value="o.id">{{ o.nama_output }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Kode <span class="required">*</span></label>
              <input v-model="form.kode" type="text" placeholder="Kode..." class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">
                {{ currentLevel === 'output' ? 'Nama Output' : currentLevel === 'belanja' ? 'Nama Belanja' : 'Nama' }}
                <span class="required">*</span>
              </label>
              <input v-model="form.nama" type="text" placeholder="Nama..." class="form-input" required />
            </div>
            <div v-if="currentLevel === 'belanja'" class="form-group">
              <label class="form-label">Pagu (Rp) <span class="required">*</span></label>
              <input v-model="form.pagu" type="number" step="0.01" placeholder="0" class="form-input" required />
            </div>
            <div v-if="currentLevel === 'output'" class="form-group">
              <label class="form-label">Ditugaskan ke <span class="required">*</span></label>
              <select v-model="form.user_id" class="form-input" required>
                <option value="" disabled>Pilih user</option>
                <option v-for="u in usersList" :key="u.id" :value="u.id">{{ u.name }} ({{ u.username }})</option>
              </select>
            </div>
            <div v-if="currentLevel === 'program'" class="form-group">
              <label class="form-label">Tahun Anggaran</label>
              <select v-model="form.tahun_id" class="form-input">
                <option v-for="t in monevStore.tahunList" :key="t.id" :value="t.id">{{ t.tahun }}</option>
              </select>
            </div>

            <div class="modal-footer">
              <button type="button" @click="showModal = false" class="btn-cancel">Batal</button>
              <button type="submit" class="btn-save" :disabled="saving">
                {{ saving ? 'Menyimpan...' : (editingItem ? 'Simpan' : 'Tambah') }}
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="delete-title">Hapus Data</h3>
            <p class="delete-desc">Apakah Anda yakin? Data anak yang terkait juga akan terhapus.</p>
          </div>
          <div class="delete-footer">
            <button @click="showDeleteModal = false" class="btn-cancel">Batal</button>
            <button @click="handleDelete" class="btn-danger">Hapus</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMonevStore } from '../stores/monev'
import { api } from '../api'

import Sidebar from '../components/layout/Sidebar.vue'
import Header from '../components/layout/Header.vue'

const route = useRoute()
const monevStore = useMonevStore()
const sidebarOpen = ref(false)

const levels = [
  { key: 'program', label: 'Program' },
  { key: 'kegiatan', label: 'Kegiatan' },
  { key: 'subkegiatan', label: 'Sub Kegiatan' },
  { key: 'output', label: 'Output' },
  { key: 'belanja', label: 'Belanja' }
]

const currentLevel = ref('program')
const selectedTahunId = ref(monevStore.selectedTahunId)

// Tahun custom dropdown
const tahunDropdownOpen = ref(false)
const tahunDropdownRef = ref(null)

// Filter bar refs & state — harus dideklarasikan SEBELUM onClickOutsideTahun
const filterProgramId = ref('')
const filterKegiatanId = ref('')
const filterSubKegiatanId = ref('')
const filterOutputId = ref('')
const filterDD = reactive({ program: false, kegiatan: false, subkegiatan: false, output: false })
const filterProgRef = ref(null)
const filterKegRef = ref(null)
const filterSkRef = ref(null)
const filterOutRef = ref(null)

const selectTahun = async (t) => {
  selectedTahunId.value = t.id
  tahunDropdownOpen.value = false
  monevStore.selectedTahunId = t.id
  await monevStore.fetchPrograms(t.id)
}

const onClickOutsideTahun = (e) => {
  if (tahunDropdownRef.value && !tahunDropdownRef.value.contains(e.target)) tahunDropdownOpen.value = false
  if (filterProgRef.value && !filterProgRef.value.contains(e.target)) filterDD.program = false
  if (filterKegRef.value && !filterKegRef.value.contains(e.target)) filterDD.kegiatan = false
  if (filterSkRef.value && !filterSkRef.value.contains(e.target)) filterDD.subkegiatan = false
  if (filterOutRef.value && !filterOutRef.value.contains(e.target)) filterDD.output = false
}

const toggleFltDD = (name) => {
  Object.keys(filterDD).forEach(k => { if (k !== name) filterDD[k] = false })
  filterDD[name] = !filterDD[name]
}
const selectFltProgram = async (id) => { filterProgramId.value = id; filterDD.program = false; await onFilterChange() }
const selectFltKegiatan = async (id) => { filterKegiatanId.value = id; filterDD.kegiatan = false; await onKegiatanFilterChange() }
const selectFltSk = async (id) => { filterSubKegiatanId.value = id; filterDD.subkegiatan = false; await onSubKegiatanFilterChange() }
const selectFltOutput = async (id) => { filterOutputId.value = id; filterDD.output = false; await onOutputFilterChange() }
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingItem = ref(null)
const deletingItem = ref(null)
const saving = ref(false)
const usersList = ref([])

const form = ref({ kode: '', nama: '', parent_id: '', pagu: '', tahun_id: '', user_id: '' })

const levelLabel = computed(() => levels.find(l => l.key === currentLevel.value)?.label || '')

const tableData = computed(() => {
  switch (currentLevel.value) {
    case 'program':
      return monevStore.programs.map(p => ({ id: p.id, kode: p.kode_program, nama: p.nama_program, parentName: `Tahun ${p.tahun || ''}`, raw: p }))
    case 'kegiatan':
      return monevStore.kegiatanList.map(k => ({ id: k.id, kode: k.kode_kegiatan, nama: k.nama_kegiatan, parentName: k.nama_program || '-', raw: k }))
    case 'subkegiatan':
      return monevStore.subKegiatanList.map(sk => ({ id: sk.id, kode: sk.kode_sub_kegiatan, nama: sk.nama_sub_kegiatan, parentName: sk.nama_kegiatan || '-', raw: sk }))
    case 'output':
      return monevStore.outputList.map(o => ({ id: o.id, kode: o.kode || null, nama: o.nama_output, parentName: o.user_name ? `${o.nama_sub_kegiatan || '-'} — ${o.user_name}` : (o.nama_sub_kegiatan || '-'), raw: o }))
    case 'belanja':
      return monevStore.belanjaList.map(b => ({ id: b.id, kode: b.kode || null, nama: b.nama_belanja, pagu: b.pagu, parentName: b.nama_output || '-', raw: b }))
    default: return []
  }
})

const formatCurrency = (value) => {
  if (!value) return 'Rp 0'
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(value)
}

const onTahunChange = async () => {
  monevStore.selectedTahunId = selectedTahunId.value
  await monevStore.fetchPrograms(selectedTahunId.value)
}
const onFilterChange = async () => {
  if (filterProgramId.value) await monevStore.fetchKegiatan(filterProgramId.value)
  else await monevStore.fetchKegiatan()
}
const onKegiatanFilterChange = async () => {
  filterSubKegiatanId.value = ''; filterOutputId.value = ''
  if (filterKegiatanId.value) await monevStore.fetchSubKegiatan(filterKegiatanId.value)
  else await monevStore.fetchSubKegiatan()
  if (currentLevel.value === 'output') await monevStore.fetchOutput(filterSubKegiatanId.value || undefined)
  if (currentLevel.value === 'belanja') { await monevStore.fetchOutput(filterSubKegiatanId.value || undefined); await monevStore.fetchBelanja(filterOutputId.value || undefined) }
}
const onSubKegiatanFilterChange = async () => {
  filterOutputId.value = ''
  await monevStore.fetchOutput(filterSubKegiatanId.value || undefined)
  if (currentLevel.value === 'belanja') await monevStore.fetchBelanja(filterOutputId.value || undefined)
}
const onOutputFilterChange = async () => { await monevStore.fetchBelanja(filterOutputId.value || undefined) }

const loadCurrentLevel = async () => {
  switch (currentLevel.value) {
    case 'program': await monevStore.fetchPrograms(selectedTahunId.value); break
    case 'kegiatan': await monevStore.fetchKegiatan(filterProgramId.value || undefined); break
    case 'subkegiatan': await monevStore.fetchSubKegiatan(filterKegiatanId.value || undefined); break
    case 'output':
      if (monevStore.programs.length === 0) await monevStore.fetchPrograms(selectedTahunId.value)
      await monevStore.fetchOutput(filterSubKegiatanId.value || undefined); break
    case 'belanja':
      if (monevStore.programs.length === 0) await monevStore.fetchPrograms(selectedTahunId.value)
      await monevStore.fetchBelanja(filterOutputId.value || undefined); break
  }
}

watch(currentLevel, loadCurrentLevel)

const openAddModal = () => {
  editingItem.value = null
  const defaultParent = currentLevel.value === 'belanja' ? filterOutputId.value || '' : filterProgramId.value || filterKegiatanId.value || filterSubKegiatanId.value || ''
  form.value = { kode: '', nama: '', parent_id: defaultParent, pagu: '', tahun_id: selectedTahunId.value, user_id: '' }
  showModal.value = true
}

const openEditModal = (item) => {
  editingItem.value = item
  const raw = item.raw
  form.value = {
    kode: item.kode || raw.kode || raw.kode_program || raw.kode_kegiatan || raw.kode_sub_kegiatan || '',
    nama: item.nama || '',
    parent_id: raw.program_id || raw.kegiatan_id || raw.sub_kegiatan_id || raw.output_id || '',
    pagu: raw.pagu || '',
    tahun_id: raw.tahun_id || selectedTahunId.value,
    user_id: raw.user_id || ''
  }
  showModal.value = true
}

const handleSave = async () => {
  saving.value = true
  try {
    switch (currentLevel.value) {
      case 'program':
        if (editingItem.value) await monevStore.updateProgram(editingItem.value.id, { kode_program: form.value.kode, nama_program: form.value.nama, tahun_id: form.value.tahun_id })
        else await monevStore.addProgram({ kode_program: form.value.kode, nama_program: form.value.nama, tahun_id: form.value.tahun_id || selectedTahunId.value })
        break
      case 'kegiatan':
        if (editingItem.value) await monevStore.updateKegiatan(editingItem.value.id, { program_id: form.value.parent_id, kode_kegiatan: form.value.kode, nama_kegiatan: form.value.nama })
        else await monevStore.addKegiatan({ program_id: form.value.parent_id, kode_kegiatan: form.value.kode, nama_kegiatan: form.value.nama })
        break
      case 'subkegiatan':
        if (editingItem.value) await monevStore.updateSubKegiatan(editingItem.value.id, { kegiatan_id: form.value.parent_id, kode_sub_kegiatan: form.value.kode, nama_sub_kegiatan: form.value.nama })
        else await monevStore.addSubKegiatan({ kegiatan_id: form.value.parent_id, kode_sub_kegiatan: form.value.kode, nama_sub_kegiatan: form.value.nama })
        break
      case 'output':
        if (editingItem.value) await monevStore.updateOutput(editingItem.value.id, { sub_kegiatan_id: form.value.parent_id, kode: form.value.kode, nama_output: form.value.nama, user_id: form.value.user_id })
        else await monevStore.addOutput({ sub_kegiatan_id: form.value.parent_id, kode: form.value.kode, nama_output: form.value.nama, user_id: form.value.user_id })
        break
      case 'belanja':
        if (editingItem.value) await monevStore.updateBelanja(editingItem.value.id, { output_id: form.value.parent_id, kode: form.value.kode, nama_belanja: form.value.nama, pagu: parseFloat(form.value.pagu) })
        else await monevStore.addBelanja({ output_id: form.value.parent_id, kode: form.value.kode, nama_belanja: form.value.nama, pagu: parseFloat(form.value.pagu) })
        break
    }
    showModal.value = false; await loadCurrentLevel()
  } catch (err) { alert(err.message) }
  finally { saving.value = false }
}

const confirmDelete = (item) => { deletingItem.value = item; showDeleteModal.value = true }

const handleDelete = async () => {
  if (!deletingItem.value) return
  try {
    switch (currentLevel.value) {
      case 'program': await monevStore.deleteProgram(deletingItem.value.id); break
      case 'kegiatan': await monevStore.deleteKegiatan(deletingItem.value.id); break
      case 'subkegiatan': await monevStore.deleteSubKegiatan(deletingItem.value.id); break
      case 'output': await monevStore.deleteOutput(deletingItem.value.id); break
      case 'belanja': await monevStore.deleteBelanja(deletingItem.value.id); break
    }
    showDeleteModal.value = false; deletingItem.value = null
  } catch (err) { alert(err.message) }
}

const fetchUsers = async () => {
  try { usersList.value = await api.get('/auth/users') }
  catch (err) { console.error('Failed to fetch users:', err) }
}

onMounted(async () => {
  await monevStore.fetchTahun()
  if (monevStore.selectedTahunId) selectedTahunId.value = monevStore.selectedTahunId
  if (route.query.program_id) { filterProgramId.value = parseInt(route.query.program_id); currentLevel.value = 'kegiatan' }
  await loadCurrentLevel(); await fetchUsers()
  document.addEventListener('mousedown', onClickOutsideTahun)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutsideTahun)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

:root {
  --c-bg:           #f0f6ff;
  --c-surface:      #ffffff;
  --c-border:       #dbeafe;
  --c-border-strong:#bfdbfe;
  --c-text-1:       #0f172a;
  --c-text-2:       #475569;
  --c-text-3:       #94a3b8;
  --c-accent:       #0ea5e9;
  --radius-card:    18px;
  --shadow-card:    0 1px 3px rgba(37,99,235,.04), 0 4px 16px rgba(37,99,235,.07);
}
* { box-sizing: border-box; }

/* ==============================
   LAYOUT
============================== */
.dashboard-root  { display: flex; height: 100vh; background: #f0f6ff; font-family: 'DM Sans', sans-serif; }
.dashboard-body  { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.dashboard-main  { flex: 1; overflow-y: auto; padding: 24px 20px; }
@media (min-width: 1024px) { .dashboard-main { padding: 32px 36px; } }
.dashboard-inner { max-width: 1280px; margin: 0 auto; }

/* ==============================
   TOP BAR
============================== */
.topbar      { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
.page-eyebrow {
  display: flex; align-items: center; gap: 7px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.7rem; font-weight: 700; letter-spacing: .14em;
  text-transform: uppercase; color: #0ea5e9; margin-bottom: 6px;
}
.eyebrow-dot { width: 6px; height: 6px; background: #0ea5e9; border-radius: 50%; box-shadow: 0 0 0 3px rgba(14,165,233,.15); }
.page-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.6rem; font-weight: 800; color: #0f172a;
  line-height: 1.15; letter-spacing: -.025em; margin: 0 0 4px;
}
.highlight {
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.page-sub { font-size: 0.85rem; color: #475569; margin: 0; }

.btn-primary-action {
  display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white; border: none; border-radius: 12px;
  padding: 11px 22px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.875rem; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 14px rgba(14,165,233,.3);
  transition: transform .2s, box-shadow .2s;
}
.btn-primary-action:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(14,165,233,.4); }
.btn-primary-action svg { width: 15px; height: 15px; }

/* ──────────── FILTER CARD ──────────── */
.filter-card {
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #dbeafe;
  box-shadow: 0 1px 3px rgba(37,99,235,.04), 0 4px 16px rgba(37,99,235,.07);
  /* overflow: hidden dihapus agar dropdown tidak terpotong */
  margin-bottom: 16px;
}

/* Main data card */
.main-card {
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #dbeafe;
  box-shadow: 0 1px 3px rgba(37,99,235,.04), 0 4px 16px rgba(37,99,235,.07);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  border-bottom: 1px solid #dbeafe;
  background: linear-gradient(to right, #f8faff, #ffffff);
}
.card-header-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border: 1px solid #bfdbfe;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: #2563eb;
}
.card-header-icon svg { width: 20px; height: 20px; }
.card-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1rem; font-weight: 800; color: #0f172a;
  margin: 0 0 2px; letter-spacing: -.02em;
}
.card-subtitle { font-size: 0.77rem; color: #94a3b8; margin: 0; font-weight: 500; }

/* ──────────── FILTER BAR ──────────── */
.filter-bar {
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
  padding: 14px 20px;
  background: #f8faff;
  border-bottom: 1px solid #dbeafe;
  border-radius: 18px 18px 0 0; /* gantikan border-radius yang hilang dari filter-card */
  position: relative; /* agar z-index dropdown bekerja */
  overflow: visible; /* pastikan dropdown tidak terpotong */
}
/* ── TAHUN CUSTOM DROPDOWN ── */
.tahun-dropdown {
  position: relative;
  user-select: none;
}
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
.trigger-icon {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; background: #e0f2fe; border-radius: 7px;
  color: #0ea5e9; flex-shrink: 0;
}
.trigger-icon svg { width: 13px; height: 13px; }
.trigger-label { font-size: 0.63rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #94a3b8; }
.trigger-value { font-size: 0.92rem; font-weight: 800; color: #0f172a; letter-spacing: -.02em; }
.trigger-chevron { width: 14px; height: 14px; color: #94a3b8; transition: transform .25s cubic-bezier(.34,1.56,.64,1); flex-shrink: 0; }
.tahun-dropdown--open .trigger-chevron { transform: rotate(180deg); color: #0ea5e9; }
.tahun-menu {
  position: absolute; top: calc(100% + 8px); right: 0; min-width: 150px;
  background: #ffffff; border: 1.5px solid #dbeafe; border-radius: 14px;
  box-shadow: 0 16px 40px rgba(15,23,42,.16), 0 2px 8px rgba(14,165,233,.08);
  z-index: 500; overflow: hidden;
}
.tahun-menu-inner { padding: 6px; display: flex; flex-direction: column; gap: 2px; }
.tahun-option {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 10px 14px; border-radius: 9px; border: none; background: transparent;
  cursor: pointer; width: 100%; text-align: left;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: background .15s;
}
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
/* ── FILTER BREADCRUMB CUSTOM DROPDOWN ── */
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
.flt-btn:hover { border-color: #94a3b8; }
.flt-dd--open .flt-btn { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,.1); background: #f0f9ff; }
.flt-val { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.flt-chev { width: 13px; height: 13px; color: #94a3b8; transition: transform .22s cubic-bezier(.34,1.56,.64,1); flex-shrink: 0; }
.flt-dd--open .flt-chev { transform: rotate(180deg); color: #0ea5e9; }
.flt-menu {
  position: absolute; top: calc(100% + 6px); left: 0; min-width: 100%; width: max-content; max-width: 280px;
  background: #ffffff; border: 1.5px solid #dbeafe; border-radius: 12px;
  box-shadow: 0 14px 36px rgba(15,23,42,.14), 0 2px 8px rgba(14,165,233,.08);
  z-index: 600; overflow-y: auto; max-height: 240px;
}
.flt-menu-inner { padding: 5px; display: flex; flex-direction: column; gap: 2px; }
.flt-opt {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 9px 12px; border-radius: 8px; border: none; background: transparent;
  cursor: pointer; width: 100%; text-align: left;
  font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: #0f172a;
  transition: background .13s;
}
.flt-opt:hover { background: #f0f9ff; }
.flt-opt--active { background: linear-gradient(135deg,#dbeafe,#f0f9ff); font-weight: 700; color: #0284c7; }
.flt-opt--active:hover { background: linear-gradient(135deg,#bae6fd,#dbeafe); }
.flt-check { width: 14px; height: 14px; color: #0284c7; flex-shrink: 0; }

/* ──────────── LEVEL TABS ──────────── */
.level-tabs {
  display: flex; background: #f0f6ff; border-radius: 10px; padding: 3px; gap: 2px;
  border: 1px solid #dbeafe;
}
.level-tab {
  padding: 6px 14px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.78rem; font-weight: 700; border: none;
  background: transparent; border-radius: 8px; cursor: pointer;
  color: #475569; transition: background .15s, color .15s;
  white-space: nowrap;
}
.level-tab--active {
  background: #ffffff; color: #0ea5e9;
  box-shadow: 0 1px 4px rgba(37,99,235,.12);
}

/* ──────────── TABLE ──────────── */
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table thead tr { background: #f8faff; border-bottom: 1.5px solid #dbeafe; }
.data-table th {
  padding: 11px 20px; text-align: left;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.68rem; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .1em; white-space: nowrap;
}
.th-center { text-align: center; }
.data-table td { padding: 13px 20px; vertical-align: middle; border-bottom: 1px solid #f0f6ff; }
.table-row { transition: background .12s; }
.table-row:hover { background: #fafcff; }
.data-table tbody tr:last-child td { border-bottom: none; }
.kode-badge {
  font-size: 0.72rem; font-family: monospace; font-weight: 700;
  color: #2563eb; background: #eff6ff;
  padding: 3px 8px; border-radius: 6px; white-space: nowrap;
  border: 1px solid #bfdbfe;
}
.nama-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem; font-weight: 600; color: #0f172a; margin: 0;
}
.pagu-text { font-size: 0.82rem; color: #475569; white-space: nowrap; font-weight: 600; }
.parent-text { font-size: 0.8rem; color: #94a3b8; }
.action-btns { display: flex; align-items: center; justify-content: center; gap: 6px; }
.action-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 12px; border: 1.5px solid transparent;
  border-radius: 8px; cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.72rem; font-weight: 700;
  background: #f8fafc;
  transition: background .15s, color .15s, border-color .15s, transform .12s;
  white-space: nowrap;
}
.action-btn:hover { transform: translateY(-1px); }
.action-btn svg { width: 13px; height: 13px; }
.action-btn--edit  { color: #475569; border-color: #e2e8f0; }
.action-btn--edit:hover  { color: #0284c7; background: #e0f2fe; border-color: #bae6fd; }
.action-btn--delete { color: #475569; border-color: #e2e8f0; }
.action-btn--delete:hover { color: #dc2626; background: #fee2e2; border-color: #fecaca; }

/* ==============================
   EMPTY STATE
============================== */
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px 24px; color: var(--c-text-3); }
.empty-icon { width: 52px; height: 52px; color: #cbd5e1; margin-bottom: 12px; }
.empty-icon svg { width: 52px; height: 52px; }
.empty-title {
  font-family: 'Sora', sans-serif;
  font-size: .9rem; font-weight: 600; color: var(--c-text-2); margin: 0 0 4px;
}
.empty-sub { font-size: .8rem; margin: 0; }

/* ==============================
   MODAL OVERLAY & BACKDROP
   — backdrop solid agar konten di bawahnya benar-benar tertutup
============================== */
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(15, 23, 42, 0.65);  /* slate-900 @ 65% — solid, tidak transparan */
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 0;
}

/* ==============================
   MODAL BOX
============================== */
.modal-box {
  position: relative; z-index: 1;
  width: 100%; max-width: 520px;
  background: #ffffff;           /* putih murni, bukan var() yang bisa override */
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  box-shadow:
    0 0 0 1px rgba(255,255,255,.6) inset,
    0 24px 64px rgba(15, 23, 42, .35),
    0 8px 24px rgba(15, 23, 42, .18);
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalIn .22s cubic-bezier(.34,1.36,.64,1);
}
.modal-box--sm {
  max-width: 420px;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(.94) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* ==============================
   MODAL HEADER
============================== */
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px 18px;
  border-bottom: 1.5px solid #e2e8f0;
  position: sticky; top: 0;
  background: #ffffff;           /* sticky header tetap solid */
  z-index: 2;
}
.modal-icon-wrap {
  width: 36px; height: 36px; border-radius: 10px;
  background: #eff6ff; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-right: 12px;
}
.modal-icon-wrap svg { width: 18px; height: 18px; color: #2563eb; }
.modal-title-group { flex: 1; }
.modal-title {
  font-family: 'Sora', sans-serif;
  font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0;
  letter-spacing: -.02em;
}
.modal-subtitle {
  font-size: 0.72rem; color: #94a3b8; margin: 2px 0 0; font-weight: 400;
}
.modal-close {
  display: flex; padding: 7px; border: none;
  background: #f8fafc; border-radius: 9px;
  cursor: pointer; transition: background .15s, color .15s;
  flex-shrink: 0;
}
.modal-close:hover { background: #fee2e2; }
.modal-close svg { width: 16px; height: 16px; color: #94a3b8; }
.modal-close:hover svg { color: #dc2626; }

/* ==============================
   MODAL FORM
============================== */
.modal-form {
  padding: 22px 24px;
  display: flex; flex-direction: column; gap: 16px;
  background: #ffffff;
}
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-label {
  font-family: 'Sora', sans-serif;
  font-size: 0.72rem; font-weight: 700; color: #475569;
  text-transform: uppercase; letter-spacing: .06em;
}
.required { color: #ef4444; margin-left: 2px; }

/* Input & select dalam modal */
.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem; color: #0f172a;
  background: #ffffff;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.form-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,.12);
}
.form-input:hover:not(:focus) { border-color: #94a3b8; }
.form-input::placeholder { color: #b0bec5; }

select.form-input {
  appearance: none;
  padding-right: 36px;
  background: #ffffff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center;
  cursor: pointer;
}

/* ==============================
   MODAL FOOTER
============================== */
.modal-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1.5px solid #e2e8f0;
  margin-top: 4px;
}

/* ==============================
   BUTTONS
============================== */
.btn-save {
  padding: 9px 26px;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: white; border: none; border-radius: 50px;
  font-family: 'Sora', sans-serif;
  font-size: 0.855rem; font-weight: 600; cursor: pointer;
  box-shadow: 0 4px 12px rgba(37,99,235,.35);
  transition: opacity .2s, transform .15s, box-shadow .15s;
}
.btn-save:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(37,99,235,.42);
}
.btn-save:disabled { opacity: .55; cursor: not-allowed; }

.btn-cancel {
  padding: 9px 22px;
  background: #f1f5f9; color: #475569;
  border: 1.5px solid #e2e8f0; border-radius: 50px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.855rem; font-weight: 600; cursor: pointer;
  transition: background .15s, border-color .15s;
}
.btn-cancel:hover { background: #e2e8f0; border-color: #cbd5e1; }

.btn-danger {
  padding: 9px 22px;
  background: #dc2626; color: white; border: none; border-radius: 50px;
  font-family: 'Sora', sans-serif;
  font-size: 0.855rem; font-weight: 600; cursor: pointer;
  box-shadow: 0 4px 12px rgba(220,38,38,.3);
  transition: background .15s, transform .15s, box-shadow .15s;
}
.btn-danger:hover {
  background: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(220,38,38,.38);
}

/* ==============================
   DELETE MODAL
============================== */
.delete-modal-body {
  padding: 36px 28px 20px;
  text-align: center;
  background: #ffffff;
}
.delete-icon-wrap {
  width: 68px; height: 68px;
  background: #fee2e2; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 0 0 10px rgba(239,68,68,.08);
}
.delete-icon-wrap svg { width: 28px; height: 28px; color: #dc2626; }
.delete-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0 0 8px;
}
.delete-desc { font-size: 0.875rem; color: #64748b; margin: 0; line-height: 1.5; }
.delete-footer {
  display: flex; justify-content: center; gap: 12px;
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1.5px solid #e2e8f0;
}
</style>