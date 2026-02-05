import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import TrendDashboard from './views/TrendDashboard';
import Profile from './views/Profile';
import AdminPerks from './views/AdminPerks';
import EmployerDashboard from './views/EmployerDashboard';
import Auth from './views/Auth';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import { UserProfile, Perk } from './types';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    setLoading(true);
    try {
      const { error: testError } = await supabase.from('perks').select('id').limit(1);
      
      if (testError && testError.code === 'PGRST205') {
        setDbError('DATABASE_TABLES_MISSING');
        setLoading(false);
        return;
      }

      setDbError(null);
      await fetchPerks();

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
      }
    } catch (err) {
      console.error("Critical System Error:", err);
    } finally {
      setLoading(false);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  };

  const fetchProfile = async (userId: string, email?: string, metadata?: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUser(data);
      } else {
        const newProfile: UserProfile = {
          fullName: metadata?.fullName || 'Değerli Üye',
          email: email || '',
          phone: '',
          isVerified: true,
          isFirstLogin: true,
          companyName: metadata?.companyName || 'VANTA Demo',
          sector: 'Teknoloji',
          jobTitle: 'Çalışan',
          location: 'İstanbul',
          tier: 'Bronze',
          balance: 100,
          totalSpent: 0
        };
        const { error: insErr } = await supabase.from('profiles').insert([{ id: userId, ...newProfile }]);
        if (!insErr) setUser(newProfile);
      }
    } catch (e) {
      console.error("Profile Fetch Error:", e);
    }
  };

  const fetchPerks = async () => {
    const { data } = await supabase.from('perks').select('*');
    if (data) setPerks(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    const authUser = await supabase.auth.getUser();
    const userId = authUser.data.user?.id;
    if (!userId) return;
    const { error } = await supabase.from('profiles').update(updatedUser).eq('id', userId);
    if (!error) setUser(updatedUser);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
      <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="font-black text-indigo-600 text-[10px] uppercase tracking-widest animate-pulse">Sistem Kaynakları Yükleniyor...</p>
    </div>
  );

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <main className="flex-1 container mx-auto px-4 py-6 md:py-10">
          <Routes>
            <Route path="/" element={user ? <Dashboard user={user} perks={perks} onUpdateUser={handleUpdateUser} /> : <Navigate to="/auth" />} />
            <Route path="/auth" element={!user ? <Auth onLogin={() => {}} /> : <Navigate to="/" />} />
            <Route path="/trends" element={user ? <TrendDashboard /> : <Navigate to="/auth" />} />
            <Route path="/employer" element={user ? <EmployerDashboard /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={user ? <Profile user={user} onUpdateUser={handleUpdateUser} /> : <Navigate to="/auth" />} />
            <Route path="/admin" element={user ? <AdminPerks perks={perks} onUpdate={fetchPerks} /> : <Navigate to="/auth" />} />
          </Routes>
        </main>
        {user && <Chatbot user={user} />}
        <footer className="bg-white border-t border-slate-100 py-12 text-center mt-20">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">VANTA CORE • REAL-TIME SYNC • B2B2C ARCHITECTURE</p>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;