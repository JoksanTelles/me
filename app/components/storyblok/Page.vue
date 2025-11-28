<template>
    <div v-editable="blok" class="container mx-auto px-4 py-8">
        <StoryblokComponent
            v-for="blok in blok.body"
            :key="blok._uid"
            :blok="blok"
        />
    </div>
</template>

<script setup>
    defineProps({ blok: Object })
</script>