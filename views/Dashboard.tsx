
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile, Perk } from '../types';
import { getSmartMatching } from '../geminiService';
import { supabase } from '../supabaseClient';

interface DashboardProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  perks: Perk[];
}

const CATEGORIES = [
  { id: 'Hepsi', label: 'Tümü', icon: '🔥' },
  { id: 'Yeme & İçme', label: 'Mutfak', icon: '🍽️' },
  { id: 'Spor', label: 'Fitness', icon: '💪' },
  { id: 'Sağlık', label: 'Sağlık', icon: '🏥' },
  { id: 'Masaj & Spa', label: 'Spa', icon: '💆' },
  { id: 'Eğitim', label: 'Eğitim', icon: '🎓' },
  { id: 'Teknoloji', label: 'Tech', icon: '💻' },
  { id: 'Etkinlik', label: 'Sosyal', icon: '🎟️' },
  { id: 'Turizm', label: 'Seyahat', icon: '✈️' }
];

const Dashboard: React.FC<DashboardProps> = ({ user, perks, onUpdateUser }) => {
  const [filter, setFilter] = useState('Hepsi');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const loadAi = async () => {
      if (perks.length > 0) {
        try {
          const res = await getSmartMatching(user, perks);
          setRecommendations(res.matches || []);
        } catch (e) {
          console.error("AI matching failed", e);
        }
      }
      setLoading(false);
    };
    loadAi();
  }, [user, perks]);

  const handleAction = async (perk: Perk) => {
    const amount = perk.discountedPrice || 500;
    const bonusMultiplier = user.tier === 'Gold' ? 1.1 : user.tier === 'Silver' ? 1.05 : 1;
    const baseValueStr = perk.value.replace(/[^0-9]/g, '');
    const baseValue = baseValueStr ? parseFloat(baseValueStr) / 100 : 0.05;
    const earnings = amount * baseValue * bonusMultiplier;

    const authUser = await supabase.auth.getUser();
    const userId = authUser.data.user?.id;
    if (!userId) return;

    // 1. Kaydı Purchases tablosuna ekle
    const { error: purchaseError } = await supabase.from('purchases').insert([{
      userId: userId,
      perkId: perk.id,
      amount: amount,
      earnings: earnings,
      storeName: perk.supplierName,
      status: 'confirmed'
    }]);

    if (purchaseError) {
      console.error("Purchase logging error:", purchaseError);
      return;
    }

    // 2. Kullanıcı profilini güncelle
    const newTotalSpent = user.totalSpent + amount;
    let newTier = user.tier;
    if (newTotalSpent >= 5000) newTier = 'Gold';
    else if (newTotalSpent >= 2000) newTier = 'Silver';

    onUpdateUser({
      ...user,
      totalSpent: newTotalSpent,
      balance: user.balance + earnings,
      tier: newTier
    });

    setSelectedPerk(null);
    setNotification(`Fırsat Onaylandı! ${earnings.toFixed(2)} TL bakiye kazandınız.`);
    setTimeout(() => setNotification(null), 3000);
  };

  if (!loading && perks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-4xl mx-auto border-2 border-indigo-100">🏪</div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Pazaryeri Kataloğu Hazırlanıyor</h2>
        <p className="text-slate-500 max-w-md mx-auto text-sm">Veritabanı bağlantısı kuruldu. Örnek verileri hemen yüklemek için İçerik Yönetimi'ne geçin.</p>
        <Link to="/admin" className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all">
          Yönetim Panelini Aç
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 relative">
      
      {notification && (
        <div className="fixed top-20 right-6 z-[300] bg-green-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-300">
          <span className="text-xl">🎉</span>
          <p className="text-xs font-black uppercase tracking-widest">{notification}</p>
        </div>
      )}

      <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 space-y-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="bg-indigo-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20">AKILLI EŞLEŞTİRME AKTİF</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
            {user.fullName.split(' ')[0]}, <br/> Sana Özel Yan Haklar.
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-sm font-medium">
            Profiline en uygun fırsatları AI yardımıyla listeliyoruz. Harcadıkça kazan, kazandıkça harca.
          </p>
        </div>
        
        <div className="mt-8 md:mt-0 bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl flex flex-col items-center justify-center min-w-[240px] shadow-inner">
           <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">CÜZDAN BAKİYESİ</p>
           <p className="text-4xl font-black text-white">{user.balance.toFixed(2)} TL</p>
           <div className="mt-4 flex gap-2">
              <span className="bg-green-500/20 text-green-400 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-green-500/30">Harcamaya Hazır</span>
           </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-6 scrollbar-hide pt-2">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setFilter(cat.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-[20px] border-2 transition-all whitespace-nowrap ${filter === cat.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'}`}
          >
            <span className="text-xl">{cat.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
          </button>
        ))}
      </div>

      {!loading && recommendations.length > 0 && filter === 'Hepsi' && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 px-2">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">
              Profiline Özel Seçimler
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map(rec => {
              const perk = perks.find(p => p.id === rec.perkId);
              if (!perk) return null;
              return (
                <div key={perk.id} onClick={() => setSelectedPerk(perk)} className="bg-white p-6 rounded-[32px] border-2 border-slate-100 shadow-sm relative group overflow-hidden cursor-pointer hover:border-indigo-600 hover:shadow-2xl transition-all duration-500 flex flex-col">
                   <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">AKILLI TAVSİYE</div>
                   <div className="mb-4">
                      <h4 className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-1">{perk.supplierName}</h4>
                      <h3 className="text-base font-black text-slate-900 line-clamp-2 leading-tight">{perk.title}</h3>
                   </div>
                   <div className="bg-indigo-50/50 p-4 rounded-2xl mb-6 border border-indigo-100/50 flex-1">
                      <p className="text-[10px] text-slate-600 font-bold leading-relaxed">"{rec.reason}"</p>
                   </div>
                   <div className="flex justify-between items-center mt-auto">
                      <span className="text-lg font-black text-slate-900">{perk.discountedPrice || perk.value} TL</span>
                      <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center group-hover:bg-indigo-600 transition-colors">→</div>
                   </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-8">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-2xl font-black tracking-tighter uppercase text-slate-900">{filter === 'Hepsi' ? 'Tüm Fırsatlar' : filter}</h2>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{perks.filter(p => filter === 'Hepsi' || p.category === filter).length} Fırsat Mevcut</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {perks.filter(p => filter === 'Hepsi' || p.category === filter).map(perk => (
            <div key={perk.id} onClick={() => setSelectedPerk(perk)} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer shadow-sm">
              <div className="h-44 bg-slate-100 relative overflow-hidden">
                 <img src={perk.imageUrl} alt={perk.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-900 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                    {perk.value} KAZANÇ
                 </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1 space-y-3">
                <div className="flex items-center gap-2">
                   <span className="text-[7px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded uppercase tracking-widest">{perk.category}</span>
                   <span className="text-[7px] font-black px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded uppercase tracking-widest">{perk.location}</span>
                </div>
                
                <h3 className="font-black text-[12px] text-slate-800 line-clamp-2 leading-tight h-8 group-hover:text-indigo-600 transition-colors">
                  {perk.title}
                </h3>
                
                <div className="pt-3 border-t border-slate-50 flex items-center justify-between mt-auto">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-300 line-through leading-none mb-1">{perk.originalPrice} TL</span>
                      <span className="text-base font-black text-slate-900 leading-none">{perk.discountedPrice || perk.value} TL</span>
                   </div>
                   <div className="bg-slate-900 text-white w-9 h-9 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-all shadow-md">
                     <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedPerk && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-lg" onClick={() => setSelectedPerk(null)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
            <button onClick={() => setSelectedPerk(null)} className="absolute top-8 right-8 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all border border-white/20 font-black">✕</button>

            <div className="h-80 relative shrink-0">
               <img src={selectedPerk.imageUrl} className="w-full h-full object-cover" alt={selectedPerk.title} />
               <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
               <div className="absolute bottom-10 left-10 right-10">
                  <span className="bg-indigo-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-indigo-600/20">{selectedPerk.category}</span>
                  <h2 className="text-3xl font-black text-slate-900 mt-4 leading-tight tracking-tighter">{selectedPerk.title}</h2>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">{selectedPerk.supplierName} • {selectedPerk.location}</p>
               </div>
            </div>

            <div className="px-10 pb-10 flex-1 overflow-y-auto custom-scrollbar space-y-10">
               <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-center gap-5">
                     <div className="text-3xl">🗓️</div>
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Geçerlilik</p>
                        <p className="text-xs font-black text-slate-900">{selectedPerk.validUntil}</p>
                     </div>
                  </div>
                  <div className="bg-indigo-50/50 p-6 rounded-[32px] border border-indigo-100 flex items-center gap-5">
                     <div className="text-3xl text-indigo-600">💎</div>
                     <div>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Kalan Limit</p>
                        <p className="text-xs font-black text-indigo-900">{selectedPerk.redemptionLimit - selectedPerk.currentRedemptions} Adet</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Kampanya Detayı</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                    {selectedPerk.description || "Bu kampanya VANTA kullanıcılarına özel olarak sunulmaktadır. Dijital kod veya fiziksel katılım ile anında faydalanabilirsiniz."}
                  </p>
               </div>

               <div className="bg-slate-900 rounded-[40px] p-8 text-white flex items-center justify-between shadow-2xl">
                  <div>
                    <p className="text-[9px] font-black text-indigo-400 uppercase mb-2 tracking-widest">Özel Fiyatınız</p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-500 line-through font-bold">{selectedPerk.originalPrice} TL</span>
                      <span className="text-4xl font-black text-white leading-none">{selectedPerk.discountedPrice || selectedPerk.value} TL</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAction(selectedPerk)}
                    className="bg-indigo-600 text-white px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                  >
                    Fırsatı Aktif Et
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
