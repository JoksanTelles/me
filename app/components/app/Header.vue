<script setup lang="ts">
    
    const links = [
        { name: 'Historias', path: '/stories' },
        { name: 'DevLog', path: '/devlog' },
        { name: 'Portafolio', path: '/portfolio' },
        { name: 'Archivos', path: '/archives' },
    ]
</script>

<template>
    <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="container flex h-14 max-w-screen-2xl items-center">
            <MobileNav />

            <div class="mr-4 flex">
                <NuxtLink to="/" class="mr-6 flex items-center space-x-2">
                    <span class="hidden font-bold sm:inline-block">
                        Joksan.dev
                    </span>
                </NuxtLink>
                <nav class="hidden gap-6 md:flex items-center text-sm font-medium">
                    <NuxtLink
                        v-for="link in links"
                        :key="link.path"
                        :to="link.path"
                        class="transition-colors hover:text-foreground/80 text-foreground/60"
                        active-class="text-foreground"
                    >
                        {{ link.name }}
                    </NuxtLink>
                </nav>
            </div>

            <div class="flex flex-1 items-center justify-end space-x-2">
                <nav class="flex items-center">
                    <ColorModeToggle />
                </nav>
            </div>
        </div>
    </header>
</template>