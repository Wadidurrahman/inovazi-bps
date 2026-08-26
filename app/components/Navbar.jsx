'use client';
import { UserCircle, Building2, LayoutGrid, ArrowRight, ChevronLeft, Search, Layers, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function NavbarTemplate({ onBack, inovasiList, activeInovasiId, onSelectInovasi }) {
  const [imageError, setImageError] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/logoBPS.jpg');
  const [mounted, setMounted] = useState(false);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const displayList = inovasiList && inovasiList.length > 0 ? inovasiList : [];

  const pilarList = Array.from(new Set(displayList.map(item => item.pilar).filter(Boolean))).sort();
  const akhlakList = Array.from(new Set(displayList.map(item => item.nilai_berakhlak).filter(Boolean))).sort();

  const filteredInovasi = displayList.filter(item => 
    item.nama_inovasi?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const openSubMenu = (menu) => {
    setIsDropdownOpen(false);
    setActiveModal(menu);
  };

  const closeAll = () => {
    setIsDropdownOpen(false);
    setActiveModal(null);
    setTimeout(() => setSearchQuery(''), 200);
  };

  const backToDropdown = () => {
    setActiveModal(null);
    setIsDropdownOpen(true);
    setSearchQuery('');
  };

  const renderModalContent = () => {
    if (activeModal === 'daftar') {
      return (
        <div className="flex flex-col h-full max-h-[70vh]">
          <div className="p-3 border-b border-slate-200 bg-white sticky top-0 z-10 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                autoFocus
                placeholder="Ketik nama inovasi yang dicari..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-md pl-9 pr-3 py-2.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="overflow-y-auto px-3 py-2 flex-1 scroll-smooth">
            <div className="space-y-1.5">
              {filteredInovasi.length > 0 ? (
                filteredInovasi.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => { onSelectInovasi(item.id); closeAll(); }}
                    className="flex items-start justify-between p-3 bg-white rounded-md hover:bg-orange-50 border border-slate-200 hover:border-orange-200 cursor-pointer transition-all group shadow-sm"
                  >
                    <div className="flex items-start gap-3 flex-1 pr-3">
                      {item.logo ? (
                        <img src={item.logo} className="w-10 h-10 rounded-md object-contain bg-white border border-slate-200 p-0.5 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                          <Layers className="w-5 h-5 text-slate-400"/>
                        </div>
                      )}
                      <div className="flex flex-col flex-1">
                        <p className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-orange-600 leading-tight mb-1 break-words">
                          {item.nama_inovasi}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded">
                            {item.pilar || 'Umum'}
                          </span>
                          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-semibold rounded">
                            {item.nilai_berakhlak || 'Kategori'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex h-full items-center pt-1">
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors shrink-0" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="w-10 h-10 text-slate-200 mb-2" />
                  <p className="text-sm text-slate-500 font-medium">Inovasi tidak ditemukan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === 'pilar') {
      return (
        <div className="flex flex-col overflow-y-auto max-h-[70vh] p-3 bg-slate-50 space-y-2">
          {pilarList.length > 0 ? pilarList.map((pilar, idx) => (
            <Link 
              key={idx} 
              href={`/pilar/${encodeURIComponent(pilar)}`} 
              onClick={closeAll}
              className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-md hover:border-[#0B5E90] hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#0B5E90] group-hover:scale-125 transition-transform" />
                <span className="font-bold text-xs md:text-sm text-slate-800 group-hover:text-[#0B5E90] break-words">{pilar}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0B5E90] transition-colors shrink-0 ml-3" />
            </Link>
          )) : <p className="text-xs text-slate-500 text-center py-10 font-medium">Belum ada pilar terdaftar.</p>}
        </div>
      );
    }

    if (activeModal === 'akhlak') {
      return (
        <div className="flex flex-col overflow-y-auto max-h-[70vh] p-3 bg-slate-50 space-y-2">
          {akhlakList.length > 0 ? akhlakList.map((akhlak, idx) => (
            <Link 
              key={idx} 
              href={`/akhlak/${encodeURIComponent(akhlak)}`} 
              onClick={closeAll}
              className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-md hover:border-emerald-500 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                <span className="font-bold text-xs md:text-sm text-slate-800 group-hover:text-emerald-600 break-words">{akhlak}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0 ml-3" />
            </Link>
          )) : <p className="text-xs text-slate-500 text-center py-10 font-medium">Belum ada nilai terdaftar.</p>}
        </div>
      );
    }
  };

  const getModalTitle = () => {
    if (activeModal === 'daftar') return 'Daftar Seluruh Inovasi';
    if (activeModal === 'pilar') return 'Daftar Pilar Inovasi';
    if (activeModal === 'akhlak') return 'Daftar Nilai BerAKHLAK';
    return '';
  };

  return (
    <header className="w-full bg-gradient-to-r from-slate-900 via-[#0B5E90] to-slate-900 backdrop-blur-xl border-b border-slate-800 shadow-md z-40 sticky top-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        <div onClick={onBack} className="flex items-center space-x-3 cursor-pointer group shrink-0">
          <div className="h-10 w-10 bg-white rounded-md flex items-center justify-center overflow-hidden border border-white/20 shadow-sm group-hover:scale-105 transition-transform">
            {!imageError ? (
              <img 
                src={logoSrc}
                alt="Logo BPS" 
                className="h-full w-full object-contain p-1"
                onError={() => {
                  if (logoSrc === '/logoBPS.jpg') setLogoSrc('/logoBPS.png');
                  else setImageError(true);
                }}
              />
            ) : (
              <Building2 className="w-5 h-5 text-[#0B5E90]" />
            )}
          </div>
          <div className="leading-tight group-hover:translate-x-1 transition-transform">
            <h1 className="text-lg font-black tracking-tight text-white">INOVAZI</h1>
            <p className="text-[10px] text-orange-300 font-bold uppercase tracking-widest">BPS Kota Probolinggo</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-md px-4 py-2 border border-white/20 transition-all shadow-sm backdrop-blur-md"
            >
              <LayoutGrid className="w-4 h-4 text-orange-300" />
              <span className="hidden sm:inline">Eksplorasi Menu</span>
            </button>

            {mounted && isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-fadeIn origin-top-right">
                  <div 
                    onClick={() => openSubMenu('daftar')}
                    className="group flex items-center justify-between p-3 hover:bg-slate-50 border-b border-slate-100 cursor-pointer transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-800 group-hover:text-orange-600">Daftar Inovasi</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-500 transition-colors" />
                  </div>

                  <div 
                    onClick={() => openSubMenu('pilar')}
                    className="group flex items-center justify-between p-3 hover:bg-slate-50 border-b border-slate-100 cursor-pointer transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#0B5E90]">Pilar Inovasi</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0B5E90] transition-colors" />
                  </div>

                  <div 
                    onClick={() => openSubMenu('akhlak')}
                    className="group flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">BerAKHLAK</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </div>
              </>
            )}
          </div>

          <Link 
            href="/admin" 
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-[#F26522] hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm rounded-md px-4 py-2 transition-all shadow-md"
          >
            <UserCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>

      {mounted && activeModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" 
            onClick={closeAll}
          />
          <div className="relative w-full max-w-xl bg-white rounded-lg shadow-2xl flex flex-col z-10 overflow-hidden animate-slideUp">
            
            <div className="flex items-center justify-between p-3.5 border-b border-slate-200 bg-white shrink-0">
              <div className="flex items-center gap-2">
                <button 
                  onClick={backToDropdown}
                  className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider">{getModalTitle()}</h2>
              </div>
              <button 
                onClick={closeAll}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 flex-1 overflow-hidden rounded-b-lg">
              {renderModalContent()}
            </div>
            
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}