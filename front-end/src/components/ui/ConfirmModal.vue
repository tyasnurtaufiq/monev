<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="$emit('cancel')"
      ></div>

      <!-- Modal -->
      <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div class="p-6 text-center">
          <!-- Icon -->
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <!-- Content -->
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
          <p class="text-gray-600">{{ message }}</p>
        </div>

        <!-- Actions -->
        <div class="px-6 py-4 bg-gray-50 flex items-center justify-center gap-3">
          <button 
            @click="$emit('cancel')"
            class="btn-secondary min-w-[100px]"
          >
            Batal
          </button>
          <button 
            @click="$emit('confirm')"
            class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium 
                   hover:bg-red-700 transition-colors min-w-[100px]"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Konfirmasi'
  },
  message: {
    type: String,
    default: 'Apakah Anda yakin?'
  }
})

defineEmits(['confirm', 'cancel'])
</script>
