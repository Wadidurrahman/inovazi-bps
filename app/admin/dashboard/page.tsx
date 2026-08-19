'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { LogOut, Save, Loader2, LayoutDashboard, UploadCloud, X, Plus, MoreVertical, Edit2, Eye, Trash2, Database, Link as LinkIcon, Building2, AlertCircle } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [logoError, setLogoError] = useState(false)
  
  const [inovasiList, setInovasiList] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // STATE UNTUK POPUP NOTIFIKASI KUSTOM
  const [popupMessage, setPopupMessage] = useState<string | null>(null)

  const initialFormState = {
    id: '', nama_inovasi: '', pilar: '', nilai_berakhlak: '', timeline: '',
    deskripsi: '', tujuan: '', output: '', outcome: '', ukuran_keberhasilan: '',
    kondisi_sebelum: '', kondisi_sesudah: '', dampak: '',
    logo: '', link: '', dokumentasi: false
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  const openAddModal = () => {
    setModalMode('add')
    setFormData(initialFormState)
    setImageFile(null)
    setImagePreview(null)
    setIsModalOpen(true)
    setActiveDropdown(null)
  }

  const openEditModal = (item: any) => {
    setModalMode('edit')
    setFormData(item)
    setImageFile(null)
    setImagePreview(item.logo || item.gambar || null)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  // VALIDASI DENGAN POPUP KUSTOM (TANPA KATA SUPABASE)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSizeInBytes = 2 * 1024 * 1024 // 2 MB

      if (file.size > maxSizeInBytes) {
        setPopupMessage('Ukuran gambar terlalu besar! Maksimal ukuran file adalah 2 MB.')
        e.target.value = ''
        return
      }

      if (!file.type.startsWith('image/')) {
        setPopupMessage('Format file tidak valid! Harap unggah file berformat gambar (PNG atau JPG).')
        e.target.value = ''
        return
      }

      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let finalImageUrl = formData.logo

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `sampul-inovasi/${fileName}`

        await supabase.storage.from('images').upload(filePath, imageFile)
        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath)
        finalImageUrl = publicUrlData.publicUrl
      }

      const { id, ...dataWithoutId } = formData
      const dataToSave = { ...dataWithoutId, logo: finalImageUrl }

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

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F4F8FB]"><Loader2 className="w-8 h-8 text-[#0B5E90] animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-[#F4F8FB] text-slate-800 font-sans pb-12 relative">
      
      {/* POPUP MODAL NOTIFIKASI KUSTOM */}
      {popupMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 max-w-sm w-full text-center transform transition-all">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Perhatian</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">{popupMessage}</p>
            <button 
              onClick={() => setPopupMessage(null)} 
              className="w-full bg-[#0B5E90] hover:bg-[#084870] text-white font-bold py-2.5 rounded-xl transition shadow-md text-sm"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm sticky top-0 z-40 transition-all">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center p-1.5 border border-slate-200 shadow-sm">
              {!logoError ? (
                <img src="/logo-bps.png" alt="Logo" className="h-full w-full object-contain" onError={() => setLogoError(true)} />
              ) : (
                <Building2 className="w-5 h-5 text-[#0B5E90]" />
              )}
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">Ruang Admin</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Portal Inovazi BPS</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => router.push('/')} className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0B5E90] px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-2 hover:bg-slate-50">
              <LayoutDashboard className="w-4 h-4" /> 
              <span className="hidden sm:inline">Pratinjau Web</span>
            </button>
            <button onClick={handleLogout} className="text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-600 px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
              <LogOut className="w-4 h-4" /> 
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 sm:px-10 mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Daftar Inovasi</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">Kelola semua program inovasi Anda di sini.</p>
          </div>
          <button 
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 bg-[#0B5E90] hover:bg-[#084870] text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Inovasi
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-visible">
          {inovasiList.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-4 border border-slate-200">
                <Database className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">Belum ada data</h3>
              <p className="text-slate-500 text-sm">Klik tombol Tambah Inovasi untuk memulai.</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto pb-32">
              <table className="w-full text-left border-collapse whitespace-nowrap sm:whitespace-normal">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Program Inovasi</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pilar</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inovasiList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.logo && (
                            <img src={item.logo} alt="" className="w-10 h-10 rounded border border-slate-200 object-cover" />
                          )}
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{item.nama_inovasi}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.timeline}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded border border-slate-200">
                          {item.pilar}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Tayang
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === item.id ? null : item.id)
                            }}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {activeDropdown === item.id && (
                            <div ref={dropdownRef} className="absolute right-0 top-10 mt-1 w-40 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-[100] animate-fadeIn">
                              <button onClick={() => router.push('/')} className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                <Eye className="w-3.5 h-3.5" /> Review
                              </button>
                              <button onClick={() => openEditModal(item)} className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#0B5E90] hover:bg-blue-50 transition-colors">
                                <Edit2 className="w-3.5 h-3.5" /> Edit Data
                              </button>
                              <div className="border-t border-slate-100 my-1"></div>
                              <button onClick={() => handleDelete(item.id)} className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" /> Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-extrabold text-slate-800">
                {modalMode === 'add' ? 'Tambah Inovasi Baru' : 'Edit Data Inovasi'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
              <form id="inovasiForm" onSubmit={handleSubmit} className="space-y-8">
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">1. Identitas Program</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nama Inovasi</label>
                      <input type="text" name="nama_inovasi" value={formData.nama_inovasi} onChange={handleChange} required className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none transition-all font-medium text-slate-800" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Pilar Utama</label>
                      <input type="text" name="pilar" value={formData.pilar} onChange={handleChange} required className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none transition-all font-medium text-slate-800" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nilai BerAKHLAK</label>
                      <input type="text" name="nilai_berakhlak" value={formData.nilai_berakhlak} onChange={handleChange} required className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none transition-all font-medium text-slate-800" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Timeline / Kuartal</label>
                      <input type="text" name="timeline" value={formData.timeline} onChange={handleChange} required className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none transition-all font-medium text-slate-800" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">2. Visual & Media</h4>
                  {!imagePreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors group">
                      <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-[#0B5E90] mb-3 transition-colors" />
                      <p className="mb-1 text-sm font-semibold text-slate-600">Klik untuk unggah gambar (Logo/Dokumentasi)</p>
                      <p className="text-xs text-slate-400">PNG, JPG (Maks 2MB)</p>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  ) : (
                    <div className="relative w-full max-w-sm h-48 rounded-lg border border-slate-200 overflow-hidden group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="bg-white text-rose-600 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-rose-50">
                          <X className="w-3 h-3" /> Ganti Gambar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">3. Substansi Kegiatan</h4>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Deskripsi / Uraian Kegiatan</label>
                      <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} required rows={3} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none transition-all resize-none font-medium text-slate-800"></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Tujuan Utama</label>
                      <textarea name="tujuan" value={formData.tujuan} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none transition-all resize-none font-medium text-slate-800"></textarea>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">4. Metrik & Dampak</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Output (Keluaran)</label>
                      <textarea name="output" value={formData.output} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none transition-all resize-none font-medium text-slate-800"></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Outcome (Hasil)</label>
                      <textarea name="outcome" value={formData.outcome} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none transition-all resize-none font-medium text-slate-800"></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Ukuran Keberhasilan</label>
                      <textarea name="ukuran_keberhasilan" value={formData.ukuran_keberhasilan} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none transition-all resize-none font-medium text-slate-800"></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Dampak Signifikan</label>
                      <textarea name="dampak" value={formData.dampak} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none transition-all resize-none font-medium text-slate-800"></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Kondisi Sebelum</label>
                      <textarea name="kondisi_sebelum" value={formData.kondisi_sebelum} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none transition-all resize-none font-medium text-slate-800"></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Kondisi Sesudah</label>
                      <textarea name="kondisi_sesudah" value={formData.kondisi_sesudah} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none transition-all resize-none font-medium text-slate-800"></textarea>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">5. Referensi Dokumen & Tautan</h4>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Tautan / Link Eksternal (Jika ada)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LinkIcon className="h-4 w-4 text-slate-400" />
                        </div>
                        <input type="url" name="link" value={formData.link} onChange={handleChange} placeholder="https://drive.google.com/..." className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-[#0B5E90] focus:ring-1 focus:ring-[#0B5E90] outline-none transition-all font-medium text-slate-800" />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5">*Kosongkan jika tidak ada tautan luar yang dilampirkan.</p>
                    </div>
                    
                    <label className="flex items-start gap-3 cursor-pointer p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center h-5">
                        <input type="checkbox" name="dokumentasi" checked={formData.dokumentasi} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-[#0B5E90] focus:ring-[#0B5E90]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700">Dokumentasi Tersedia di Media Drive</span>
                        <span className="text-xs text-slate-500 mt-0.5">Centang ini jika file fisik / dokumentasi foto sudah diamankan di Google Drive internal BPS.</span>
                      </div>
                    </label>
                  </div>
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                Batal
              </button>
              <button form="inovasiForm" type="submit" disabled={loading} className="bg-[#0B5E90] hover:bg-[#084870] text-white font-bold px-6 py-2.5 rounded-lg transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 text-sm">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {loading ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}