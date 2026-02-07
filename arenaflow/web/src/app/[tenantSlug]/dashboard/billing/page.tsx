"use client";
import { Check } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export default function BillingPage() {
  const { token } = useAuth();

  const handleSubscribe = async (planId: string) => {
    const res = await fetch('http://localhost:3001/api/payments/create-checkout', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ planId })
    });
    
    const data = await res.json();
    if (data.url) window.location.href = data.url; // Manda pro Abacate Pay
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-black mb-8 text-center">Escolha o plano da sua Arena</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PlanCard 
          title="Plano PRO" 
          price="149,90" 
          features={["Até 3 quadras", "Relatórios mensais", "Suporte via chat"]}
          onSelect={() => handleSubscribe('PRO')}
        />
        <PlanCard 
          title="Plano ELITE" 
          price="299,90" 
          features={["Quadras ilimitadas", "Marketing integrado", "Gestor de conta"]}
          highlight
          onSelect={() => handleSubscribe('GOLD')}
        />
      </div>
    </div>
  );
}

function PlanCard({ title, price, features, highlight, onSelect }: any) {
  return (
    <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${highlight ? 'border-orange-600 bg-white shadow-xl scale-105' : 'border-zinc-200 bg-zinc-50'}`}>
      <h3 className="text-xl font-black mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-black text-zinc-900 font-sans">R$ {price}</span>
        <span className="text-zinc-500 font-bold">/mês</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((f: any) => (
          <li key={f} className="flex items-center gap-2 font-medium text-zinc-600">
            <Check size={18} className="text-orange-600" /> {f}
          </li>
        ))}
      </ul>
      <button onClick={onSelect} className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${highlight ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-zinc-900 text-white hover:bg-zinc-700'}`}>
        Assinar agora
      </button>
    </div>
  );
}