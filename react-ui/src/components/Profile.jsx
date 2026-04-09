import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LiveMap, Bdg } from './shared';
import { BANGALORE, ZONE_COLOR, SEV_COLOR, EVENTS, ALERTS, SOCIAL_POSTS, ZONE_STATS, NAV, EVENT_TYPES, RANGES, ZONES } from '../data/mockData';

export default function Profile() {
  return <div style={{ padding: 16 }}>
    <h2 className="pg-title">👤 Profile</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <div className="cp-card">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👤</div>
          <div><div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Welcome User</div><div style={{ color: 'var(--muted)' }}>dhanushhr998@gmail.com</div><div style={{ marginTop: 6 }}><span style={{ background: '#22c55e', color: '#000', fontSize: '.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 999 }}>● Safe</span></div></div>
        </div>
        {[['Role', 'User · Citizen Reporter'], ['Member Since', 'February 2026'], ['Reports Submitted', '0'], ['Alerts Received', '5']].map(([l, v]) => <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.05)', fontSize: '.88rem' }}><span style={{ color: 'var(--muted)' }}>{l}</span><b>{v}</b></div>)}
      </div>
      <div className="cp-card">
        <div className="p-hdr">⚙️ Preferences</div>
        {[{ l: 'Notification Alerts', v: true }, { l: 'Email Updates', v: false }, { l: 'SMS Alerts', v: true }, { l: 'Night Mode', v: true }].map(p => <div key={p.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
          <span style={{ fontSize: '.88rem' }}>{p.l}</span>
          <div style={{ width: 40, height: 22, borderRadius: 999, background: p.v ? 'var(--primary)' : 'rgba(255,255,255,.1)', position: 'relative', cursor: 'pointer' }}><div style={{ position: 'absolute', top: 3, left: p.v ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} /></div>
        </div>)}
        <div className="p-hdr" style={{ marginTop: 16 }}>🛠️ Tech Stack</div>
        {['React 18 + Vite', 'Leaflet + OpenStreetMap', 'OSRM Routing Engine', 'Nominatim Geocoding', 'FastAPI Backend', 'SQLite Database'].map(t => <div key={t} style={{ display: 'flex', gap: 8, padding: '5px 0', fontSize: '.82rem', color: 'var(--muted)' }}><span style={{ color: 'var(--success)' }}>✓</span>{t}</div>)}
      </div>
    </div>
  </div>;
}
