<script setup lang="ts">
import { Folder, Hash, ArrowRight } from 'lucide-vue-next'

interface StoryblokStory {
  name: string
  uuid: string
  full_slug: string
  content: Record<string, any>
}

const storyblokApi = useStoryblokApi()

// 1. Obtener TODOS los archivos (flat)
// Pedimos 'starts_with: archives/' para obtener todo lo que esté en esa carpeta
const { data } = await storyblokApi.get('cdn/stories', {
  version: 'draft',
  starts_with: 'archives/',
  is_startpage: false, 
  sort_by: 'content.date:desc'
})

const allArchives = data.stories

const processedArchives = computed(() => {
    if (!allArchives) return []
    return allArchives.map((story: StoryblokStory) => ({
        ...story,
        content: {
            ...story.content,
            name: story.name
        }
    }))
})

// 2. Extraer Tags Únicos (Secciones) dinámicamente
// Recorremos todos los artículos y colectamos sus tags
const sections = computed(() => {
const tagsSet = new Set<string>()

allArchives.forEach((story: any) => {
    // Asumimos que 'tags' es un array de strings en el content type
    // Si usaste el sistema de tags nativo de storyblok, sería story.tag_list
    const itemTags = story.content.tags || [] 
    
    // Si es un string (algunos campos tag lo guardan así), lo convertimos
    const tagsArray = Array.isArray(itemTags) ? itemTags : [itemTags]
    
    tagsArray.forEach((t: string) => {
    if(t) tagsSet.add(t)
    })
})

return Array.from(tagsSet).sort()
})
</script>

<template>
    <div class="container py-10">
        <div class="mb-10 border-b pb-6">
        <h1 class="text-3xl font-bold tracking-tight mb-2">Archivero</h1>
        <p class="text-muted-foreground">Digital Garden. Colección completa de aprendizajes y notas.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <aside class="md:col-span-1">
            <div class="sticky top-24 space-y-6">
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                <h3 class="font-semibold mb-4 flex items-center gap-2">
                <Folder class="w-4 h-4" />
                Secciones
                </h3>
                
                <nav class="flex flex-col space-y-1">
                <NuxtLink 
                    to="/archives" 
                    class="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium bg-muted text-primary"
                >
                    <span>Todo</span>
                    <span class="text-xs text-muted-foreground">{{ processedArchives.length }}</span>
                </NuxtLink>

                <NuxtLink 
                    v-for="tag in sections" 
                    :key="tag"
                    :to="`/archives/section/${tag}`" 
                    class="flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-muted/50 transition-colors capitalize text-muted-foreground hover:text-foreground"
                >
                    <span>{{ tag }}</span>
                </NuxtLink>
                </nav>
            </div>
            </div>
        </aside>

        <div class="md:col-span-3 grid gap-4 content-start">
            <NuxtLink 
            v-for="archive in processedArchives" 
            :key="archive.uuid"
            :to="`/${archive.full_slug}`"
            class="block group"
            >
            <Card class="hover:border-primary/50 transition-all hover:shadow-sm">
                <CardHeader>
                <div class="flex justify-between items-start gap-4">
                    <div class="space-y-2">
                    <CardTitle class="text-lg group-hover:text-primary transition-colors">
                        {{ archive.content.name }}
                    </CardTitle>
                    <CardDescription class="line-clamp-2">
                        {{ archive.content.intro }}
                    </CardDescription>
                    
                    <div class="flex gap-2 mt-2">
                        <span v-for="tag in archive.content.tags" :key="tag" class="inline-flex items-center text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        <Hash class="w-3 h-3 mr-1 opacity-50" />
                        {{ tag }}
                        </span>
                    </div>
                    </div>
                    
                    <ArrowRight class="w-5 h-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                </CardHeader>
            </Card>
            </NuxtLink>
        </div>
        </div>
    </div>
</template>