<script setup lang="ts">
import { Book } from 'lucide-vue-next'

interface ChapterBlok {
	chapter_number: number;
	title: string;
	content: any; // Rich text
	author_notes: string;
}

const props = defineProps<{
  	blok: ChapterBlok
}>()

const route = useRoute()

</script>

<template>
    <div v-if="blok" v-editable="blok" class="min-h-screen bg-background">
        <main class="container max-w-prose mx-auto py-12 md:py-20 px-4 sm:px-0">

            <!-- Real Chapter Content -->
            <h1 class="text-3xl md:text-4xl font-bold text-center mb-12 font-serif tracking-tight">
                {{ blok.title || 'Sin Título' }}
            </h1>

            <div class="prose prose-lg prose-slate dark:prose-invert font-serif max-w-none leading-relaxed text-foreground/90">
                <StoryblokRichText :doc="blok.content" />
            </div>

            <Separator class="my-12" />

            <div v-if="blok.author_notes" class="bg-muted/50 rounded-lg p-6 mb-12 text-sm">
                <h4 class="font-bold mb-2 flex items-center gap-2">
                    <Book class="w-4 h-4" />
                    Notas del Autor
                </h4>
                <div class="prose prose-sm dark:prose-invert text-muted-foreground">
                    {{ blok.author_notes || 'Sin Título' }}
                </div>
            </div>

        </main>
    </div>
</template>