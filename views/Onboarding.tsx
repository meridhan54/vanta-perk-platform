
import React, { useState } from 'react';
import { OnboardingStep, UserProfile } from '../types';

const SECTORS = [
  { id: 'tech', label: 'Teknoloji & Yazılım', icon: '💻' },
  { id: 'finance', label: 'Finans & Bankacılık', icon: '🏦' },
  { id: 'health', label: 'Sağlık & İlaç', icon: '🏥' },
  { id: 'retail', label: 'Perakende & E-Ticaret', icon: '🛍️' },
  { id: 'manuf', label: 'Üretim & Sanayi', icon: '🏭' },
  { id: 'edu', label: 'Eğitim', icon: '🎓' },
  { id: 'logistics', label: 'Lojistik & Ulaşım', icon: '🚚' },
  { id: 'energy', label: 'Enerji', icon: '⚡' },
  { id: 'tourism', label: 'Turizm & Otelcilik', icon: '✈️' },
  { id: 'const', label: 'İnşaat & Gayrimenkul', icon: '🏗️' },
  { id: 'media', label: 'Medya & Reklam', icon: '📣' },
  { id: 'public', label: 'Kamu & Sivil Toplum', icon: '🏛️' },
];

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.Personal);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: '',
    email: '',
    companyName: '',
    sector: '',
    jobTitle: '',
    location: '',
    isVerified: false
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      if (otpValue === '123456') {
        const finalProfile = { ...formData, isVerified: true } as UserProfile;
        onComplete(finalProfile);
      } else {
        alert("Hatalı kod! Lütfen demo kodu olan 123456'yı deneyin.");
        setIsVerifying(false);
      }
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">VANTA'ya Katılın</h1>
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Adım {step}/3</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-white' : 'bg-indigo-400'}`} />
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {step === OnboardingStep.Personal && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold text-slate-800">Kişisel Bilgiler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ad Soyad</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="Örn: Ahmet Yılmaz"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kurumsal E-posta</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="ahmet.yilmaz@sirket.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <button 
                disabled={!formData.fullName || !formData.email}
                onClick={handleNext} 
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-indigo-100"
              >
                İleri
              </button>
            </div>
          )}

          {step === OnboardingStep.Company && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">İş ve Sektör Bilgileri</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Şirket Adı</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="Örn: Trendyol"
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Çalıştığınız Sektör</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {SECTORS.map((sector) => (
                      <button
                        key={sector.id}
                        onClick={() => setFormData({...formData, sector: sector.label})}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${formData.sector === sector.label ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-100 hover:border-slate-300 bg-slate-50'}`}
                      >
                        <span className="text-xl">{sector.icon}</span>
                        <span className="text-[11px] font-bold text-slate-700 leading-tight">{sector.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unvan</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none text-sm"
                      placeholder="Yazılım Geliştirici"
                      value={formData.jobTitle}
                      onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lokasyon</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none text-sm"
                      placeholder="İstanbul"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={handleBack} className="flex-1 border border-slate-200 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">Geri</button>
                <button 
                  disabled={!formData.companyName || !formData.sector}
                  onClick={handleNext} 
                  className="flex-[2] bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
                >
                  Profilimi Tamamla
                </button>
              </div>
            </div>
          )}

          {step === OnboardingStep.Verification && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-2">🔒</div>
              <h2 className="text-lg font-bold text-slate-800">Son Adım: Doğrulama</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Platform güvenliği için kurumsal e-posta adresinize gönderilen 6 haneli kodu giriniz.</p>
              
              {!otpSent ? (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <p className="text-sm font-bold text-slate-700">{formData.email}</p>
                  <button onClick={() => setOtpSent(true)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md">
                    Doğrulama Kodu Gönder
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <input 
                    type="text" 
                    maxLength={6}
                    className="w-48 text-center text-3xl font-black tracking-[0.3em] px-4 py-3 border-2 border-indigo-100 rounded-xl outline-none focus:border-indigo-600 bg-slate-50 mx-auto block"
                    placeholder="000000"
                    value={otpValue}
                    onChange={e => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                  <div className="text-xs font-bold text-amber-600 bg-amber-50 py-2 rounded-lg border border-amber-100">
                    Demo Kodu: 123456
                  </div>
                  <button 
                    disabled={otpValue.length !== 6 || isVerifying}
                    onClick={handleVerify} 
                    className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-xl ${isVerifying ? 'bg-slate-400' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {isVerifying ? 'Doğrulanıyor...' : 'Doğrula ve Başla'}
                  </button>
                </div>
              )}
              
              <button onClick={handleBack} className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">Bilgileri Düzenle</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
