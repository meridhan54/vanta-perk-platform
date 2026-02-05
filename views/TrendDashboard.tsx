
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTrendInsights } from '../geminiService';

const SECTOR_DATA = [
  { name: 'Teknoloji', fitness: 400, health: 240, education: 500, lifestyle: 180 },
  { name: 'Finans', fitness: 300, health: 450, education: 200, lifestyle: 300 },
  { name: 'Perakende', fitness: 200, health: 150, education: 100, lifestyle: 400 },
  { name: 'Üretim', fitness: 250, health: 300, education: 150, lifestyle: 100 },
];

const TrendDashboard: React.FC = () => {
  const [insight, setInsight] = useState<string>('Analiz ediliyor...');

  useEffect(() => {
    const fetchInsight = async () => {
      const text = await getTrendInsights(SECTOR_DATA);
      setInsight(text || "Analiz hatası.");
    };
    fetchInsight();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Finansal Trendler & Raporlama</h1>
        <p className="text-xs text-slate-500">Sektörel bazda satın alma eğilimleri ve platform performansı.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="font-bold text-sm mb-6 text-slate-800 uppercase tracking-widest">Sektörel Talep Analizi</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SECTOR_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="fitness" fill="#6366f1" radius={[2, 2, 0, 0]} />
                <Bar dataKey="education" fill="#10b981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="health" fill="#f43f5e" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-indigo-900 text-white p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-4">
                <span className="p-1.5 bg-white/20 rounded-lg text-sm">🤖</span>
                <h2 className="font-bold text-base">AI Analiz Notu</h2>
             </div>
             <p className="text-xs leading-relaxed opacity-90 italic">
               "{insight}"
             </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 text-[9px] opacity-60">
            * Analizler VANTA altyapısı üzerinden geçen doğrudan işlemlerden türetilmiştir.
          </div>
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-black text-sm uppercase tracking-widest mb-6">İş Modeli ve Para Akışı (MoR)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-bold text-indigo-600 flex items-center gap-2 text-xs">
              <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">1</span>
              Ödeme Tahsilatı (B2C)
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Kullanıcı (Çalışan), ödemeyi VANTA Sanal POS'u üzerinden yapar. Para VANTA'nın havuz hesabına aktarılır. Kullanıcıya **VANTA Teknolojileri A.Ş.** tarafından fatura kesilir.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-indigo-600 flex items-center gap-2 text-xs">
              <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">2</span>
              Tedarikçi Mutabakatı (B2B)
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Hizmet/Ürün kullanıldıktan sonra, tedarikçi (Örn: MacFit) VANTA'ya kurumsal anlaşma bedeli üzerinden fatura keser. VANTA, komisyonunu içeride tutarak kalan bakiyeyi tedarikçiye aktarır.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-indigo-600 flex items-center gap-2 text-xs">
              <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">3</span>
              Operasyonel Avantaj
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Tedarikçiler tek tek personelle uğraşmaz, VANTA ile tek bir kurumsal muhataplık kurar. Personel ise platform gücü sayesinde bireysel alamayacağı fiyatlara VANTA üzerinden erişir.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrendDashboard;
