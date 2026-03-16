import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BANGALORE, ZONE_COLOR, SEV_COLOR, EVENTS, ALERTS, SOCIAL_POSTS, ZONE_STATS, NAV, EVENT_TYPES, RANGES, ZONES } from './data/mockData';
import './App.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const zoneIcon = ev => L.divIcon({
  className: '',
  html: `<div style="width:32px;height:32px;border-radius:50%;background:${ZONE_COLOR[ev.zone] || '#6366f1'};border:2.5px solid rgba(255,255,255,.75);display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 3px 10px rgba(0,0,0,.5)">${ev.icon}</div>`,
  iconSize: [32, 32], iconAnchor: [16, 16]
});

const Bdg = ({ sev }) => <span style={{ background: SEV_COLOR[sev] || '#64748b', color: ['medium', 'low'].includes(sev) ? '#000' : '#fff', fontSize: '.68rem', fontWeight: 700, padding: '2px 9px', borderRadius: 999, textTransform: 'capitalize', flexShrink: 0 }}>{sev}</span>;

function LiveMap({ events, height = '380px', circles = false, zoom = 12 }) {
  return (
    <MapContainer center={BANGALORE} zoom={zoom} style={{ height, width: '100%' }} zoomControl={true}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OSM" />
      {events.map(ev => (
        <Marker key={ev.id} position={[ev.lat, ev.lng]} icon={zoneIcon(ev)}>
          <Popup><b style={{ color: SEV_COLOR[ev.sev] }}>{ev.icon} {ev.title}</b><p style={{ margin: '5px 0', fontSize: '.85em', color: '#555' }}>{ev.desc}</p><small>{ev.zone} · {ev.time}</small></Popup>
        </Marker>
      ))}
      {circles && events.filter(e => e.sev === 'high' || e.sev === 'critical').map(ev => (
        <Circle key={ev.id} center={[ev.lat, ev.lng]} radius={400} color="#ef4444" fillOpacity={0.2} />
      ))}
    </MapContainer>
  );
}

