'use client';
import { useState, useEffect } from 'react';
import { ArrowRight, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

export default function InnovationList({ inovasiList, onSelectInovasi, initialId }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (initialId && inovasiList && inovasiList.length > 0) {
      const index = inovasiList.findIndex(item => item.id?.toString() === initialId?.toString());
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [initialId, inovasiList]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % inovasiList.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? inovasiList.length - 1 : prev - 1));
  };

  if (!inovasiList || inovasiList.length === 0) return null;

  const currentItem = inovasiList[currentIndex];
  const displayImage = currentItem.gambar || currentItem.foto_1 || currentItem.logo || '/bg-1.webp';

  return (
    <div className="w-full h-full min-h-[calc(100vh-72px)] flex items-center justify-center relative bg-[#021526] overflow-hidden py-10">
      {/* Background Blur Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <img src={displayImage} className="w-full h-full object-cover opacity-10 blur-[40px] transition-opacity duration-500" alt="bg" />
         <div className="absolute inset-0 bg-gradient-to-r from-[#021526] via-[#052e4d]/40 to-[#021526]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">

         {/* Konten Kiri (Teks & Judul) */}
         <div className="flex-1 w-full flex flex-col justify-center animate-fadeInLeft">
            <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-md text-slate-800 text-[10px] sm:text-xs font-bold mb-5 shadow-sm w-fit">
               <Layers className="w-4 h-4 text-[#F26522]" />
               Total {inovasiList.length} Inovasi Tersedia
            </div>

            {/* Label Pilar & Akhlak (Fleksibel, bisa multi-baris jika panjang) */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
               <span className="bg-white text-[#0B5E90] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded shadow-sm">
                 {currentItem.pilar || 'PILAR UMUM'}
               </span>
               <span className="bg-white text-[#F26522] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded shadow-sm">
                 {currentItem.nilai_berakhlak || 'KATEGORI'}
               </span>
            </div>

            {/* Judul & Deskripsi (Tidak akan terpotong) */}
            <div className="flex flex-col justify-start mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-white mb-4 leading-snug drop-shadow-md break-words">
                 {currentItem.nama_inovasi}
              </h1>

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed line-clamp-4 max-w-xl font-medium">
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

         {/* Konten Kanan (Slider Gambar HD) */}
         <div className="w-full lg:w-[50%] flex justify-center lg:justify-end animate-fadeInRight">
            <div className="relative w-full max-w-[560px] aspect-[4/3] sm:aspect-[16/10] bg-slate-900/50 rounded-[20px] p-2 shadow-2xl border border-white/10 group backdrop-blur-sm">
               <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-slate-800 shadow-inner">

                 {inovasiList.map((item, idx) => {
                    const img = item.gambar || item.foto_1 || item.logo || '/bg-1.webp';
                    return (
                      <div
                        key={item.id}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                          idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                      >
                        {/* Background Blur (Mengisi layar kosong agar HD tetap proporsional) */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110" 
                          style={{ backgroundImage: `url(${img})` }} 
                        />
                        {/* Gambar Asli - Menggunakan object-contain agar tidak ter-crop */}
                        <img
                          src={img}
                          alt={item.nama_inovasi}
                          loading={idx === 0 ? "eager" : "lazy"}
                          decoding="async"
                          className="relative z-10 w-full h-full object-contain drop-shadow-md"
                        />
                      </div>
                    );
                 })}

                 {/* Bayangan Bawah untuk Tombol Navigasi */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#021526]/90 via-transparent to-transparent z-20 pointer-events-none"></div>

                 {/* Tombol Kiri Kanan (Muncul saat di-hover) */}
                 {inovasiList.length > 1 && (
                   <>
                     <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/40 hover:bg-[#F26522] text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                        <ChevronLeft className="w-4 h-4" />
                     </button>
                     <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/40 hover:bg-[#F26522] text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
                        <ChevronRight className="w-4 h-4" />
                     </button>
                   </>
                 )}

                 {/* Indikator Titik Bawah */}
                 {inovasiList.length > 1 && (
                   <div className="absolute bottom-4 left-0 w-full flex justify-center flex-wrap gap-2 z-30 px-4">
                      {inovasiList.map((_, idx) => (
                         <button
                           key={idx}
                           onClick={() => setCurrentIndex(idx)}
                           className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                             idx === currentIndex ? 'w-6 bg-[#F26522]' : 'w-1.5 bg-white/50 hover:bg-white'
                           }`}
                           aria-label={`Slide ${idx + 1}`}
                         />
                      ))}
                   </div>
                 )}

               </div>
            </div>
         </div>

      </div>
    </div>
  );
}