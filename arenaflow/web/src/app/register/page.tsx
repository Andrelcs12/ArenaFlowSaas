"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = "http://localhost:3001/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: '', password: '', arenaName: '', slug: '' });
  const router = useRouter();

    // src/app/register/page.tsx
    const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // LOG PARA VOCÊ VER NO NAVEGADOR O QUE ESTÁ SAINDO
  console.log("Enviando dados:", {
    email: formData.email,
    password: formData.password,
    name: formData.arenaName,
    slug: formData.slug
  });

  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: formData.email, 
        password: formData.password, 
        name: formData.arenaName, // O BACKEND PEDE 'name'
        slug: formData.slug       // O BACKEND PEDE 'slug'
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Aqui você vai ver a mensagem real do erro (ex: "Slug já existe")
      alert(`Erro: ${data.error}`); 
      return;
    }

    router.push('/login');
  } catch (err: any) {
    alert("Erro de conexão com o servidor.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg">
        <h1 className="text-2xl font-black text-center mb-6 text-orange-600 italic">ARENAFLOW</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Nome da Arena" className="p-4 bg-zinc-50 rounded-2xl outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-orange-500" 
              onChange={e => setFormData({...formData, arenaName: e.target.value})} required />
            <input placeholder="URL (ex: arena-japa)" className="p-4 bg-zinc-50 rounded-2xl outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-orange-500" 
              onChange={e => setFormData({...formData, slug: e.target.value})} required />
          </div>
          <input placeholder="Seu E-mail" type="email" className="w-full p-4 bg-zinc-50 rounded-2xl outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-orange-500" 
            onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Sua Senha" className="w-full p-4 bg-zinc-50 rounded-2xl outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-orange-500" 
            onChange={e => setFormData({...formData, password: e.target.value})} required />
          <button className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-200">
            CRIAR MINHA ARENA AGORA
          </button>
        </form>
      </div>
    </div>
  );
}