
import React, { useState, useEffect } from 'react';
import { UserProfile, UserPurchase } from '../types';
import { supabase } from '../supabaseClient';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const authUser = await supabase.auth.getUser();
      const userId = authUser.data.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('userId', userId)
        .order('purchaseDate', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (e) {
      console.error("Error fetching purchases:", e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* HEADER CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-sm relative overflow-hidden">
        <div className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-2xl shrink-0">
          {user.fullName[0]}
        </div>
        <div className="flex-1 text-center md:text-left">
           <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
             <h1 className="text-2xl font-black text-slate-900">{user.fullName}</h1>
             <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${user.tier === 'Gold' ? 'border-amber-500 text-amber-500' : user.tier === 'Silver' ? 'border-slate-400 text-slate-400' : 'border-orange-600 text-orange-600'}`}>
                {user.tier} Member
             </span>
           </div>
           <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{user.jobTitle} • {user.companyName}</p>
           <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase">📍 {user.location}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">✉️ {user.email}</span>
           </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-5 select-none pointer-events-none">
           <span className="text-9xl font-black uppercase">{user.tier}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* WALLET & TIER STATS */}
        <div className="space-y-6">
           <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Cüzdan Bakiyesi</p>
              <p className="text-3xl font-black text-indigo-400 mb-6">{user.balance.toFixed(2)} TL</p>
              <div className="space-y-3">
                 <button className="w-full bg-indigo-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">Nakit Olarak Çek</button>
                 <button onClick={fetchPurchases} className="w-full bg-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Yenile</button>
              </div>
           </div>

           <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Katman İlerlemesi</h3>
              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                       <span>Bronz</span>
                       <span>Silver</span>
                       <span>Gold</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-600" style={{width: `${Math.min((user.totalSpent / 2000) * 100, 100)}%`}}></div>
                    </div>
                 </div>
                 <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-[10px] font-black text-indigo-700 uppercase leading-relaxed">
                       {user.tier === 'Gold' ? 'En yüksek kademedesiniz! Tüm harcamalarda +%10 bonus kazanırsınız.' : `${(2000 - user.totalSpent).toFixed(0)} TL daha harcayarak Silver avantajlarını açın!`}
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* RECENT PURCHASES */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">İşlem Geçmişi</h2>
              <span className="text-[10px] font-black text-slate-400 uppercase">{purchases.length} İşlem</span>
           </div>
           
           <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-20 text-center animate-pulse">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yükleniyor...</p>
                </div>
              ) : purchases.length === 0 ? (
                <div className="p-6 text-center py-20">
                   <div className="text-4xl mb-4">🛒</div>
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Henüz bir işleminiz bulunmuyor.</p>
                </div>
              ) : (
                purchases.map(item => (
                  <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {item.storeName ? item.storeName[0] : 'V'}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900">{item.storeName}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{formatDate(item.purchaseDate)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-slate-900">-{item.amount.toFixed(2)} TL</p>
                       <p className="text-[9px] font-black text-green-600 uppercase mt-1">+{item.earnings.toFixed(2)} TL Bonus</p>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
