<template>
    <div v-if="story" class="p-4">
        <StoryblokComponent :blok="story.content" />
    </div>
    <div v-else class="p-4 text-gray-500">
        <p v-if="pending">Loading story...</p>
        <p v-else-if="error" class="text-red-500">Error loading story</p>
    </div>
</template>

<script setup>
// Fetch the 'home' story from Storyblok with draft version
// useAsyncStoryblok returns a reactive object with story, pending, and error properties
const { story, pending, error } = await useAsyncStoryblok('home', { 
  api: { version: 'draft' } 
})
</script>