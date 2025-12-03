<script setup lang="ts">
const storyblok = useStoryblokApi()

console.log("Iniciando la carga de historias desde Storyblok...");

const { data: stories, pending, error } = await useAsyncData('stories', async () => {
  try {
    const { data } = await storyblok.get('cdn/stories', {
      // IMPORTANTE: Si tus historias no aparecen, prueba a cambiar 'draft' por 'published'
      // O si estás seguro de que están en draft, verifica el content_type en Storyblok.
      version: 'draft', 
      content_type: 'stories', // Asegúrate que este sea el content_type correcto de tus historias en Storyblok
      sort_by: 'created_at:desc'
    });
    console.log('Respuesta completa de la API de Storyblok (data):', data);
    return data.stories;
  } catch (e) {
    console.error('Ocurrió un error al intentar obtener las historias:', e);
    return null; // Retornar null para indicar un fallo
  }
});

// Logs para depuración
if (error.value) {
  console.error('Error capturado por useAsyncData:', error.value);
}

console.log('Datos finales de `stories`:', stories.value);

if (!stories.value) {
    console.log("La variable `stories` es nula. Esto probablemente se deba a un error durante la obtención de datos. Revisa la consola para más detalles.");
} else if (stories.value.length === 0) {
    console.log("La variable `stories` es un arreglo vacío. Verifica que tengas historias con el content_type 'story' en tu espacio de Storyblok, y que estén en la versión 'draft'.");
}
</script>

<template>
    <div class="container py-12">
        <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h1 class="text-4xl font-bold tracking-tight font-serif">Biblioteca</h1>
            <p class="text-muted-foreground text-lg">
                Colección de historias originales, novelas y experimentos narrativos.
            </p>
        </div>

        <h2 class="text-3xl font-bold tracking-tight font-serif mb-8 mt-12 text-center">Tus Historias de Storyblok</h2>
        <div v-if="stories && stories.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            <NuxtLink
                v-for="story in stories"
                :key="story.uuid"
                :to="`/${story.full_slug}`"
                class="group space-y-3"
            >
                <div class="aspect-[2/3] overflow-hidden rounded-md border bg-muted shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 relative">
                <img
                    v-if="story.content.cover?.filename"
                    :src="story.content.cover.filename + '/m/400x600'"
                    :alt="story.content.title"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div v-else class="h-full w-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <span class="text-4xl">📚</span>
                </div>

                <div v-if="story.content.status" class="absolute top-2 right-2">
                    <Badge variant="secondary" class="shadow-sm backdrop-blur-md bg-background/80">
                    {{ story.content.status }}
                    </Badge>
                </div>
                </div>

                <div class="space-y-1">
                <h3 class="font-bold leading-tight group-hover:text-primary transition-colors">
                    {{ story.content.title }}
                </h3>
                <div class="flex flex-wrap gap-1">
                    <span v-for="g in story.content.genres?.slice(0, 2)" :key="g" class="text-xs text-muted-foreground">
                    {{ g }}
                    </span>
                </div>
                </div>
            </NuxtLink>
        </div>
        <div v-else class="p-4 text-gray-500 text-center">
            <p>No se encontraron historias de Storyblok.</p>
            <p class="mt-2">Por favor, verifica lo siguiente:</p>
            <ul class="list-disc list-inside text-left mx-auto max-w-sm mt-2">
                <li>Asegúrate de que tienes historias creadas en tu espacio de Storyblok.</li>
                <li>Verifica que el `content_type` en `index.vue` (`'story'`) coincide con el tipo de contenido de tus historias en Storyblok.</li>
                <li>Intenta cambiar `version: 'draft'` a `version: 'published'` en `index.vue` para ver si tus historias publicadas aparecen.</li>
                <li>Revisa la consola del navegador y la del servidor Nuxt.js para errores adicionales.</li>
            </ul>
            <p v-if="pending" class="mt-4">Cargando historias...</p>
            <p v-if="error" class="mt-4">Error al cargar historias: {{ error?.message }}</p>
        </div>
    </div>
</template>