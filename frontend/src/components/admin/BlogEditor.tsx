import React, { useState, useEffect } from 'react';
import { pb } from '../../lib/pocketbase';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TiptapReact } from './TiptapReact';

export function BlogEditor({ recordId }: { recordId: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [post, setPost] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft'
  });

  useEffect(() => {
    pb.authStore.loadFromCookie(document.cookie);
    if (recordId !== 'new') {
      pb.collection('blog').getOne(recordId)
        .then(record => {
          setPost({
            title: record.title || '',
            slug: record.slug || '',
            content: record.content?.html || record.content || '',
            status: record.status || 'draft'
          });
          setLoading(false);
        })
        .catch(err => {
          setError('No se pudo cargar el artículo.');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [recordId]);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: post.title,
        slug: post.slug,
        content: { html: post.content },
        status: post.status
      };

      if (recordId === 'new') {
        await pb.collection('blog').create(payload);
      } else {
        await pb.collection('blog').update(recordId, payload);
      }
      window.location.href = '/admin/blog';
    } catch(err: any) {
      console.error(err);
      setError(err.message || 'Error al guardar el artículo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-stone-500">Cargando...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-title text-rose-950">
          {recordId === 'new' ? 'Nuevo Artículo' : 'Editar Artículo'}
        </h1>
        <Button onClick={save} disabled={saving} className="bg-rose-600 hover:bg-rose-700 text-white">
          {saving ? 'Guardando...' : 'Guardar Artículo'}
        </Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">{error}</div>}

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Título del Artículo</Label>
            <Input value={post.title} onChange={e => setPost({...post, title: e.target.value})} placeholder="Ej. 10 Tips de Diseño Web" />
          </div>
          <div className="space-y-2">
            <Label>URL Slug</Label>
            <Input value={post.slug} onChange={e => setPost({...post, slug: e.target.value})} placeholder="ej-10-tips-diseno-web" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select value={post.status} onValueChange={v => setPost({...post, status: v})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Contenido</Label>
          <div className="border border-stone-200 rounded-xl overflow-hidden min-h-[400px]">
            <TiptapReact value={post.content} onChange={v => setPost({...post, content: v})} />
          </div>
        </div>
      </div>
    </div>
  );
}
