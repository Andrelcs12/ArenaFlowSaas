"use client";
import { Check } from 'lucide-react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BillingPage() {
  const { tenantSlug } = useParams();

  const handleSubscribe = async (planId: string) => {
    try {
      // 1. Pegamos o token salvo no login
      const token = localStorage.getItem('token'); 

      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        return;
      }

      // 2. Chamada para o seu backend
      const res = await fetch('http://localhost:3001/api/payments/create-checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId }) // Aqui o planId será 'PRO' ou 'ELITE'
      });

      const data = await res.json();

      if (data.url) {
        // Redireciona para o checkout real do Abacate Pay
        window.location.href = data.url; 
      } else {
        alert(data.error || "Erro ao gerar pagamento.");
      }
    } catch (err) {
      console.error("Erro no fetch:", err);
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-zinc-900 tracking-tight mb-4"
          >
            Escolha seu plano para a <span className="text-orange-600 uppercase">{tenantSlug}</span>
          </motion.h1>
          <p className="text-zinc-500 font-medium">Sua arena pronta para o próximo nível com a Novely.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PlanCard 
            id="PRO"
            title="Mensal Pro"
            price="149,90"
            description="Ideal para arenas que estão começando."
            features={["Agenda Online", "Gestão de Quadras", "Suporte Novely"]}
            onSelect={handleSubscribe}
          />

          <PlanCard 
            id="ELITE"
            title="Elite Anual"
            price="129,90"
            description="O melhor custo-benefício para crescer."
            features={["Tudo do Pro", "Relatórios Avançados", "Marketing Integrado", "Taxas Menores"]}
            highlight
            onSelect={handleSubscribe}
          />
        </div>
      </div>
    </div>
  );
}

interface PlanCardProps {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
  onSelect: (id: string) => void;
}

function PlanCard({ id, title, price, description, features, highlight = false, onSelect }: PlanCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col ${
        highlight ? 'border-orange-600 bg-white shadow-2xl scale-105' : 'border-zinc-200 bg-white/50'
      }`}
    >
      {highlight && (
        <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4">RECOMENDADO</span>
      )}
      <h3 className="text-2xl font-black text-zinc-900 mb-2">{title}</h3>
      <p className="text-zinc-500 text-sm mb-6 font-medium">{description}</p>
      
      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-5xl font-black tracking-tighter text-zinc-900">R${price}</span>
        <span className="text-zinc-400 font-bold">/mês</span>
      </div>

      <ul className="space-y-4 mb-10 flex-1">
        {features.map((f: string) => (
          <li key={f} className="flex items-center gap-3 text-zinc-600 font-bold text-sm">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Check size={12} strokeWidth={4} />
            </div>
            {f}
          </li>
        ))}
      </ul>

      <button 
        // AQUI ESTAVA O ERRO: Agora passamos uma função que envia apenas o ID
        onClick={() => onSelect(id)} 
        className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
          highlight 
          ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200' 
          : 'bg-zinc-900 text-white hover:bg-zinc-800'
        }`}
      >
        ASSINAR AGORA
      </button>
    </motion.div>
  );
}