'use client';
import { ArrowRight, Layers } from 'lucide-react';

export default function InnovationList({ inovasiList, onSelectInovasi, initialId }) {
  if (!inovasiList || inovasiList.length === 0) return null;

  const currentItem = initialId
    ? inovasiList.find(item => item.id?.toString() === initialId?.toString()) || inovasiList[0]
    : inovasiList[0];

  const displayImage = currentItem.gambar || currentItem.foto_1 || currentItem.logo || '/bg-1.webp';

  return (
    <div className="w-full h-full min-h-[calc(100vh-72px)] flex items-center justify-center relative bg-[#021526] overflow-hidden py-10">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
         <img src={displayImage} className="w-full h-full object-cover opacity-10 blur-[40px] transition-opacity duration-500" alt="bg" />
         <div className="absolute inset-0 bg-gradient-to-r from-[#021526] via-[#052e4d]/40 to-[#021526]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">

         <div className="flex-1 w-full flex flex-col justify-center animate-fadeInLeft">
            <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-md text-slate-800 text-[10px] sm:text-xs font-bold mb-5 shadow-sm w-fit">
               <Layers className="w-4 h-4 text-[#F26522]" />
               Data Inovasi Terpilih
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-5">
               <span className="bg-white text-[#0B5E90] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded shadow-sm">
                 {currentItem.pilar || 'PILAR UMUM'}
               </span>
               <span className="bg-white text-[#F26522] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded shadow-sm">
                 {currentItem.nilai_berakhlak || 'KATEGORI'}
               </span>
            </div>

            <div className="flex flex-col justify-start mb-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-4 leading-snug drop-shadow-md break-words">
                 {currentItem.nama_inovasi}
              </h1>

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl font-medium break-words">
                 {currentItem.deskripsi}
              </p>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => onSelectInovasi(currentItem.id)}
                className="bg-[#F26522] hover:bg-[#d95516] text-white font-bold py-3 px-6 rounded-lg inline-flex items-center gap-2.5 transition-all hover:-translate-y-0.5 shadow-xl shadow-[#F26522]/20 text-xs sm:text-sm"
              >
                Lihat Detail Inovasi <ArrowRight className="w-4 h-4" />
              </button>
            </div>
         </div>

         <div className="w-full lg:w-[50%] flex justify-center lg:justify-end animate-fadeInRight">
            <div className="relative w-full max-w-[560px] aspect-[4/3] sm:aspect-[16/10] bg-slate-900/50 rounded-[20px] p-2 shadow-2xl border border-white/10 backdrop-blur-sm">
               <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-slate-800 shadow-inner">
                  
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110" 
                    style={{ backgroundImage: `url(${displayImage})` }} 
                  />
                  
                  <img
                    src={displayImage}
                    alt={currentItem.nama_inovasi}
                    className="relative z-10 w-full h-full object-contain drop-shadow-md"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021526]/60 via-transparent to-transparent z-20 pointer-events-none"></div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}