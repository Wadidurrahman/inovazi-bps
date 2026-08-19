import { ArrowRight, Activity } from 'lucide-react'

export default function InnovationCardTemplate({ item, onSelect }) {
  const imageUrl = item.gambar || item.dokumentasi || item.logo

  return (
    <div
      onClick={() => onSelect(item)}
      className="group bg-white rounded-2xl cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-1 border border-slate-200 hover:border-[#0B5E90]/30 hover:shadow-xl hover:shadow-[#0B5E90]/5 overflow-hidden"
    >
      <div className="h-48 w-full relative overflow-hidden bg-slate-100">
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={item.nama_inovasi} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        )}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[10px] font-bold tracking-wider px-3 py-1.5 bg-white/90 backdrop-blur-sm text-slate-800 rounded-md uppercase shadow-sm border border-slate-200">
            {item.pilar}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 bg-white relative">
        <h3 className="text-xl font-extrabold text-slate-800 mb-3 group-hover:text-[#0B5E90] transition-colors pr-8 leading-tight">
          {item.nama_inovasi}
        </h3>
        
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6 font-medium flex-1">
          {item.deskripsi}
        </p>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#0B5E90] bg-[#0B5E90]/5 px-3 py-1 rounded-md">
            {item.nilai_berakhlak}
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#F26522] transition-colors">
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}