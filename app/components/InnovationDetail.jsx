'use client'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export default function InnovationDetailTemplate({ data, onBack }) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef(null)

  // State untuk slider foto dokumentasi di halaman detail
  const [currentDetailSlide, setCurrentDetailSlide] = useState(0)
  const detailSliderImages = data ? [data.foto_1, data.foto_2, data.foto_3].filter(Boolean) : []

  useEffect(() => {
    if (detailSliderImages.length <= 1) return
    const interval = setInterval(() => {
      setCurrentDetailSlide((prev) => (prev + 1) % detailSliderImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [detailSliderImages.length])

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100
        setScrollProgress(progress)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active-reveal')
        }
      })
    }, { threshold: 0.1 })

    const elements = document.querySelectorAll('.scroll-reveal')
    elements.forEach((el) => observer.observe(el))

    return () => {
      if (container) container.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [data])

  return (
    <div ref={containerRef} className="w-full h-full bg-white overflow-y-auto scroll-smooth custom-scrollbar relative font-sans text-slate-800 flex flex-col items-center">
      
      <style dangerouslySetInnerHTML={{__html: `
        .scroll-reveal {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .scroll-reveal.active-reveal {
          opacity: 1;
          transform: translateY(0);
        }
      `}} />

      <div className="sticky top-0 z-50 w-full h-1 bg-slate-100">
        <div 
          className="h-full bg-[#0B5E90] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* CONTAINER UTAMA DITARIK KE TENGAH DENGAN MAKSIMAL LEBAR YANG PAS */}
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-12 pt-8 pb-16">
        
        <header className="scroll-reveal mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-[#0B5E90] text-white rounded-sm">
              {data.pilar}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-slate-100 text-slate-600 rounded-sm">
              {data.nilai_berakhlak}
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 leading-tight">
            {data.nama_inovasi}
          </h1>
          
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Timeline: {data.timeline}
          </p>
        </header>

        <div className="w-full h-px bg-slate-200 my-6 scroll-reveal"></div>

        <div className="flex flex-col lg:flex-row gap-12 justify-center">
          
          {/* ARTIKEL KIRI */}
          <div className="lg:w-[65%]">
            <article className="space-y-6 text-[15px] text-slate-700 leading-relaxed text-justify">
              
              <section className="scroll-reveal">
                <h2 className="text-lg font-bold text-slate-900 mb-1.5">Latar Belakang & Deskripsi</h2>
                <p>{data.deskripsi}</p>
              </section>

              <section className="scroll-reveal">
                <h2 className="text-lg font-bold text-slate-900 mb-1.5">Tujuan Inovasi</h2>
                <p>{data.tujuan}</p>
              </section>

              <section className="scroll-reveal">
                <h2 className="text-lg font-bold text-slate-900 mb-2 border-b border-slate-100 pb-1.5">Indikator Hasil</h2>
                <div className="space-y-3 pt-1">
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Output (Keluaran)</h3>
                    <p>{data.output}</p>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Outcome (Hasil Akhir)</h3>
                    <p>{data.outcome}</p>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Ukuran Keberhasilan</h3>
                    <p>{data.ukuran_keberhasilan}</p>
                  </div>
                </div>
              </section>

              <section className="scroll-reveal">
                <h2 className="text-lg font-bold text-slate-900 mb-2 border-b border-slate-100 pb-1.5">Transformasi Kondisi</h2>
                <div className="space-y-3 pt-1">
                  <div className="pl-3 border-l-2 border-slate-300">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Kondisi Sebelumnya</h3>
                    <p>{data.kondisi_sebelum}</p>
                  </div>
                  <div className="pl-3 border-l-2 border-emerald-500">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-0.5">Kondisi Saat Ini</h3>
                    <p className="text-slate-900 font-medium">{data.kondisi_sesudah}</p>
                  </div>
                </div>
              </section>

              <section className="scroll-reveal">
                <h2 className="text-lg font-bold text-slate-900 mb-1.5">Dampak</h2>
                <p className="italic">{data.dampak}</p>
              </section>

            </article>

            <div className="pt-8 mt-8 border-t border-slate-200 flex justify-end scroll-reveal">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#0B5E90] hover:bg-[#084870] rounded shadow-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Beranda
              </button>
            </div>
          </div>

          {/* SIDEBAR KANAN (LOGO & SLIDER DOKUMENTASI 3 FOTO) */}
          <div className="lg:w-[32%]">
            <div className="sticky top-6 scroll-reveal space-y-6">
              
              {/* 1. LOGO INOVASI */}
              {data.logo && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 shadow-xs">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Logo Inovasi</h3>
                  <div className="w-full h-44 rounded overflow-hidden border border-slate-200 bg-white flex items-center justify-center p-2">
                    <img src={data.logo} alt={data.nama_inovasi} className="w-full h-full object-contain" />
                  </div>
                </div>
              )}

              {/* 2. SLIDER FOTO DOKUMENTASI (3 FOTO) */}
              {detailSliderImages.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 shadow-xs">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Dokumentasi Kegiatan</h3>
                  <div className="relative w-full h-48 rounded-md overflow-hidden border border-slate-200 bg-black">
                    {detailSliderImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                          idx === currentDetailSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                        }`}
                      >
                        <img src={imgUrl} alt={`Dokumentasi ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}

                    {/* Titik Dots Indikator */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                      {detailSliderImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentDetailSlide(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentDetailSlide ? 'w-4 bg-[#F26522]' : 'w-1.5 bg-white/60 hover:bg-white'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. DOKUMEN REFERENSI */}
              <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                  Dokumen Referensi
                </h3>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600">Arsip Media Drive</span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${data.dokumentasi ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {data.dokumentasi ? 'Tersedia' : 'Kosong'}
                  </span>
                </div>

                {data.link && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Tautan Lampiran</h4>
                    <a 
                      href={data.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-between w-full bg-white border border-slate-200 hover:border-[#0B5E90] hover:shadow-sm rounded p-3 transition-all group"
                    >
                      <div className="flex flex-col overflow-hidden mr-2">
                        <span className="text-xs font-bold text-slate-700 group-hover:text-[#0B5E90] truncate transition-colors">Tautan Eksternal</span>
                        <span className="text-[10px] text-slate-500 truncate mt-0.5">{data.link}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#0B5E90] shrink-0 transition-colors" />
                    </a>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}