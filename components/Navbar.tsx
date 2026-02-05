import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200">V</div>
            <span className="text-xl font-black tracking-tighter">VANTA</span>
          </Link>
          <div className="hidden lg:flex gap-6">
            <Link to="/" className={`text-[11px] font-black uppercase tracking-widest ${isActive('/') ? 'text-indigo-600' : 'text-slate-500'}`}>Pazaryeri</Link>
            <Link to="/employer" className={`text-[11px] font-black uppercase tracking-widest ${isActive('/employer') ? 'text-indigo-600' : 'text-slate-500'}`}>Şirketim</Link>
            <Link to="/trends" className={`text-[11px] font-black uppercase tracking-widest ${isActive('/trends') ? 'text-indigo-600' : 'text-slate-500'}`}>Analiz</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Bakiye:</span>
            <span className="text-xs font-black text-indigo-600">{user.balance.toLocaleString('tr-TR')} TL</span>
          </div>
          
          <Link to="/profile" className="flex items-center gap-3 bg-white p-1 rounded-full border border-slate-100 hover:border-indigo-100 transition-all group">
             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500 border-2 border-white shadow-sm overflow-hidden">
                {user.fullName[0]}
             </div>
          </Link>

          <button onClick={onLogout} className="text-slate-400 hover:text-red-500 transition-colors p-2">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 3H7a2 2 0 00-2 2v14a2 2 0 002 2h8m4-9l-4-4m4 4l-4 4m4-4H9"/></svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;