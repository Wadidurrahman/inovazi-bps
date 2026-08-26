'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { Loader2, ArrowLeft, Building2 } from 'lucide-react';

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

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* Header Sederhana */}
      <header className="sticky top-0 z-10 w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center shadow-sm">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-500 text-sm font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Judul Pilar */}
        <div className="text-center mb-10 w-full">
          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-extrabold uppercase tracking-widest rounded-md mb-3">
            Kategori Pilar
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {pilarName}
          </h1>
        </div>

        {/* Status Loading atau Daftar Logo */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-orange-500" />
            <p className="text-sm font-medium">Memuat data inovasi...</p>
          </div>
        ) : inovasiList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
            {inovasiList.map((item) => (
              <div 
                key={item.id}
                onClick={() => router.push(`/?detail=${item.id}`)}
                className="group flex flex-col items-center p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-orange-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 mb-4 overflow-hidden group-hover:bg-orange-50/50 transition-colors">
                  {item.logo ? (
                    <img src={item.logo} alt={item.nama_inovasi} className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform" />
                  ) : (
                    <Building2 className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-700 text-center line-clamp-2 group-hover:text-orange-500 transition-colors">
                  {item.nama_inovasi}
                </h3>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 w-full max-w-md bg-white border border-slate-200 border-dashed rounded-2xl mt-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700 mb-1">Data Kosong</h3>
            <p className="text-sm text-slate-500">Belum ada inovasi yang terdaftar di pilar ini.</p>
          </div>
        )}
      </main>
    </div>
  );
}