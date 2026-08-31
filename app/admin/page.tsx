'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { ArrowLeft, KeyRound, User, Building2, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [logoSrc, setLogoSrc] = useState('/logoBPS.jpg')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) throw error

      router.push('/admin/dashboard')
    } catch (error: any) {
      alert(`Gagal masuk: Email atau kata sandi salah!`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#0B5E90] to-slate-900 font-sans selection:bg-[#F26522] selection:text-white p-4 overflow-y-auto">
      
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden relative z-10 my-auto">
        
        <div className="bg-gradient-to-r from-[#0B5E90] to-[#084870] p-6 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center p-2 mb-3 shadow-lg border border-slate-100">
              <img 
                src={logoSrc} 
                alt="Logo BPS" 
                className="h-full w-full object-contain" 
                onError={() => {
                  if (logoSrc === '/logoBPS.jpg') {
                    setLogoSrc('/logoBPS.png')
                  } else {
                    setLogoSrc('')
                  }
                }} 
              />
              {logoSrc === '' && <Building2 className="w-5 h-5 text-[#0B5E90]" />}
            </div>
            <h1 className="text-lg font-extrabold tracking-wide text-white flex items-center gap-2">
              LOGIN INOVAZI <ShieldCheck className="w-4 h-4 text-[#F26522]" />
            </h1>
            <p className="text-[10px] text-orange-300 font-bold uppercase tracking-widest mt-0.5">BPS Kota Probolinggo</p>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-lg pl-11 pr-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#0B5E90] focus:bg-white focus:ring-2 focus:ring-[#0B5E90]/20 transition"
                  placeholder="admin@bps.go.id"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-lg pl-11 pr-11 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#0B5E90] focus:bg-white focus:ring-2 focus:ring-[#0B5E90]/20 transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0B5E90] transition focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0B5E90] to-[#084870] hover:from-[#084870] hover:to-[#063554] text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 text-xs tracking-wide"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Memeriksa Autentikasi...' : 'Masuk ke Dashboard'}
            </button>
          </form>
        </div>

        <div className="bg-slate-50/80 backdrop-blur px-6 py-3.5 border-t border-slate-100 flex flex-col items-center gap-2">
          <Link href="/" className="inline-flex items-center justify-center space-x-1.5 text-[10px] font-bold text-slate-500 hover:text-[#0B5E90] transition uppercase tracking-widest group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Halaman Publik</span>
          </Link>

          <div className="text-center text-[9px] text-slate-400 font-medium tracking-wide pt-1 border-t border-slate-200/60 w-full">
            © 2026 Badan Pusat Statistik Kota Probolinggo <br />
            Developed by <span className="text-slate-600 font-bold">Wadidurrahman</span>
          </div>
        </div>

      </div>
    </main>
  )
}