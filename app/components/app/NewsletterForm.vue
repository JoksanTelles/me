<script setup lang="ts">
import { ref } from 'vue'
import { Loader2, Mail } from 'lucide-vue-next'
import { toast } from 'vue-sonner' // Importamos la función toast directamente

const email = ref('')
const loading = ref(false)

const subscribe = async () => {
    if (!email.value) return
    
    loading.value = true

    try {
        await $fetch('/api/subscribe', {
        method: 'POST',
        body: { email: email.value }
        })
        
        // Éxito: Limpiamos y mostramos Toast verde
        email.value = ''
        toast.success('¡Suscripción exitosa!', {
        description: 'Gracias por unirte a la comunidad.',
        })
        
    } catch (error: any) {
        // Error: Mostramos Toast rojo
        toast.error('Error al suscribirse', {
        description: 'Por favor, verifica tu email o inténtalo más tarde.',
        })
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="w-full max-w-sm space-y-2">
        <form @submit.prevent="subscribe" class="flex gap-2">
        <div class="relative flex-1">
            <Mail class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
            v-model="email" 
            type="email" 
            placeholder="tu@email.com" 
            class="pl-9"
            required
            :disabled="loading"
            />
        </div>
        <Button type="submit" :disabled="loading">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? '...' : 'Suscribir' }}
        </Button>
        </form>
        </div>
</template>