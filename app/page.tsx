'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import NavbarTemplate from '@/app/components/Navbar'
import InnovationListTemplate from '@/app/components/InnovationList'
import InnovationDetailTemplate from '@/app/components/InnovationDetail'

export default function Home() {
  const [inovasiList, setInovasiList] = useState<any[]>([])
  const [selectedInovasi, setSelectedInovasi] = useState<any>(null)
  const [activeInovasiId, setActiveInovasiId] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInovasi() {
      try {
        const { data, error } = await supabase
          .from('inovasi')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        setInovasiList(data || [])
        if (data && data.length > 0) {
          setActiveInovasiId(data[0].id)
        }
      } catch (error: any) {
        console.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchInovasi()
  }, [])

  const handleNavbarSelect = (id: string) => {
    setActiveInovasiId(id)
    const found = inovasiList.find(item => item.id.toString() === id.toString())
    if (found) {
      setActiveInovasiId(found.id)
      if (selectedInovasi) {
        setSelectedInovasi(found)
      }
    }
  }

  return (
    <main className="h-screen w-full overflow-hidden bg-[#0B5E90] text-slate-100 font-sans selection:bg-[#F26522] selection:text-white flex flex-col">
      <NavbarTemplate
        onBack={() => setSelectedInovasi(null)}
        inovasiList={inovasiList}
        activeInovasiId={activeInovasiId}
        onSelectInovasi={handleNavbarSelect}
      />
      <div className="flex-1 w-full h-[calc(100vh-61px)] overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full ">
            <div className="w-8 h-8 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !selectedInovasi ? (
          <InnovationListTemplate
            inovasiList={inovasiList}
            onSelect={(item: any) => {
              setSelectedInovasi(item)
              setActiveInovasiId(item.id)
            }}
            activeId={activeInovasiId}
          />
        ) : (
          <InnovationDetailTemplate
            data={selectedInovasi}
            onBack={() => setSelectedInovasi(null)}
          />
        )}
      </div>
    </main>
  )
}