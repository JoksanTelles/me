<template>
  <div class="p-8 md:p-12 max-w-5xl mx-auto">
    <h1 class="font-title text-4xl text-stone-900 uppercase mb-2">Bienvenido, Admin</h1>
    <p class="text-stone-500 mb-8">Resumen rápido de la plataforma.</p>
    
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h3 class="text-stone-500 text-sm font-bold uppercase tracking-wide">Usuarios Registrados</h3>
        <p class="text-4xl font-title mt-2">{{ stats.users }}</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h3 class="text-stone-500 text-sm font-bold uppercase tracking-wide">Cursos Creados</h3>
        <p class="text-4xl font-title mt-2">{{ stats.courses }}</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h3 class="text-stone-500 text-sm font-bold uppercase tracking-wide">Pedidos Totales</h3>
        <p class="text-4xl font-title mt-2">{{ stats.purchases }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { pb } from '../../lib/pocketbase';

const stats = reactive({
  users: 0,
  courses: 0,
  purchases: 0
});

onMounted(async () => {
  try {
    const u = await pb.collection('users').getList(1, 1);
    stats.users = u.totalItems;
    const c = await pb.collection('courses').getList(1, 1);
    stats.courses = c.totalItems;
    const p = await pb.collection('purchases').getList(1, 1);
    stats.purchases = p.totalItems;
  } catch(e) {
    console.error(e);
  }
});
</script>
