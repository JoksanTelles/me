<script setup lang="ts">
import Header from '~/components/app/Header.vue'
import Footer from '~/components/app/Footer.vue'
</script>

<template>
    <div class="relative flex min-h-screen flex-col bg-background text-foreground font-sans text-foreground antialiased">
        <Header />
        <main class="flex-1">
        <slot />
        </main>
        <Footer />
    </div>
</template>