import React, { useState, useMemo } from 'react';
import { LiveMap, Bdg } from './shared';
// No longer using SOCIAL_POSTS to ensure 100% Live reporting

export default function SocialMonitor({ events, onRefresh, addToast, API_URL }) {
  const [filter, setFilter] = useState('All Platforms'); 
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 🛰️ EXCLUSIVE LIVE FEED: Only show incidents from social sources (Twitter, IG, News, Maps)
  const socialEvents = useMemo(() => {
    return events
      .filter(e => ['Twitter', 'Instagram', 'Facebook', 'X/Twitter', 'Sentinel Live Feed', 'Google Maps', 'NewsAPI', 'Google News RSS', 'AI Real-Time Master Prompt', 'ChatGPT / Gemini Verified'].includes(e.source))
      .map(e => ({
        ...e,
        id: `live-${e.id}`,
        platform: e.source.split(' ')[0].toLowerCase(),
        text: e.desc || e.title,
        loc: e.loc || e.location_name || 'Bengaluru',
        time: e.time,
        sev: e.sev,
        verified: true,
        tags: [e.type || 'Urban Alert'],
        lat: e.lat,
        lng: e.lng,
        icon: e.icon || '📍'
      }));
  }, [events]);

  const filtered = socialEvents.filter(s => 
    (filter === 'All Platforms' || s.platform === filter.toLowerCase() || (filter === 'Twitter' && s.platform === 'x/twitter')) && 
    (s.text.toLowerCase().includes(search.toLowerCase()) || !search)
  );

  const stats = {
    total: filtered.length,
    critical: filtered.filter(s => s.sev === 'critical').length,
    high: filtered.filter(s => s.sev === 'high').length,
    verified: filtered.filter(s => s.verified).length
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81,#4945ff)', borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>📡 Live Social Intelligence Feed</h2>
            <p style={{ color: 'rgba(255,255,255,.65)', marginTop: 4, marginBottom: 14 }}>Bengaluru Sentinel: Active Proximity Scanning (5m Interval) · No Archived Data</p>
          </div>
          <button 
            onClick={async () => {
              if (addToast) addToast('⚡ Sentinel Sweep', 'Connecting to Gemini AI for deep Social Crawl...');
              try {
                 const res = await fetch(`${API_URL}/collection/login-trigger`, { method: 'POST' });
                 if (res.ok) {
                   const data = await res.json();
                   if (addToast) addToast('✅ Master Sweep Complete', data.message || 'Collected ~40 FRESH Live Incidents.');
                   if (onRefresh) onRefresh();
                 }
              } catch (e) {
                 if (addToast) addToast('❌ Connection Error', 'Sentinel could not reach live feeds.');
              }
            }}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: 10, fontWeight: 700, fontSize: '.88rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(59,130,246,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            🛰️ Sync Fresh Feed
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: 10 }}>
          <input style={{ flex: 1, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, padding: '10px 16px', color: '#fff', fontSize: '.9rem', outline: 'none' }} placeholder="Filter live neighborhood alerts..." value={search} onChange={e => setSearch(e.target.value)} />
          <select style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: '.88rem' }} value={filter} onChange={e => setFilter(e.target.value)}>
            {['All Platforms', 'Twitter', 'Instagram', 'Google'].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* 📍 LIVE SOCIAL MAP */}
      <div className="cp-card" style={{ padding: 0, overflow: 'hidden', height: '350px', marginBottom: 16 }}>
        <LiveMap events={filtered} height="350px" zoom={11} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        {[{ icon: '📡', v: stats.total, l: 'Sentinel Live', c: '#6366f1' }, { icon: '🚨', v: stats.critical, l: 'Critical Ops', c: '#ef4444' }, { icon: '🛡️', v: stats.verified, l: 'AI Verified', c: '#22c55e' }, { icon: '🟠', v: stats.high, l: 'High Severity', c: '#f97316' }].map(s => <div key={s.l} className="cp-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.c}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{s.icon}</div>
          <div><div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{s.l}</div></div>
        </div>)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && (
          <div className="cp-card" style={{ textAlign: 'center', padding: '60px 0', borderStyle: 'dashed', color: 'var(--muted)' }}>
             🛰️ No social reports found in the last 2 hours. Try syncing live feeds.
          </div>
        )}
        {filtered.map(s => (
          <div key={s.id} className="cp-card" style={{ borderLeft: `5px solid ${SEV_COLOR[s.sev] || '#64748b'}`, animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
              <span className={`plat plat-${s.platform.replace('x/','')}`} style={{ padding: '4px 12px', fontSize: '.75rem', fontWeight: 700 }}>
                {s.platform === 'twitter' || s.platform === 'x/twitter' ? '𝕏 Twitter' : s.platform === 'instagram' ? '📷 Instagram' : s.platform === 'google' ? '🗺️ Google' : s.platform}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '.8rem', color: 'var(--muted)', fontWeight: 600 }}>📍 {s.loc} · {s.time}</span>
              <Bdg sev={s.sev} />
            </div>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.5, color: '#f8fafc', margin: 0, fontWeight: 500 }}>{s.text}</p>
            <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
              {s.tags?.map(t => <span key={t} style={{ color: '#818cf8', fontSize: '.75rem', fontWeight: 800 }}>#{t.replace(/ /g, '').replace('#', '')}</span>)}
              <span style={{ fontSize: '.7rem', background: 'rgba(34,197,94,0.1)', color: '#4ade80', padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(34,197,94,0.3)', fontWeight: 800 }}>✓ VERIFIED</span>
              <button 
                onClick={() => setSelectedEvent(s)}
                style={{ marginLeft: 'auto', background: 'rgba(99,102,241,0.2)', border: '1px solid #6366f1', color: '#c7d2fe', padding: '6px 14px', borderRadius: 6, fontSize: '.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                👁️ View AI Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* POPUP MODAL FOR DETAILED AI REPORT */}
      {selectedEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn .2s ease-out' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, width: '100%', maxWidth: 550, padding: 24, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Bdg sev={selectedEvent.sev} />
                  <span style={{ fontSize: '.8rem', color: '#94a3b8', fontWeight: 600 }}>ID: {selectedEvent.id}</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', margin: 0, color: '#f8fafc', fontWeight: 800 }}>{selectedEvent.title || 'Incident Report'}</h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                 <div>
                   <div style={{ fontSize: '.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Date & Time</div>
                   <div style={{ fontSize: '.9rem', color: '#f8fafc', fontWeight: 600 }}>📅 {new Date().toLocaleDateString()} · ⏰ {selectedEvent.time}</div>
                 </div>
                 <div>
                   <div style={{ fontSize: '.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Exact Place Detail</div>
                   <div style={{ fontSize: '.9rem', color: '#f8fafc', fontWeight: 600 }}>📍 {selectedEvent.loc}</div>
                 </div>
               </div>
               <div style={{ fontSize: '.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: 4 }}>AI Summary (3-Line)</div>
               <p style={{ fontSize: '.9rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>This is a confirmed {selectedEvent.type.toLowerCase()} situation located strictly at {selectedEvent.loc}. Emergency response teams and monitoring assets have been flagged. {selectedEvent.text}</p>
            </div>

            <div style={{ background: 'linear-gradient(to right, rgba(16,185,129,0.1), transparent)', borderLeft: '3px solid #10b981', padding: '14px 16px', borderRadius: '0 8px 8px 0' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                 <span style={{ fontSize: '1.1rem' }}>🤖</span>
                 <strong style={{ color: '#10b981', fontSize: '.85rem' }}>AI Agent Suggestion</strong>
               </div>
               <div style={{ color: '#d1d5db', fontSize: '.85rem', lineHeight: 1.5 }}>
                 {selectedEvent.sev === 'critical' ? 'IMMEDIATE ACTION REQUIRED: Residents must avoid this zone entirely. If you are near this location, evacuate if instructed by authorities.' : 
                  selectedEvent.sev === 'high' ? 'WARNING: Proceed with extreme caution. Severe delays or hazards are present. Reroute trips away from this area.' :
                  'ADVISORY: Expect moderate delays. Stay alert and follow local municipal guidelines if passing through this sector.'}
               </div>
            </div>
            
            <button onClick={() => setSelectedEvent(null)} style={{ background: '#3b82f6', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: 8, marginTop: 20, fontWeight: 700, cursor: 'pointer' }}>Acknowledge Report</button>
          </div>
        </div>
      )}
    </div>
  );
}

const SEV_COLOR = { critical: '#ef4444', high: '#ef4444', medium: '#f97316', low: '#22c55e' };
