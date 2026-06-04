<template>
  <div class="relative" @click="isOpen = !isOpen" v-click-outside="() => isOpen = false">
    <!-- Icono de usuario -->
    <div class="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center font-bold text-stone-600 cursor-pointer hover:ring-2 hover:ring-rose-200 transition-all select-none">
      {{ initials }}
    </div>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="isOpen" class="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden z-50">
        <div class="px-4 py-3 border-b border-stone-50 bg-stone-50/50">
          <p class="text-sm font-medium text-stone-900 truncate">{{ userName }}</p>
        </div>
        <div class="py-1">
          <a href="/dashboard" class="block px-4 py-2 text-sm text-stone-700 hover:bg-rose-50 hover:text-rose-600 transition-colors">
            Mi Dashboard
          </a>
          <a href="/dashboard" class="block px-4 py-2 text-sm text-stone-700 hover:bg-rose-50 hover:text-rose-600 transition-colors">
            Mis Compras
          </a>
          <a href="#" class="block px-4 py-2 text-sm text-stone-400 hover:bg-stone-50 transition-colors cursor-not-allowed">
            Configuraciones
          </a>
        </div>
        <div class="py-1 border-t border-stone-50">
          <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { pb } from '../lib/pocketbase';

const props = defineProps({
  userName: {
    type: String,
    default: 'Usuario'
  }
});

const isOpen = ref(false);

const initials = computed(() => {
  return props.userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
});

const logout = () => {
  pb.authStore.clear();
  document.cookie = 'pb_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  window.location.href = '/login';
};

// Directiva simple para click outside
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
};
</script>
