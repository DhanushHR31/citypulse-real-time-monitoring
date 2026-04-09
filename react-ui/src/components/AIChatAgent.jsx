import React, { useState, useRef, useEffect } from 'react';

const BENGALURU_ZONES = [
  // Central Bengaluru
  "MG Road", "Brigade Road", "Shivajinagar", "Majestic", "Cubbon Park", "Vasanth Nagar", "Richmond Town", "Lavelle Road", "Infantry Road",
  // North Bengaluru
  "Yelahanka", "Hebbal", "Devanahalli", "Jakkur", "Thanisandra", "Hennur", "RT Nagar", "Vidyaranyapura", "Sahakar Nagar", "Airport Area",
  // South Bengaluru
  "Jayanagar", "JP Nagar", "Banashankari", "BTM Layout", "Bannerghatta Road", "Basavanagudi", "Kumaraswamy Layout", "Kanakapura Road", "Uttarahalli",
  // East Bengaluru
  "Whitefield", "KR Puram", "Marathahalli", "Mahadevapura", "CV Raman Nagar", "Indiranagar", "HAL", "Brookefield", "Varthur", "Bellandur",
  // West Bengaluru
  "Rajajinagar", "Vijayanagar", "Kengeri", "Nagarbhavi", "Magadi Road", "Malleshwaram", "Yeshwanthpur", "Peenya", "Dasarahalli",
  // IT & Tech Corridors
  "Electronic City", "Outer Ring Road (ORR)", "Manyata Tech Park Area", "Sarjapur Road", "HSR Layout", "Koramangala", "Domlur",
  // Industrial Areas
  "Peenya Industrial Area", "Bommasandra Industrial Area", "Jigani Industrial Area", "Bidadi Industrial Zone",
  // Suburban / Peripheral Areas
  "Anekal", "Attibele", "Nelamangala", "Hoskote", "Doddaballapur", "Ramanagara Road Area",
  // Administrative Zones (BBMP Zones)
  "East Zone", "West Zone", "South Zone", "North Zone", "Mahadevapura Zone", "Bommanahalli Zone", "RR Nagar Zone", "Dasarahalli Zone"
];

export default function FloatAIChat({ incidents }) {
  const [isOpen, setIsOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { role: 'ai', text: "🌐 **Google Search Mode Active**.\n\nI am your **AI City Search Engine**. Ask me anything about a Bengaluru location, or search an area below to see live safety intelligence and Google News trends!" }
  ]);
  const [inp, setInp] = useState('');
  const [locSearch, setLocSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = async (txt) => {
    const q = txt || inp;
    if (!q.trim()) return;
    setInp('');
    setLocSearch('');
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, incidents: incidents })
      });
      const data = await res.json();
      setMsgs(m => [...m, { role: 'ai', text: data.response }]);
    } catch (err) {
      setMsgs(m => [...m, { role: 'ai', text: "🔍 Searching Google News... Indexing failed. Please check the live dashboard map for markers!" }]);
    } finally {
      setLoading(false);
    }
  };

  const filteredZones = locSearch ? BENGALURU_ZONES.filter(z => z.toLowerCase().includes(locSearch.toLowerCase())) : [];

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: 25, right: 25, zIndex: 10000,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
      >
        <span style={{ fontSize: '1.6rem' }}>{isOpen ? '❌' : '💬'}</span>
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 95, right: 25, zIndex: 10000,
          width: 400, height: 580, maxHeight: '85vh',
          background: '#ffffff', borderRadius: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'chatFadeIn 0.35s ease-out',
          border: '1px solid rgba(0,0,0,0.1)'
        }}>
          <style>{`
            @keyframes chatFadeIn { from { opacity: 0; transform: translateY(30px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); } 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); } }
            .msg-scroll::-webkit-scrollbar { width: 5px; }
            .msg-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); borderRadius: 10px; }
            .zone-chip-item:hover { background: #eff6ff !important; color: #1e40af !important; }
          `}</style>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 24px', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>🌐</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>AI City Search Engine</div>
                <div style={{ fontSize: '.72rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, background: '#4ade80', borderRadius: '50%', animation: 'pulse-glow 2s infinite' }}></span>
                  Google News & Gemini Sync: ON
                </div>
              </div>
            </div>
          </div>

          {/* Location Search Bar */}
          <div style={{ padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid #cbd5e1', borderRadius: 10, padding: '6px 14px' }}>
              <span style={{ fontSize: '1rem' }}>🔍</span>
              <input 
                placeholder="Search location (e.g. MG Road, Hebbal)..." 
                value={locSearch}
                onChange={e => setLocSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', flex: 1, outline: 'none', fontSize: '.9rem', color: '#1e293b' }}
              />
            </div>
            {filteredZones.length > 0 && (
               <div style={{ position: 'absolute', top: 54, left: 20, right: 20, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 99999, maxHeight: 180, overflowY: 'auto' }}>
                  {filteredZones.map(z => (
                     <div key={z} onClick={() => send(`Google Search Status for ${z}?`)} style={{ padding: '10px 16px', fontSize: '.95rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', color: '#1e293b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }} className="zone-chip-item">
                        <span style={{ color: '#ef4444' }}>📍</span> {z}
                     </div>
                  ))}
               </div>
            )}
          </div>

          <div style={{ padding: '8px 20px', background: 'rgba(37, 99, 235, 0.05)', fontSize: '.68rem', color: '#1e40af', fontWeight: 700 }}>
             ⚡ Fusing Live <b>Google Search Data</b> with Gemini Urban Intelligence.
          </div>

          {/* Messages */}
          <div className="msg-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'ai' ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                <div style={{
                  padding: '14px 20px', borderRadius: 20,
                  background: m.role === 'ai' ? '#f1f5f9' : '#2563eb',
                  color: m.role === 'ai' ? '#1e293b' : '#fff',
                  fontSize: '.95rem', lineHeight: 1.5,
                  boxShadow: m.role === 'ai' ? 'none' : '0 6px 15px rgba(37, 99, 235, 0.25)',
                  borderBottomLeftRadius: m.role === 'ai' ? 4 : 20,
                  borderBottomRightRadius: m.role === 'user' ? 4 : 20,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#f1f5f9', padding: '12px 18px', borderRadius: '18px 18px 18px 4px', fontSize: '.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="loading-spinner" style={{ width: 14, height: 14, border: '2px solid #cbd5e1', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                Indexing location intelligence...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>

          {/* Input */}
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ 
              display: 'flex', gap: 10, background: '#f8fafc', padding: '10px 10px 10px 20px', 
              borderRadius: 16, border: '2px solid #e2e8f0', alignItems: 'center', transition: 'border-color .2s'
            }} onFocus={e => e.currentTarget.style.borderColor = '#2563eb'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
              <input 
                value={inp} 
                onChange={e => setInp(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Google-search a location..." 
                style={{ border: 'none', background: 'transparent', flex: 1, outline: 'none', color: '#1e293b', fontSize: '.95rem' }}
              />
              <button 
                onClick={() => send()}
                style={{ 
                  width: 44, height: 44, borderRadius: 12, background: '#2563eb', 
                  color: '#fff', border: 'none', fontSize: '1.3rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >🚀</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
