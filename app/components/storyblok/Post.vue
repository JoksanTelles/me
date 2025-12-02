<script setup lang="ts">
    import { Clock, Calendar } from 'lucide-vue-next'

    defineProps({ blok: Object })

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
    <div v-editable="blok" class="container max-w-3xl py-12">
        <header class="mb-10 text-center space-y-4">
            <div class="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar class="w-4 h-4" />
                <time>{{ formatDate(blok.date) }}</time>
            </div>

            <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">
                {{ blok.title || 'DevLog Sin Título' }}
            </h1>

            <p v-if="blok.intro" class="text-xl text-muted-foreground max-w-2xl mx-auto">
                {{ blok.intro }}
            </p>
        </header>

        <div v-if="blok.cover?.filename" class="mb-10 overflow-hidden rounded-xl border bg-muted shadow-sm">
            <img 
                :src="blok.cover.filename + '/m/1200x600'" 
                :alt="blok.cover.alt"
                class="w-full h-auto object-cover"
            />
        </div>

        <article class="prose prose-slate dark:prose-invert max-w-none prose-img:rounded-lg prose-headings:font-bold prose-a:text-primary">
            <StoryblokRichText :doc="blok.content" />
        </article>
    </div>
</template>