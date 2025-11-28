<template>
    <div v-editable="blok" class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">
            {{ blok.name }}
        </h3>
    </div>
</template>

<script setup>
    defineProps({ blok: Object })
</script>