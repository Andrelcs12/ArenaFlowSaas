"use client";
import { useState, useEffect } from 'react';
import { Plus, Trash2, Layout } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export default function CourtsManager() {
  const { token, user } = useAuth();
  const [courts, setCourts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  // 1. Carregar Quadras Existentes
  useEffect(() => {
    if (token && user?.tenantId) {
      fetch('http://localhost:3001/api/courts', {
        headers: { 'x-tenant-id': user.tenantId }
      })
      .then(res => res.json())
      .then(data => setCourts(Array.isArray(data) ? data : []));
    }
  }, [token, user]);

  // 2. Criar Nova Quadra
  const handleAddCourt = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/courts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-tenant-id': user.tenantId,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, pricePerHour: Number(price) })
    });

    if (res.ok) {
      const newCourt = await res.json();
      setCourts([...courts, newCourt]);
      setName('');
      setPrice('');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-2">
        <Layout className="text-orange-600" /> GERENCIAR QUADRAS
      </h1>

      {/* Formulário de Cadastro */}
      <form onSubmit={handleAddCourt} className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input 
          placeholder="Nome da Quadra (ex: Quadra 01 Society)" 
          className="p-4 bg-zinc-50 rounded-2xl outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-orange-500"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input 
          placeholder="Preço por Hora (R$)" 
          type="number"
          className="p-4 bg-zinc-50 rounded-2xl outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-orange-500"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
        <button className="bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all flex items-center justify-center gap-2">
          <Plus size={20} /> ADICIONAR
        </button>
      </form>

      {/* Lista de Quadras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courts.map(court => (
          <div key={court.id} className="bg-white p-6 rounded-3xl border border-zinc-200 flex justify-between items-center shadow-sm">
            <div>
              <h3 className="font-bold text-lg">{court.name}</h3>
              <p className="text-zinc-500 text-sm">R$ {court.pricePerHour.toFixed(2)} / hora</p>
            </div>
            <button className="text-zinc-400 hover:text-red-500 transition-colors">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {courts.length === 0 && (
          <p className="text-zinc-400 italic col-span-2 text-center py-10">Você ainda não cadastrou nenhuma quadra.</p>
        )}
      </div>
    </div>
  );
}