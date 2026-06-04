<template>
  <div class="p-8 md:p-12 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <a :href="baseRoute" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2 text-muted-foreground">
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver
        </a>
        <h1 class="text-3xl font-bold tracking-tight">{{ recordId === 'new' ? 'Nuevo' : 'Editar' }} Registro</h1>
      </div>
      <button @click="save" :disabled="saving" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 gap-2">
        <span class="material-symbols-outlined text-[18px]">save</span>
        {{ saving ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>

    <div v-if="error" class="bg-destructive/15 text-destructive p-4 rounded-md text-sm font-medium border border-destructive/20 mb-6 flex items-center gap-2">
      <span class="material-symbols-outlined text-[18px]">error</span>
      {{ error }}
    </div>

    <div v-if="loading" class="text-center p-8 text-muted-foreground">Cargando datos...</div>
    
    <div v-else class="rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:p-8 space-y-6">
      <div v-for="field in visibleFields" :key="field.name" class="flex flex-col gap-2">
        <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{{ field.label || field.name }}</label>
        <p v-if="field.desc" class="text-[0.8rem] text-muted-foreground">{{ field.desc }}</p>

        <select v-if="field.type === 'relation'" v-model="formData[field.name]" class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
          <option value="">Selecciona una opción</option>
          <option v-for="opt in relationsData[field.collection] || []" :key="opt.id" :value="opt.id">
            {{ opt[field.display] || opt.id }}
          </option>
        </select>

        <input v-else-if="field.type === 'text' || field.type === 'email' || field.type === 'url'" v-model="formData[field.name]" :type="field.type" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
        
        <select v-else-if="field.type === 'select'" v-model="formData[field.name]" class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
          <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
        </select>

        <TiptapEditor v-else-if="field.type === 'tiptap'" v-model="formData[field.name]" class="min-h-[400px]" />

        <textarea v-else-if="field.type === 'text_long' || field.type === 'json'" v-model="formData[field.name]" rows="5" class="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"></textarea>

        <input v-else-if="field.type === 'number'" v-model.number="formData[field.name]" type="number" step="0.01" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
        
        <div v-else-if="field.type === 'boolean'" class="flex items-center space-x-2 rounded-md border p-4">
          <input type="checkbox" v-model="formData[field.name]" class="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 accent-primary">
          <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Activar {{ field.label || field.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminForm'
}
</script>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { pb } from '../../lib/pocketbase';
import { getCollectionConfig } from '../../lib/adminConfig';
import TiptapEditor from '../TiptapEditor.vue';

const props = defineProps({
  collectionId: String,
  recordId: String, 
  baseRoute: String,
  recordLookupField: { type: String, default: 'id' },
  fieldsFilter: { type: Array, default: () => [] }
});

const config = getCollectionConfig(props.collectionId);

const visibleFields = computed(() => {
  if (props.fieldsFilter && props.fieldsFilter.length > 0) {
    return config.fields.filter(f => props.fieldsFilter.includes(f.name));
  }
  return config.fields.filter(f => !f.hidden);
});

const formData = reactive({});
const relationsData = reactive({});
const loading = ref(true);
const saving = ref(false);
const error = ref('');
let originalId = null;

onMounted(async () => {
  config.fields.forEach(f => {
    formData[f.name] = f.type === 'boolean' ? false : (f.type === 'number' ? 0 : '');
  });

  await fetchRelations();

  if (props.recordId !== 'new') {
    try {
      let record;
      if (props.recordLookupField === 'id') {
        record = await pb.collection(props.collectionId).getOne(props.recordId);
      } else {
        record = await pb.collection(props.collectionId).getFirstListItem(`${props.recordLookupField}="${props.recordId}"`);
      }
      originalId = record.id;

      config.fields.forEach(f => {
        let val = record[f.name];
        if (f.type === 'tiptap' && val && typeof val === 'object' && val.html) {
          val = val.html;
        } else if (f.type === 'json' && typeof val === 'object') {
          val = JSON.stringify(val, null, 2);
        }
        formData[f.name] = val;
      });
    } catch(e) {
      error.value = "Registro no encontrado.";
    }
  }
  loading.value = false;
});

const fetchRelations = async () => {
  for (const field of config.fields) {
    if (field.type === 'relation' && field.collection) {
      if (!relationsData[field.collection]) {
        try {
          relationsData[field.collection] = await pb.collection(field.collection).getFullList();
        } catch(e) {}
      }
    }
  }
};

const save = async () => {
  saving.value = true;
  error.value = '';
  
  try {
    const payload = { ...formData };
    
    config.fields.forEach(f => {
      if (f.type === 'tiptap' && payload[f.name]) {
        payload[f.name] = { html: payload[f.name] };
      } else if (f.type === 'json' && payload[f.name]) {
        try { payload[f.name] = JSON.parse(payload[f.name]); } catch(e){}
      }
      if (f.name === 'password' && !payload[f.name]) {
        delete payload.password;
      }
    });

    if (props.collectionId === 'users' && payload.password) {
      payload.passwordConfirm = payload.password;
    }

    if (props.recordId === 'new') {
      await pb.collection(props.collectionId).create(payload);
      window.location.href = props.baseRoute;
    } else {
      await pb.collection(props.collectionId).update(originalId, payload);
      window.location.href = props.baseRoute;
    }
  } catch(e) {
    console.error(e);
    let details = '';
    if (e.response && e.response.data) {
      details = ' Detalles: ' + JSON.stringify(e.response.data);
    }
    error.value = (e.message || "Error al guardar. Revisa los campos requeridos.") + details;
  } finally {
    saving.value = false;
  }
};
</script>
<!-- Volar trigger -->
