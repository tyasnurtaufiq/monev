<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <Sidebar v-model="sidebarOpen" />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      
      <main class="flex-1 overflow-y-auto p-3 lg:p-6">
        <div class="max-w-6xl mx-auto">
          <!-- Page Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Data Kegiatan</h1>
              <p class="text-gray-500 dark:text-gray-400 mt-1">Kelola program, kegiatan, sub kegiatan, dan output</p>
            </div>
            <button @click="openAddModal" class="btn-accent flex items-center gap-2 self-start sm:self-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah
            </button>
          </div>

          <!-- Tahun + Level Selector -->
          <div class="card dark:bg-gray-800 dark:border-gray-700 p-4 mb-6">
            <div class="flex flex-wrap items-center gap-4">
              <select v-model="selectedTahunId" @change="onTahunChange" class="input-field w-auto">
                <option v-for="t in monevStore.tahunList" :key="t.id" :value="t.id">{{ t.tahun }}</option>
              </select>

              <div class="flex items-center bg-gray-100 rounded-lg p-1">
                <button 
                  v-for="level in levels" :key="level.key"
                  @click="currentLevel = level.key"
                  class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                  :class="currentLevel === level.key ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
                >
                  {{ level.label }}
                </button>
              </div>

              <!-- Breadcrumb filters -->
              <template v-if="currentLevel !== 'program'">
                <select v-model="filterProgramId" @change="onFilterChange" class="input-field w-auto">
                  <option value="">Semua Program</option>
                  <option v-for="p in monevStore.programs" :key="p.id" :value="p.id">{{ p.nama_program }}</option>
                </select>
              </template>

              <template v-if="currentLevel === 'subkegiatan' || currentLevel === 'output'">
                <select v-model="filterKegiatanId" @change="onKegiatanFilterChange" class="input-field w-auto">
                  <option value="">Semua Kegiatan</option>
                  <option v-for="k in monevStore.kegiatanList" :key="k.id" :value="k.id">{{ k.nama_kegiatan }}</option>
                </select>
              </template>

              <template v-if="currentLevel === 'output'">
                <select v-model="filterSubKegiatanId" @change="onSubKegiatanFilterChange" class="input-field w-auto">
                  <option value="">Semua Sub Kegiatan</option>
                  <option v-for="sk in monevStore.subKegiatanList" :key="sk.id" :value="sk.id">{{ sk.nama_sub_kegiatan }}</option>
                </select>
              </template>
            </div>
          </div>

          <!-- Data Table -->
          <div class="card dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Kode</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Nama</th>
                  <th v-if="currentLevel === 'output'" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Pagu</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Parent</th>
                  <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                <tr 
                  v-for="item in tableData" :key="item.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td class="px-6 py-4">
                    <span class="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded">{{ item.kode || '-' }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <p class="font-medium text-gray-900 dark:text-gray-100">{{ item.nama }}</p>
                  </td>
                  <td v-if="currentLevel === 'output'" class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ formatCurrency(item.pagu) }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ item.parentName || '-' }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center gap-2">
                      <button @click="openEditModal(item)" class="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button @click="confirmDelete(item)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>

            <div v-if="tableData.length === 0" class="text-center py-12">
              <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-gray-500 font-medium">Belum ada data</p>
              <p class="text-gray-400 text-sm">Klik tombol "Tambah" untuk menambah data baru</p>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showModal = false"></div>
        <div class="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">
              {{ editingItem ? 'Edit' : 'Tambah' }} {{ levelLabel }}
            </h3>
            <button @click="showModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSave" class="p-6 space-y-5">
            <!-- Parent selector -->
            <div v-if="currentLevel === 'kegiatan'">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Program <span class="text-red-500">*</span></label>
              <select v-model="form.parent_id" class="input-field" required>
                <option value="" disabled>Pilih program</option>
                <option v-for="p in monevStore.programs" :key="p.id" :value="p.id">{{ p.nama_program }}</option>
              </select>
            </div>
            <div v-if="currentLevel === 'subkegiatan'">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Kegiatan <span class="text-red-500">*</span></label>
              <select v-model="form.parent_id" class="input-field" required>
                <option value="" disabled>Pilih kegiatan</option>
                <option v-for="k in monevStore.kegiatanList" :key="k.id" :value="k.id">{{ k.nama_kegiatan }}</option>
              </select>
            </div>
            <div v-if="currentLevel === 'output'">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Sub Kegiatan <span class="text-red-500">*</span></label>
              <select v-model="form.parent_id" class="input-field" required>
                <option value="" disabled>Pilih sub kegiatan</option>
                <option v-for="sk in monevStore.subKegiatanList" :key="sk.id" :value="sk.id">{{ sk.nama_sub_kegiatan }}</option>
              </select>
            </div>

            <!-- Kode -->
            <div v-if="currentLevel !== 'output'">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Kode</label>
              <input v-model="form.kode" type="text" placeholder="Kode..." class="input-field" />
            </div>

            <!-- Nama -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                {{ currentLevel === 'output' ? 'Nama Output' : 'Nama' }} <span class="text-red-500">*</span>
              </label>
              <input v-model="form.nama" type="text" placeholder="Nama..." class="input-field" required />
            </div>

            <!-- Pagu (output only) -->
            <div v-if="currentLevel === 'output'">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Pagu (Rp) <span class="text-red-500">*</span></label>
              <input v-model="form.pagu" type="number" step="0.01" placeholder="0" class="input-field" required />
            </div>

            <!-- User assignment (output only) -->
            <div v-if="currentLevel === 'output'">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Ditugaskan ke <span class="text-red-500">*</span></label>
              <select v-model="form.user_id" class="input-field" required>
                <option value="" disabled>Pilih user</option>
                <option v-for="u in usersList" :key="u.id" :value="u.id">{{ u.name }} ({{ u.username }})</option>
              </select>
            </div>

            <!-- Tahun (program only) -->
            <div v-if="currentLevel === 'program'">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Tahun Anggaran</label>
              <select v-model="form.tahun_id" class="input-field">
                <option v-for="t in monevStore.tahunList" :key="t.id" :value="t.id">{{ t.tahun }}</option>
              </select>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" @click="showModal = false" class="btn-secondary">Batal</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Menyimpan...' : (editingItem ? 'Simpan' : 'Tambah') }}
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
            <h3 class="text-xl font-bold text-gray-900 mb-2">Hapus Data</h3>
            <p class="text-gray-600">Apakah Anda yakin? Data anak yang terkait juga akan terhapus.</p>
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
  { key: 'output', label: 'Output' }
]

