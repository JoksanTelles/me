<script setup lang="ts">
const storyblokApi = useStoryblokApi()

// Fetch stories from the 'logs' folder
const { data } = await storyblokApi.get('cdn/stories', {
  version: 'draft',
  starts_with: 'logs/', // <-- Important: Must match your folder in Storyblok
  is_startpage: false,
  sort_by: 'content.date:desc' // Sort by date descending
})

const logs = data.stories
</script>

<template>
    <div class="container py-12 max-w-5xl">
        <div class="mb-10 text-center">
            <h1 class="text-3xl font-bold tracking-tight mb-2">DevLogs</h1>
            <p class="text-muted-foreground">Bitácora de desarrollo, errores cometidos y lecciones aprendidas.</p>
        </div>

        <div class="grid gap-8">
            <Card v-for="log in logs" :key="log.uuid" class="flex flex-col md:flex-row overflow-hidden hover:border-primary/50 transition-colors">
                
                <div v-if="log.content.cover?.filename" class="md:w-1/3 aspect-video md:aspect-auto bg-muted relative">
                <img 
                    :src="log.content.cover.filename + '/m/500x350'" 
                    :alt="log.content.cover.alt"
                    class="object-cover w-full h-full absolute inset-0"
                />
                </div>

                <div class="flex-1 p-6 flex flex-col justify-center">
                    <div class="mb-2 text-sm text-muted-foreground">
                        {{ new Date(log.content.date).toLocaleDateString('es-ES') }}
                    </div>
                    
                    <h2 class="text-2xl font-bold mb-3 leading-tight">
                        <NuxtLink :to="'/devlog/' + log.slug"  class="hover:underline decoration-primary underline-offset-4">
                            {{ log.content.title || log.name }}
                        </NuxtLink>
                    </h2>
                    
                    <p class="text-muted-foreground line-clamp-3 mb-4">
                        {{ log.content.intro }}
                    </p>

                    <div class="mt-auto">
                        <Button variant="link" class="px-0" as-child>
                            <NuxtLink :to="'/devlog/' + log.slug">Leer más &rarr;</NuxtLink>
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    </div>
</template>