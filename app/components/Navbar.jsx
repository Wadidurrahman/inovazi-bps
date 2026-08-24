'use client';
import { UserCircle, Building2, LayoutGrid, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function NavbarTemplate({ onBack, inovasiList, activeInovasiId, onSelectInovasi }) {
  const [imageError, setImageError] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/logoBPS.jpg');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const displayList = inovasiList && inovasiList.length > 0 ? inovasiList : [];

  // Mengekstrak kategori pilar dan akhlak secara otomatis langsung dari data inovasi
  const pilarList = Array.from(new Set(displayList.map(item => item.pilar).filter(Boolean)));
  const akhlakList = Array.from(new Set(displayList.map(item => item.nilai_berakhlak).filter(Boolean)));

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="w-full bg-gradient-to-r from-slate-900 via-[#0B5E90] to-slate-900 backdrop-blur-xl border-b border-slate-700/60 shadow-lg z-40 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-24 py-3 flex items-center justify-between gap-4">
          <div onClick={onBack} className="flex items-center space-x-3 cursor-pointer group shrink-0">
            <div className="h-11 w-11 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-white/20 shadow-md group-hover:scale-105 transition-all">
              {!imageError ? (
                <img 
                  src={logoSrc}
                  alt="Logo BPS" 
                  className="h-full w-full object-contain p-1.5"
                  onError={() => {
                    if (logoSrc === '/logoBPS.jpg') setLogoSrc('/logoBPS.png');
                    else setImageError(true);
                  }}
                />
              ) : (
                <Building2 className="w-6 h-6 text-[#0B5E90]" />
              )}
            </div>
            <div className="leading-tight group-hover:translate-x-1 transition-transform">
              <h1 className="text-xl font-extrabold tracking-tight text-white">INOVAZI</h1>
              <p className="text-[10px] text-orange-300 font-bold uppercase tracking-widest">BPS Kota Probolinggo</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPopupOpen(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-md px-4 py-2 border border-white/40 transition-all shadow-md backdrop-blur-md"
            >
              <LayoutGrid className="w-5 h-5 text-orange-300" />
              <span className="hidden sm:inline">Eksplorasi Menu</span>
            </button>

            <Link 
              href="/admin" 
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-[#F26522] hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm rounded-md px-4 py-2 transition-all shadow-lg"
            >
              <UserCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {mounted && isPopupOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
              <h2 className="text-lg font-bold text-slate-800">Eksplorasi Inovasi BPS</h2>
              <button 
                onClick={() => setIsPopupOpen(false)}
                className="p-2 text-slate-400 hover:text-red-500 bg-white rounded-full shadow-sm hover:shadow transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-4">Pilar</h3>
                <div className="space-y-2">
                  {pilarList.length > 0 ? (
                    pilarList.map((pilar, idx) => (
                      <Link 
                        key={idx} 
                        href={`/pilar/${encodeURIComponent(pilar)}`} 
                        onClick={() => setIsPopupOpen(false)}
                        className="block p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all font-medium text-slate-700 flex items-center justify-between group"
                      >
                        <span>{pilar}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">Belum ada pilar.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0B5E90] uppercase tracking-widest mb-4">Akhlak</h3>
                <div className="space-y-2">
                  {akhlakList.length > 0 ? (
                    akhlakList.map((akhlak, idx) => (
                      <Link 
                        key={idx} 
                        href={`/akhlak/${encodeURIComponent(akhlak)}`}
                        onClick={() => setIsPopupOpen(false)}
                        className="block p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all font-medium text-slate-700 flex items-center justify-between group"
                      >
                        <span>{akhlak}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B5E90] transition-colors" />
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">Belum ada nilai.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Inovasi Terkini</h3>
                <div className="space-y-3">
                  {displayList.slice(0, 4).map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => { onSelectInovasi(item.id); setIsPopupOpen(false); }}
                      className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                    >
                      {item.logo ? (
                        <img src={item.logo} className="w-10 h-10 rounded-md object-cover border border-slate-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-400"><Building2 className="w-5 h-5"/></div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-700 group-hover:text-[#0B5E90] line-clamp-1">{item.nama_inovasi}</p>
                        <p className="text-[10px] text-slate-500 truncate">{item.pilar || 'Umum'}</p>
                      </div>
                    </div>
                  ))}
                  {displayList.length === 0 && <p className="text-sm text-slate-400">Belum ada inovasi.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}