const currentLevel = ref('program')
const selectedTahunId = ref(monevStore.selectedTahunId)
const filterProgramId = ref('')
const filterKegiatanId = ref('')
const filterSubKegiatanId = ref('')
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingItem = ref(null)
const deletingItem = ref(null)
const saving = ref(false)

const usersList = ref([])

const form = ref({
  kode: '',
  nama: '',
  parent_id: '',
  pagu: '',
  tahun_id: '',
  user_id: ''
})

const levelLabel = computed(() => levels.find(l => l.key === currentLevel.value)?.label || '')

const tableData = computed(() => {
  switch (currentLevel.value) {
    case 'program':
      return monevStore.programs.map(p => ({
        id: p.id, kode: p.kode_program, nama: p.nama_program,
        parentName: `Tahun ${p.tahun || ''}`, raw: p
      }))
    case 'kegiatan':
      return monevStore.kegiatanList.map(k => ({
        id: k.id, kode: k.kode_kegiatan, nama: k.nama_kegiatan,
        parentName: k.nama_program || '-', raw: k
      }))
    case 'subkegiatan':
      return monevStore.subKegiatanList.map(sk => ({
        id: sk.id, kode: sk.kode_sub_kegiatan, nama: sk.nama_sub_kegiatan,
        parentName: sk.nama_kegiatan || '-', raw: sk
      }))
    case 'output':
      return monevStore.outputList.map(o => ({
        id: o.id, kode: null, nama: o.nama_output, pagu: o.pagu,
        parentName: o.user_name ? `${o.nama_sub_kegiatan || '-'} — ${o.user_name}` : (o.nama_sub_kegiatan || '-'), raw: o
      }))
    default:
      return []
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
  if (filterProgramId.value) {
    await monevStore.fetchKegiatan(filterProgramId.value)
  } else {
    await monevStore.fetchKegiatan()
  }
}

const onKegiatanFilterChange = async () => {
  filterSubKegiatanId.value = ''
  if (filterKegiatanId.value) {
    await monevStore.fetchSubKegiatan(filterKegiatanId.value)
  } else {
    await monevStore.fetchSubKegiatan()
  }
  if (currentLevel.value === 'output') {
    await monevStore.fetchOutput(filterSubKegiatanId.value || undefined)
  }
}

const onSubKegiatanFilterChange = async () => {
  await monevStore.fetchOutput(filterSubKegiatanId.value || undefined)
}

const loadCurrentLevel = async () => {
  switch (currentLevel.value) {
    case 'program':
      await monevStore.fetchPrograms(selectedTahunId.value)
      break
    case 'kegiatan':
      await monevStore.fetchKegiatan(filterProgramId.value || undefined)
      break
    case 'subkegiatan':
      await monevStore.fetchSubKegiatan(filterKegiatanId.value || undefined)
      break
    case 'output':
      // Load parent data for filters if needed
      if (monevStore.programs.length === 0) {
        await monevStore.fetchPrograms(selectedTahunId.value)
      }
      if (monevStore.kegiatanList.length === 0 && filterProgramId.value) {
        await monevStore.fetchKegiatan(filterProgramId.value)
      }
      if (monevStore.subKegiatanList.length === 0 && filterKegiatanId.value) {
        await monevStore.fetchSubKegiatan(filterKegiatanId.value)
      }
      await monevStore.fetchOutput(filterSubKegiatanId.value || undefined)
      break
  }
}

watch(currentLevel, loadCurrentLevel)

const openAddModal = () => {
  editingItem.value = null
  form.value = {
    kode: '',
    nama: '',
    parent_id: filterProgramId.value || filterKegiatanId.value || '',
    pagu: '',
    tahun_id: selectedTahunId.value,
    user_id: ''
  }
  showModal.value = true
}

const openEditModal = (item) => {
  editingItem.value = item
  const raw = item.raw
  form.value = {
    kode: item.kode || '',
    nama: item.nama || '',
    parent_id: raw.program_id || raw.kegiatan_id || raw.sub_kegiatan_id || '',
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
        if (editingItem.value) {
          await monevStore.updateProgram(editingItem.value.id, {
            kode_program: form.value.kode,
            nama_program: form.value.nama,
            tahun_id: form.value.tahun_id
          })
        } else {
          await monevStore.addProgram({
            kode_program: form.value.kode,
            nama_program: form.value.nama,
            tahun_id: form.value.tahun_id || selectedTahunId.value
          })
        }
        break
      case 'kegiatan':
        if (editingItem.value) {
          await monevStore.updateKegiatan(editingItem.value.id, {
            program_id: form.value.parent_id,
            kode_kegiatan: form.value.kode,
            nama_kegiatan: form.value.nama
          })
        } else {
          await monevStore.addKegiatan({
            program_id: form.value.parent_id,
            kode_kegiatan: form.value.kode,
            nama_kegiatan: form.value.nama
          })
        }
        break
      case 'subkegiatan':
        if (editingItem.value) {
          await monevStore.updateSubKegiatan(editingItem.value.id, {
            kegiatan_id: form.value.parent_id,
            kode_sub_kegiatan: form.value.kode,
            nama_sub_kegiatan: form.value.nama
          })
        } else {
          await monevStore.addSubKegiatan({
            kegiatan_id: form.value.parent_id,
            kode_sub_kegiatan: form.value.kode,
            nama_sub_kegiatan: form.value.nama
          })
        }
        break
      case 'output':
        if (editingItem.value) {
          await monevStore.updateOutput(editingItem.value.id, {
            sub_kegiatan_id: form.value.parent_id,
            nama_output: form.value.nama,
            pagu: parseFloat(form.value.pagu),
            user_id: form.value.user_id
          })
        } else {
          await monevStore.addOutput({
            sub_kegiatan_id: form.value.parent_id,
            nama_output: form.value.nama,
            pagu: parseFloat(form.value.pagu),
            user_id: form.value.user_id
          })
        }
        break
    }
    showModal.value = false
    await loadCurrentLevel()
  } catch (err) {
    alert(err.message)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item) => {
  deletingItem.value = item
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!deletingItem.value) return
  try {
    switch (currentLevel.value) {
      case 'program': await monevStore.deleteProgram(deletingItem.value.id); break
      case 'kegiatan': await monevStore.deleteKegiatan(deletingItem.value.id); break
      case 'subkegiatan': await monevStore.deleteSubKegiatan(deletingItem.value.id); break
      case 'output': await monevStore.deleteOutput(deletingItem.value.id); break
    }
    showDeleteModal.value = false
    deletingItem.value = null
  } catch (err) {
    alert(err.message)
  }
}

const fetchUsers = async () => {
  try {
    usersList.value = await api.get('/auth/users')
  } catch (err) {
    console.error('Failed to fetch users:', err)
  }
}

onMounted(async () => {
  await monevStore.fetchTahun()
  if (monevStore.selectedTahunId) {
    selectedTahunId.value = monevStore.selectedTahunId
  }

  // check query param
  if (route.query.program_id) {
    filterProgramId.value = parseInt(route.query.program_id)
    currentLevel.value = 'kegiatan'
  }

  await loadCurrentLevel()
  await fetchUsers()
})
</script>
