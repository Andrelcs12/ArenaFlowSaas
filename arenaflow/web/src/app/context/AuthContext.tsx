"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<any>({}); 

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  // src/app/context/AuthContext.tsx

  // src/app/context/AuthContext.tsx

const login = (data: any) => {
  console.log("Dados recebidos no login:", data); // Adicione esse log para debugar!

  if (!data.user?.tenant?.slug) {
    console.error("ERRO: O backend não enviou o slug da arena!");
    alert("Erro interno: Arena não encontrada para este usuário.");
    return;
  }

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  setToken(data.token);
  setUser(data.user);

  const slug = data.user.tenant.slug;
  router.push(`/${slug}/dashboard`);
};

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);