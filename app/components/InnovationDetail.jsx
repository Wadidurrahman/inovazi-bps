'use client'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, BarChart3 } from 'lucide-react'

export default function InnovationDetailTemplate({ data, onBack }) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef(null)

  const [currentDetailSlide, setCurrentDetailSlide] = useState(0)
  const detailSliderImages = data ? [data.foto_1, data.foto_2, data.foto_3].filter(Boolean) : []

  const bannerImg = data?.gambar || '/bg-1.webp'

  useEffect(() => {
    if (detailSliderImages.length <= 1) return
    const interval = setInterval(() => {
      setCurrentDetailSlide((prev) => (prev + 1) % detailSliderImages.length)
    }, 3000)
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

  if (!data) return null;

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-50 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar relative font-sans text-slate-800 flex flex-col items-center">
      <style dangerouslySetInnerHTML={{__html: `
        .scroll-reveal {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }
        .scroll-reveal.active-reveal {
          opacity: 1;
          transform: translateY(0);
        }
      `}} />

      <div className="sticky top-0 z-50 w-full h-1 bg-slate-200 shrink-0">
        <div 
          className="h-full bg-[#F26522] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <div className="relative w-full h-[20vh] min-h-[150px] shrink-0 bg-slate-900 overflow-hidden">
        <img 
          src={bannerImg} 
          alt="Banner Inovasi" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-900/10 to-slate-900/70" />
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-20 pb-16 -mt-14 relative z-10 box-border">
        <header className="scroll-reveal mb-6 bg-white p-6 sm:p-7 rounded-xl shadow-sm border border-slate-200/80">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-[#0B5E90] text-white rounded">
              {data.pilar}
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-orange-50 text-orange-600 rounded">
              {data.nilai_berakhlak}
            </span>
          </div>
          
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight mb-2 leading-snug break-words">
            {data.nama_inovasi}
          </h1>
          
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Timeline: {data.timeline}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          <div className="w-full lg:w-[68%] min-w-0 flex flex-col gap-6">
            <div className="scroll-reveal w-full aspect-video rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
              <img 
                src={bannerImg} 
                alt={data.nama_inovasi} 
                className="w-full h-full object-cover"
              />
            </div>

            <article className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-6 sm:p-7 rounded-xl shadow-sm border border-slate-200/80">
              <section className="scroll-reveal">
                <h2 className="text-sm font-bold text-slate-900 mb-1.5 uppercase tracking-wide">Latar Belakang & Deskripsi</h2>
                <p className="break-words font-medium text-slate-600">{data.deskripsi}</p>
              </section>

              <section className="scroll-reveal pt-4 border-t border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 mb-1.5 uppercase tracking-wide">Tujuan Inovasi</h2>
                <p className="break-words font-medium text-slate-600">{data.tujuan}</p>
              </section>

              <section className="scroll-reveal pt-4 border-t border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 mb-2.5 uppercase tracking-wide">Indikator Hasil</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Output (Keluaran)</h3>
                    <p className="font-medium text-slate-700 break-words">{data.output}</p>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Outcome (Hasil Akhir)</h3>
                    <p className="font-medium text-slate-700 break-words">{data.outcome}</p>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Ukuran Keberhasilan</h3>
                    <p className="font-medium text-slate-700 break-words">{data.ukuran_keberhasilan}</p>
                  </div>
                </div>
              </section>

              <section className="scroll-reveal pt-4 border-t border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 mb-2.5 uppercase tracking-wide">Transformasi Kondisi</h2>
                <div className="space-y-3">
                  <div className="pl-3 border-l-2 border-slate-300">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Kondisi Sebelumnya</h3>
                    <p className="font-medium text-slate-600 break-words">{data.kondisi_sebelum}</p>
                  </div>
                  <div className="pl-3 border-l-2 border-[#0B5E90]">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#0B5E90] mb-0.5">Kondisi Saat Ini</h3>
                    <p className="font-medium text-slate-900 break-words">{data.kondisi_sesudah}</p>
                  </div>
                </div>
              </section>

              <section className="scroll-reveal pt-4 border-t border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 mb-1.5 uppercase tracking-wide">Dampak</h2>
                <p className="italic text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 break-words">{data.dampak}</p>
              </section>

              {data.grafik && (
                <section className="scroll-reveal pt-4 border-t border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900 mb-2.5 uppercase tracking-wide flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#F26522]" /> Grafik Kinerja Inovasi
                  </h2>
                  <div className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-center">
                    <img 
                      src={data.grafik} 
                      alt="Grafik Kinerja" 
                      className="w-full max-h-[350px] object-contain rounded"
                    />
                  </div>
                </section>
              )}
            </article>

            <div className="pt-2 flex justify-start scroll-reveal">
              <button
                onClick={onBack}
                className="group bg-white hover:bg-[#F26522] text-[#F26522] hover:text-white border border-[#F26522] font-bold py-2.5 px-6 rounded-lg inline-flex items-center gap-2 transition-all duration-200 shadow-xs text-xs uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                Kembali ke Menu
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[32%] shrink-0">
            <div className="sticky top-6 scroll-reveal space-y-4">
              {data.logo && (
                <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Logo Inovasi</h3>
                  <div className="w-full aspect-square max-h-44 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center p-3">
                    <img src={data.logo} alt={data.nama_inovasi} className="w-full h-full object-contain" />
                  </div>
                </div>
              )}

              {detailSliderImages.length > 0 && (
                <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Dokumentasi Kegiatan</h3>
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-slate-100 bg-slate-900">
                    {detailSliderImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                          idx === currentDetailSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                      >
                        <img src={imgUrl} alt={`Dokumentasi ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="absolute bottom-2.5 left-0 w-full flex justify-center gap-1.5 z-10 px-2">
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

              <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                  Status Arsip
                </h3>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-semibold text-slate-600">Arsip Media Drive</span>
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${data.dokumentasi ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                    {data.dokumentasi ? 'Tersedia' : 'Kosong'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}