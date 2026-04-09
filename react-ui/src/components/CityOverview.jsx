import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LiveMap, Bdg } from './shared';
import { BANGALORE, ZONE_COLOR, SEV_COLOR, EVENTS, ALERTS, SOCIAL_POSTS, ZONE_STATS, NAV, EVENT_TYPES, RANGES, ZONES } from '../data/mockData';

export default function CityOverview({ events }) {
  const hourly = Array.from({ length: 12 }, (_, i) => ({ time: `${8 + i}:00`, events: Math.floor(Math.random() * 8 + 2), alerts: Math.floor(Math.random() * 3) }));
  return <div style={{ padding: 16 }}>
    <h2 className="pg-title">🏙️ Bangalore City Overview</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
      <div>
        <div className="cp-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}><LiveMap events={events} height="380px" /></div>
        <div className="cp-card">
          <div className="p-hdr">📈 Incident Trend (Today)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={hourly}><defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.07)" /><XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11 }} /><YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} /><Tooltip contentStyle={{ background: '#1a2235', border: '1px solid #6366f1', borderRadius: 8, color: '#f1f5f9' }} />
              <Area type="monotone" dataKey="events" stroke="#6366f1" fill="url(#g1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <div className="cp-card" style={{ marginBottom: 14 }}>
          <div className="p-hdr">📊 By Zone</div>
          {ZONE_STATS.map(z => <div key={z.zone} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: '.82rem' }}>
            <span style={{ width: 70, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted)' }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: z.color, display: 'inline-block' }} />{z.zone}</span>
            <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,.07)', borderRadius: 999 }}><div style={{ height: '100%', width: `${(z.count / 16) * 100}%`, background: z.color, borderRadius: 999 }} /></div>
            <b>{z.count}</b>
          </div>)}
        </div>
        <div className="cp-card">
          <div className="p-hdr">🏷️ Trending Tags</div>
          {['#BangaloreTraffic', '#BBMP', '#BangaloreRains', '#SilkBoard', '#Whitefield', '#MajesticFire', '#ORR'].map((t, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,.05)', fontSize: '.82rem' }}>
            <span style={{ color: 'var(--accent)' }}>{t}</span><span style={{ color: 'var(--muted)' }}>{22 - i * 2} mentions</span>
          </div>)}
        </div>
      </div>
    </div>
  </div>;
}
