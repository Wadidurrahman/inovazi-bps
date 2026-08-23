'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from './../../utils/supabase';
import NavbarTemplate from './Navbar';
import InnovationList from './InnovationList';
import InnovationDetail from './InnovationDetail';

function MainContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const previewId = searchParams.get('preview');
  const detailId = searchParams.get('detail');

  const [inovasiList, setInovasiList] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);

  const heroImages = [
    '/bg-1.webp',
    '/bg-2.webp',
    '/bg-3.webp'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
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

  const handleNavbarSelect = (id) => {
    router.push(`/?preview=${id}`);
  };

  const handleShowDetail = (id) => {
    router.push(`/?detail=${id}`);
  };

  const handleBackToPreview = () => {
    router.push(`/?preview=true`); 
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const activeDetail = inovasiList.find(i => i.id?.toString() === detailId?.toString());

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950 text-slate-800 flex flex-col select-none">
      <div className="shrink-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <NavbarTemplate 
          onBack={handleBackToHome}
          inovasiList={inovasiList}
          activeInovasiId={detailId || previewId}
          onSelectInovasi={handleNavbarSelect}
        />
      </div>

      <main className="flex-1 relative overflow-hidden bg-slate-50">
        {detailId && activeDetail ? (
          <div className="absolute inset-0 w-full h-full overflow-y-auto custom-scrollbar animate-fadeIn bg-slate-50">
             <InnovationDetail 
               data={activeDetail}  
               onBack={handleBackToPreview} 
             />
          </div>
        ) : previewId ? (
          <div className="absolute inset-0 w-full h-full overflow-y-auto bg-slate-900 animate-fadeIn">
             <InnovationList 
               inovasiList={inovasiList} 
               onSelectInovasi={handleShowDetail}
               initialId={previewId !== 'true' ? previewId : null} 
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
                  <span className="text-3xl sm:text-4xl font-black text-white leading-none drop-shadow-md">{inovasiList.length}</span>
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

export default function HomePage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 w-screen h-screen bg-slate-950"></div>}>
      <MainContent />
    </Suspense>
  );
}