import Link from 'next/link';
import { Trophy, Zap, Smartphone, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-white text-zinc-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <span className="text-2xl font-black italic text-orange-600">ARENAFLOW</span>
        <Link href="/login" className="bg-zinc-900 text-white px-6 py-2 rounded-full font-bold hover:bg-zinc-800 transition">
          Entrar no Painel
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
          Sua Arena no <span className="text-orange-600">Piloto Automático.</span>
        </h1>
        <p className="text-xl text-zinc-600 mb-10">
          Chega de confusão no WhatsApp. Um sistema de agendamento simples, rápido e focado em converter seus horários vagos em dinheiro.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/register" className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-xl hover:scale-105 transition">
            COMEÇAR AGORA
          </Link>
        </div>
      </header>

      {/* Features */}
      <section className="bg-zinc-50 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={<Zap className="text-orange-600" />} title="Agendamento 24h" desc="Seu cliente reserva até de madrugada sem você precisar responder." />
          <FeatureCard icon={<Trophy className="text-orange-600" />} title="Multi-Quadras" desc="Gerencie Society, Beach Tennis ou Padel em um só lugar." />
          <FeatureCard icon={<Smartphone className="text-orange-600" />} title="Link na Bio" desc="Um link exclusivo para sua arena que funciona direto no celular." />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-500">{desc}</p>
    </div>
  );
}