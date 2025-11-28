<template>
    <div v-editable="blok" class="py-10 text-center">
        <h2 class="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {{ blok.headline }}
        </h2>
    </div>
</template>

<script setup>
    defineProps({ blok: Object })
</script>