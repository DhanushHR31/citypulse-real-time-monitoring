import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LiveMap, Bdg } from './shared';
import { BANGALORE, ZONE_COLOR, SEV_COLOR, EVENTS, ALERTS, SOCIAL_POSTS, ZONE_STATS, NAV, EVENT_TYPES, RANGES, ZONES } from '../data/mockData';

export default function NearbyEvents({ events }) {
  const [rad, setRad] = useState('5km');
  const dist = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) * 111;
  const km = parseInt(rad);
  const nearby = events.filter(e => dist([e.lat, e.lng], BANGALORE) < km);
  return <div style={{ padding: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <h2 className="pg-title">📍 Nearby Events</h2>
      <div style={{ display: 'flex', gap: 6 }}>{RANGES.map(r => <button key={r} className={`rb${rad === r ? ' ra' : ''}`} onClick={() => setRad(r)}>{r}</button>)}</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14, height: 'calc(100vh - 260px)' }}>
      <div className="cp-card" style={{ padding: 0, overflow: 'hidden' }}><LiveMap events={nearby} height="100%" circles={true} /></div>
      <div style={{ overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[{ l: 'Incidents', v: nearby.filter(e => ['Accidents', 'Fire'].includes(e.type)).length, c: 'var(--danger)' }, { l: 'Road Issues', v: nearby.filter(e => ['Works', 'Power'].includes(e.type)).length, c: 'var(--warning)' }, { l: 'Social', v: Math.floor(nearby.length * 0.4), c: 'var(--accent)' }, { l: 'Total', v: nearby.length, c: 'var(--primary)' }].map(s => (
            <div key={s.l} className="cp-card" style={{ textAlign: 'center', padding: 14 }}><div style={{ fontSize: '2rem', fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{s.l}</div></div>
          ))}
        </div>
        {nearby.map(ev => <div key={ev.id} className="ev-row cp-card" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: '1.3rem' }}>{ev.icon}</span>
          <div style={{ flex: 1 }}><div style={{ fontSize: '.85rem', fontWeight: 600 }}>{ev.title}</div><div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{ev.loc} · {ev.time}</div></div>
          <Bdg sev={ev.sev} />
        </div>)}
      </div>
    </div>
  </div>;
}
