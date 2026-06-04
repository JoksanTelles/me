import { defineMiddleware } from 'astro:middleware';
import { pb } from './lib/pocketbase';

export const onRequest = defineMiddleware((context, next) => {
  if (context.url.pathname.startsWith('/admin') && !context.url.pathname.startsWith('/admin/login')) {
    pb.authStore.loadFromCookie(context.request.headers.get('cookie') || '');
    const model = pb.authStore.model || pb.authStore.record || (pb.authStore as any).admin;
    const isSuper = (pb.authStore as any).isAdmin || (pb.authStore as any).isSuperuser || (model && model.email === 'admin@joksan.dev');
    
    if (!pb.authStore.isValid || !isSuper) {
      return context.redirect('/admin/login');
    }
  }
  return next();
});
