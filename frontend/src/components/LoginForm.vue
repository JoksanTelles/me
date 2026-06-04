<template>
  <div class="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl p-8 border border-stone-100">
    <div class="text-center mb-8">
      <h2 class="font-title tracking-wide text-rose-950 text-3xl uppercase mb-2">{{ isLogin ? 'Bienvenido' : 'Crear Cuenta' }}</h2>
      <p class="text-stone-500 text-sm">
        {{ isLogin ? 'Ingresa para acceder a tus cursos.' : 'Únete para empezar a aprender.' }}
      </p>
    </div>

    <div v-if="errorMsg" class="bg-red-100 text-red-700 p-3 rounded-xl text-sm mb-4">
      {{ errorMsg }}
    </div>

    <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
      <div v-if="!isLogin">
        <label class="block text-sm font-semibold text-stone-700 mb-1">Nombre</label>
        <input 
          v-model="form.name" 
          type="text" 
          required 
          class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all text-stone-800"
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-stone-700 mb-1">Correo Electrónico</label>
        <input 
          v-model="form.email" 
          type="email" 
          required 
          class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all text-stone-800"
          placeholder="tucorreo@ejemplo.com"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-stone-700 mb-1">Contraseña</label>
        <input 
          v-model="form.password" 
          type="password" 
          required 
          class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all text-stone-800"
          placeholder="••••••••"
        />
      </div>

      <button 
        type="submit" 
        class="mt-2 w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 uppercase tracking-wide"
      >
        {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
      </button>
    </form>

    <div class="mt-6 text-center">
      <button 
        @click="isLogin = !isLogin" 
        class="text-sm font-medium text-stone-500 hover:text-rose-500 transition-colors underline-offset-4 hover:underline"
      >
        {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { pb } from '../lib/pocketbase';

const isLogin = ref(true);
const errorMsg = ref('');

const form = reactive({
  name: '',
  email: '',
  password: ''
});

const handleSubmit = async () => {
  errorMsg.value = '';
  try {
    if (!isLogin.value) {
      // Registro
      await pb.collection('users').create({
        username: form.name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random()*1000),
        email: form.email,
        password: form.password,
        passwordConfirm: form.password,
        name: form.name
      });
    }
    
    // Login
    await pb.collection('users').authWithPassword(form.email, form.password);
    
    // Guardar cookie para SSR
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
    
    // Si viene del carrito, regresarlo a checkout
    if (document.cookie.includes('cart_course_id')) {
      window.location.href = '/checkout';
    } else {
      window.location.href = '/dashboard';
    }
  } catch (err) {
    errorMsg.value = err.message;
  }
};
</script>
