import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LiveMap, Bdg } from './shared';
import { BANGALORE, ZONE_COLOR, SEV_COLOR, EVENTS, ALERTS, SOCIAL_POSTS, ZONE_STATS, NAV, EVENT_TYPES, RANGES, ZONES } from '../data/mockData';

export default function Analytics({ events }) {
  const bar = ZONE_STATS;
  const pie = [{ name: 'High', value: events.filter(e => e.sev === 'high').length || 1 }, { name: 'Medium', value: events.filter(e => e.sev === 'medium').length || 1 }, { name: 'Low', value: events.filter(e => e.sev === 'low').length || 1 }, { name: 'Critical', value: events.filter(e => e.sev === 'critical').length || 1 }];
  const COLORS = ['#f97316', '#f59e0b', '#22c55e', '#ef4444'];
  const line = Array.from({ length: 7 }, (_, i) => ({ day: `Day ${i + 1}`, incidents: Math.floor(Math.random() * 20 + 5), alerts: Math.floor(Math.random() * 8 + 1) }));
  return <div style={{ padding: 16 }}>
    <h2 className="pg-title">📊 Analytics</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
      {[{ l: 'Total Events', v: events.length, c: 'var(--primary)' }, { l: 'Critical', v: events.filter(e => e.sev === 'critical').length, c: 'var(--danger)' }, { l: 'High', v: events.filter(e => e.sev === 'high').length, c: 'var(--warning)' }, { l: 'Zones Active', v: ZONE_STATS.length, c: 'var(--accent)' }].map(s => <div key={s.l} className="cp-card" style={{ textAlign: 'center' }}><div style={{ fontSize: '2.2rem', fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{s.l}</div></div>)}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
      <div className="cp-card"><div className="p-hdr">📈 7-Day Incident Trend</div>
        <ResponsiveContainer width="100%" height={220}><LineChart data={line}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.07)" /><XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 11 }} /><YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} /><Tooltip contentStyle={{ background: '#1a2235', border: '1px solid #6366f1', borderRadius: 8, color: '#f1f5f9' }} /><Legend /><Line type="monotone" dataKey="incidents" stroke="#6366f1" strokeWidth={2} /><Line type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
      <div className="cp-card"><div className="p-hdr">🍩 Severity Distribution</div>
        <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={pie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} stroke="none">{pie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip contentStyle={{ background: '#1a2235', border: '1px solid #6366f1', borderRadius: 8, color: '#f1f5f9' }} /></PieChart></ResponsiveContainer></div>
    </div>
    <div className="cp-card"><div className="p-hdr">📊 Events by Zone</div>
      <ResponsiveContainer width="100%" height={220}><BarChart data={bar} barSize={36}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.07)" /><XAxis dataKey="zone" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{ background: '#1a2235', border: '1px solid #6366f1', borderRadius: 8, color: '#f1f5f9' }} /><Bar dataKey="count" radius={[6, 6, 0, 0]}>{bar.map((z, i) => <Cell key={i} fill={z.color} />)}</Bar></BarChart></ResponsiveContainer></div>
  </div>;
}
