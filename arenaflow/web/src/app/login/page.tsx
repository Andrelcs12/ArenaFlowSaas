"use client";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificação de segurança para o Contexto
    if (typeof login !== 'function') {
      alert("Erro crítico: O sistema de autenticação não foi carregado corretamente.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        login(data); // Aqui o context salva user e token
      } else {
        alert(data.error || "E-mail ou senha incorretos.");
      }
    } catch (err) {
      alert("Erro de conexão: Certifique-se que o backend (porta 3001) está rodando.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-black text-center mb-2 italic text-orange-600">ARENAFLOW</h1>
        <p className="text-zinc-500 text-center mb-8">Painel Administrativo</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-zinc-700 ml-1">E-mail</label>
            <input 
              type="email" 
              required
              className="w-full p-4 bg-zinc-50 rounded-2xl border-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="seu@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-zinc-700 ml-1">Senha</label>
            <input 
              type="password" 
              required
              className="w-full p-4 bg-zinc-50 rounded-2xl border-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            disabled={isSubmitting}
            className={`w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold text-lg transition-all ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-800 active:scale-95 shadow-lg'
            }`}
          >
            {isSubmitting ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}