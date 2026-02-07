"use client";
import { useEffect, useState } from 'react';
import { 
  PlusCircle, Calendar, Users, DollarSign, 
  LayoutDashboard, Map, Settings, LogOut, 
  ArrowUpRight, Clock, ChevronRight, Search, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const { tenantSlug } = useParams();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user?.tenantId) {
      fetch('http://localhost:3001/api/bookings', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': user.tenantId 
        }
      })
      .then(res => res.json())
      .then(data => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    }
  }, [token, user]);

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex font-sans text-zinc-900">
      
      {/* SIDEBAR PREMIUM */}
      <aside className="w-72 bg-zinc-950 border-r border-white/5 p-8 flex flex-col hidden lg:flex text-white">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 rotate-3">
            <LayoutDashboard size={22} />
          </div>
          <h2 className="text-xl font-black tracking-tighter uppercase">Arena<span className="text-orange-500 text-2xl">.</span></h2>
        </div>

        <nav className="space-y-1 flex-1">
          <SidebarLink icon={<Calendar size={20} />} label="Agenda" active href={`/${tenantSlug}/dashboard`} />
          <SidebarLink icon={<Map size={20} />} label="Minhas Quadras" href={`/${tenantSlug}/dashboard/courts`} />
          <SidebarLink icon={<Users size={20} />} label="Clientes" href="#" />
          <SidebarLink icon={<Settings size={20} />} label="Configurações" href="#" />
        </nav>

        <div className="pt-6 border-t border-white/10">
          <button 
            onClick={logout}
            className="flex items-center gap-3 p-4 w-full text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all font-bold"
          >
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto overflow-x-hidden">
        
        {/* TOP BAR */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-orange-600 font-black text-xs uppercase tracking-[0.2em]">Painel Administrativo</span>
              <h1 className="text-4xl font-black tracking-tight text-zinc-900 mt-1">
                Fala, {user?.email?.split('@')[0]}!
              </h1>
            </motion.div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input type="text" placeholder="Buscar reserva..." className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm font-medium" />
            </div>
            <button className="bg-white p-3 border border-zinc-200 rounded-2xl text-zinc-500 hover:text-orange-600 transition-colors relative">
                <Bell size={22} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
            </button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-orange-600 text-white px-6 py-4 rounded-2xl flex items-center gap-3 font-black shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all"
            >
              <PlusCircle size={20} /> RESERVAR
            </motion.button>
          </div>
        </header>

        {/* CARDS DE IMPACTO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard label="Reservas hoje" value={bookings.length} icon={<Calendar />} subValue="+2 desde ontem" color="orange" />
          <StatCard label="Atletas cadastrados" value="842" icon={<Users />} subValue="12 novos este mês" color="zinc" />
          <StatCard label="Faturamento" value="R$ 12.450" icon={<DollarSign />} subValue="+18.4%" color="green" isCurrency />
        </div>

        {/* SEÇÃO DE TABELA ESTILIZADA */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-xl shadow-zinc-200/50 overflow-hidden"
        >
          <div className="p-8 border-b border-zinc-50 flex justify-between items-center bg-white">
            <div>
                <h3 className="text-xl font-black text-zinc-900">Agenda do Dia</h3>
                <p className="text-zinc-500 text-sm font-medium">Controle de horários e presenças</p>
            </div>
            <button className="px-5 py-2 rounded-xl border border-zinc-200 font-bold text-sm hover:bg-zinc-50 transition-all">Exportar PDF</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 text-zinc-400 text-[10px] font-black uppercase tracking-[0.15em]">
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Informações do Atleta</th>
                  <th className="px-8 py-4">Quadra selecionada</th>
                  <th className="px-8 py-4">Horário</th>
                  <th className="px-8 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                <AnimatePresence>
                  {bookings.map((b: any, i) => (
                    <motion.tr 
                      key={b.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-orange-50/30 transition-all group"
                    >
                      <td className="px-8 py-5">
                        <span className="flex items-center gap-1.5 text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full w-fit uppercase">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Confirmado
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-zinc-900/10">
                            {b.user.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-zinc-900 leading-none mb-1">{b.user.email.split('@')[0]}</p>
                            <p className="text-xs text-zinc-400 font-medium lowercase italic">{b.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-bold text-zinc-600 italic">
                        {b.court.name}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 font-black text-zinc-900">
                          <Clock size={16} className="text-orange-500" />
                          {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded-lg transition-all text-zinc-400 hover:text-orange-600 border border-transparent hover:border-zinc-200">
                            <ChevronRight size={20} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {loading && <div className="p-20 text-center animate-pulse font-black text-zinc-300 italic uppercase">Sincronizando Banco de Dados...</div>}
            {!loading && bookings.length === 0 && (
                <div className="p-20 text-center">
                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-300">
                        <Calendar size={32} />
                    </div>
                    <p className="text-zinc-400 font-bold italic">Nenhum agendamento para este período.</p>
                </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active = false, href }: any) {
  return (
    <Link href={href}>
        <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all font-bold ${
        active ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
        }`}>
        {icon}
        <span className="text-sm tracking-tight">{label}</span>
        </div>
    </Link>
  );
}

function StatCard({ label, value, icon, subValue, color, isCurrency }: any) {
    const colors: any = {
        orange: 'text-orange-600 bg-orange-50',
        zinc: 'text-zinc-900 bg-zinc-100',
        green: 'text-emerald-600 bg-emerald-50'
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm relative overflow-hidden"
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${colors[color]}`}>
                {icon}
            </div>
            <p className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">{label}</p>
            <h4 className="text-3xl font-black text-zinc-900 tracking-tighter mb-1">{value}</h4>
            <span className={`text-xs font-bold ${color === 'green' ? 'text-emerald-500' : 'text-zinc-400'}`}>
                {subValue}
            </span>
            <div className="absolute -right-4 -bottom-4 text-zinc-50 opacity-[0.03] rotate-12">
                {icon && <div className="scale-[4]">{icon}</div>}
            </div>
        </motion.div>
    );
}