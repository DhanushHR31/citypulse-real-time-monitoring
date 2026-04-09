import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LiveMap, Bdg } from './shared';
import { BANGALORE, ZONE_COLOR, SEV_COLOR, EVENTS, ALERTS, SOCIAL_POSTS, ZONE_STATS, NAV, EVENT_TYPES, RANGES, ZONES } from '../data/mockData';

export default function MyReports({ myReports }) {
  const demo = [{ id: 'd1', type: 'Suspicious Activity', location: 'Cubbon Park', desc: 'Group of people behaving suspiciously near lake.', time: '2h ago', status: 'Verified', sev: 'medium' }, { id: 'd2', type: 'Poor Lighting', location: '80ft Road, Indiranagar', desc: 'Street lights not working for 3 days.', time: '1d ago', status: 'Pending', sev: 'low' }, { id: 'd3', type: 'Road Damage', location: 'Koramangala 5th Block', desc: 'Large pothole causing accidents.', time: '2d ago', status: 'Resolved', sev: 'high' }];
  const all = [...myReports.map(r => ({ ...r, sev: 'low' })), ...demo];
  const statusColor = { Verified: '#22c55e', Pending: '#f59e0b', Resolved: '#6366f1', Submitted: '#06b6d4' };
  return <div style={{ padding: 16 }}>
    <h2 className="pg-title">📄 My Reports</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {all.map(r => <div key={r.id} className="cp-card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(99,102,241,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>📋</div>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 700, marginBottom: 3 }}>{r.type} — {r.location}</div><div style={{ fontSize: '.82rem', color: 'var(--muted)', marginBottom: 6 }}>{r.desc}</div><div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.3)' }}>{r.time}</div></div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span style={{ background: statusColor[r.status] || '#64748b', color: '#000', fontSize: '.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>{r.status}</span>
          <Bdg sev={r.sev} />
        </div>
      </div>)}
    </div>
  </div>;
}
