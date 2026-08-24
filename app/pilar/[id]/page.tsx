'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { Loader2, ArrowLeft, Building2, ArrowRight } from 'lucide-react';

export default function PilarDetail() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const pilarName = decodeURIComponent(Array.isArray(rawId) ? rawId[0] : (rawId || ''));

  const [inovasiList, setInovasiList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from('inovasi')
          .select('*')
          .ilike('pilar', pilarName);
            
        if (data) setInovasiList(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (pilarName) {
      fetchData();
    }
  }, [pilarName]);

  const bgImage = inovasiList.length > 0 ? (inovasiList[0].gambar || '/bg-1.webp') : '/bg-1.webp';

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src={bgImage} className="w-full h-full object-cover opacity-20 blur-3xl scale-105" alt="Bg" />
        <div className="absolute inset-0 bg-slate-950/85"></div>
      </div>

      <header className="relative z-10 w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-md px-6 py-3 flex items-center justify-between shrink-0">
        <Link 
          href="/"
          className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali
        </Link>
        <span className="text-xs font-semibold text-slate-300">Pilar: <strong className="text-white">{pilarName}</strong></span>
      </header>

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-6 py-8 flex flex-col justify-center overflow-y-auto custom-scrollbar">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{pilarName}</h1>
          <p className="text-xs text-slate-400 mt-1">Daftar program inovasi strategis yang bernaung di bawah pilar ini.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2 text-[#F26522]" /> Memuat data...
          </div>
        ) : inovasiList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inovasiList.map((item) => (
              <div 
                key={item.id}
                onClick={() => router.push(`/?detail=${item.id}`)}
                className="group bg-slate-900/90 hover:bg-slate-900 border border-white/10 hover:border-[#F26522]/50 rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1.5 shrink-0">
                      {item.logo ? (
                        <img src={item.logo} alt={item.nama_inovasi} className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">{item.nama_inovasi}</h3>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-3">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-orange-400 pt-2 border-t border-white/10">
                  <span>Lihat Detail</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white/5 rounded-xl border border-white/10 max-w-sm mx-auto w-full">
            <Building2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Belum ada inovasi untuk pilar ini.</p>
          </div>
        )}
      </main>
    </div>
  );
}