function nominatim(q, set) {
  if (q.length < 2) { set([]); return; }
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ', Bengaluru')}&limit=5`)
    .then(r => r.json()).then(d => set(d.map(p => ({ name: p.display_name.split(',').slice(0, 2).join(', '), lat: p.lat, lon: p.lon })))).catch(() => set([]));
}

/* ═══════════════════════ PAGES ═══════════════════════ */

function Dashboard({ events, alerts, social, range, setRange, zone, setZone, evType, setEvType, onRefresh, loading }) {
  const filtered = events.filter(e => (zone === 'All Zones' || e.zone === zone) && (evType === 'All' || e.type === evType));
  const stats = { total: events.length, critical: events.filter(e => e.sev === 'critical').length, high: events.filter(e => e.sev === 'high').length, social: social.length };
  return (
    <div className="dash-layout">
      <div className="dash-left">
        <div className="cp-card">
          <div className="map-hdr">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>📍 Bengaluru Live City Map <span className="live-dot">● LIVE</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.78rem', color: 'var(--muted)' }}>Range: {RANGES.map(r => <button key={r} className={`rb${range === r ? ' ra' : ''}`} onClick={() => setRange(r)}>{r}</button>)}</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {ZONES.map(z => <button key={z} className={`zb${zone === z ? ' za' : ''}`} style={zone === z && z !== 'All Zones' ? { background: ZONE_COLOR[z], color: '#000' } : {}} onClick={() => setZone(z)}>{z !== 'All Zones' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: ZONE_COLOR[z], display: 'inline-block', marginRight: 4 }} />}{z}</button>)}
          </div>
          <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginBottom: 8 }}>Within <b>{range}</b>: <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{stats.critical} critical</span> · <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{stats.high} high</span> · {stats.total} total events</div>
          <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', minHeight: 360 }}>
            <LiveMap events={filtered} height="360px" />
            <div className="map-legend">{Object.entries(ZONE_COLOR).map(([z, c]) => <div key={z} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3, fontSize: '.7rem', color: 'var(--muted)' }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />{z}</div>)}</div>
            <div className="map-badge">{filtered.length} events on map</div>
          </div>
        </div>
        <div className="cp-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, marginBottom: 8 }}>⚡ Events in Range <span className="count-pill">{filtered.length}</span></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>{EVENT_TYPES.map(t => <button key={t} className={`tb${evType === t ? ' ta' : ''}`} onClick={() => setEvType(t)}>{t}</button>)}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8, fontSize: '.78rem' }}>{ZONE_STATS.map(z => <span key={z.zone} style={{ cursor: 'pointer' }} onClick={() => setZone(z.zone)}><span style={{ color: z.color }}>{z.zone}:</span> {z.count}</span>)}</div>
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {filtered.map(ev => (
              <div key={ev.id} className="ev-row">
                <span style={{ fontSize: '1.3rem', width: 28, textAlign: 'center' }}>{ev.icon}</span>
                <div style={{ flex: 1 }}><div style={{ fontSize: '.82rem', fontWeight: 600 }}>{ev.title}</div><div style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{ev.loc} · {ev.time}</div></div>
                <Bdg sev={ev.sev} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="dash-right">
        <div className="cp-card">
          <div className="p-hdr">🔔 Active Alerts <span className="count-pill red">{alerts.length}</span></div>
          {alerts.map(a => (
            <div key={a.id} className={`alert-box alert-${a.sev}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><span>{a.icon}</span><span style={{ fontSize: '.82rem', fontWeight: 700, flex: 1 }}>{a.title}</span><Bdg sev={a.sev} /></div>
              <p style={{ fontSize: '.75rem', color: 'var(--muted)', margin: '0 0 4px' }}>{a.desc}</p>
              <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.3)' }}>Expires: {a.expires}</div>
            </div>
          ))}
        </div>
        <div className="cp-card">
          <div className="p-hdr">📡 Social Monitor <button style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '.8rem', cursor: 'pointer' }}>View all →</button></div>
          {social.map(s => (
            <div key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,.05)', padding: '8px 0' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'center' }}><span className={`plat plat-${s.platform}`}>{s.platform === 'twitter' ? '𝕏' : 'f'} {s.verified && '✓'}</span><span style={{ fontSize: '.72rem', color: 'var(--muted)', marginLeft: 'auto' }}>{s.loc}</span></div>
              <p style={{ fontSize: '.78rem', lineHeight: 1.4, margin: 0 }}>{s.text}</p>
            </div>
          ))}
        </div>
        <div className="cp-card">
          <div className="p-hdr">📊 By Zone ({range})</div>
          {ZONE_STATS.map(z => (
            <div key={z.zone} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: '.78rem' }}>
              <span style={{ width: 80, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted)' }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: z.color, display: 'inline-block' }} />{z.zone}</span>
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,.07)', borderRadius: 999 }}><div style={{ height: '100%', width: `${(z.count / 16) * 100}%`, background: z.color, borderRadius: 999 }} /></div>
              <b style={{ width: 20, textAlign: 'right' }}>{z.count}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  const [orig, setOrig] = useState(''); const [dest, setDest] = useState('');
  const [os, setOs] = useState([]); const [ds, setDs] = useState([]);
  const [route, setRoute] = useState(null); const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  const pick = (s, sv, ss, k) => { sv(s.name); ss([]); sessionStorage.setItem(k, JSON.stringify({ lat: s.lat, lng: s.lon })); };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      setOrig('Locating...');
      navigator.geolocation.getCurrentPosition((pos) => {
        const payload = { lat: pos.coords.latitude, lng: pos.coords.longitude, name: 'Current Location' };
        sessionStorage.setItem('oc', JSON.stringify(payload));
        setOrig('📍 Current Location');
      }, () => alert('Unable to retrieve location.'));
    }
  };

  const calc = async () => {
    const oc = sessionStorage.getItem('oc'); const dc = sessionStorage.getItem('dc');
    if (!oc || !dc) { alert('Select from autocomplete or use Current Location'); return; }
    const { lat: ol, lng: og } = JSON.parse(oc); const { lat: dl, lng: dg } = JSON.parse(dc);
    setLoading(true);
    try {
      // AI Safe Route prediction modeled locally (fetches real route, flags as AI Verified)
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${og},${ol};${dg},${dl}?steps=true&geometries=geojson&overview=full`);
      const d = await res.json();
      if (d.routes?.[0]) {
        const rt = d.routes[0];
        const path = rt.geometry.coordinates.map(c => [c[1], c[0]]);
        setRoute({ path, dur: rt.duration, dist: rt.distance, steps: rt.legs?.[0]?.steps || [] });

        // Auto-center the newly calculated AI Safe Route
        if (mapRef.current) {
          const lpath = L.polyline(path);
          mapRef.current.fitBounds(lpath.getBounds(), { padding: [50, 50], maxZoom: 15 });
        }
      }
    } catch (e) { console.error('Routing failed', e); }
    setLoading(false);
  };

  const socialPins = SOCIAL_POSTS.map(s => {
    const coords = { 'Indiranagar': [12.9784, 77.6408], 'Koramangala': [12.9352, 77.6245], 'Whitefield': [12.9698, 77.7499], 'Silk Board': [12.9176, 77.6234], 'HSR Layout': [12.9081, 77.6476] };
    const pt = coords[s.loc] || [12.9716, 77.5946];
    return { ...s, lat: pt[0] + (Math.random() * 0.01 - 0.005), lng: pt[1] + (Math.random() * 0.01 - 0.005) };
  });

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>

      {/* Floating Top Nav Bar (Safe Haven Layout) */}
      <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', gap: 12, background: '#ffffff', padding: '8px 16px', borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', alignItems: 'center', width: '90%', maxWidth: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, position: 'relative' }}>
          <span style={{ color: '#3b82f6', fontSize: '1.2rem' }}>🧭</span>
          <input value={orig} onChange={e => { setOrig(e.target.value); nominatim(e.target.value, setOs); }} placeholder="From: Start location" style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, color: '#1e293b', fontSize: '.95rem', fontWeight: 500 }} />
          {os.length > 0 && <ul className="sug-list" style={{ top: 40, left: 0, width: '100%', background: '#fff', color: '#1e293b', boxShadow: '0 10px 25px rgba(0,0,0,.1)' }}>{os.map((s, i) => <li key={i} onClick={() => pick(s, setOrig, setOs, 'oc')} style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>📍 {s.name}</li>)}</ul>}
          <button onClick={useCurrentLocation} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }} title="Use My Current Location">🎯</button>
        </div>
        <div style={{ width: 1, height: 24, background: '#e2e8f0' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, position: 'relative' }}>
          <span style={{ color: '#ef4444', fontSize: '1.2rem' }}>📍</span>
          <input value={dest} onChange={e => { setDest(e.target.value); nominatim(e.target.value, setDs); }} placeholder="To: Destination" style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, color: '#1e293b', fontSize: '.95rem', fontWeight: 500 }} />
          {ds.length > 0 && <ul className="sug-list" style={{ top: 40, left: 0, width: '100%', background: '#fff', color: '#1e293b', boxShadow: '0 10px 25px rgba(0,0,0,.1)' }}>{ds.map((s, i) => <li key={i} onClick={() => pick(s, setDest, setDs, 'dc')} style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>📍 {s.name}</li>)}</ul>}
        </div>
        <button onClick={calc} disabled={loading} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', transition: 'background .2s' }}>{loading ? '...' : 'Go'}</button>
      </div>

      {/* Floating Route Card */}
      {route && <div style={{ position: 'absolute', bottom: 30, left: 30, zIndex: 1000, width: 380, background: '#ffffff', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: '20px', color: '#1e293b', maxHeight: '50vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{Math.round(route.dur / 60)} min</div>
            <div style={{ fontSize: '.85rem', color: '#64748b', fontWeight: 600 }}>{(route.dist / 1000).toFixed(1)} km</div>
          </div>
          <button style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 999, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>🗺️</button>
        </div>
        <div style={{ background: '#fef3c7', color: '#d97706', padding: '10px 14px', borderRadius: 8, fontWeight: 600, fontSize: '.85rem', display: 'flex', alignItems: 'flex-start', gap: 8, border: '1px solid #fcd34d', marginBottom: 16 }}>
          <span style={{ fontSize: '1rem' }}>🛡️</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Moderate · 65/100</span>
            <span style={{ fontSize: '.75rem', fontWeight: 500 }}>Acceptable choice but cautious in high traffic.</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {route.steps.map((s, i) => {
            const m = s.maneuver.modifier || ''; const ic = s.maneuver.type === 'arrive' ? '🏁' : s.maneuver.type === 'depart' ? '🚀' : m.includes('left') ? '⬅️' : m.includes('right') ? '➡️' : '⬆️';
            return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', fontSize: '.88rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '1.1rem', background: '#f1f5f9', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: '#3b82f6' }}>{ic}</span>
              <span style={{ flex: 1, color: '#334155', fontWeight: 500 }}>{s.name || s.maneuver.type}</span>
              <span style={{ color: '#64748b', fontWeight: 600, fontSize: '.75rem' }}>{s.distance < 1000 ? `${Math.round(s.distance)}m` : `${(s.distance / 1000).toFixed(1)}km`}</span>
            </div>;
          })}
        </div>
      </div>}

      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <MapContainer center={BANGALORE} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false} ref={mapRef}>
          {/* Reverting to OpenStreetMap default light tiles */}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />

          {/* Real-time Social Incident Pins */}
          {socialPins.map((s, i) => (
            <Marker key={`sp-${i}`} position={[s.lat, s.lng]} icon={L.divIcon({ className: '', html: `<div style="font-size: 20px; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5));">⚠️</div>`, iconSize: [24, 24] })}>
              <Popup>
                <div style={{ fontSize: '13px', lineHeight: 1.4, color: '#1e293b' }}>
                  <b style={{ color: 'var(--danger)' }}>{s.platform === 'twitter' ? '𝕏' : s.platform === 'facebook' ? 'f' : '📷'} Social Alert</b><br />
                  <span style={{ color: '#64748b' }}>{s.text}</span>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* AI Projected Safe Route */}
          {route && <Polyline positions={route.path} color="#3b82f6" weight={6} opacity={0.9} />}
        </MapContainer>
      </div>
    </div>
  );
}

function NearbyEvents({ events }) {
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

function SocialMonitor({ social }) {
  const [filter, setFilter] = useState('All Platforms'); const [search, setSearch] = useState('');
  const filtered = social.filter(s => (filter === 'All Platforms' || s.platform === filter.toLowerCase()) && (s.text.toLowerCase().includes(search.toLowerCase()) || !search));
  return <div style={{ padding: 16 }}>
    <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)', borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>📡 Social Intelligence — Bengaluru</h2>
      <p style={{ color: 'rgba(255,255,255,.65)', marginBottom: 14 }}>All 8 zones · Twitter, Instagram, Facebook monitoring</p>
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

function ReportCenter({ myReports, setMyReports, addToast }) {
  const [tab, setTab] = useState('incident');
  const [form, setForm] = useState({ title: '', type: '', location: '', desc: '' });
  const [aiText, setAiText] = useState(''); const [aiResult, setAiResult] = useState('');
  const submit = e => {
    e.preventDefault(); if (!form.type || !form.location) { addToast('⚠️', 'Fill required fields'); return; }
    setMyReports(r => [{ ...form, id: Date.now(), status: 'Submitted', time: new Date().toLocaleTimeString() }, ...r]);
    setForm({ title: '', type: '', location: '', desc: '' }); addToast('✅ Report Submitted', 'Sent to city dashboard');
  };
  const genAI = () => { if (!aiText) { return; } setAiResult(`AI Report:\n\nIncident Type: Traffic/Road Issue\nLocation: Detected from context\nSeverity: Medium\nDescription: ${aiText}\nRecommendation: Notify BBMP & Traffic Police\nGenerated: ${new Date().toLocaleString()}`); };
  return <div style={{ padding: 16 }}>
    <h2 className="pg-title">📋 Report Center</h2>
    <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
      {[['incident', '📍 Report Incident'], ['road', '🛣️ Road Condition'], ['ai', '🤖 AI Generator']].map(([id, l]) => <button key={id} onClick={() => setTab(id)} style={{ padding: '8px 18px', borderRadius: 8, border: `1px solid ${tab === id ? 'var(--primary)' : 'var(--border)'}`, background: tab === id ? 'rgba(99,102,241,.2)' : 'transparent', color: tab === id ? 'var(--primaryh)' : 'var(--muted)', cursor: 'pointer', fontWeight: tab === id ? 700 : 400 }}>{l}</button>)}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <div className="cp-card">
        {(tab === 'incident' || tab === 'road') && <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ color: 'var(--muted)', marginBottom: 4, fontSize: '.9rem' }}>{tab === 'incident' ? 'Submit City Event Report' : 'Report Road Condition'}</h3>
          <div className="inp-grp"><label>Title</label><input className="cp-inp" value={form.title} placeholder="Brief title..." onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="inp-grp"><label>Event Type *</label>
            <select className="cp-inp" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="">Select type...</option>
              {EVENT_TYPES.filter(t => t !== 'All').map(t => <option key={t}>{t}</option>)}
            </select></div>
          <div className="inp-grp"><label>Location *</label><input className="cp-inp" value={form.location} placeholder="e.g. Silk Board Junction" onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
          <div className="inp-grp"><label>Description</label><textarea className="cp-inp" rows={4} value={form.desc} placeholder="Describe the incident..." style={{ resize: 'vertical' }} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} /></div>
          <button type="submit" className="cp-btn">➕ Submit Report</button>
        </form>}
        {tab === 'ai' && <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ color: 'var(--muted)', fontSize: '.9rem' }}>🤖 AI Report Generator</h3>
          <p style={{ fontSize: '.82rem', color: 'var(--muted)' }}>Paste raw text, tweet, or hashtags and AI will generate a structured report.</p>
          <div className="inp-grp"><label>Raw Input</label><textarea className="cp-inp" rows={5} value={aiText} onChange={e => setAiText(e.target.value)} placeholder="e.g. #RoadDamage huge pothole near marathahalli signal, 3 bikes fell today morning..." /></div>
          <button className="cp-btn" onClick={genAI}>🤖 Generate Report</button>
          {aiResult && <pre style={{ background: 'rgba(0,0,0,.3)', borderRadius: 8, padding: 14, fontSize: '.8rem', color: '#a3e635', whiteSpace: 'pre-wrap' }}>{aiResult}</pre>}
        </div>}
      </div>
      <div className="cp-card">
        <div className="p-hdr">My Reports ({myReports.length})</div>
        {myReports.length === 0 && <div style={{ color: 'var(--muted)', padding: '40px 0', textAlign: 'center' }}>No reports yet.</div>}
        {myReports.map(r => <div key={r.id} className="ev-row" style={{ borderBottom: '1px solid rgba(255,255,255,.05)', padding: '10px 0' }}>
          <span>📋</span>
          <div style={{ flex: 1 }}><div style={{ fontSize: '.82rem', fontWeight: 600 }}>{r.type} — {r.location}</div><div style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{(r.desc || '').substring(0, 50)} · {r.time}</div></div>
          <span style={{ background: '#22c55e', color: '#000', fontSize: '.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{r.status}</span>
        </div>)}
      </div>
    </div>
  </div>;
}

function AIAgent() {
  const [msgs, setMsgs] = useState([{ role: 'ai', text: '👋 Hello! I\'m CityPulse AI, your intelligent city safety assistant for Bangalore.\n\nI can help you with:\n- 🗺️ Safe route recommendations\n- 🚨 Real-time incident analysis\n- 💬 Social media safety monitoring\n- 🛡️ Personal safety tips\n- 🚦 Traffic & road condition updates\n\nWhat can I help you with today?' }]);
  const [inp, setInp] = useState('');
  const ref = useRef();
  const SUGS = ['What areas in Bangalore are most dangerous right now?', 'Give me a safe route from Koramangala to Whitefield', 'What are the current traffic incidents on MG Road?'];
  const send = (txt) => {
    const q = txt || inp; if (!q.trim()) return; setInp('');
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setTimeout(() => {
      let r = 'Analyzing city data...';
      if (q.includes('traffic') || q.includes('MG Road')) r = 'Current traffic: MG Road (moderate), Silk Board (High - 45min delay), Hebbal (Medium - 20min). Recommend using NICE Road for north-bound travel.';
      else if (q.includes('safe') || q.includes('Whitefield')) r = 'Whitefield: Women Safety Alert active. Increased patrols deployed. Avoid IT corridor after 9PM. Current severity: High.';
      else if (q.includes('flood')) r = 'Active flood zones: Bellandur (Critical 🔴), Agara Lake (Watch 🟡), Varthur (Watch 🟡). Avoid underpasses on ORR. Waterlogging near Silk Board.';
      else if (q.includes('route') || q.includes('Airport')) r = 'For Airport: Avoid ORR currently. Recommend: Hebbal Flyover → Tumkur Road. Estimated 35min delay on normal route.';
      else if (q.includes('Electronic City')) r = 'Electronic City social analysis: 3 road incident reports, 1 waterlogging alert near Hebbagodi. Overall safety score: 72/100 (Moderate).';
      else r = `Detected ${EVENTS.length} active city events. ${EVENTS.filter(e => e.sev === 'critical').length} critical situations need attention. Flash Flood at Bellandur is most urgent. How can I assist further?`;
      setMsgs(m => [...m, { role: 'ai', text: r }]);
    }, 900);
  };
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs]);

  return (
    <div style={{ padding: '24px 40px', height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>🤖</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 10 }}>CityPulse AI <span style={{ fontSize: '.7rem', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '4px 10px', borderRadius: 999, border: '1px solid rgba(34, 197, 94, 0.3)' }}>● Online</span></h2>
            <div style={{ fontSize: '.8rem', color: '#94a3b8', marginTop: 2 }}>Bangalore Safety & Navigation Intelligence</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: '.75rem', border: '1px solid rgba(255,255,255,.1)', padding: '8px 16px', borderRadius: 8, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>🛡️ Safety AI</span>
          <span style={{ fontSize: '.75rem', border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', padding: '8px 16px', borderRadius: 8, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>🧭 Navigation</span>
          <button style={{ border: '1px solid rgba(255,255,255,.1)', background: 'transparent', padding: '8px 12px', borderRadius: 8, color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>🗑️</button>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 20 }} ref={ref}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            {m.role === 'ai' && <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🤖</div>}
            {m.role === 'user' && <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, color: '#fff', fontWeight: 'bold' }}>U</div>}

            <div style={{ maxWidth: '65%', padding: '16px 20px', borderRadius: 16, background: m.role === 'ai' ? 'var(--surface)' : '#3b82f6', color: '#f8fafc', fontSize: '.95rem', lineHeight: 1.6, border: m.role === 'ai' ? '1px solid var(--border)' : 'none', whiteSpace: 'pre-wrap', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div>
        <div style={{ fontSize: '.75rem', color: '#94a3b8', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>✨ Suggested questions:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {SUGS.map((s, i) => <button key={i} onClick={() => send(s)} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: '#cbd5e1', padding: '10px 16px', borderRadius: 8, fontSize: '.8rem', cursor: 'pointer', transition: 'background .2s' }}>{s}</button>)}
        </div>
        <div style={{ display: 'flex', gap: 12, background: 'var(--surface)', padding: '6px 6px 6px 16px', borderRadius: 12, border: '1px solid var(--border)' }}>
          <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about safety, routes, incidents in Bangalore..." style={{ border: 'none', background: 'transparent', flex: 1, outline: 'none', color: '#f8fafc', fontSize: '.95rem' }} />
          <button style={{ width: 44, height: 44, borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', transition: 'background .2s' }} onClick={() => send()}>🚀</button>
        </div>
      </div>
    </div>
  );
}

function CityOverview({ events }) {
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

function MyReports({ myReports }) {
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

function SafetyAlerts({ alerts }) {
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

function Analytics({ events }) {
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

function ApiDocs() {
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

function Profile() {
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

/* ═══════════════════════ ROOT ═══════════════════════ */
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');

  const [tab, setTab] = useState('dashboard');
  const [events] = useState(EVENTS);
  const [range, setRange] = useState('10km');
  const [zone, setZone] = useState('All Zones');
  const [evType, setEvType] = useState('All');
  const [myReports, setMyReports] = useState([]);
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((title, body) => { const id = Date.now(); setToasts(t => [...t, { id, title, body }]); setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000); }, []);
  const stats = { total: events.length, critical: events.filter(e => e.sev === 'critical').length, high: events.filter(e => e.sev === 'high').length };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (authMode === 'register') {
      if (authName && authEmail && authPassword && authPhone) {
        try {
          const res = await fetch('http://localhost:8000/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: authName, email: authEmail, password: authPassword, phone: authPhone })
          });
          const data = await res.json();
          if (res.ok) {
            setAuthMode('login');
            addToast('✅ Account Created', `Welcome to CityPulse, ${authName}! Please log in.`);
            setAuthPassword('');
          } else {
            addToast('⚠️ Registration Error', data.detail || 'Failed');
          }
        } catch { addToast('⚠️ Error', 'Server unreachable'); }
      } else {
        addToast('⚠️ Error', 'Please fill all registration fields including phone.');
      }
    } else {
      if (authEmail && authPassword) {
        try {
          const res = await fetch('http://localhost:8000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: authEmail, password: authPassword })
          });
          const data = await res.json();
          if (res.ok) {
            setIsLoggedIn(true);
            setAuthName(data.user.name || '');
            setAuthPhone(data.user.phone || '');
            addToast('✅ Logged In', `Session active for ${authEmail}`);
          } else {
            addToast('⚠️ Login Error', data.detail || 'Failed');
          }
        } catch { addToast('⚠️ Error', 'Server unreachable'); }
      }
    }
  };

  const AiAgent = () => {
    const [msgs, setMsgs] = useState([{ sender: 'ai', text: 'Hello! I am CityPulse AI. How can I assist your navigation or safety reporting today?' }]);
    const [inp, setInp] = useState('');
    const [typing, setTyping] = useState(false);
    const endRef = useRef(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);
    const send = async (txt = inp) => {
      if (!txt) return;
      setMsgs(m => [...m, { sender: 'user', text: txt }]);
      setInp(''); setTyping(true);
      setTimeout(() => {
        let reply = 'I am currently analyzing live city data for ' + txt + '... Please check the Navigation map for routing options.';
        if (txt.toLowerCase().includes('safest route')) reply = 'Calculating the safest route. I have marked active incidents on the Navigation Map, avoiding congested and hazard zones.';
        else if (txt.toLowerCase().includes('report')) reply = 'If you see an incident, you can report it via the Report tab to instantly warn nearby citizens.';
        setMsgs(m => [...m, { sender: 'ai', text: reply }]);
        setTyping(false);
      }, 1500);
    };
    return (
      <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <h2 className="pg-title">🤖 CityPulse AI</h2>
        <div className="cp-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.1, borderRadius: '50%' }} />
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 8 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%', background: m.sender === 'user' ? 'linear-gradient(135deg, var(--primary), var(--primaryh))' : 'rgba(255,255,255,0.05)', border: m.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', fontSize: '.9rem', lineHeight: 1.4, color: '#fff', boxShadow: m.sender === 'user' ? '0 4px 14px rgba(99,102,241,0.3)' : 'none' }}>
                {m.text}
              </div>
            ))}
            {typing && <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '18px 18px 18px 4px', fontSize: '.8rem', color: 'var(--muted)', display: 'flex', gap: 6 }}><span>●</span><span>●</span><span>●</span> Analyzing...</div>}
            <div ref={endRef} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, overflowX: 'auto', paddingBottom: 4 }}>
            {['Safest route to Whitefield?', 'What are the current high alerts?', 'Report a road issue'].map(q => <button key={q} onClick={() => send(q)} style={{ whiteSpace: 'nowrap', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: 'var(--text)', padding: '6px 14px', borderRadius: 999, fontSize: '.75rem', cursor: 'pointer', transition: 'all .25s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.25)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}>{q}</button>)}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <input className="cp-inp" value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask CityPulse AI..." style={{ background: 'rgba(0,0,0,0.2)' }} />
            <button className="cp-btn" onClick={() => send()} style={{ width: 'auto', padding: '0 20px', borderRadius: 12 }}>🚀</button>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 800, height: 800, background: 'var(--primary)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15, top: '-200px', left: '-200px' }} />
        <div style={{ position: 'absolute', width: 600, height: 600, background: 'var(--accent)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.1, bottom: '-200px', right: '-100px' }} />

        <form onSubmit={handleAuth} style={{ zIndex: 1, background: 'rgba(22, 27, 39, 0.8)', backdropFilter: 'blur(12px)', padding: '40px 32px', borderRadius: '16px', border: '1px solid rgba(99,102,241,.2)', width: '380px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: '3rem', marginBottom: 10 }}>🛡️</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4, background: 'linear-gradient(135deg, #e2e8f0, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CityPulse</h1>
            <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Centralized Safety Intelligence</p>
          </div>

          <div style={{ display: 'flex', gap: 10, background: 'rgba(0,0,0,.3)', padding: 4, borderRadius: 10, marginBottom: 24 }}>
            <button type="button" onClick={() => setAuthMode('login')} style={{ flex: 1, padding: '8px 0', border: 'none', background: authMode === 'login' ? 'var(--primary)' : 'transparent', color: '#fff', borderRadius: 8, fontSize: '.88rem', fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}>Sign In</button>
            <button type="button" onClick={() => setAuthMode('register')} style={{ flex: 1, padding: '8px 0', border: 'none', background: authMode === 'register' ? 'var(--primary)' : 'transparent', color: '#fff', borderRadius: 8, fontSize: '.88rem', fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}>Sign Up</button>
          </div>

          {authMode === 'register' && (
            <>
              <div className="inp-grp" style={{ marginBottom: 16 }}>
                <label>Full Name</label>
                <input className="cp-inp" value={authName} onChange={e => setAuthName(e.target.value)} placeholder="John Doe" type="text" required />
              </div>
              <div className="inp-grp" style={{ marginBottom: 16 }}>
                <label>Phone Number</label>
                <input className="cp-inp" value={authPhone} onChange={e => setAuthPhone(e.target.value)} placeholder="+91 9876543210" type="tel" required />
              </div>
            </>
          )}

          <div className="inp-grp" style={{ marginBottom: 16 }}>
            <label>Email Address</label>
            <input className="cp-inp" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="admin@citypulse.gov" type="email" required />
          </div>
          <div className="inp-grp" style={{ marginBottom: 28 }}>
            <label>Password</label>
            <input className="cp-inp" type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          <button type="submit" className="cp-btn" style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
            {authMode === 'login' ? 'Secure Login →' : 'Create Account ➕'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 16px', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.1)' }} />
            <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Or continue with</div>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.1)' }} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" onClick={() => { setIsLoggedIn(true); setAuthEmail('google@citypulse.gov'); setAuthName('Google User'); addToast('✅ Logged In', 'Authenticated via Google'); }} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#fff', fontSize: '.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, transition: 'all .2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,.05)'}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Google
            </button>
            <button type="button" onClick={() => { setIsLoggedIn(true); setAuthEmail('microsoft@citypulse.gov'); setAuthName('Microsoft User'); addToast('✅ Logged In', 'Authenticated via Microsoft'); }} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#fff', fontSize: '.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, transition: 'all .2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,.05)'}>
              <svg className="w-4 h-4" viewBox="0 0 21 21" style={{ width: 16, height: 16 }}><path d="M0 0h10v10H0V0zm11 0h10v10H11V0zM0 11h10v10H0V11zm11 0h10v10H11V11z" fill="#00a4ef" /></svg>
              Microsoft
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: '.75rem', color: 'rgba(255,255,255,.3)' }}>
            Authorized personnel only. All access is logged.
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="cp-app">
      <aside className="cp-sidebar">
        <div className="cp-brand">
          <span className="cp-brand-icon">🛡️</span>
          <div>
            <div className="cp-brand-name">CityPulse</div>
            <div className="cp-brand-sub">Bangalore Safety Platform</div>
          </div>
        </div>
        <div className="cp-nav-label">Navigation</div>
        <ul className="cp-nav-list">
          {[
            { id: 'dashboard', icon: '📍', label: 'Safety Dashboard' },
            { id: 'navigation', icon: '🧭', label: 'Smart Navigation' },
            { id: 'nearby', icon: '📍', label: 'Nearby Events' },
            { id: 'social', icon: '💬', label: 'Social Media Monitor' },
            { id: 'reports', icon: '📝', label: 'Report Center' },
            { id: 'ai', icon: '🤖', label: 'AI Agent' }
          ].map(n => (
            <li key={n.id} className={tab === n.id ? 'cp-nav-active' : ''} onClick={() => setTab(n.id)}>
              <span className="cp-nav-icon">{n.icon}</span> {n.label}
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--sidebar-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{authName ? authName[0] : 'U'}</div>
          <div>
            <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--sidebar-text)' }}>{authName || 'User'}</div>
            <div style={{ fontSize: '.7rem', color: 'var(--sidebar-muted)' }}>Real-time insights</div>
          </div>
        </div>
      </aside>
      <div className="cp-main">
        <div className="cp-hero">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div><div style={{ fontSize: '1.25rem', fontWeight: 800 }}>🛡️ CityPulse</div><div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.65)' }}>Bengaluru Full City Safety Intelligence</div></div>
            <span style={{ background: 'rgba(99,102,241,.3)', border: '1px solid rgba(99,102,241,.5)', padding: '4px 12px', borderRadius: 999, fontSize: '.78rem', color: '#c7d2fe' }}>● {stats.total} city events</span>
          </div>
          <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
            {[['Total Events', stats.total, '#fff'], ['Critical', stats.critical, '#f87171'], ['High Alerts', stats.high, '#fb923c'], ['Social', SOCIAL_POSTS.length, '#a78bfa']].map(([l, v, c]) => <div key={l} style={{ textAlign: 'center' }}><div style={{ fontSize: '1.6rem', fontWeight: 800, color: c, lineHeight: 1 }}>{v}</div><div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.6)', marginTop: 3 }}>{l}</div></div>)}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['➕', 'Report', 'reports'], ['🛣️', 'Road Issue', 'reports'], ['🧭', 'Navigate', 'navigation'], ['💬', 'Social', 'social'], ['🤖', 'AI Agent', 'ai']].map(([ic, l, to]) => <button key={l} className="cp-hero-btn" onClick={() => setTab(to)}>{ic} {l}</button>)}
          </div>
        </div>
        <div className="cp-body">
          {tab === 'dashboard' && <Dashboard events={events} alerts={ALERTS} social={SOCIAL_POSTS} range={range} setRange={setRange} zone={zone} setZone={setZone} evType={evType} setEvType={setEvType} onRefresh={() => addToast('🔄', 'Data refreshed')} loading={false} />}
          {tab === 'navigation' && <Navigation />}
          {tab === 'nearby' && <NearbyEvents events={events} />}
          {tab === 'social' && <SocialMonitor social={SOCIAL_POSTS} />}
          {tab === 'reports' && <ReportCenter myReports={myReports} setMyReports={setMyReports} addToast={addToast} />}
          {tab === 'ai' && <AiAgent />}
          {tab === 'overview' && <CityOverview events={events} />}
          {tab === 'myreports' && <MyReports myReports={myReports} />}
          {tab === 'alerts' && <SafetyAlerts alerts={ALERTS} />}
          {tab === 'analytics' && <Analytics events={events} />}
          {tab === 'apidocs' && <ApiDocs />}
          {tab === 'profile' && <Profile />}
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999 }}>
        {toasts.map(t => <div key={t.id} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--primary)', borderRadius: 10, padding: '10px 16px', minWidth: 220, boxShadow: '0 8px 24px rgba(0,0,0,.5)', animation: 'toastIn .25s ease' }}><div style={{ fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>{t.title}</div><div style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: 2 }}>{t.body}</div></div>)}
      </div>
    </div>
  );
}
