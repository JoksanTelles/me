<script setup lang="ts">
    import { Calendar, ChevronRight, Hash } from 'lucide-vue-next'
    import { Badge } from '~/components/ui/badge'

    interface Blok {
    title: string;
    date: string;
    tags: string[];
    intro: string;
    content: any;
    cover?: {
        filename: string;
        alt: string;
    };
    }

    defineProps<{
    blok: Blok
    }>()

    const formatDate = (dateStr: string) => {
        if (!dateStr) return ''
        return new Date(dateStr).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }
</script>

<template>
    <div v-editable="blok" class="container max-w-3xl py-10">
        <nav class="flex items-center text-sm text-muted-foreground mb-6 space-x-1">
            <NuxtLink to="/archives" class="hover:text-primary transition-colors">Archivos</NuxtLink>
            <ChevronRight class="w-4 h-4" />
            <span class="font-medium text-foreground truncate">{{ blok.title }}</span>
        </nav>

        <header class="mb-8 border-b pb-8">
        <div class="flex flex-wrap items-center gap-4 mb-4 text-sm">
            <div class="flex items-center gap-1 text-muted-foreground">
            <Calendar class="w-4 h-4" />
            <span>{{ formatDate(blok.date) }}</span>
            </div>
            
            <div v-if="blok.tags" class="flex gap-2">
                <NuxtLink 
                    v-for="tag in blok.tags" 
                    :key="tag" 
                    :to="`/archives/section/${tag}`"
                >
                    <Badge variant="secondary" class="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer flex items-center gap-1">
                        <Hash class="w-3 h-3" />
                        {{ tag }}
                    </Badge>
                </NuxtLink>
            </div>
        </div>

        <h1 class="text-3xl font-bold tracking-tight mb-4">
            {{ blok.title }}
        </h1>

        <p v-if="blok.intro" class="text-lg text-muted-foreground leading-relaxed">
            {{ blok.intro }}
        </p>
        </header>

        <div v-if="blok.cover?.filename" class="my-8 overflow-hidden rounded-xl border bg-card shadow-sm aspect-video">
            <img 
                :src="blok.cover.filename + '/m/1200x600/smart'" 
                :alt="blok.cover.alt"
                class="w-full h-full object-cover"
            />
        </div>

        <div class="prose prose-slate dark:prose-invert max-w-none">
            <StoryblokRichText :doc="blok.content" />
        </div>
    </div>
</template>