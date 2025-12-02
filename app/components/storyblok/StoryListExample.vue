<script setup lang="ts">
import { ref } from 'vue'
import { BookOpen } from 'lucide-vue-next'

// Mock story data structure (simplified from what index.vue expects)
interface MockStory {
    uuid: string;
    full_slug: string;
    content: {
        cover?: {
            filename: string;
            alt: string;
        };
        title: string;
        status?: string;
        genres?: string[];
    };
}

const mockStories = ref<MockStory[]>([
    {
        uuid: 'mock-story-1-uuid',
        full_slug: '/mock-story-example',
        content: {
            cover: {
                filename: 'https://a.storyblok.com/f/100000/600x900/mockcover1.jpg', // Placeholder image
                alt: 'Ejemplo de Portada'
            },
            title: 'La Aventura del Caballero Valiente (Ejemplo)',
            status: 'Ongoing',
            genres: ['Fantasía', 'Aventura']
        }
    },
    {
        uuid: 'mock-story-2-uuid',
        full_slug: '/another-mock-story',
        content: {
            title: 'El Misterio del Bosque Encantado (Ejemplo)',
            status: 'Completed',
            genres: ['Misterio', 'Fantasía']
        }
    }
])
</script>

<template>
    <div class="container py-12">
        <h2 class="text-3xl font-bold tracking-tight font-serif mb-8 text-center">Listado de Historias de Prueba (Ejemplo)</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            <NuxtLink
                v-for="story in mockStories"
                :key="story.uuid"
                :to="story.full_slug"
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
                        <span class="text-4xl text-muted-foreground">📚</span>
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
    </div>
</template>
