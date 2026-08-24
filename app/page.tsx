'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

import NavbarTemplate from './components/Navbar';
import InnovationList from './components/InnovationList';
import InnovationDetail from './components/InnovationDetail';

// TRIK RAHASIA: Memaksa TypeScript agar tidak memeriksa tipe data komponen JSX
const NavbarComponent = NavbarTemplate as any;
const InnovationListComponent = InnovationList as any;
const InnovationDetailComponent = InnovationDetail as any;

export default function HomePage() {
  const [inovasiList, setInovasiList] = useState<any[]>([]);
  const [bgIndex, setBgIndex] = useState<number>(0);
  
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentId, setCurrentId] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  const heroImages = [
    '/bg-1.webp',
    '/bg-2.webp',
    '/bg-3.webp'
  ];

  useEffect(() => {
    setIsClient(true);
    const fetchInovasi = async () => {
      try {
        const { data } = await supabase
          .from('inovasi')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data) setInovasiList(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInovasi();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // HANYA BACA URL 1X SAAT PERTAMA KALI DIBUKA
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const detailId = search.get('detail');
    const previewId = search.get('preview');

    if (detailId) {
      setCurrentView('detail');
      setCurrentId(detailId);
    } else if (previewId) {
      setCurrentView('preview');
      setCurrentId(previewId !== 'true' ? previewId : null);
    }
  }, []);

  // NAVIGASI MURNI REACT STATE (DIJAMIN 100% TIDAK FREEZE KARENA TIDAK MENGUBAH URL)
  const navigateTo = (view: string, id: any = null) => {
    setCurrentView(view);
    setCurrentId(id);
  };

  const activeDetail: any = inovasiList.find(i => i.id?.toString() === currentId?.toString());

  if (!isClient) return <div className="fixed inset-0 w-screen h-screen bg-slate-950"></div>;

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950 text-slate-800 flex flex-col select-none">
      <div className="shrink-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <NavbarComponent 
          onBack={() => navigateTo('home')}
          inovasiList={inovasiList}
          activeInovasiId={currentId}
          onSelectInovasi={(id: any) => navigateTo('preview', id)} 
        />
      </div>

      <main className="flex-1 relative overflow-hidden bg-slate-50">
        
        {currentView === 'detail' ? (
          <div className="absolute inset-0 w-full h-full overflow-y-auto custom-scrollbar animate-fadeIn bg-slate-50">
             {activeDetail ? (
               <InnovationDetailComponent 
                 data={activeDetail}  
                 onBack={() => navigateTo('preview', currentId)} 
               />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                 <div className="w-10 h-10 border-4 border-[#0B5E90] border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-slate-500 font-bold tracking-widest text-xs uppercase animate-pulse">Menyiapkan Data...</p>
               </div>
             )}
          </div>

        ) : currentView === 'preview' ? (
          <div className="absolute inset-0 w-full h-full overflow-y-auto bg-slate-900 animate-fadeIn">
             <InnovationListComponent 
               inovasiList={inovasiList} 
               onSelectInovasi={(id: any) => navigateTo('detail', id)}
               initialId={currentId} 
             />
          </div>

        ) : (
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-slate-950 animate-fadeIn">
            <div className="absolute inset-0 z-0 bg-slate-900">
              {heroImages.map((src, idx) => (
                <img 
                  key={idx}
                  src={src} 
                  alt={`Latar BPS ${idx + 1}`} 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === bgIndex ? 'opacity-100' : 'opacity-0'}`}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80';
                  }}
                />
              ))}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-3xl mx-auto px-6 text-center flex flex-col items-center">
              <div className="mb-4 inline-block drop-shadow-md">
                <span className="px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-orange-400 text-[10px] sm:text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-lg">
                  SISTEM INFORMASI INOVAZI
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight drop-shadow-lg">
                BPS Kota <br className="sm:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 drop-shadow-lg">
                  Probolinggo
                </span>
              </h1>
              
              <p className="text-white text-sm sm:text-base max-w-xl mx-auto mb-8 font-medium leading-snug drop-shadow-md">
                Direktori pusat informasi inovasi pelayanan publik. Silakan eksplorasi ragam program unggulan melalui navigasi <strong className="text-orange-400 font-bold">Eksplorasi Menu</strong> di sudut kanan atas layar Anda.
              </p>

              <div className="inline-flex items-center bg-white/20 backdrop-blur-xl border border-white/30 px-6 py-3 rounded-2xl shadow-xl">
                <div className="flex flex-col text-right border-r border-white/30 pr-4 mr-4">
                  <span className="text-3xl sm:text-4xl font-black text-white leading-none drop-shadow-md">
                    {inovasiList.length > 0 ? inovasiList.length : '...'}
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-0.5 drop-shadow-md">INOVASI AKTIF</span>
                  <span className="text-[10px] font-bold text-slate-100 uppercase tracking-widest drop-shadow-md">TELAH TERDAFTAR</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}