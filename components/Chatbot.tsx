
import React, { useState } from 'react';
import { chatAssistant } from '../geminiService';
import { UserProfile } from '../types';

interface ChatbotProps {
  user: UserProfile;
}

const Chatbot: React.FC<ChatbotProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: `Merhaba ${user.fullName}! Ben VANTA asistanı. Sana bugün nasıl yardımcı olabilirim?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const botMsg = await chatAssistant(userMsg, user);
    setMessages(prev => [...prev, { role: 'bot', text: botMsg || 'Üzgünüm, bir hata oluştu.' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {isOpen ? (
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">VANTA Canlı Destek</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white opacity-70 hover:opacity-100">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2.5 rounded-xl text-[11px] leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-[10px] text-slate-400 italic">Asistan yazıyor...</div>}
          </div>
          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Sorunuzu yazın..." 
              className="flex-1 text-[11px] px-3 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button onClick={handleSend} className="bg-indigo-600 text-white p-2 rounded-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform group"
        >
          <span className="text-2xl group-hover:rotate-12 transition-transform">💬</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></div>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
