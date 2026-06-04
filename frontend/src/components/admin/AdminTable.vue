<template>
  <div class="p-8 md:p-12">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="font-title text-4xl text-stone-900 uppercase">{{ config.name }}</h1>
        <p class="text-stone-500 mt-1">Administrando registros de {{ config.id }}</p>
      </div>
      <a :href="`${baseRoute}/new`" class="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all uppercase text-sm tracking-wide flex items-center gap-2">
        <span>+</span> Nuevo Registro
      </a>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wider">
              <th v-for="field in config.fields" :key="field.name" class="p-4 font-bold">{{ field.label || field.name }}</th>
              <th class="p-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="border-b border-stone-100">
              <td :colspan="config.fields.length + 1" class="p-8 text-center text-stone-400">Cargando datos...</td>
            </tr>
            <tr v-else-if="records.length === 0" class="border-b border-stone-100">
              <td :colspan="config.fields.length + 1" class="p-8 text-center text-stone-400 italic">No hay registros aún.</td>
            </tr>
            <tr v-for="record in records" :key="record.id" class="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
              <td v-for="field in config.fields" :key="field.name" class="p-4 text-sm text-stone-600">
                <span v-if="field.type === 'relation'">
                  {{ getRelationDisplay(field, record[field.name]) }}
                </span>
                <span v-else-if="field.type === 'boolean'" :class="record[field.name] ? 'text-green-500 font-bold' : 'text-stone-400'">
                  {{ record[field.name] ? 'Sí' : 'No' }}
                </span>
                <span v-else class="truncate max-w-[200px] block" :title="record[field.name]">
                  {{ record[field.name] }}
                </span>
              </td>
              <td class="p-4 text-right space-x-3">
                <a :href="getEditUrl(record)" class="text-rose-500 hover:text-rose-600 font-bold text-sm uppercase tracking-wider">Editar</a>
                <button @click="deleteRecord(record.id)" class="text-stone-400 hover:text-red-500 font-bold text-sm uppercase tracking-wider">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { pb } from '../../lib/pocketbase';
import { getCollectionConfig } from '../../lib/adminConfig';

const props = defineProps({
  collectionId: String,
  baseRoute: String,
  editUrlParam: { type: String, default: 'id' }
});

const config = getCollectionConfig(props.collectionId);
const records = ref([]);
const loading = ref(true);
const relationsData = ref({});

onMounted(async () => {
  await fetchRecords();
  await fetchRelations();
});

const fetchRecords = async () => {
  loading.value = true;
  try {
    records.value = await pb.collection(props.collectionId).getFullList({ sort: '-created' });
  } catch(e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const fetchRelations = async () => {
  for (const field of config.fields) {
    if (field.type === 'relation' && field.collection) {
      if (!relationsData.value[field.collection]) {
        try {
          const rels = await pb.collection(field.collection).getFullList();
          relationsData.value[field.collection] = rels;
        } catch(e) {}
      }
    }
  }
};

const getRelationDisplay = (field, id) => {
  if (!id) return '-';
  const rels = relationsData.value[field.collection];
  if (!rels) return id;
  const item = rels.find(r => r.id === id);
  return item ? (item[field.display] || item.id) : id;
};

const getEditUrl = (record) => {
  if (props.collectionId === 'users') {
    return `${props.baseRoute}/@${record.username}`;
  }
  return `${props.baseRoute}/${record[props.editUrlParam]}`;
};

const deleteRecord = async (id) => {
  if (confirm('¿Estás seguro de eliminar este registro?')) {
    await pb.collection(props.collectionId).delete(id);
    await fetchRecords();
  }
};
</script>
