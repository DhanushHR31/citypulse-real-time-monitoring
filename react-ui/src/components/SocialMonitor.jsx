import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LiveMap, Bdg } from './shared';
import { BANGALORE, ZONE_COLOR, SEV_COLOR, EVENTS, ALERTS, SOCIAL_POSTS, ZONE_STATS, NAV, EVENT_TYPES, RANGES, ZONES } from '../data/mockData';

export default function SocialMonitor({ social, onRefresh, addToast }) {
  const [filter, setFilter] = useState('All Platforms'); const [search, setSearch] = useState('');
  const filtered = social.filter(s => (filter === 'All Platforms' || s.platform === filter.toLowerCase()) && (s.text.toLowerCase().includes(search.toLowerCase()) || !search));
  return <div style={{ padding: 16 }}>
    <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)', borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>📡 Social Intelligence — Bengaluru</h2>
          <p style={{ color: 'rgba(255,255,255,.65)', marginTop: 4, marginBottom: 14 }}>All 8 zones · AI-Powered Preprocessing & Geocoding</p>
        </div>
        <button 
          onClick={async () => {
            if (addToast) addToast('⚡ AI Start', 'Phase 1-6 Social Monitoring workflow initiated...');
            try {
               const res = await fetch('http://127.0.0.1:8000/collection/fetch-all', { method: 'POST' });
               if (res.ok) {
                 const data = await res.json();
                 if (addToast) addToast('✅ Success', `Collected ${data.count} new AI-verified incidents!`);
                 if (onRefresh) onRefresh();
               }
            } catch (e) {
               if (addToast) addToast('❌ Error', 'Could not reach Social Collection Server.');
            }
          }}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 10, fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          ✨ Fetch AI Insights
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {['🚨 Critical', '🚗 Severe Congestion', '🌧️ Challenging Conditions', '⚠️ High Alert'].map(t => <span key={t} style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', padding: '4px 12px', borderRadius: 999, fontSize: '.78rem' }}>{t}</span>)}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input style={{ flex: 1, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, padding: '9px 14px', color: '#fff', fontSize: '.88rem', outline: 'none' }} placeholder="Search incidents, #hashtags, areas..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, padding: '9px 14px', color: '#fff', fontSize: '.88rem' }} value={filter} onChange={e => setFilter(e.target.value)}>
          {['All Platforms', 'Twitter', 'Facebook', 'Instagram'].map(p => <option key={p} style={{ background: '#1a2235' }}>{p}</option>)}
        </select>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
      {[{ icon: '💬', v: 45, l: 'Live Reports', c: '#6366f1' }, { icon: '🚨', v: 5, l: 'Critical Alerts', c: '#ef4444' }, { icon: '✅', v: 25, l: 'Verified', c: '#22c55e' }, { icon: '#', v: 25, l: 'Trending Tags', c: '#a78bfa' }].map(s => <div key={s.l} className="cp-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.c}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{s.icon}</div>
        <div><div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{s.l}</div></div>
      </div>)}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>
      <div className="cp-card" style={{ padding: 0, overflow: 'hidden' }}><LiveMap events={EVENTS} height="380px" /></div>
      <div>
        <div className="cp-card" style={{ marginBottom: 14 }}>
          <div className="p-hdr">📊 Social Media Insights</div>
          {[{ l: 'Total Alerts', v: 45, c: '#6366f1' }, { l: 'Verified', v: 25, c: '#22c55e' }, { l: 'High Relevance', v: 38, c: '#f59e0b' }, { l: 'Trending Tags', v: 25, c: '#a78bfa' }].map((s, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.05)', fontSize: '.85rem' }}><span style={{ color: 'var(--muted)' }}>{s.l}</span><b style={{ color: s.c }}>{s.v}</b></div>)}
        </div>
        <div className="cp-card">
          <div className="p-hdr">🔥 Most Mentioned</div>
          {['#BangaloreTraffic', '#BBMP', '#BangaloreRains', '#SilkBoard', '#Whitefield'].map((t, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.05)', fontSize: '.82rem' }}><span style={{ color: 'var(--accent)' }}>{t}</span><span style={{ color: 'var(--muted)' }}>{20 - i * 3} posts</span></div>)}
        </div>
      </div>
    </div>
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {filtered.map(s => <div key={s.id} className="cp-card">
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          <span className={`plat plat-${s.platform}`}>{s.platform === 'twitter' ? '𝕏 twitter' : s.platform === 'facebook' ? 'f facebook' : '📷 instagram'} {s.verified && '✓'}</span>
          <span style={{ marginLeft: 'auto', fontSize: '.75rem', color: 'var(--muted)' }}>📍 {s.loc} · {s.time}</span>
          <Bdg sev={s.sev} />
        </div>
        <p style={{ fontSize: '.9rem', margin: 0 }}>{s.text}</p>
        <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>{s.tags.map(t => <span key={t} style={{ background: 'rgba(6,182,212,.15)', color: 'var(--accent)', fontSize: '.72rem', padding: '2px 8px', borderRadius: 999 }}>{t}</span>)}</div>
      </div>)}
    </div>
  </div>;
}
