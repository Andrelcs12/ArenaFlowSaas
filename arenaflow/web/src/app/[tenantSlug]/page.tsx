"use client";
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useParams } from 'next/navigation';

const API_URL = "http://localhost:3001/api";

export default function PublicBooking() {
  const params = useParams();
  const tenantSlug = params.tenantSlug;

  const [arena, setArena] = useState<any>(null);
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(true);

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

  useEffect(() => {
    async function loadArenaData() {
      try {
        // 1. Busca a arena específica pelo SLUG
        const resTenant = await fetch(`${API_URL}/tenants/slug/${tenantSlug}`);
        const found = await resTenant.json();

        if (found && found.id) {
          setArena(found);
          // 2. Busca as quadras dessa arena usando o ID encontrado
          const resCourts = await fetch(`${API_URL}/courts`, { 
            headers: { 'x-tenant-id': found.id } 
          });
          const courtsData = await resCourts.json();
          setCourts(courtsData);
        }
      } catch (error) {
        console.error("Erro ao carregar arena:", error);
      } finally {
        setLoading(false);
      }
    }
    if (tenantSlug) loadArenaData();
  }, [tenantSlug]);

  const handleBooking = () => {
    if (!selectedCourt || !selectedTime) return alert("Selecione quadra e horário!");
    alert(`Solicitação enviada para ${arena.name}!\nQuadra: ${selectedCourt.name}\nData: ${selectedDate} às ${selectedTime}`);
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-orange-600 font-bold">Carregando Arena...</div>;
  if (!arena) return <div className="p-20 text-center font-bold text-red-500">Arena não encontrada (404)</div>;

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <div className="w-20 h-20 bg-orange-600 rounded-3xl mx-auto mb-4 flex items-center justify-center text-white font-black text-3xl shadow-xl rotate-3">
          {arena.name.substring(0,2).toUpperCase()}
        </div>
        <h1 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">{arena.name}</h1>
        <p className="text-zinc-500 flex items-center justify-center gap-1 font-medium">
          <MapPin size={16} className="text-orange-500" /> Agendamento Online
        </p>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Passo 1: Data */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CalendarIcon size={22} className="text-orange-500" /> 1. Quando você quer jogar?
            </h2>
            <input 
              type="date" 
              className="w-full p-4 rounded-2xl bg-zinc-50 border-none ring-1 ring-zinc-200 outline-none focus:ring-2 focus:ring-orange-500 font-bold text-zinc-700" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
            />
          </section>

          {/* Passo 2: Quadra */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200">
            <h2 className="text-xl font-bold mb-4">2. Qual a quadra?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courts.map((court: any) => (
                <button 
                  key={court.id} 
                  onClick={() => setSelectedCourt(court)} 
                  className={`p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
                    selectedCourt?.id === court.id 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-zinc-100 hover:border-zinc-300 bg-zinc-50'
                  }`}
                >
                  <span className="block font-black text-lg text-zinc-800 uppercase leading-none mb-1">{court.name}</span>
                  <span className="text-orange-600 font-bold">R$ {court.pricePerHour}/hr</span>
                  {selectedCourt?.id === court.id && <CheckCircle2 className="absolute top-2 right-2 text-orange-500" size={20} />}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Lateral: Horários */}
        <div className="md:col-span-1">
          <section className="bg-white p-6 rounded-3xl shadow-lg border border-zinc-200 sticky top-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock size={22} className="text-orange-500" /> 3. Horário
            </h2>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
              {timeSlots.map((time) => (
                <button 
                  key={time} 
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 text-sm font-bold rounded-xl border transition-all ${
                    selectedTime === time 
                    ? 'bg-zinc-900 text-white border-zinc-900' 
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-orange-500'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-100">
              <div className="flex justify-between mb-4">
                <span className="text-zinc-500 font-medium">Total:</span>
                <span className="text-2xl font-black text-zinc-900">
                  {selectedCourt ? `R$ ${selectedCourt.pricePerHour}` : '---'}
                </span>
              </div>
              <button 
                onClick={handleBooking}
                disabled={!selectedCourt || !selectedTime}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-orange-700 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-orange-200"
              >
                RESERVAR AGORA
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}