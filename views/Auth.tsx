
import React, { useState } from 'react';
import { AuthStep } from '../types';
import { supabase } from '../supabaseClient';

const Auth: React.FC<{ onLogin: () => void }> = () => {
  const [step, setStep] = useState<AuthStep>(AuthStep.Login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    // Demo için önceden oluşturulmuş bir test hesabı veya rastgele bir mail kullanabiliriz.
    // En stabil yöntem: demo@vanta.com şifre: Vanta123456
    const demoEmail = 'demo@vanta.com';
    const demoPass = 'Vanta123456';

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPass,
      });

      if (error) {
        // Hesap yoksa otomatik oluşturmayı dene
        const { error: signUpErr } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPass,
          options: {
            data: {
              fullName: 'Demo Kullanıcı',
              companyName: 'VANTA Global',
              tier: 'Silver',
              balance: 750,
              totalSpent: 1250
            }
          }
        });
        if (signUpErr) showToast("Hızlı giriş şu an yapılamıyor: " + signUpErr.message);
        else showToast("Demo hesabı oluşturuldu. Lütfen tekrar 'Demo Girişi'ne basın.", 'success');
      }
    } catch (err) {
      showToast("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          showToast("E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.");
        } else if (error.message.includes("Email not confirmed")) {
          showToast("Lütfen e-posta adresinize gönderilen onay linkine tıklayın.", 'error');
        } else {
          showToast(`Giriş Hatası: ${error.message}`);
        }
      }
    } catch (err: any) {
      showToast("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName: fullName || 'Yeni Kullanıcı',
            companyName: 'Vanta Demo',
            tier: 'Bronze',
            balance: 100,
            totalSpent: 0
          }
        }
      });

      if (error) {
        if (error.message.includes("rate limit")) {
          showToast("Çok fazla deneme yaptınız. Lütfen 1-2 dakika bekleyip tekrar deneyin.", 'error');
        } else {
          showToast(`Kayıt Hatası: ${error.message}`);
        }
      } else if (data.user && data.session === null) {
        showToast('Kayıt başarılı! Lütfen e-postanıza gelen onay linkine tıklayın.', 'success');
        setStep(AuthStep.Login);
      } else {
        showToast('Hesabınız oluşturuldu! Giriş yapabilirsiniz.', 'success');
        setStep(AuthStep.Login);
      }
    } catch (err: any) {
      showToast("İşlem sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative">
      
      {notification && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[500] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-10 duration-500 min-w-[320px] ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-slate-900 text-white border border-white/10'}`}>
          <span className="text-2xl">{notification.type === 'success' ? '✨' : '⚠️'}</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{notification.type === 'success' ? 'BAŞARILI' : 'DİKKAT'}</p>
            <p className="text-xs font-bold leading-tight">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-indigo-600 p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-800 pointer-events-none"></div>
          <div className="relative z-10 space-y-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center text-4xl mx-auto font-black shadow-inner border border-white/10 rotate-3 transition-transform hover:rotate-0 duration-500">V</div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">VANTA</h1>
            <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Core Benefits Platform</p>
          </div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>
        </div>

        <div className="p-10 md:p-12">
          <form onSubmit={step === AuthStep.Login ? handleLogin : handleSignUp} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                {step === AuthStep.Login ? 'Hoş Geldiniz' : 'Aramıza Katılın'}
              </h2>
            </div>
            
            <button 
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-indigo-50 text-indigo-700 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border-2 border-indigo-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-3 mb-4 group"
            >
              <span className="text-lg group-hover:scale-125 transition-transform">✨</span>
              <span>Hızlı Demo Girişi</span>
            </button>

            <div className="relative py-4">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
               <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-300 bg-white px-4">veya</div>
            </div>

            {step !== AuthStep.Login && (
              <div className="animate-in slide-in-from-top-4 duration-500">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-1">Ad Soyad</label>
                <input 
                  type="text"
                  value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-1">E-posta</label>
              <input 
                type="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="ahmet@vanta.com"
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-1">Şifre</label>
              <input 
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm"
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span>{step === AuthStep.Login ? 'Giriş Yap' : 'Hesap Oluştur'}</span>
              )}
            </button>

            <div className="pt-6 text-center">
              <button 
                type="button"
                disabled={loading}
                onClick={() => setStep(step === AuthStep.Login ? AuthStep.Activation : AuthStep.Login)}
                className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors border-b-2 border-transparent hover:border-indigo-600 pb-1"
              >
                {step === AuthStep.Login ? 'Hesabınız yok mu? Kayıt Olun' : 'Zaten hesabınız var mı? Giriş yapın'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-center w-full px-4">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">VANTA CORE • SECURE AUTHENTICATION v2.5</p>
      </div>
    </div>
  );
};

export default Auth;
