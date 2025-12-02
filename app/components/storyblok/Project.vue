<script setup lang="ts">
    import { Calendar } from 'lucide-vue-next'

    defineProps({ blok: Object })

    // Función simple para formatear fecha
    const formatDate = (dateStr: string) => {
        if (!dateStr) return ''
        return new Date(dateStr).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
</script>

<template>
    <div v-editable="blok" class="container max-w-4xl py-10 space-y-8">
        <div class="space-y-4">
            <div class="flex items-center gap-2 text-muted-foreground">
                <Calendar class="w-4 h-4" />
                <span class="text-sm">{{ formatDate(blok.date) }}</span>
            </div>
        
            <h1 class="text-4xl font-bold tracking-tight lg:text-5xl">
                {{ blok.title || 'Sin Título' }} 
            </h1>

            <div v-if="blok.tags" class="flex flex-wrap gap-2">
                <Badge v-for="tag in blok.tags" :key="tag" variant="secondary">
                {{ tag }}
                </Badge>
            </div>
        </div>

        <div v-if="blok.cover?.filename" class="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <img 
                :src="blok.cover.filename" 
                :alt="blok.cover.alt || blok.title"
                class="object-cover w-full h-full"
            />
        </div>

        <p v-if="blok.summary" class="text-xl text-muted-foreground leading-relaxed">
            {{ blok.summary }}
        </p>

        <Separator class="my-8" />

        <div class="prose prose-slate dark:prose-invert max-w-none">
            <StoryblokRichText :doc="blok.content" />
        </div>
    </div>
</template>