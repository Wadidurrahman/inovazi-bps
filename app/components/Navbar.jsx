import { UserCircle, Building2, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

export default function NavbarTemplate({ onBack, inovasiList, activeInovasiId, onSelectInovasi }) {
  const [imageError, setImageError] = useState(false)
  const [logoSrc, setLogoSrc] = useState('/logoBPS.jpg')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const displayList = inovasiList && inovasiList.length > 0 ? inovasiList : []
  const activeItem = displayList.find(i => i.id?.toString() === activeInovasiId?.toString())

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="w-full bg-gradient-to-r from-slate-900 via-[#0B5E90] to-slate-900 backdrop-blur-xl border-b border-slate-700/60 shadow-lg z-50 sticky top-0 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-24 py-3 flex items-center justify-between gap-3 sm:gap-4">
        
        <div
          onClick={onBack}
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer select-none group shrink-0"
        >
          <div className="h-10 w-10 sm:h-11 sm:w-11 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-white/20 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 relative">
            {!imageError ? (
              <img 
                src={logoSrc}
                alt="Logo BPS" 
                className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:rotate-3"
                onError={() => {
                  if (logoSrc === '/logoBPS.jpg') {
                    setLogoSrc('/logoBPS.png')
                  } else if (logoSrc === '/logoBPS.png') {
                    setLogoSrc('/logo-bps.jpg')
                  } else {
                    setImageError(true)
                  }
                }}
              />
            ) : (
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B5E90]" />
            )}
          </div>
          <div className="leading-tight group-hover:translate-x-1 transition-transform duration-300">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              INOVAZI
            </h1>
            <p className="text-[9px] sm:text-[10px] text-orange-300 font-bold uppercase tracking-widest">BPS Kota Probolinggo</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4">
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between gap-2 sm:gap-3 w-40 sm:w-56 md:w-64 bg-white hover:bg-white/20 text-slate-800 hover:text-white font-semibold text-xs sm:text-sm rounded-md px-3.5 sm:px-4 py-2.5 border border-white/40 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 truncate">
                {activeItem?.logo || activeItem?.gambar ? (
                  <img 
                    src={activeItem.logo || activeItem.gambar} 
                    alt="" 
                    className="w-5 h-5 rounded object-cover shrink-0 border border-slate-200" 
                  />
                ) : null}
                <span className="truncate">{activeItem?.nama_inovasi || 'Pilih Inovasi'}</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-orange-300 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-tr-md shadow-2xl border border-slate-100 py-2 z-50 max-h-80 overflow-y-auto transform opacity-100 scale-100 transition-all duration-300 origin-top-right animate-fadeIn">
                <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Daftar Program Inovasi
                </div>
                {displayList.map((item) => {
                  const thumb = item.logo || item.gambar
                  const isSelected = item.id?.toString() === activeItem?.id?.toString()
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectInovasi(item.id)
                        setIsOpen(false)
                      }}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-200 ${
                        isSelected ? 'bg-[#0B5E90]/10 text-[#0B5E90]' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {thumb && <img src={thumb} alt="" className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0" />}
                      <div className="truncate flex-1">
                        <p className={`text-sm truncate ${isSelected ? 'font-bold' : 'font-medium'}`}>{item.nama_inovasi}</p>
                        <p className="text-[10px] text-slate-500 truncate">{item.pilar}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <Link 
            href="/admin" 
            className="flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 bg-gradient-to-r from-orange-500 to-[#F26522] hover:from-orange-600 hover:to-orange-700 text-white rounded-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg shadow-orange-500/20 shrink-0"
            title="Masuk Ruang Admin"
          >
            <UserCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </div>

      </div>
    </header>
  )
}