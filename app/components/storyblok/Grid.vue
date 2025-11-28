<template>
    <div v-editable="blok" class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StoryblokComponent
            v-for="blok in blok.columns"
            :key="blok._uid"
            :blok="blok"
        />
    </div>
</template>

<script setup>
    defineProps({ blok: Object })
</script>