'use client'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ExternalLink } from 'lucide-react'

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
    <div ref={containerRef} className="w-full h-full bg-slate-100 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar relative font-sans text-slate-800 flex flex-col items-center">
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

      <div className="fixed top-0 left-0 z-[60] w-full h-1 bg-slate-200">
        <div 
          className="h-full bg-[#F26522] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <div className="relative w-full pt-16 pb-24 px-4 sm:px-8 lg:px-20 flex flex-col justify-end min-h-[35vh] shrink-0 bg-slate-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30" 
          style={{ backgroundImage: `url(${bannerImg})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/20" />
        
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {data.pilar && data.pilar.split(',').map((pilarItem, idx) => (
              <span key={idx} className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-[#0B5E90] text-white rounded shadow-sm">
                {pilarItem.trim()}
              </span>
            ))}
            {data.nilai_berakhlak && data.nilai_berakhlak.split('/').map((akhlakItem, idx) => (
              <span key={idx} className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-[#F26522] text-white rounded shadow-sm">
                {akhlakItem.trim()}
              </span>
            ))}
          </div>
          
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight break-words drop-shadow-md">
            {data.nama_inovasi}
          </h1>
          
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Frekuensi Pelaksanaan: <span className="text-white">{data.timeline}</span>
          </p>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 sm:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          <div className="w-full lg:w-[68%] min-w-0 flex flex-col gap-6">
            
            <div className="flex flex-col gap-3">
              <div className="scroll-reveal relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110" 
                  style={{ backgroundImage: `url(${bannerImg})` }} 
                />
                <img 
                  src={bannerImg} 
                  alt={data.nama_inovasi} 
                  className="relative z-10 w-full h-full object-contain drop-shadow-lg"
                />
              </div>

              {data.link_publik && (
                <div className="scroll-reveal px-1">
                  <a 
                    href={data.link_publik} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0B5E90] hover:text-[#F26522] transition-colors group"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span className="group-hover:underline underline-offset-4 break-all">Link: {data.link_publik}</span>
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              <section className="scroll-reveal">
                <h2 className="text-sm font-extrabold text-[#0B5E90] mb-1.5 uppercase tracking-wide border-b border-slate-100 pb-2">Latar Belakang & Deskripsi</h2>
                <p className="break-words font-medium text-slate-600 whitespace-pre-wrap">{data.deskripsi}</p>
              </section>

              <section className="scroll-reveal">
                <h2 className="text-sm font-extrabold text-[#0B5E90] mb-1.5 uppercase tracking-wide border-b border-slate-100 pb-2">Tujuan Inovasi</h2>
                <p className="break-words font-medium text-slate-600 whitespace-pre-wrap">{data.tujuan}</p>
              </section>

              <section className="scroll-reveal">
                <h2 className="text-sm font-extrabold text-[#0B5E90] mb-3 uppercase tracking-wide border-b border-slate-100 pb-2">Indikator Hasil</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#F26522] mb-1">Output</h3>
                    <p className="text-xs font-semibold text-slate-700 break-words whitespace-pre-wrap">{data.output}</p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#F26522] mb-1">Outcome</h3>
                    <p className="text-xs font-semibold text-slate-700 break-words whitespace-pre-wrap">{data.outcome}</p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#F26522] mb-1">Keberhasilan</h3>
                    <p className="text-xs font-semibold text-slate-700 break-words whitespace-pre-wrap">{data.ukuran_keberhasilan}</p>
                  </div>
                </div>
              </section>

              <section className="scroll-reveal">
                <h2 className="text-sm font-extrabold text-[#0B5E90] mb-3 uppercase tracking-wide border-b border-slate-100 pb-2">Transformasi Kondisi</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border-l-2 border-slate-300 bg-slate-50 rounded-r-xl">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Kondisi Sebelumnya</h3>
                    <p className="text-xs font-semibold text-slate-600 break-words whitespace-pre-wrap">{data.kondisi_sebelum}</p>
                  </div>
                  <div className="p-4 border-l-2 border-[#0B5E90] bg-[#0B5E90]/5 rounded-r-xl">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B5E90] mb-1.5">Kondisi Saat Ini</h3>
                    <p className="text-xs font-semibold text-slate-800 break-words whitespace-pre-wrap">{data.kondisi_sesudah}</p>
                  </div>
                </div>
              </section>

              <section className="scroll-reveal">
                <h2 className="text-sm font-extrabold text-[#0B5E90] mb-2 uppercase tracking-wide border-b border-slate-100 pb-2">Dampak Inovasi</h2>
                <p className="font-semibold text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 break-words whitespace-pre-wrap leading-relaxed">{data.dampak}</p>
              </section>

              {data.grafik && (
                <section className="scroll-reveal pt-2">
                  <div className="w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-200 flex justify-center relative">
                    <div 
                      className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110" 
                      style={{ backgroundImage: `url(${data.grafik})` }} 
                    />
                    <img 
                      src={data.grafik} 
                      alt="Grafik Kinerja" 
                      className="relative z-10 w-full max-h-[450px] object-contain drop-shadow-md"
                    />
                  </div>
                </section>
              )}
            </div>

            <div className="pt-6 flex justify-start scroll-reveal">
              <button
                onClick={onBack}
                className="group bg-white hover:bg-[#0B5E90] text-[#0B5E90] hover:text-white border border-[#0B5E90] font-bold py-2.5 px-6 rounded-xl inline-flex items-center gap-2 transition-all duration-200 shadow-sm text-xs uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                Kembali ke Menu Utama
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[32%] shrink-0">
            <div className="sticky top-6 scroll-reveal space-y-6">
              
              {data.logo && (
                <div className="flex flex-col items-center pb-4 border-b border-slate-100">
                  <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 w-full text-left">Logo Inovasi</h3>
                  <img src={data.logo} alt={data.nama_inovasi} className="w-full max-w-[220px] max-h-[220px] object-contain drop-shadow-sm" />
                </div>
              )}

              {detailSliderImages.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Dokumentasi Kegiatan</h3>
                  <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                    {detailSliderImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                          idx === currentDetailSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                      >
                        <div 
                          className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110" 
                          style={{ backgroundImage: `url(${imgUrl})` }} 
                        />
                        <img src={imgUrl} alt={`Dokumentasi ${idx + 1}`} className="relative z-10 w-full h-full object-contain drop-shadow-md" />
                      </div>
                    ))}
                    <div className="absolute bottom-3 left-0 w-full flex justify-center gap-1.5 z-10 px-2 bg-gradient-to-t from-slate-900/60 to-transparent pt-6 pb-1">
                      {detailSliderImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentDetailSlide(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                            idx === currentDetailSlide ? 'w-5 bg-[#F26522]' : 'w-1.5 bg-white/60 hover:bg-white'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Status Arsip</h3>
                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs font-bold text-slate-600">Arsip Fisik & Drive</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm ${data.dokumentasi ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
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