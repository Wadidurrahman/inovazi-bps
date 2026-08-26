'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { Loader2, ArrowLeft, Building2, Search } from 'lucide-react';

export default function AkhlakDetail() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const akhlakName = decodeURIComponent(Array.isArray(rawId) ? rawId[0] : (rawId || ''));

  const [inovasiList, setInovasiList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from('inovasi')
          .select('*')
          .ilike('nilai_berakhlak', `%${akhlakName}%`);
            
        if (data) setInovasiList(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (akhlakName) {
      fetchData();
    }
  }, [akhlakName]);

  const filteredList = inovasiList.filter(item =>
    item.nama_inovasi?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-slate-100/50 text-slate-800 flex flex-col font-sans select-none overflow-x-hidden relative">
      <div className="absolute top-4 left-4 z-30">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 shadow-sm px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 border border-slate-200 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 text-[#0B5E90]" /> Kembali
        </Link>
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 flex flex-col items-center">
        <div className="text-center mb-6 mt-2 w-full max-w-xl relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4 drop-shadow-sm">
            {akhlakName}
          </h1>

          {inovasiList.length > 3 && (
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari inovasi dalam nilai ini..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#0B5E90] focus:ring-2 focus:ring-[#0B5E90]/20 transition-all shadow-sm"
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#0B5E90]" />
            <p className="text-sm font-medium">Memuat data inovasi...</p>
          </div>
        ) : filteredList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 w-full">
            {filteredList.map((item) => (
              <div 
                key={item.id}
                onClick={() => router.push(`/?detail=${item.id}`)}
                className="group flex flex-col bg-white border border-slate-200 rounded-xl cursor-pointer hover:shadow-lg hover:shadow-[#0B5E90]/10 hover:border-[#0B5E90] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="w-full h-28 sm:h-32 flex items-center justify-center p-4 relative bg-white shrink-0">
                  {item.logo ? (
                    <img src={item.logo} alt={item.nama_inovasi} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out" />
                  ) : (
                    <Building2 className="w-10 h-10 text-slate-200" />
                  )}
                </div>
                
                <div className="w-full p-3 bg-slate-50 border-t border-slate-100 flex flex-col items-center justify-start h-[72px] sm:h-[84px]">
                  <h3 className="text-[11px] sm:text-xs font-bold text-slate-700 text-center leading-snug line-clamp-3 group-hover:text-[#0B5E90] transition-colors w-full">
                    {item.nama_inovasi}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 w-full max-w-sm bg-white border border-slate-200 border-dashed rounded-2xl mt-2 shadow-sm">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700 mb-1">Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500">Tidak ada inovasi yang sesuai dengan pencarian Anda.</p>
          </div>
        )}
      </main>
    </div>
  );
}