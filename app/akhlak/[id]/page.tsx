'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../utils/supabase'; 
import { Loader2, ArrowLeft, Building2 } from 'lucide-react';

export default function AkhlakDetail() {
  const params = useParams();
  const akhlakId = params.id; 

  const [inovasiList, setInovasiList] = useState([]);
  const [akhlakName, setAkhlakName] = useState('Memuat...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: akhlakData } = await supabase
          .from('kategori_akhlak')
          .select('nama_akhlak')
          .eq('id', akhlakId)
          .single();
          
        if (akhlakData) setAkhlakName(akhlakData.nama_akhlak);

        const { data: inovasiData } = await supabase
          .from('inovasi')
          .select('id, nama_inovasi, logo')
          .eq('akhlak_id', akhlakId);
          
        if (inovasiData) setInovasiList(inovasiData);

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (akhlakId) {
      fetchData();
    }
  }, [akhlakId]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#0B5E90] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Inovasi Berdasarkan BerAKHLAK: <span className="text-[#0B5E90]">{akhlakName}</span>
          </h1>
          <p className="mt-2 text-slate-600">Daftar program dan inovasi yang mencerminkan nilai {akhlakName}.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            Memuat data inovasi...
          </div>
        ) : inovasiList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {inovasiList.map((inovasi) => (
              <Link 
                key={inovasi.id} 
                href={`/?inovasi=${inovasi.id}`} 
                className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-100 p-4 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-orange-200 transition-colors">
                  {inovasi.logo ? (
                    <img 
                      src={inovasi.logo} 
                      alt={inovasi.nama_inovasi} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <h3 className="font-bold text-sm text-slate-700 group-hover:text-[#0B5E90] line-clamp-2">
                  {inovasi.nama_inovasi}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Belum ada inovasi</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Saat ini belum ada data inovasi yang didaftarkan pada nilai ini.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}