
import React, { useState } from 'react';
import { Perk } from '../types';
import { supabase } from '../supabaseClient';

interface AdminPerksProps {
  perks: Perk[];
  onUpdate: (updatedPerks: Perk[]) => void;
}

const AdminPerks: React.FC<AdminPerksProps> = ({ perks, onUpdate }) => {
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSeedConfirm, setShowSeedConfirm] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const DEFAULT_PERKS: Perk[] = [
    // --- YEME & İÇME (4) ---
    { id: 'f-1', supplierName: 'Burger Lab', title: 'Gurme Menü Avantajı', description: 'Tüm şubelerde geçerli %20 anında indirim.', offerType: 'deal', value: '%20', category: 'Yeme & İçme', validUntil: '2025-12-31', redemptionLimit: 500, currentRedemptions: 42, originalPrice: 450, discountedPrice: 360, location: 'İstanbul', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800' },
    { id: 'f-2', supplierName: 'Starbucks', title: '2. Kahve %50 İndirimli', description: 'VANTA üyelerine özel kodla.', offerType: 'deal', value: '%50', category: 'Yeme & İçme', validUntil: '2025-12-31', redemptionLimit: 1000, currentRedemptions: 156, originalPrice: 120, discountedPrice: 60, location: 'Tüm Türkiye', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=800' },
    { id: 'f-3', supplierName: 'Pizza Locale', title: 'Hafta Sonu 1 Alana 1 Bedava', description: 'Seçili orta boy pizzalarda geçerli.', offerType: 'deal', value: 'BEDAVA', category: 'Yeme & İçme', validUntil: '2025-12-31', redemptionLimit: 300, currentRedemptions: 89, originalPrice: 800, discountedPrice: 400, location: 'İzmir & İst', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800' },
    { id: 'f-4', supplierName: 'Sushi Co', title: 'Premium Combo Menü', description: '32 parçalık setlerde özel fiyat.', offerType: 'deal', value: '%15', category: 'Yeme & İçme', validUntil: '2025-12-31', redemptionLimit: 200, currentRedemptions: 12, originalPrice: 1500, discountedPrice: 1275, location: 'Tüm Türkiye', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800' },

    // --- SPOR (4) ---
    { id: 's-1', supplierName: 'MacFit', title: '6 Aylık Gold Üyelik', description: 'Tüm kulüplerde geçerli sınırsız erişim.', offerType: 'deal', value: '%30', category: 'Spor', validUntil: '2025-12-31', redemptionLimit: 100, currentRedemptions: 23, originalPrice: 9000, discountedPrice: 6300, location: 'Tüm Türkiye', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800' },
    { id: 's-2', supplierName: 'Reformer Pilates', title: '12 Derslik Grup Paketi', description: 'Birebir eğitmen gözetiminde seanslar.', offerType: 'deal', value: '%25', category: 'Spor', validUntil: '2025-12-31', redemptionLimit: 50, currentRedemptions: 5, originalPrice: 6000, discountedPrice: 4500, location: 'İstanbul', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1518611012118-2969c6a2c50f?w=800' },
    { id: 's-3', supplierName: 'Decathlon', title: '150 TL İndirim Çeki', description: '750 TL ve üzeri alışverişlerde geçerli.', offerType: 'coupon', value: '150 TL', category: 'Spor', validUntil: '2025-12-31', redemptionLimit: 1000, currentRedemptions: 412, originalPrice: 750, discountedPrice: 600, location: 'Online', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800' },
    { id: 's-4', supplierName: 'Urban Riders', title: '5 Derslik Başlangıç Seti', description: 'Enerji dolu indoor cycling deneyimi.', offerType: 'deal', value: '%40', category: 'Spor', validUntil: '2025-12-31', redemptionLimit: 80, currentRedemptions: 18, originalPrice: 1800, discountedPrice: 1080, location: 'İstanbul', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800' },

    // --- SAĞLIK (4) ---
    { id: 'h-1', supplierName: 'Medicana', title: 'Kapsamlı Check-up', description: 'Yaşınıza uygun tam sağlık taraması.', offerType: 'deal', value: '%20', category: 'Sağlık', validUntil: '2025-12-31', redemptionLimit: 40, currentRedemptions: 8, originalPrice: 8000, discountedPrice: 6400, location: 'Ankara & İst', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800' },
    { id: 'h-2', supplierName: 'Denta World', title: 'Diş Beyazlatma & Bakım', description: 'Profesyonel gülüş tasarımı seansı.', offerType: 'deal', value: '%50', category: 'Sağlık', validUntil: '2025-12-31', redemptionLimit: 100, currentRedemptions: 34, originalPrice: 3500, discountedPrice: 1750, location: 'İstanbul', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800' },
    { id: 'h-3', supplierName: 'Memorial', title: 'Online Terapi Paketi', description: 'Uzman psikologlarla 4 seanslık paket.', offerType: 'deal', value: '%15', category: 'Sağlık', validUntil: '2025-12-31', redemptionLimit: 200, currentRedemptions: 56, originalPrice: 4000, discountedPrice: 3400, location: 'Online', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800' },
    { id: 'h-4', supplierName: 'Acıbadem', title: 'Göz Muayenesi & Optik', description: 'Muayene ve gözlük alımlarında avantaj.', offerType: 'deal', value: '%10', category: 'Sağlık', validUntil: '2025-12-31', redemptionLimit: 150, currentRedemptions: 12, originalPrice: 1200, discountedPrice: 1080, location: 'İstanbul', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800' },

    // --- EĞİTİM (4) ---
    { id: 'e-1', supplierName: 'Udemy', title: 'Yazılım & AI Kursları', description: 'Tüm eğitimlerde VANTA kodu geçerli.', offerType: 'coupon', value: '%40', category: 'Eğitim', validUntil: '2025-12-31', redemptionLimit: 500, currentRedemptions: 211, originalPrice: 600, discountedPrice: 360, location: 'Online', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800' },
    { id: 'e-2', supplierName: 'Storytel', title: 'Yıllık Sınırsız Abonelik', description: 'Binlerce sesli kitap cebinizde.', offerType: 'deal', value: '%20', category: 'Eğitim', validUntil: '2025-12-31', redemptionLimit: 1000, currentRedemptions: 567, originalPrice: 1200, discountedPrice: 960, location: 'Mobil', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800' },
    { id: 'e-3', supplierName: 'Masterclass', title: 'Dünya Ustalarından Dersler', description: 'Yıllık tüm derslere erişim pass.', offerType: 'deal', value: '%25', category: 'Eğitim', validUntil: '2025-12-31', redemptionLimit: 50, currentRedemptions: 4, originalPrice: 4500, discountedPrice: 3375, location: 'Online', rating: 5.0, imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800' },
    { id: 'e-4', supplierName: 'Cambly', title: 'Birebir İngilizce (6 Ay)', description: 'Haftada 2 gün 30 dakika özel ders.', offerType: 'deal', value: '%60', category: 'Eğitim', validUntil: '2025-12-31', redemptionLimit: 100, currentRedemptions: 88, originalPrice: 15000, discountedPrice: 6000, location: 'Online', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1523240715639-963c7a794e7b?w=800' },

    // --- TEKNOLOJİ (4) ---
    { id: 't-1', supplierName: 'Apple Gürgençler', title: 'iPhone & Mac Aksesuar', description: 'Orijinal kılıf, kablo ve adaptörler.', offerType: 'deal', value: '%15', category: 'Teknoloji', validUntil: '2025-12-31', redemptionLimit: 200, currentRedemptions: 45, originalPrice: 2000, discountedPrice: 1700, location: 'Mağaza', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1510511459019-5dee997dd1db?w=800' },
    { id: 't-2', supplierName: 'Turkcell Pasaj', title: 'Akıllı Saat Fırsatı', description: 'Seçili modellerde VANTA indirimi.', offerType: 'deal', value: '%10', category: 'Teknoloji', validUntil: '2025-12-31', redemptionLimit: 300, currentRedemptions: 112, originalPrice: 5000, discountedPrice: 4500, location: 'Online', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' },
    { id: 't-3', supplierName: 'Monster Notebook', title: 'Oyuncu Ekipmanları', description: 'Mouse ve kulaklıklarda geçerli.', offerType: 'deal', value: '%20', category: 'Teknoloji', validUntil: '2025-12-31', redemptionLimit: 150, currentRedemptions: 67, originalPrice: 3000, discountedPrice: 2400, location: 'Mağaza', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800' },
    { id: 't-4', supplierName: 'Trendyol Tech', title: 'Elektronik İndirim Kodu', description: 'Tüm küçük ev aletlerinde geçerli.', offerType: 'coupon', value: '250 TL', category: 'Teknoloji', validUntil: '2025-12-31', redemptionLimit: 1000, currentRedemptions: 742, originalPrice: 3000, discountedPrice: 2750, location: 'Online', rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800' },

    // --- ETKİNLİK (4) ---
    { id: 'ev-1', supplierName: 'Zorlu PSM', title: 'Broadway Müzikalleri', description: 'Kategori 1 ve 2 biletlerde indirim.', offerType: 'deal', value: '%20', category: 'Etkinlik', validUntil: '2025-12-31', redemptionLimit: 50, currentRedemptions: 12, originalPrice: 3000, discountedPrice: 2400, location: 'İstanbul', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1503095396549-807039a30687?w=800' },
    { id: 'ev-2', supplierName: 'Biletix', title: 'Açık Hava Konserleri', description: 'Seçili etkinliklerde anında %10.', offerType: 'coupon', value: '%10', category: 'Etkinlik', validUntil: '2025-12-31', redemptionLimit: 1000, currentRedemptions: 890, originalPrice: 1500, discountedPrice: 1350, location: 'Türkiye', rating: 4.2, imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800' },
    { id: 'ev-3', supplierName: 'Museum Pass', title: 'Kültür & Sanat Kartı', description: 'Müzeler ve sergilerde tam erişim.', offerType: 'deal', value: '%15', category: 'Etkinlik', validUntil: '2025-12-31', redemptionLimit: 200, currentRedemptions: 145, originalPrice: 800, discountedPrice: 680, location: 'Türkiye', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800' },
    { id: 'ev-4', supplierName: 'DasDas', title: 'Tiyatro & Konser Bileti', description: 'Ataşehir şubesi etkinliklerinde.', offerType: 'deal', value: '%25', category: 'Etkinlik', validUntil: '2025-12-31', redemptionLimit: 100, currentRedemptions: 34, originalPrice: 1000, discountedPrice: 750, location: 'İstanbul', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800' },

    // --- TURİZM (4) ---
    { id: 'tr-1', supplierName: 'Etstur', title: 'Ege & Akdeniz Otelleri', description: 'Yaz tatili erken rezervasyon fırsatı.', offerType: 'deal', value: '2500 TL', category: 'Turizm', validUntil: '2025-12-31', redemptionLimit: 100, currentRedemptions: 33, originalPrice: 25000, discountedPrice: 22500, location: 'Antalya', rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
    { id: 'tr-2', supplierName: 'THY', title: 'Uçuş Milleri Bonusu', description: 'Bilet alımlarında 1000 Ekstra Mil.', offerType: 'deal', value: '1000 MİL', category: 'Turizm', validUntil: '2025-12-31', redemptionLimit: 500, currentRedemptions: 211, originalPrice: 0, discountedPrice: 0, location: 'Global', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?w=800' },
    { id: 'tr-3', supplierName: 'Jolly Tur', title: 'Gap & Karadeniz Turları', description: 'Kültür turlarında %10 VANTA indirimi.', offerType: 'deal', value: '%10', category: 'Turizm', validUntil: '2025-12-31', redemptionLimit: 200, currentRedemptions: 87, originalPrice: 15000, discountedPrice: 13500, location: 'Türkiye', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800' },
    { id: 'tr-4', supplierName: 'Booking.com', title: 'Nakit İade Avantajı', description: 'Rezervasyon tutarının %10u iade.', offerType: 'cashback', value: '%10', category: 'Turizm', validUntil: '2025-12-31', redemptionLimit: 1000, currentRedemptions: 567, originalPrice: 8000, discountedPrice: 7200, location: 'Global', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800' },

    // --- MASAJ & SPA (4) ---
    { id: 'sp-1', supplierName: 'Deep Relax Spa', title: 'Thai Masajı Paketi', description: '60 dakikalık derin gevşeme seansı.', offerType: 'deal', value: '%35', category: 'Masaj & Spa', validUntil: '2025-12-31', redemptionLimit: 60, currentRedemptions: 12, originalPrice: 1800, discountedPrice: 1170, location: 'Beşiktaş', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800' },
    { id: 'sp-2', supplierName: 'Swissotel Spa', title: 'Hamam & Sauna Keyfi', description: 'Hafta içi kullanım + meyve tabağı.', offerType: 'deal', value: '%20', category: 'Masaj & Spa', validUntil: '2025-12-31', redemptionLimit: 40, currentRedemptions: 5, originalPrice: 3500, discountedPrice: 2800, location: 'Nişantaşı', rating: 5.0, imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800' },
    { id: 'sp-3', supplierName: 'Caudalie Spa', title: 'Vinosource Yüz Bakımı', description: 'Doğal üzüm özleriyle cilt yenileme.', offerType: 'deal', value: '%15', category: 'Masaj & Spa', validUntil: '2025-12-31', redemptionLimit: 30, currentRedemptions: 2, originalPrice: 2800, discountedPrice: 2380, location: 'İstinye', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800' },
    { id: 'sp-4', supplierName: 'Nuspa', title: 'Nu Signature Masajı', description: 'Klasikleşmiş Nuspa kalitesi.', offerType: 'deal', value: '%25', category: 'Masaj & Spa', validUntil: '2025-12-31', redemptionLimit: 100, currentRedemptions: 45, originalPrice: 1400, discountedPrice: 1050, location: 'Tüm Şubeler', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800' }
  ];

  const performSeed = async () => {
    setLoading(true);
    setShowSeedConfirm(false);
    try {
      const { error } = await supabase
        .from('perks')
        .upsert(DEFAULT_PERKS.map(p => ({
          id: p.id,
          supplierName: p.supplierName,
          title: p.title,
          description: p.description,
          offerType: p.offerType,
          value: p.value,
          originalPrice: p.originalPrice,
          discountedPrice: p.discountedPrice,
          category: p.category,
          validUntil: p.validUntil,
          redemptionLimit: p.redemptionLimit,
          currentRedemptions: p.currentRedemptions,
          rating: p.rating,
          location: p.location,
          imageUrl: p.imageUrl
        })), { onConflict: 'id' });

      if (error) {
        showToast(`Hata: ${error.message}`, 'error');
      } else {
        showToast('32 adet premium hizmet başarıyla veritabanına yazıldı!');
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      showToast('İşlem sırasında beklenmedik bir hata oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Custom confirm prompt for delete could be added, but for speed let's just do it
    const { error } = await supabase.from('perks').delete().eq('id', id);
    if (!error) {
      onUpdate(perks.filter(p => p.id !== id));
      showToast('Fırsat başarıyla silindi.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerk) return;
    setLoading(true);

    const { error } = await supabase
      .from('perks')
      .upsert([editingPerk], { onConflict: 'id' });

    if (!error) {
      showToast('Değişiklikler kaydedildi!');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showToast(error.message, 'error');
    }
    setLoading(false);
  };

  const startNew = () => {
    setEditingPerk({
      id: 'custom-' + Math.random().toString(36).substring(7),
      supplierName: '',
      title: '',
      description: '',
      offerType: 'deal',
      value: '%20',
      category: 'Yeme & İçme',
      validUntil: '2025-12-31',
      redemptionLimit: 100,
      currentRedemptions: 0,
      originalPrice: 0,
      discountedPrice: 0,
      location: 'İstanbul',
      rating: 5.0,
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800'
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 animate-in fade-in duration-500 relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-20 right-6 z-[300] p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-300 ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          <span className="text-xl">{notification.type === 'success' ? '✅' : '❌'}</span>
          <p className="text-xs font-black uppercase tracking-widest">{notification.message}</p>
        </div>
      )}

      {/* Custom Seed Confirm Modal */}
      {showSeedConfirm && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[32px] p-10 max-w-md w-full text-center space-y-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="text-5xl">📊</div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Veritabanı Doldurma</h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">32 adet sektörel yan hak verisi VANTA kataloguna eklenecek. Mevcut veriler varsa güncellenecektir. Onaylıyor musunuz?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowSeedConfirm(false)} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Vazgeç</button>
              <button onClick={performSeed} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Evet, Doldur</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">İçerik Yönetimi</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Platform Katalog Operasyonu (32+ Hizmet)</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowSeedConfirm(true)}
            disabled={loading}
            className="flex-1 md:flex-none border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all disabled:opacity-50"
          >
            {loading ? 'İşleniyor...' : 'Tüm Sektörleri Doldur'}
          </button>
          <button 
            onClick={startNew}
            className="flex-1 md:flex-none bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
          >
            + Manuel Ekle
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hizmet / Marka</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">İşlem Sayısı</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fiyat/Değer</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {perks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-4xl">🏗️</div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Veritabanı boş. "Tüm Sektörleri Doldur" butonuna basın.</p>
                  </div>
                </td>
              </tr>
            ) : (
              perks.sort((a,b) => a.category.localeCompare(b.category)).map((perk) => (
                <tr key={perk.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <img src={perk.imageUrl} className="w-12 h-12 rounded-xl object-cover border border-slate-100" alt="" />
                      <div>
                        <p className="text-xs font-black text-slate-900">{perk.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{perk.supplierName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[9px] font-black px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg uppercase">
                      {perk.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex flex-col">
                       <p className="text-[10px] font-black text-slate-900">{perk.currentRedemptions} / {perk.redemptionLimit}</p>
                       <div className="w-16 h-1 bg-slate-100 rounded-full mt-1">
                          <div className="h-full bg-indigo-600 rounded-full" style={{width: `${(perk.currentRedemptions/perk.redemptionLimit)*100}%`}}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-black text-slate-900">{perk.discountedPrice || perk.value} TL</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setEditingPerk(perk)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">✎</button>
                      <button onClick={() => handleDelete(perk.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">✕</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingPerk && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Hizmet Editörü</h2>
              <button onClick={() => setEditingPerk(null)} className="text-slate-400 text-2xl font-bold">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Marka / Sağlayıcı</label>
                  <input value={editingPerk.supplierName} onChange={e => setEditingPerk({...editingPerk, supplierName: e.target.value})} className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Sektörel Kategori</label>
                  <select 
                    value={editingPerk.category} 
                    onChange={e => setEditingPerk({...editingPerk, category: e.target.value})}
                    className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-bold outline-none bg-white"
                  >
                    <option>Yeme & İçme</option>
                    <option>Spor</option>
                    <option>Sağlık</option>
                    <option>Eğitim</option>
                    <option>Teknoloji</option>
                    <option>Masaj & Spa</option>
                    <option>Etkinlik</option>
                    <option>Turizm</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Kampanya Başlığı</label>
                <input value={editingPerk.title} onChange={e => setEditingPerk({...editingPerk, title: e.target.value})} className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Piyasa Fiyatı (TL)</label>
                  <input type="number" value={editingPerk.originalPrice} onChange={e => setEditingPerk({...editingPerk, originalPrice: Number(e.target.value)})} className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-bold outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">VANTA Özel Fiyat (TL)</label>
                  <input type="number" value={editingPerk.discountedPrice} onChange={e => setEditingPerk({...editingPerk, discountedPrice: Number(e.target.value)})} className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-xs font-bold outline-none" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all disabled:opacity-50"
              >
                {loading ? 'İşleniyor...' : 'Veritabanına Yaz'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPerks;
