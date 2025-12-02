<script setup lang="ts">
import { BookOpen, Clock, List } from 'lucide-vue-next'

interface StoryBlok {
    cover?: {
        filename: string;
        alt: string;
    };
    title: string;
    status?: 'Draft' | 'Ongoing' | 'Completed';
    genres?: string[];
    synopsis?: any; // Rich text field
    chapters?: string[];
}

const props = defineProps<{
  blok: StoryBlok
}>()
const route = useRoute()
const storyblokApi = useStoryblokApi()

const version = computed(() => route.query._storyblok ? 'draft' : 'published')

// Estado para los capítulos
const chapters = ref<any[]>([])

// Fetch de capítulos a través de las referencias en el blok
const fetchChapters = async () => {
  if (!props.blok.chapters || props.blok.chapters.length === 0) {
    chapters.value = []
    return
  }

  const { data } = await storyblokApi.get('cdn/stories', {
    version: version.value,
    by_uuids: props.blok.chapters.join(','),
    sort_by: 'content.chapter_number:asc'
  })

  chapters.value = data.stories
}

// Ejecutamos el fetch en el servidor y cliente
await fetchChapters()

// Helpers visuales
const statusColors = {
    Draft: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Ongoing: 'bg-green-500/10 text-green-500 border-green-500/20',
    Completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
}
</script>

<template>
    <div v-editable="blok" class="container py-10 md:py-16">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        
        <div class="md:col-span-4 lg:col-span-3 space-y-6">
            <div class="aspect-[2/3] w-full overflow-hidden rounded-lg border bg-muted shadow-xl relative group">
            <img 
                v-if="blok.cover?.filename"
                :src="blok.cover.filename + '/m/600x900'" 
                :alt="blok.title"
                class="object-cover w-full h-full"
            />
            <div v-else class="flex items-center justify-center h-full bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                <BookOpen class="w-12 h-12 opacity-20" />
            </div>
            </div>

            <Button v-if="chapters.length > 0" class="w-full" size="lg" as-child>
            <NuxtLink :to="`/${chapters[0].full_slug}`">
                <BookOpen class="w-4 h-4 mr-2" />
                Leer Primer Capítulo
            </NuxtLink>
            </Button>

            <div class="space-y-4 text-sm">
            <div v-if="blok.status" class="flex justify-between items-center py-2 border-b">
                <span class="text-muted-foreground">Estado</span>
                <Badge variant="outline" :class="statusColors[blok.status] || ''">
                {{ blok.status }}
                </Badge>
            </div>
            <div v-if="blok.genres" class="space-y-2">
                <span class="text-muted-foreground block">Géneros</span>
                <div class="flex flex-wrap gap-1">
                <Badge v-for="g in blok.genres" :key="g" variant="secondary">{{ g }}</Badge>
                </div>
            </div>
            </div>
        </div>

        <div class="md:col-span-8 lg:col-span-9 space-y-10">
            <div>
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-serif">
                {{ blok.title }}
            </h1>
            <div class="prose prose-lg dark:prose-invert text-muted-foreground">
                <StoryblokRichText :doc="blok.synopsis" />
            </div>
            </div>

            <Separator />

            <div class="space-y-6">
            <h2 class="text-2xl font-bold flex items-center gap-2">
                <List class="w-6 h-6" />
                Índice de Capítulos
            </h2>

            <div v-if="chapters.length > 0" class="grid gap-2">
                <NuxtLink 
                v-for="chapter in chapters" 
                :key="chapter.uuid"
                :to="`/${chapter.full_slug}`"
                class="group flex items-center justify-between p-4 rounded-lg border bg-card hover:border-primary/50 hover:bg-muted/50 transition-all"
                >
                <div class="flex items-center gap-4">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {{ chapter.content.chapter_number }}
                    </div>
                    <span class="font-medium group-hover:text-primary transition-colors">
                    {{ chapter.content.title }}
                    </span>
                </div>
                <span class="text-xs text-muted-foreground hidden sm:inline-block">
                    Leer &rarr;
                </span>
                </NuxtLink>
            </div>
            <div v-else class="text-center py-10 text-muted-foreground bg-muted/30 rounded-lg">
                No hay capítulos publicados aún.
            </div>
            </div>
        </div>
        </div>
    </div>
</template>