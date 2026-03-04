<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>

      <!-- Modal -->
      <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">
            {{ isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru' }}
          </h3>
          <button 
            @click="$emit('close')"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Nama Kegiatan <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.title"
              type="text" 
              placeholder="Masukkan nama kegiatan..."
              class="input-field"
              required
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Deskripsi
            </label>
            <textarea 
              v-model="form.description"
              placeholder="Jelaskan detail kegiatan..."
              rows="3"
              class="input-field resize-none"
            ></textarea>
          </div>

          <!-- Division & Status -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Divisi <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="form.divisionId"
                class="input-field"
                required
              >
                <option value="" disabled>Pilih divisi</option>
                <option 
                  v-for="division in divisions" 
                  :key="division.id" 
                  :value="division.id"
                >
                  {{ division.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Status <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="form.status"
                class="input-field"
                required
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <!-- Priority & Deadline -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Prioritas
              </label>
              <select 
                v-model="form.priority"
                class="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Deadline <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.deadline"
                type="date" 
                class="input-field"
                required
              />
            </div>
          </div>

          <!-- Progress (only for editing) -->
          <div v-if="isEditing">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Progress: {{ form.progress }}%
            </label>
            <input 
              v-model="form.progress"
              type="range" 
              min="0" 
              max="100" 
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
          </div>

          <!-- Assignees -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Assignees
            </label>
            <input 
              v-model="assigneesInput"
              type="text" 
              placeholder="Nama assignee (pisahkan dengan koma)"
              class="input-field"
            />
            <p class="text-xs text-gray-500 mt-1">Contoh: John Doe, Jane Smith</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button"
              @click="$emit('close')"
              class="btn-secondary"
            >
              Batal
            </button>
            <button 
              type="submit"
              class="btn-primary"
            >
              {{ isEditing ? 'Simpan Perubahan' : 'Tambah Kegiatan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useActivitiesStore } from '../../stores/activities'

const props = defineProps({
  activity: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const activitiesStore = useActivitiesStore()
const divisions = computed(() => activitiesStore.divisions)

const isEditing = computed(() => !!props.activity)

const form = reactive({
  title: '',
  description: '',
  divisionId: '',
  status: 'pending',
  priority: 'medium',
  deadline: '',
  progress: 0
})

const assigneesInput = ref('')

onMounted(() => {
  if (props.activity) {
    form.title = props.activity.title
    form.description = props.activity.description
    form.divisionId = props.activity.divisionId
    form.status = props.activity.status
    form.priority = props.activity.priority
    form.deadline = props.activity.deadline
    form.progress = props.activity.progress || 0
    assigneesInput.value = props.activity.assignees?.join(', ') || ''
  } else {
    // Default deadline to 7 days from now
    const defaultDeadline = new Date()
    defaultDeadline.setDate(defaultDeadline.getDate() + 7)
    form.deadline = defaultDeadline.toISOString().split('T')[0]
  }
})

const handleSubmit = () => {
  const assignees = assigneesInput.value
    .split(',')
    .map(a => a.trim())
    .filter(a => a)

  emit('save', {
    title: form.title,
    description: form.description,
    divisionId: parseInt(form.divisionId),
    status: form.status,
    priority: form.priority,
    deadline: form.deadline,
    progress: parseInt(form.progress),
    assignees
  })
}
</script>
