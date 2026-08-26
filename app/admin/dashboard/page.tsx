'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import InovasiFormModal from '@/app/components/InovasiFormModal'
import { 
  LogOut, Loader2, LayoutDashboard, Plus, MoreVertical, Edit2, 
  Eye, Trash2, Database, Link as LinkIcon, Building2, AlertCircle, 
  Search, Filter, ChevronLeft, ChevronRight 
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [authLoading, setAuthLoading] = useState(true)
  const [logoSrc, setLogoSrc] = useState('/logoBPS.jpg')
  
  const [inovasiList, setInovasiList] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterPilar, setFilterPilar] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const [popupMessage, setPopupMessage] = useState<string | null>(null)

  const filterPilarOptions = ['Semua', 'Pilar 1', 'Pilar 2', 'Pilar 3', 'Pilar 4', 'Pilar 5', 'Pilar 6']

  const fetchData = async () => {
    const { data } = await supabase.from('inovasi').select('*').order('created_at', { ascending: false })
    if (data) setInovasiList(data)
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin')
      } else {
        setAuthLoading(false)
        fetchData()
      }
    }
    checkUser()

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [router])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterPilar])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  const openAddModal = () => {
    setModalMode('add')
    setSelectedItem(null)
    setIsModalOpen(true)
    setActiveDropdown(null)
  }

  const openEditModal = (item: any) => {
    setModalMode('edit')
    setSelectedItem(item)
    setIsModalOpen(true)
    setActiveDropdown(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data inovasi ini?')) {
      await supabase.from('inovasi').delete().eq('id', id)
      fetchData()
    }
    setActiveDropdown(null)
  }

  const filteredData = inovasiList.filter(item => {
    const matchesSearch = item.nama_inovasi.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPilar = filterPilar === 'Semua' || (item.pilar && item.pilar.includes(filterPilar))
    return matchesSearch && matchesPilar
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 text-[#0B5E90] animate-spin" /></div>
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {popupMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6 max-w-sm w-full text-center">
            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Perhatian</h3>
            <p className="text-xs text-slate-600 mb-6">{popupMessage}</p>
            <button onClick={() => setPopupMessage(null)} className="w-full bg-[#0B5E90] hover:bg-[#084870] text-white font-semibold py-2 rounded-lg transition text-xs">
              Mengerti
            </button>
          </div>
        </div>
      )}

      <header className="shrink-0 w-full bg-white border-b border-slate-200 shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 shadow-xs">
              <img 
                src={logoSrc} 
                alt="Logo BPS" 
                className="h-full w-full object-contain p-1" 
                onError={() => setLogoSrc('/logoBPS.png')} 
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 tracking-tight">Ruang Admin</h1>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Portal Inovazi BPS</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="text-xs font-semibold text-slate-600 hover:text-[#0B5E90] px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 hover:bg-slate-50">
              <LayoutDashboard className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Pratinjau Web</span>
            </button>
            <div className="w-px h-4 bg-slate-200"></div>
            <button onClick={handleLogout} className="text-xs font-semibold text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 hover:bg-rose-50">
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-20 py-6 overflow-hidden">
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Daftar Inovasi</h2>
            <p className="text-xs text-slate-500 mt-1">Kelola direktori program inovasi dengan mudah.</p>
          </div>
          <button onClick={openAddModal} className="inline-flex items-center justify-center gap-2 bg-[#0B5E90] hover:bg-[#084870] text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm text-xs">
            <Plus className="w-3.5 h-3.5" /> Tambah Inovasi
          </button>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari inovasi..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none text-slate-700" 
            />
          </div>
          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <select 
              value={filterPilar}
              onChange={(e) => setFilterPilar(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none text-slate-700 appearance-none cursor-pointer"
            >
              {filterPilarOptions.map(pilar => (
                <option key={pilar} value={pilar}>{pilar}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Program Inovasi</th>
                  <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pilar</th>
                  <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {item.logo ? (
                            <img src={item.logo} alt="" className="w-9 h-9 rounded-md border border-slate-200 object-cover bg-white" />
                          ) : (
                            <div className="w-9 h-9 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-slate-300" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800 text-xs truncate max-w-[300px]">{item.nama_inovasi}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{item.timeline}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                          {item.pilar || '-'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Tayang
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right relative">
                        <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === item.id ? null : item.id) }} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeDropdown === item.id && (
                          <div ref={dropdownRef} className="absolute right-8 top-8 w-38 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-[50] animate-fadeIn">
                            <button onClick={() => router.push(`/?detail=${item.id}`)} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                              <Eye className="w-3.5 h-3.5" /> Preview Publik
                            </button>
                            {item.link && (
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors">
                                <LinkIcon className="w-3.5 h-3.5" /> Buka Arsip
                              </a>
                            )}
                            <button onClick={() => openEditModal(item)} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-[#0B5E90] hover:bg-blue-50 transition-colors">
                              <Edit2 className="w-3.5 h-3.5" /> Edit Data
                            </button>
                            <div className="border-t border-slate-100 my-1"></div>
                            <button onClick={() => handleDelete(item.id)} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" /> Hapus Data
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Database className="w-8 h-8 text-slate-300 mb-2" />
                        <p className="text-xs text-slate-500 font-medium">Tidak ada data ditemukan.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="shrink-0 bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-medium">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} data
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-semibold transition-colors ${
                      currentPage === idx + 1 ? 'bg-[#0B5E90] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <InovasiFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedItem}
        onSuccess={fetchData}
        setPopupMessage={setPopupMessage}
      />
    </div>
  )
}