<script setup lang="ts">
    const storyblokApi = useStoryblokApi()

    // Pedimos todas las historias que empiecen con 'projects/'
    // Excluimos la carpeta raíz si existiera, queremos los items.
    const { data } = await storyblokApi.get('cdn/stories', {
        version: 'draft', // Cambiar a 'published' en producción
        starts_with: 'projects/',
        is_startpage: false // Evita traer la carpeta en sí, solo hijos
    })

    const projects = data.stories
</script>

<template>
    <div class="container py-10">
        <div class="mb-8 space-y-2">
            <h1 class="text-3xl font-bold tracking-tight">Portafolio</h1>
            <p class="text-muted-foreground">Una selección de mis trabajos y experimentos más recientes.</p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card v-for="project in projects" :key="project.uuid" class="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <div class="aspect-video w-full overflow-hidden bg-muted relative">
                    <img 
                        v-if="project.content.cover?.filename"
                        :src="project.content.cover.filename + '/m/800x600'" 
                        :alt="project.content.cover.alt"
                        class="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
                    />
                    <div v-else class="flex items-center justify-center h-full text-muted-foreground">
                        Sin imagen
                    </div>
                </div>

                <CardHeader>
                    <div class="space-y-1">
                        <CardTitle class="line-clamp-1">
                            <NuxtLink :to="'/p/' + project.slug" class="hover:underline">
                                {{ project.content.title || project.name }}
                            </NuxtLink>
                        </CardTitle>
                        <CardDescription class="line-clamp-2">
                            {{ project.content.summary }}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent class="mt-auto pt-0">
                    <div class="flex flex-wrap gap-2">
                        <Badge v-for="tag in project.content.tags?.slice(0,3)" :key="tag" variant="outline" class="text-xs">
                            {{ tag }}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>