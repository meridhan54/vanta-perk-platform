import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const STATS = [
  { label: 'Aktif Çalışan', value: '1,240', change: '+12%', icon: '👥' },
  { label: 'Aylık Toplam Tasarruf', value: '₺45,200', change: '+8%', icon: '💰' },
  { label: 'Kullanım Oranı', value: '%84', change: '+5%', icon: '📈' },
  { label: 'Kalan Bütçe', value: '₺12,500', change: '-2%', icon: '🏦' },
];

const CATEGORY_DATA = [
  { name: 'Yeme İçme', value: 45 },
  { name: 'Spor', value: 25 },
  { name: 'Sağlık', value: 15 },
  { name: 'Eğitim', value: 10 },
  { name: 'Diğer', value: 5 },
];

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#94a3b8'];

const EmployerDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Şirket Yönetim Paneli</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">VANTA Global - İnsan Kaynakları Portalı</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
          Raporu İndir (.PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:border-indigo-600 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Haftalık Yan Hak Kullanım Yoğunluğu</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { day: 'Pzt', usage: 45 }, { day: 'Sal', usage: 52 }, { day: 'Çar', usage: 38 },
                { day: 'Per', usage: 65 }, { day: 'Cum', usage: 78 }, { day: 'Cmt', usage: 40 }, { day: 'Paz', usage: 22 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="usage" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
          <h2 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-8 relative z-10">Kategori Dağılımı</h2>
          <div className="h-64 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 relative z-10">
            {CATEGORY_DATA.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase">{item.name}</span>
                </div>
                <span className="text-xs font-black text-white">%{item.value}</span>
              </div>
            ))}
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;