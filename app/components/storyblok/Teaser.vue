<script setup>
    defineProps({ blok: Object })
</script>

<template>
    <div v-editable="blok" class="py-10 text-center">
        <h2 class="text-4xl font-bold tracking-tight">
            {{ blok.headline || "Teaser Headline" }}
        </h2>
    </div>
</template>