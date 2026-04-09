import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LiveMap, Bdg } from './shared';
import { BANGALORE, ZONE_COLOR, SEV_COLOR, EVENTS, ALERTS, SOCIAL_POSTS, ZONE_STATS, NAV, EVENT_TYPES, RANGES, ZONES } from '../data/mockData';

export default function ApiDocs() {
  const eps = [{ m: 'GET', p: '/events', d: 'Fetch all city events', r: '[{id,title,type,severity,lat,lng,...}]' }, { m: 'POST', p: '/collection/fetch-all', d: 'Trigger social media collection pipeline', r: '{status,count,data:{news,social}}' }, { m: 'POST', p: '/navigation/route', d: 'Calculate OSRM route', r: '{data:{routes:[{geometry,legs,duration,distance}]}}' }, { m: 'POST', p: '/predict/severity', d: 'AI severity prediction', r: '{prediction:{severity,confidence,method}}' }, { m: 'GET', p: '/alerts', d: 'Get active safety alerts', r: '[{id,title,desc,severity,...}]' }];
  const MC = { 'GET': '#22c55e', 'POST': '#6366f1', 'PUT': '#f59e0b', 'DELETE': '#ef4444' };
  return <div style={{ padding: 16 }}>
    <h2 className="pg-title">&lt;/&gt; API Documentation</h2>
    <div className="cp-card" style={{ marginBottom: 14, background: 'rgba(99,102,241,.08)', border: '1px solid var(--primary)' }}>
      <b>Base URL:</b> <code style={{ color: 'var(--accent)' }}>http://localhost:8000</code><br />
      <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>FastAPI backend · SQLite DB · Automatic docs at /docs</span>
    </div>
    {eps.map((e, i) => <div key={i} className="cp-card" style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <span style={{ background: MC[e.m], color: '#000', fontWeight: 800, padding: '3px 10px', borderRadius: 6, fontSize: '.8rem' }}>{e.m}</span>
        <code style={{ color: 'var(--primaryh)', fontSize: '1rem' }}>{e.p}</code>
        <span style={{ color: 'var(--muted)', fontSize: '.85rem' }}>{e.d}</span>
      </div>
      <div style={{ background: 'rgba(0,0,0,.3)', borderRadius: 8, padding: 10, fontFamily: 'monospace', fontSize: '.8rem', color: '#a3e635' }}>{e.r}</div>
    </div>)}
  </div>;
}
