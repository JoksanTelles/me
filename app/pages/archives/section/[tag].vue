<script setup lang="ts">
import { Folder, ArrowLeft, Hash } from 'lucide-vue-next'
import { useRoute, useStoryblokApi, computed } from '#imports'

const route = useRoute()
const currentTag = route.params.tag as string
const storyblokApi = useStoryblokApi()

// 1. Obtenemos TODO para poder armar el sidebar igual (necesitamos saber qué otros tags existen)
const { data } = await storyblokApi.get('cdn/stories', {
version: 'draft',
starts_with: 'archives/',
is_startpage: false,
sort_by: 'content.date:desc'
})

const allArchives = data.stories

// 2. Extraer Tags (Misma lógica para el Sidebar)
const sections = computed(() => {
const tagsSet = new Set<string>()
allArchives.forEach((story: any) => {
	const itemTags = story.content.tags || [] 
	const tagsArray = Array.isArray(itemTags) ? itemTags : [itemTags]
	tagsArray.forEach((t: string) => { if(t) tagsSet.add(t) })
})
return Array.from(tagsSet).sort()
})

// 3. Filtrar los artículos que coinciden con el tag actual
const filteredArchives = computed(() => {
return allArchives.filter((story: any) => {
	const itemTags = story.content.tags || []
	const tagsArray = Array.isArray(itemTags) ? itemTags : [itemTags]
	return tagsArray.includes(currentTag)
})
})
</script>

<template>
	<div class="container py-10">
		<div class="mb-10 border-b pb-6">
		<div class="flex items-center gap-2 mb-2">
			<NuxtLink to="/archives" class="text-muted-foreground hover:text-primary transition-colors">
			<ArrowLeft class="w-6 h-6" />
			</NuxtLink>
			<h1 class="text-3xl font-bold tracking-tight capitalize">
			Sección: <span class="text-primary">{{ currentTag }}</span>
			</h1>
		</div>
		<p class="text-muted-foreground">Mostrando {{ filteredArchives.length }} publicaciones etiquetadas.</p>
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
					class="flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
				>
					<span>Todo</span>
					<span class="text-xs text-muted-foreground">{{ allArchives.length }}</span>
				</NuxtLink>

				<NuxtLink 
					v-for="tag in sections" 
					:key="tag"
					:to="`/archives/section/${tag}`" 
					class="flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors capitalize"
					:class="tag === currentTag ? 'bg-muted text-primary font-medium' : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'"
				>
					<span>{{ tag }}</span>
					</NuxtLink>
				</nav>
			</div>
			</div>
		</aside>

		<div class="md:col-span-3 grid gap-4 content-start">
			<NuxtLink 
			v-for="archive in filteredArchives" 
			:key="archive.uuid"
			:to="`/${archive.full_slug}`"
			class="block group"
			>
			<Card class="hover:border-primary/50 transition-all hover:shadow-sm">
				<CardHeader>
				<div class="flex justify-between items-start gap-4">
					<div class="space-y-2">
					<CardTitle class="text-lg group-hover:text-primary transition-colors">
						{{ archive.content.title }}
					</CardTitle>
					<CardDescription class="line-clamp-2">
						{{ archive.content.intro }}
					</CardDescription>
					
					<div class="flex gap-2 mt-2">
						<span v-for="tag in archive.content.tags" :key="tag" 
						class="inline-flex items-center text-xs px-2 py-0.5 rounded transition-colors"
						:class="tag === currentTag ? 'bg-primary/10 text-primary font-medium' : 'bg-muted text-muted-foreground'"
						>
						<Hash class="w-3 h-3 mr-1 opacity-50" />
						{{ tag }}
						</span>
					</div>
					</div>
				</div>
				</CardHeader>
			</Card>
			</NuxtLink>
			
			<div v-if="filteredArchives.length === 0" class="text-center py-10 text-muted-foreground">
			No hay artículos en esta sección.
			</div>
		</div>
		</div>
	</div>
</template>