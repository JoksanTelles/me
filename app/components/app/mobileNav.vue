<script setup lang="ts">
    import { Menu, BookOpen, Laptop, Briefcase, Archive } from 'lucide-vue-next'

    // Definimos los enlaces aquí para reusarlos
    const links = [
        { name: 'Inicio', path: '/', icon: Laptop },
        { name: 'Historias', path: '/s', icon: BookOpen },
        { name: 'DevLogs', path: '/devlog', icon: Laptop }, // Icono temporal
        { name: 'Portafolio', path: '/portfolio', icon: Briefcase },
        { name: 'Archivos', path: '/archives', icon: Archive },
    ]

    const open = ref(false)
</script>

<template>
    <Sheet v-model:open="open">
        <SheetTrigger as-child>
            <Button variant="ghost" size="icon" class="md:hidden">
                <Menu class="h-5 w-5" />
                <span class="sr-only">Menú</span>
            </Button>
        </SheetTrigger>
        <SheetContent side="left">
            <SheetHeader>
                <SheetTitle class="text-left text-lg font-bold">Joksan.dev</SheetTitle>
                <SheetDescription class="sr-only">
                    Menú de navegación principal
                </SheetDescription>
            </SheetHeader>
            <div class="flex flex-col space-y-4 py-4">
                <NuxtLink
                    v-for="link in links"
                    :key="link.path"
                    :to="link.path"
                    class="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                    @click="open = false"
                >
                <component :is="link.icon" class="h-4 w-4" />
                    {{ link.name }}
                </NuxtLink>
            </div>
        </SheetContent>
    </Sheet>
</template>