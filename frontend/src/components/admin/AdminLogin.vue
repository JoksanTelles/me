<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-8 w-full max-w-sm">
      <h1 class="text-2xl font-bold tracking-tight text-center mb-2">Panel Admin</h1>
      <p class="text-muted-foreground text-sm mb-6 text-center">Ingresa con tus credenciales maestras.</p>
      
      <div v-if="error" class="bg-destructive/15 text-destructive p-3 rounded-md text-sm mb-4 border border-destructive/20 font-medium text-center">{{ error }}</div>
      
      <form @submit.prevent="login" class="flex flex-col gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
          <input v-model="email" type="email" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" required>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Contraseña</label>
          <input v-model="password" type="password" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" required>
        </div>
        <button type="submit" class="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full">Ingresar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { pb } from '../../lib/pocketbase';

const email = ref('admin@joksan.dev');
const password = ref('1234567890');
const error = ref('');

const login = async () => {
  error.value = '';
  try {
    // Using pb.send to support latest SDK with v0.22 backend
    const result = await pb.send('/api/admins/auth-with-password', {
      method: 'POST',
      body: { identity: email.value, password: password.value }
    });
    pb.authStore.save(result.token, result.admin);
    
    // Configurar cookie para Astro SSR
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false, secure: false, sameSite: 'Lax' });
    
    window.location.href = '/admin/dashboard';
  } catch(e) {
    try {
      const result = await pb.collection('users').authWithPassword(email.value, password.value);
      if (result.record.email === 'admin@joksan.dev') {
        document.cookie = pb.authStore.exportToCookie({ httpOnly: false, secure: false, sameSite: 'Lax' });
        window.location.href = '/admin/dashboard';
      } else {
        pb.authStore.clear();
        error.value = 'No tienes permisos de administrador.';
      }
    } catch(e2) {
      error.value = 'Credenciales inválidas.';
    }
  }
};
</script>
