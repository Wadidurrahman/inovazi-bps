'use client'
import { useState, useEffect } from 'react'
import { ArrowRight, Database } from 'lucide-react'

export default function InnovationListTemplate({ inovasiList, onSelect, activeId }) {
  const displayList = inovasiList && inovasiList.length > 0 ? inovasiList : []

  const activePreview = displayList.length > 0 
    ? (displayList.find(item => item.id?.toString() === activeId?.toString()) || displayList[0]) 
    : null

  const [currentSlide, setCurrentSlide] = useState(0)

  const sliderImages = activePreview ? [activePreview.foto_1, activePreview.foto_2, activePreview.foto_3].filter(Boolean) : []

  useEffect(() => {
    if (sliderImages.length <= 1) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [sliderImages.length])

  useEffect(() => {
    setCurrentSlide(0)
  }, [activeId])

  if (!activePreview) {
    return (
      <div className="h-full w-full flex-1 relative flex flex-col items-center justify-center bg-[#F4F8FB] overflow-hidden py-20 min-h-[400px]">
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 sm:px-10 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-6 border border-slate-200 shadow-sm hover:scale-105 transition-transform duration-300">
            <Database className="w-8 h-8 text-[#F26522]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight drop-shadow-sm">
            Belum Ada Data Inovasi
          </h1>
          <p className="text-lg text-white font-medium leading-relaxed">
            Sistem belum mendeteksi adanya data inovasi. Silakan login ke Dashboard Admin untuk menambahkan program inovasi baru agar tayang di sini.
          </p>
        </div>
      </div>
    )
  }

  const imageUrl = activePreview.gambar || activePreview.logo

  return (
    <div className="h-full w-full flex-1 relative flex flex-col bg-[#F4F8FB] overflow-hidden">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {imageUrl && (
          <img
            key={activePreview.id}
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover opacity-100 transition-transform duration-1000 ease-out hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#215882] via-[#215882]/70 to-transparent"></div>
      </div>

      {/* Kontainer Utama yang Ditarik Agak Ke Tengah (max-w-6xl) agar nyaman dibaca */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center h-full w-full px-6 sm:px-10 py-12">
        <div className="w-full max-w-5xl xl:max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="max-w-xl flex-1 w-full">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-200 text-[#0B5E90] text-xs font-semibold w-fit mb-6 shadow-sm">
              <Database className="w-4 h-4 text-[#F26522]" />
              <span>Total {displayList.length} Inovasi Tersedia</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 bg-white text-[#0B5E90] rounded border border-[#0B5E90]/20 backdrop-blur-sm">
                {activePreview.pilar}
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 bg-white text-[#F26522] rounded border border-[#F26522]/20 backdrop-blur-sm">
                {activePreview.nilai_berakhlak}
              </span>
            </div>

            <h1 key={`title-${activePreview.id}`} className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight drop-shadow-md">
              {activePreview.nama_inovasi}
            </h1>

            <p key={`desc-${activePreview.id}`} className="text-sm sm:text-base text-white/95 line-clamp-3 mb-8 font-medium leading-relaxed max-w-lg">
              {activePreview.deskripsi}
            </p>

            <button
              onClick={() => onSelect(activePreview)}
              className="inline-flex items-center space-x-3 bg-[#F26522] hover:bg-[#d95a1e] text-white px-6 sm:px-8 py-3.5 rounded-lg transition-all duration-300 hover:-translate-y-1 font-bold shadow-lg shadow-[#F26522]/30 text-sm group"
            >
              <span>Lihat Detail Inovasi</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {sliderImages.length > 0 && (
            <div className="w-full max-w-md lg:w-[380px] h-[300px] sm:h-[340px] bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 p-3 shadow-2xl flex flex-col relative overflow-hidden shrink-0">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/40">
                {sliderImages.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                  >
                    <img src={imgSrc} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                {sliderImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? 'w-6 bg-[#F26522]' : 'w-2 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}