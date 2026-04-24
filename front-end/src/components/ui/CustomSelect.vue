<template>
  <div class="custom-select" :class="[wrapperClass, { 'is-open': isOpen, 'is-disabled': disabled }]" ref="selectRef">
    <button type="button" class="cs-trigger" :class="triggerClass" @click="toggle" :disabled="disabled">
      <span class="cs-label">{{ displayLabel }}</span>
      <svg class="cs-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <Transition name="cs-dropdown">
      <div v-if="isOpen" class="cs-menu" :class="menuClass">
        <div class="cs-menu-inner">
          <button 
            v-for="opt in options" 
            :key="opt.value" 
            type="button" 
            class="cs-option" 
            :class="{ 'is-active': opt.value === modelValue }"
            @click="selectOption(opt)"
          >
            <span class="cs-option-label">{{ opt.label }}</span>
            <svg v-if="opt.value === modelValue" class="cs-option-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] }, // [{ label: '...', value: '...' }]
  placeholder: { type: String, default: 'Pilih...' },
  disabled: { type: Boolean, default: false },
  wrapperClass: { type: String, default: '' },
  triggerClass: { type: String, default: '' },
  menuClass: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const selectRef = ref(null)

const displayLabel = computed(() => {
  const selected = props.options.find(o => String(o.value) === String(props.modelValue))
  return selected ? selected.label : props.placeholder
})

const toggle = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const selectOption = (opt) => {
  isOpen.value = false
  if (String(opt.value) !== String(props.modelValue)) {
    emit('update:modelValue', opt.value)
    emit('change', opt.value)
  }
}

const onClickOutside = (e) => {
  if (selectRef.value && !selectRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

.custom-select {
  position: relative;
  user-select: none;
  display: inline-block;
  width: 100%;
}
.cs-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
  background: #ffffff;
  border: 1.5px solid #dbeafe;
  border-radius: 10px;
  padding: 8px 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: #0f172a;
  cursor: pointer;
  outline: none;
  text-align: left;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.cs-trigger:hover:not(:disabled) {
  border-color: #94a3b8;
}
.is-open .cs-trigger {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14,165,233,.12);
}
.is-disabled .cs-trigger {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
  border-color: #e2e8f0;
}
.cs-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.cs-chevron {
  width: 14px;
  height: 14px;
  color: #94a3b8;
  transition: transform .25s cubic-bezier(.34,1.56,.64,1);
  flex-shrink: 0;
}
.is-open .cs-chevron {
  transform: rotate(180deg);
  color: #0ea5e9;
}

.cs-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 100%;
  width: max-content;
  max-width: 350px;
  background: #ffffff;
  border: 1.5px solid #dbeafe;
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(15,23,42,.16), 0 2px 8px rgba(14,165,233,.08);
  z-index: 9999;
  overflow-y: auto;
  max-height: 280px;
}
/* Scrollbar styling for menu */
.cs-menu::-webkit-scrollbar { width: 6px; }
.cs-menu::-webkit-scrollbar-track { background: transparent; }
.cs-menu::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

.cs-menu-inner {
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cs-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 9px;
  border: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.85rem;
  color: #0f172a;
  transition: background .15s;
}
.cs-option:hover {
  background: #f0f9ff;
}
.cs-option.is-active {
  background: linear-gradient(135deg, #dbeafe, #f0f9ff);
  font-weight: 700;
  color: #0284c7;
}
.cs-option.is-active:hover {
  background: linear-gradient(135deg, #bae6fd, #dbeafe);
}

.cs-option-label {
  white-space: normal;
  line-height: 1.3;
}
.cs-option-check {
  width: 15px;
  height: 15px;
  color: #0284c7;
  flex-shrink: 0;
}

/* Animations */
.cs-dropdown-enter-active {
  transition: opacity .18s ease, transform .22s cubic-bezier(.34,1.56,.64,1);
  transform-origin: top;
}
.cs-dropdown-leave-active {
  transition: opacity .15s ease, transform .15s ease;
  transform-origin: top;
}
.cs-dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scaleY(0.96);
}
.cs-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scaleY(0.97);
}
</style>
