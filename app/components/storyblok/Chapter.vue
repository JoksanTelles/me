<script setup lang="ts">
import { ArrowLeft, ArrowRight, Book, List } from 'lucide-vue-next'

interface ChapterBlok {
  chapter_number: number;
  title: string;
  content: any; // Rich text
  author_notes?: any; // text
}

const props = defineProps<{
  blok: ChapterBlok
}>()
const route = useRoute()
const storyblokApi = useStoryblokApi()

const version = computed(() => route.query._storyblok ? 'draft' : 'published')

// Estado para navegación
const navigation = ref<{ prev: any; next: any; index: number | null; parent: any }>({ prev: null, next: null, index: null, parent: null })

// Lógica para encontrar capítulo anterior/siguiente
const fetchNavigation = async () => {
  const storySlug = route.params.slug as string;
  if (!storySlug) return;

  // 1. Fetch the parent story to get the list of chapters
  const { data: storyData } = await storyblokApi.get(`cdn/stories/stories/${storySlug}`, { version: version.value });
  
  navigation.value.parent = storyData.story;
  const chapterUuids = storyData.story.content.chapters;

  if (!chapterUuids || chapterUuids.length === 0) return;

  // 2. Fetch all chapters of this story by their UUIDs
  const { data: chaptersData } = await storyblokApi.get('cdn/stories', {
    version: version.value,
    by_uuids: chapterUuids.join(','),
    sort_by: 'content.chapter_number:asc'
  });

  const chapters = chaptersData.stories;

  // 3. Find current chapter to set prev/next
  const currentPath = route.path.replace(/^\//, '')
  const currentIndex = chapters.findIndex((c: any) => c.full_slug === currentPath)

  if (currentIndex !== -1) {
    navigation.value.index = currentIndex
    navigation.value.prev = chapters[currentIndex - 1] || null
    navigation.value.next = chapters[currentIndex + 1] || null
  }
}

await fetchNavigation()
</script>

<template>
    <div v-if="blok" v-editable="blok" class="min-h-screen bg-background">
        
        <header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="container max-w-prose mx-auto h-14 flex items-center justify-between">
            <NuxtLink 
            :to="`/stories/${route.params.slug}`" 
            class="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
            >
            <ArrowLeft class="w-4 h-4" />
            <span v-if="navigation.parent" class="hidden sm:inline">{{ navigation.parent.content.title }}</span>
            <span v-else class="hidden sm:inline">Volver al Índice</span>
            </NuxtLink>
            
            <span class="text-sm font-semibold truncate max-w-[150px] sm:max-w-xs">
            Capítulo {{ blok.chapter_number }}
            </span>

            <div class="w-8"></div> 
        </div>
        </header>

        <main class="container max-w-prose mx-auto py-12 md:py-20 px-4 sm:px-0">
        
        <h1 class="text-3xl md:text-4xl font-bold text-center mb-12 font-serif tracking-tight">
            {{ blok.title }}
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
            <StoryblokRichText :doc="blok.author_notes" />
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-8">
            <Button 
                v-if="navigation.prev" 
                variant="outline" 
                class="h-auto py-4 flex flex-col items-start gap-1 text-left"
                as-child
            >
            <NuxtLink :to="`/${navigation.prev.full_slug}`">
                <span class="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowLeft class="w-3 h-3" /> Anterior
                </span>
                <span class="font-semibold line-clamp-1">{{ navigation.prev.content.title }}</span>
            </NuxtLink>
            </Button>
            <div v-else></div> <Button 
            v-if="navigation.next" 
            class="h-auto py-4 flex flex-col items-end gap-1 text-right"
            as-child
            >
            <NuxtLink :to="`/${navigation.next.full_slug}`">
                <span class="text-xs text-primary-foreground/80 flex items-center gap-1">
                Siguiente <ArrowRight class="w-3 h-3" />
                </span>
                <span class="font-semibold line-clamp-1">{{ navigation.next.content.title }}</span>
            </NuxtLink>
            </Button>

            <Button 
            v-else 
            variant="secondary"
            class="h-auto py-4"
            as-child
            >
            <NuxtLink :to="`/stories/${route.params.slug}`">
                <List class="w-4 h-4 mr-2" />
                <span v-if="navigation.parent">{{ navigation.parent.content.title }}</span>
                <span v-else>Volver al Índice</span>
            </NuxtLink>
            </Button>
        </div>

        </main>
    </div>
</template>