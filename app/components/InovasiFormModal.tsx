'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/utils/supabase'
import { Save, Loader2, UploadCloud, X, Link as LinkIcon, ChevronDown } from 'lucide-react'

export default function InovasiFormModal({ isOpen, onClose, mode, initialData, onSuccess, setPopupMessage }: any) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<any>({})

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

  const [showPilar, setShowPilar] = useState(false)
  const [showAkhlak, setShowAkhlak] = useState(false)
  
  const pilarRef = useRef<HTMLDivElement>(null)
  const akhlakRef = useRef<HTMLDivElement>(null)

  const pilarOptions = ['Pilar 1', 'Pilar 2', 'Pilar 3', 'Pilar 4', 'Pilar 5', 'Pilar 6']
  const akhlakOptions = ['Berorientasi Pelayanan', 'Akuntabel', 'Kompeten', 'Harmonis', 'Loyal', 'Adaptif', 'Kolaboratif']
  const timelineOptions = ['Harian', 'Mingguan', 'Bulanan', 'Triwulanan', 'Tahunan']

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData(initialData)
        setBgPreview(initialData.gambar || null)
        setImagePreview(initialData.logo || null)
        setFoto1Preview(initialData.foto_1 || null)
        setFoto2Preview(initialData.foto_2 || null)
        setFoto3Preview(initialData.foto_3 || null)
        setGrafikPreview(initialData.grafik || null)
      } else {
        setFormData({
          nama_inovasi: '', pilar: '', nilai_berakhlak: '', timeline: '', deskripsi: '', tujuan: '', 
          output: '', outcome: '', ukuran_keberhasilan: '', kondisi_sebelum: '', kondisi_sesudah: '', 
          dampak: '', gambar: '', logo: '', foto_1: '', foto_2: '', foto_3: '', grafik: '', link_publik: '', link_private: '', dokumentasi: false
        })
        setBgPreview(null); setImagePreview(null); setFoto1Preview(null);
        setFoto2Preview(null); setFoto3Preview(null); setGrafikPreview(null);
      }
      setBgFile(null); setImageFile(null); setFoto1File(null); setFoto2File(null); setFoto3File(null); setGrafikFile(null);
      setShowPilar(false); setShowAkhlak(false);
    }
  }, [isOpen, mode, initialData])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pilarRef.current && !pilarRef.current.contains(event.target as Node)) setShowPilar(false)
      if (akhlakRef.current && !akhlakRef.current.contains(event.target as Node)) setShowAkhlak(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, typeTarget: string) => {
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

      const { id, link, ...dataWithoutId } = formData
      const dataToSave = { 
        ...dataWithoutId, 
        gambar: finalBgUrl, 
        logo: finalLogoUrl, 
        foto_1: finalFoto1, 
        foto_2: finalFoto2, 
        foto_3: finalFoto3, 
        grafik: finalGrafik,
        nilai_berakhlak: formData.nilai_berakhlak || '',
        pilar: formData.pilar || ''
      }

      if (mode === 'add') {
        const { error } = await supabase.from('inovasi').insert([dataToSave])
        if (error) throw error
      } else {
        const { error } = await supabase.from('inovasi').update(dataToSave).eq('id', formData.id)
        if (error) throw error
      }
      
      onSuccess()
      onClose()
    } catch (error: any) {
      setPopupMessage(`Gagal menyimpan data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getSelectedPilarText = () => {
    const arr = formData.pilar ? formData.pilar.split(', ').filter(Boolean) : []
    if (arr.length === 0) return 'Pilih Pilar'
    if (arr.length === 1) return arr[0]
    return `${arr.length} Pilar Terpilih`
  }

  const getSelectedAkhlakText = () => {
    const arr = formData.nilai_berakhlak ? formData.nilai_berakhlak.split(' / ').filter(Boolean) : []
    if (arr.length === 0) return 'Pilih Nilai'
    if (arr.length === 1) return arr[0]
    return `${arr.length} Nilai Terpilih`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <h3 className="text-sm font-bold text-slate-800">
            {mode === 'add' ? 'Tambah Inovasi Baru' : 'Edit Data Inovasi'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
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
                  <input type="text" name="nama_inovasi" value={formData.nama_inovasi || ''} onChange={handleChange} required className="w-full bg-white border border-slate-200 rounded px-3 py-2.5 text-xs focus:border-[#0B5E90] outline-none text-slate-800 transition-colors" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Timeline / Frekuensi</label>
                  <select name="timeline" value={formData.timeline || ''} onChange={handleChange} required className="w-full bg-white border border-slate-200 rounded px-3 py-2.5 text-xs focus:border-[#0B5E90] outline-none text-slate-800 transition-colors appearance-none cursor-pointer">
                    <option value="" disabled>Pilih Priode</option>
                    {timelineOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                
                <div className="relative" ref={pilarRef}>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pilar Utama</label>
                  <div 
                    onClick={() => setShowPilar(!showPilar)}
                    className="w-full bg-white border border-slate-200 rounded px-3 py-2.5 text-xs text-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span className={formData.pilar ? "font-semibold text-[#0B5E90]" : "text-slate-400"}>{getSelectedPilarText()}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showPilar ? 'rotate-180' : ''}`} />
                  </div>
                  {showPilar && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-2 max-h-48 overflow-y-auto animate-fadeIn">
                      {pilarOptions.map((p) => {
                        const currentArr = formData.pilar ? formData.pilar.split(', ').filter(Boolean) : []
                        const isChecked = currentArr.includes(p)
                        return (
                          <label key={p} className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors">
                            <input type="checkbox" checked={isChecked} onChange={(e) => {
                              let updated = [...currentArr]
                              if (e.target.checked) updated.push(p)
                              else updated = updated.filter(i => i !== p)
                              setFormData({...formData, pilar: updated.join(', ')})
                            }} className="w-3.5 h-3.5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                            <span className="text-xs font-semibold text-slate-700">{p}</span>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="relative" ref={akhlakRef}>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nilai BerAKHLAK</label>
                  <div 
                    onClick={() => setShowAkhlak(!showAkhlak)}
                    className="w-full bg-white border border-slate-200 rounded px-3 py-2.5 text-xs text-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span className={formData.nilai_berakhlak ? "font-semibold text-[#0B5E90]" : "text-slate-400"}>{getSelectedAkhlakText()}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showAkhlak ? 'rotate-180' : ''}`} />
                  </div>
                  {showAkhlak && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-2 max-h-48 overflow-y-auto animate-fadeIn">
                      {akhlakOptions.map((a) => {
                        const currentArr = formData.nilai_berakhlak ? formData.nilai_berakhlak.split(' / ').filter(Boolean) : []
                        const isChecked = currentArr.includes(a)
                        return (
                          <label key={a} className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors">
                            <input type="checkbox" checked={isChecked} onChange={(e) => {
                              let updated = [...currentArr]
                              if (e.target.checked) updated.push(a)
                              else updated = updated.filter(i => i !== a)
                              setFormData({...formData, nilai_berakhlak: updated.join(' / ')})
                            }} className="w-3.5 h-3.5 rounded border-slate-300 text-[#0B5E90] focus:ring-[#0B5E90]" />
                            <span className="text-xs font-semibold text-slate-700">{a}</span>
                          </label>
                        )
                      })}
                    </div>
                  )}
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
                  <textarea name="deskripsi" value={formData.deskripsi || ''} onChange={handleChange} required rows={3} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tujuan Utama</label>
                  <textarea name="tujuan" value={formData.tujuan || ''} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">4. Metrik & Dampak</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Output (Keluaran)</label>
                  <textarea name="output" value={formData.output || ''} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Outcome (Hasil Akhir)</label>
                  <textarea name="outcome" value={formData.outcome || ''} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ukuran Keberhasilan</label>
                  <textarea name="ukuran_keberhasilan" value={formData.ukuran_keberhasilan || ''} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Dampak (Impact)</label>
                  <textarea name="dampak" value={formData.dampak || ''} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kondisi Sebelumnya</label>
                  <textarea name="kondisi_sebelum" value={formData.kondisi_sebelum || ''} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kondisi Saat Ini</label>
                  <textarea name="kondisi_sesudah" value={formData.kondisi_sesudah || ''} onChange={handleChange} required rows={2} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800"></textarea>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">5. Referensi Dokumen</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Link Publik (Akses Masyarakat Umum)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <input type="url" name="link_publik" value={formData.link_publik || ''} onChange={handleChange} placeholder="https://..." className="w-full bg-white border border-slate-200 rounded pl-8 pr-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Link Private (Akses Internal Pegawai)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <input type="url" name="link_private" value={formData.link_private || ''} onChange={handleChange} placeholder="https://..." className="w-full bg-white border border-slate-200 rounded pl-8 pr-3 py-2 text-xs focus:border-[#0B5E90] outline-none text-slate-800" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-start gap-2.5 cursor-pointer p-3 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                    <div className="flex items-center mt-0.5">
                      <input type="checkbox" name="dokumentasi" checked={formData.dokumentasi || false} onChange={handleChange} className="w-3.5 h-3.5 rounded border-slate-300 text-[#0B5E90] focus:ring-[#0B5E90]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-700">Arsip Fisik / Digital Telah Diamankan</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">Berikan centang jika seluruh dokumen terkait program ini telah terarsip dengan baik di internal BPS.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex items-center justify-end gap-2 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded transition-colors">
            Batal
          </button>
          <button form="inovasiForm" type="submit" disabled={loading} className="bg-[#0B5E90] hover:bg-[#084870] text-white font-semibold px-5 py-2 rounded transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-70 text-xs">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

      </div>
    </div>
  )
}