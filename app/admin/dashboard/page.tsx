'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { 
  LogOut, Save, Loader2, LayoutDashboard, UploadCloud, X, Plus, 
  MoreVertical, Edit2, Eye, Trash2, Database, Link as LinkIcon, 
  Building2, AlertCircle, Search, Filter, ChevronLeft, ChevronRight 
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [logoSrc, setLogoSrc] = useState('/logoBPS.jpg')
  
  const [inovasiList, setInovasiList] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterPilar, setFilterPilar] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const [bgFile, setBgFile] = useState<File | null>(null)
  const [bgPreview, setBgPreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [foto1File, setFoto1File] = useState<File | null>(null)
  const [foto1Preview, setFoto1Preview] = useState<string | null>(null)
  const [foto2File, setFoto2File] = useState<File | null>(null)
  const [foto2Preview, setFoto2Preview] = useState<string | null>(null)
  const [foto3File, setFoto3File] = useState<File | null>(null)
  const [foto3Preview, setFoto3Preview] = useState<string | null>(null)
  const [grafikFile, setGrafikFile] = useState<File | null>(null)
  const [grafikPreview, setGrafikPreview] = useState<string | null>(null)

  const [popupMessage, setPopupMessage] = useState<string | null>(null)

  const initialFormState = {
    id: '', nama_inovasi: '', pilar: '', nilai_berakhlak: '', timeline: '',
    deskripsi: '', tujuan: '', output: '', outcome: '', ukuran_keberhasilan: '',
    kondisi_sebelum: '', kondisi_sesudah: '', dampak: '',
    gambar: '', logo: '', foto_1: '', foto_2: '', foto_3: '', grafik: '', link: '', dokumentasi: false
  }
  const [formData, setFormData] = useState(initialFormState)

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
    setFormData(initialFormState)
    setBgFile(null); setBgPreview(null)
    setImageFile(null); setImagePreview(null)
    setFoto1File(null); setFoto1Preview(null)
    setFoto2File(null); setFoto2Preview(null)
    setFoto3File(null); setFoto3Preview(null)
    setGrafikFile(null); setGrafikPreview(null)
    setIsModalOpen(true)
    setActiveDropdown(null)
  }

  const openEditModal = (item: any) => {
    setModalMode('edit')
    setFormData(item)
    setBgFile(null); setBgPreview(item.gambar || null)
    setImageFile(null); setImagePreview(item.logo || null)
    setFoto1File(null); setFoto1Preview(item.foto_1 || null)
    setFoto2File(null); setFoto2Preview(item.foto_2 || null)
    setFoto3File(null); setFoto3Preview(item.foto_3 || null)
    setGrafikFile(null); setGrafikPreview(item.grafik || null)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, typeTarget: 'bg' | 'logo' | 'f1' | 'f2' | 'f3' | 'grafik') => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setPopupMessage('Ukuran gambar terlalu besar! Maksimal 2 MB.')
        return
      }
      if (!file.type.startsWith('image/')) {
        setPopupMessage('Format file harus berupa gambar (PNG/JPG).')
        return
      }

      const previewUrl = URL.createObjectURL(file)
      if (typeTarget === 'bg') { setBgFile(file); setBgPreview(previewUrl) }
      else if (typeTarget === 'logo') { setImageFile(file); setImagePreview(previewUrl) }
      else if (typeTarget === 'f1') { setFoto1File(file); setFoto1Preview(previewUrl) }
      else if (typeTarget === 'f2') { setFoto2File(file); setFoto2Preview(previewUrl) }
      else if (typeTarget === 'f3') { setFoto3File(file); setFoto3Preview(previewUrl) }
      else if (typeTarget === 'grafik') { setGrafikFile(file); setGrafikPreview(previewUrl) }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let finalBgUrl = formData.gambar
      let finalLogoUrl = formData.logo
      let finalFoto1 = formData.foto_1
      let finalFoto2 = formData.foto_2
      let finalFoto3 = formData.foto_3
      let finalGrafik = formData.grafik

      const uploadToSupabase = async (file: File) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`
        const filePath = `sampul-inovasi/${fileName}`
        await supabase.storage.from('images').upload(filePath, file)
        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath)
        return publicUrlData.publicUrl
      }

      if (bgFile) finalBgUrl = await uploadToSupabase(bgFile)
      if (imageFile) finalLogoUrl = await uploadToSupabase(imageFile)
      if (foto1File) finalFoto1 = await uploadToSupabase(foto1File)
      if (foto2File) finalFoto2 = await uploadToSupabase(foto2File)
      if (foto3File) finalFoto3 = await uploadToSupabase(foto3File)
      if (grafikFile) finalGrafik = await uploadToSupabase(grafikFile)

      const { id, ...dataWithoutId } = formData
      const dataToSave = { 
        ...dataWithoutId, 
        gambar: finalBgUrl, logo: finalLogoUrl, foto_1: finalFoto1, 
        foto_2: finalFoto2, foto_3: finalFoto3, grafik: finalGrafik
      }

      if (modalMode === 'add') {
        const { error } = await supabase.from('inovasi').insert([dataToSave])
        if (error) throw error
      } else {
        const { error } = await supabase.from('inovasi').update(dataToSave).eq('id', formData.id)
        if (error) throw error
      }
      
      fetchData()
      setIsModalOpen(false)
    } catch (error: any) {
      setPopupMessage(`Gagal menyimpan data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const uniquePilars = ['Semua', ...Array.from(new Set(inovasiList.map(item => item.pilar).filter(Boolean)))]

  const filteredData = inovasiList.filter(item => {
    const matchesSearch = item.nama_inovasi.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPilar = filterPilar === 'Semua' || item.pilar === filterPilar
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
              {uniquePilars.map(pilar => (
                <option key={pilar as string} value={pilar as string}>{pilar}</option>
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
                          {item.pilar}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
              <h3 className="text-sm font-bold text-slate-800">
                {modalMode === 'add' ? 'Tambah Inovasi Baru' : 'Edit Data Inovasi'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="inovasiForm" onSubmit={handleSubmit} className="space-y-8">
                
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">1. Identitas Program</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Inovasi</label>
                      <input type="text" name="nama_inovasi" value={formData.nama_inovasi} onChange={handleChange} required className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pilar Utama</label>
                      <input type="text" name="pilar" value={formData.pilar} onChange={handleChange} required className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nilai BerAKHLAK</label>
                      <input type="text" name="nilai_berakhlak" value={formData.nilai_berakhlak} onChange={handleChange} required className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Timeline / Kuartal</label>
                      <input type="text" name="timeline" value={formData.timeline} onChange={handleChange} required className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800 transition-colors" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">2. Pengaturan Media & Gambar</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Background Utama (Banner Web)</label>
                      {!bgPreview ? (
                        <label className="flex flex-col items-center justify-center w-full h-24 border border-slate-200 border-dashed rounded cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                          <UploadCloud className="w-4 h-4 text-slate-400 mb-1" />
                          <span className="text-[10px] text-slate-500">Pilih Gambar Banner</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'bg')} />
                        </label>
                      ) : (
                        <div className="relative w-full h-24 rounded border border-slate-200 overflow-hidden">
                          <img src={bgPreview} alt="BG" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => { setBgFile(null); setBgPreview(null); }} className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded text-[9px] font-bold">Ganti</button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Logo Inovasi</label>
                      {!imagePreview ? (
                        <label className="flex flex-col items-center justify-center w-full h-24 border border-slate-200 border-dashed rounded cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                          <UploadCloud className="w-4 h-4 text-slate-400 mb-1" />
                          <span className="text-[10px] text-slate-500">Pilih Logo Utama</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'logo')} />
                        </label>
                      ) : (
                        <div className="relative w-full h-24 rounded border border-slate-200 overflow-hidden">
                          <img src={imagePreview} alt="Logo" className="w-full h-full object-contain bg-white" />
                          <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded text-[9px] font-bold">Ganti</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Foto Dokumentasi (3 Slider)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {!foto1Preview ? (
                        <label className="flex flex-col items-center justify-center w-full h-20 border border-dashed border-slate-200 rounded cursor-pointer bg-slate-50 hover:bg-slate-100">
                          <span className="text-[9px] text-slate-500">+ Tambah Foto 1</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'f1')} />
                        </label>
                      ) : (
                        <div className="relative w-full h-20 rounded border border-slate-200 overflow-hidden">
                          <img src={foto1Preview} alt="F1" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => { setFoto1File(null); setFoto1Preview(null); }} className="absolute top-1 right-1 bg-rose-500 text-white w-4 h-4 flex items-center justify-center rounded text-[9px] font-bold">X</button>
                        </div>
                      )}
                      {!foto2Preview ? (
                        <label className="flex flex-col items-center justify-center w-full h-20 border border-dashed border-slate-200 rounded cursor-pointer bg-slate-50 hover:bg-slate-100">
                          <span className="text-[9px] text-slate-500">+ Tambah Foto 2</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'f2')} />
                        </label>
                      ) : (
                        <div className="relative w-full h-20 rounded border border-slate-200 overflow-hidden">
                          <img src={foto2Preview} alt="F2" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => { setFoto2File(null); setFoto2Preview(null); }} className="absolute top-1 right-1 bg-rose-500 text-white w-4 h-4 flex items-center justify-center rounded text-[9px] font-bold">X</button>
                        </div>
                      )}
                      {!foto3Preview ? (
                        <label className="flex flex-col items-center justify-center w-full h-20 border border-dashed border-slate-200 rounded cursor-pointer bg-slate-50 hover:bg-slate-100">
                          <span className="text-[9px] text-slate-500">+ Tambah Foto 3</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'f3')} />
                        </label>
                      ) : (
                        <div className="relative w-full h-20 rounded border border-slate-200 overflow-hidden">
                          <img src={foto3Preview} alt="F3" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => { setFoto3File(null); setFoto3Preview(null); }} className="absolute top-1 right-1 bg-rose-500 text-white w-4 h-4 flex items-center justify-center rounded text-[9px] font-bold">X</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Grafik Kinerja (Opsional)</label>
                    {!grafikPreview ? (
                      <label className="flex flex-col items-center justify-center w-full md:w-[48%] h-24 border border-slate-200 border-dashed rounded cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                        <UploadCloud className="w-4 h-4 text-slate-400 mb-1" />
                        <span className="text-[10px] text-slate-500">Unggah Grafik</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'grafik')} />
                      </label>
                    ) : (
                      <div className="relative w-full md:w-[48%] h-24 rounded border border-slate-200 overflow-hidden bg-white">
                        <img src={grafikPreview} alt="Grafik" className="w-full h-full object-contain" />
                        <button type="button" onClick={() => { setGrafikFile(null); setGrafikPreview(null); }} className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded text-[9px] font-bold">Ganti</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">3. Substansi Kegiatan</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Deskripsi / Uraian Kegiatan</label>
                      <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} required rows={3} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tujuan Utama</label>
                      <textarea name="tujuan" value={formData.tujuan} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">4. Metrik & Dampak</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Output (Keluaran)</label>
                      <textarea name="output" value={formData.output} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Outcome (Hasil Akhir)</label>
                      <textarea name="outcome" value={formData.outcome} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ukuran Keberhasilan</label>
                      <textarea name="ukuran_keberhasilan" value={formData.ukuran_keberhasilan} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Dampak (Impact)</label>
                      <textarea name="dampak" value={formData.dampak} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kondisi Sebelumnya</label>
                      <textarea name="kondisi_sebelum" value={formData.kondisi_sebelum} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kondisi Saat Ini</label>
                      <textarea name="kondisi_sesudah" value={formData.kondisi_sesudah} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">5. Referensi Dokumen</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Link Eksternal Arsip (Media Drive dll)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                          <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <input type="url" name="link" value={formData.link} onChange={handleChange} placeholder="https://..." className="w-full bg-white border border-slate-200 rounded pl-8 pr-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800" />
                      </div>
                    </div>
                    
                    <label className="flex items-start gap-2.5 cursor-pointer p-3 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                      <div className="flex items-center mt-0.5">
                        <input type="checkbox" name="dokumentasi" checked={formData.dokumentasi} onChange={handleChange} className="w-3.5 h-3.5 rounded border-slate-300 text-[#0B5E90] focus:ring-[#0B5E90]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-700">Arsip Fisik / Digital Telah Diamankan</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">Berikan centang jika seluruh dokumen terkait program ini telah terarsip dengan baik di internal BPS.</span>
                      </div>
                    </label>
                  </div>
                </div>

              </form>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex items-center justify-end gap-2 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded transition-colors">
                Batal
              </button>
              <button form="inovasiForm" type="submit" disabled={loading} className="bg-[#0B5E90] hover:bg-[#084870] text-white font-semibold px-5 py-2 rounded transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-70 text-xs">
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}