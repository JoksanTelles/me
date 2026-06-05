import PocketBase from 'pocketbase';

// URL del backend local. En producción será la URL del VPS (ej: https://api.joksan.dev)
export const pb = new PocketBase('http://127.0.0.1:8090');

// Deshabilitamos el autoupdate para SSR (Astro)
pb.autoCancellation(false);

// Auto-cargar cookie en el lado del cliente (navegador)
if (typeof document !== 'undefined') {
  pb.authStore.loadFromCookie(document.cookie);
}
