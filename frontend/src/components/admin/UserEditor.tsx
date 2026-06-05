import React, { useState, useEffect } from 'react';
import { pb } from '../../lib/pocketbase';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

export function UserEditor({ username }: { username: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    email: '',
    name: '',
    password: '',
    passwordConfirm: ''
  });

  useEffect(() => {
    pb.authStore.loadFromCookie(document.cookie);
    if (username !== 'new') {
      pb.collection('users').getFirstListItem(`username="${username}"`)
        .then(record => {
          setUserData({
            id: record.id,
            username: record.username || '',
            email: record.email || '',
            name: record.name || '',
            password: '',
            passwordConfirm: ''
          });
          setLoading(false);
        })
        .catch(err => {
          setError('No se pudo cargar el usuario.');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [username]);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const payload: any = {
        username: userData.username,
        email: userData.email,
        name: userData.name,
      };

      if (userData.password) {
        payload.password = userData.password;
        payload.passwordConfirm = userData.passwordConfirm;
      }

      if (username === 'new') {
        await pb.collection('users').create(payload);
      } else {
        await pb.collection('users').update(userData.id, payload);
      }
      window.location.href = '/admin/usuarios';
    } catch(err: any) {
      console.error(err);
      setError(err.message || 'Error al guardar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-stone-500">Cargando...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-title text-rose-950">
          {username === 'new' ? 'Nuevo Usuario' : `Editar Usuario`}
        </h1>
        <Button onClick={save} disabled={saving} className="bg-rose-600 hover:bg-rose-700 text-white">
          {saving ? 'Guardando...' : 'Guardar Usuario'}
        </Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">{error}</div>}

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Nombre de Usuario</Label>
            <Input value={userData.username} onChange={e => setUserData({...userData, username: e.target.value})} placeholder="joksan" />
          </div>
          <div className="space-y-2">
            <Label>Correo Electrónico</Label>
            <Input type="email" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} placeholder="correo@ejemplo.com" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Nombre Completo</Label>
          <Input value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} placeholder="Joksan Telles" />
        </div>

        <div className="pt-6 border-t border-stone-100 space-y-6">
          <h3 className="font-title text-xl text-stone-800">Contraseña</h3>
          <p className="text-sm text-stone-500">Deja este campo vacío si no deseas cambiar la contraseña del usuario.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Nueva Contraseña</Label>
              <Input type="password" value={userData.password} onChange={e => setUserData({...userData, password: e.target.value, passwordConfirm: e.target.value})} placeholder="********" />
            </div>
            {/* Si es PocketBase, normalmente passwordConfirm debe ser igual a password, lo mapeamos directamente arriba o pedimos verificación */}
          </div>
        </div>
      </div>
    </div>
  );
}
