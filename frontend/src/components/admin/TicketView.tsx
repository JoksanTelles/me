import React, { useState, useEffect } from 'react';
import { pb } from '../../lib/pocketbase';
import { Button } from '../ui/button';

export function TicketView({ recordId, backUrl = '/admin/pedidos' }: { recordId: string, backUrl?: string }) {
  const [loading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    pb.authStore.loadFromCookie(document.cookie);
    if (recordId !== 'new') {
      pb.collection('purchases').getOne(recordId, { expand: 'user_id,course_id' })
        .then(record => {
          setPurchase(record);
          setLoading(false);
        })
        .catch(err => {
          setError('No se pudo cargar el pedido.');
          setLoading(false);
        });
    } else {
      setError('No se puede crear un ticket nuevo desde aquí.');
      setLoading(false);
    }
  }, [recordId]);

  if (loading) return <div className="p-8 text-center text-stone-500">Cargando ticket...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;
  if (!purchase) return null;

  const user = purchase.expand?.user_id;
  const course = purchase.expand?.course_id;
  const date = new Date(purchase.created).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' });

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-title text-rose-950">Ticket de Compra</h1>
        <Button asChild variant="outline">
          <a href={backUrl}>Volver a Pedidos</a>
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
        <div className="flex justify-between items-start border-b border-stone-100 pb-6 mb-6">
          <div>
            <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">ID del Pedido</p>
            <p className="font-mono text-lg text-stone-900">{purchase.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">Fecha de Compra</p>
            <p className="text-stone-900">{date}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-stone-50 p-6 rounded-2xl">
            <h3 className="font-title text-xl text-stone-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-stone-400">person</span>
              Datos del Cliente
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase">Nombre</p>
                <p className="text-stone-900 font-medium">{user?.name || user?.username || 'Desconocido'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase">Correo</p>
                <p className="text-stone-900">{user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-6 rounded-2xl">
            <h3 className="font-title text-xl text-stone-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-stone-400">school</span>
              Curso Adquirido
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase">Título</p>
                <p className="text-stone-900 font-medium">{course?.title || 'Desconocido'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase">Estado</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full mt-1">
                  {purchase.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-100 pt-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase mb-1">Referencia Stripe</p>
              <p className="font-mono text-xs text-stone-500">{purchase.stripe_payment_intent_id || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">Monto Pagado</p>
              <p className="font-title text-4xl text-rose-600">${purchase.amount?.toFixed(2) || '0.00'} <span className="text-xl text-stone-400">MXN</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
