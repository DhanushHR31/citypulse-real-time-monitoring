import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LiveMap, Bdg } from './shared';
import { BANGALORE, ZONE_COLOR, SEV_COLOR, EVENTS, ALERTS, SOCIAL_POSTS, ZONE_STATS, NAV, EVENT_TYPES, RANGES, ZONES } from '../data/mockData';

export default function SafetyAlerts({ alerts }) {
  return <div style={{ padding: 16 }}>
    <h2 className="pg-title">🔔 Safety Alerts</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {alerts.map(a => <div key={a.id} className={`cp-card alert-${a.sev}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><span style={{ fontSize: '1.3rem' }}>{a.icon}</span><span style={{ fontWeight: 700, flex: 1 }}>{a.title}</span><Bdg sev={a.sev} /></div>
        <p style={{ fontSize: '.85rem', color: 'var(--muted)', marginBottom: 8 }}>{a.desc}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'rgba(255,255,255,.3)' }}><span>Zone: {a.zone}</span><span>Expires: {a.expires}</span></div>
      </div>)}
    </div>
  </div>;
}
