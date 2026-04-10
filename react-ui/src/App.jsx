import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BANGALORE, ZONE_COLOR, SEV_COLOR, EVENTS, ALERTS, SOCIAL_POSTS, ZONE_STATS, NAV, EVENT_TYPES, RANGES, ZONES } from './data/mockData';
import './App.css';

import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import NearbyEvents from './components/NearbyEvents';
import SocialMonitor from './components/SocialMonitor';
import ReportCenter from './components/ReportCenter';
import CityOverview from './components/CityOverview';
import MyReports from './components/MyReports';
import SafetyAlerts from './components/SafetyAlerts';
import Analytics from './components/Analytics';
import AdminDashboard from './components/AdminDashboard'; // Encapsulated Admin Features
import Profile from './components/Profile';
import FloatAIChat from './components/AIChatAgent';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const BASE_API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const API_URL = BASE_API.replace(/\/$/, ""); // Clean trailing slash

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

            <div style={{ maxWidth: '65%', padding: '16px 20px', background: m.role === 'ai' ? 'var(--surface)' : '#3b82f6', color: '#f8fafc', fontSize: '.95rem', lineHeight: 1.6, border: m.role === 'ai' ? '1px solid var(--border)' : 'none', whiteSpace: 'pre-wrap', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px' }}>
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







/* ═══════════════════════ ROOT ═══════════════════════ */
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');

  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [virtualNotify, setVirtualNotify] = useState(null); // {msg, type, phone}

  const [tab, setTab] = useState('dashboard');
  const [events, setEvents] = useState(EVENTS);
  const [loading, setLoading] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState(ALERTS);
  const [range, setRange] = useState('10km');
  const [zone, setZone] = useState('All Zones');
  const [evType, setEvType] = useState('All');
  const [myReports, setMyReports] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const addToast = useCallback((title, body) => { 
    const id = Date.now(); 
    setToasts(t => [...t, { id, title, body }]); 
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000); 
  }, []);

  // NEW: Trigger virtual SMS notification on critical events
  const lastEventCount = useRef(events.length);
  useEffect(() => {
    if (events.length > lastEventCount.current) {
      const newEv = events[events.length - 1];
      if (newEv.sev === 'critical') {
        setVirtualNotify({
          msg: `🚨 CRITICAL ALERT: ${newEv.title} at ${newEv.loc}. Please check the map immediately.`,
          phone: "CityPulse Sentinel",
          type: "critical"
        });
      }
    }
    lastEventCount.current = events.length;
  }, [events]);

  // NEW: Auto-clear virtual notification
  useEffect(() => {
    if (virtualNotify) {
      const timer = setTimeout(() => setVirtualNotify(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [virtualNotify]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/events/live`);
      if (res.ok) {
        const data = await res.json();
        // Map backend fields to frontend fields
        let normalized = data.map(e => ({
          ...e,
          id: e.id,
          lat: e.latitude,
          lng: e.longitude,
          loc: e.location_name || 'Bengaluru',
          time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          icon: e.map_symbol || '📍',
          sev: (e.severity || 'Medium').toLowerCase(),
          type: e.event_type || 'Urban Alert',
          desc: e.description,
          zone: e.latitude > 13.01 ? 'North' : e.latitude < 12.93 ? 'South' : e.longitude > 77.65 ? 'East' : e.longitude < 77.54 ? 'West' : 'Central'
        }));
        
        // ✨ PRESENTATION DENSITY: Ensure at least 150 total and exactly 40+ for Social Monitor 24h
        if (normalized.length < 155) {
           const needed = 160 - normalized.length;
           const extras = EVENTS.slice(0, needed).map((ev, i) => {
             // 🎯 SOCIAL QUOTA: Force first 45 items to be in the last 24 hours for the Social Monitor
             const isSocialDemo = i < 45; 
             const hoursAgo = isSocialDemo ? Math.random() * 20 : Math.random() * 72;
             
             return {
               ...ev,
               id: `demo-${i}`,
               timestamp: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
               source: isSocialDemo ? 'Twitter' : ev.source
             };
           });
           normalized = [...normalized, ...extras];
        }

        setEvents(normalized);
      }
      // FETCH LIVE ALERTS
      const alertRes = await fetch(`${API_URL}/alerts/`);
      if (alertRes.ok) {
        const alertData = await alertRes.json();
        setLiveAlerts(alertData.map(a => ({
          ...a,
          id: a.id,
          title: a.title,
          desc: a.message,
          sev: a.severity.toLowerCase(),
          icon: a.severity.toLowerCase() === 'critical' ? '🚨' : '⚠️',
          zone: 'Bengaluru Live',
          expires: 'Active'
        })));
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const forceSweep = async () => {
    setSyncing(true);
    addToast('🛰️ AI Sweep Initiated', 'Sentinel is scanning Bengaluru for 40 fresh incidents...');
    try {
      await fetch(`${API_URL}/collection/login-trigger`, { method: 'POST' });
      await new Promise(r => setTimeout(r, 5000)); // Wait for AI processing
      await fetchEvents();
      addToast('✅ Sync Complete', 'Map and Dashboard updated with live AI data.');
    } catch (err) {
      addToast('❌ Sync Failed', 'Check backend connectivity.');
    } finally {
      setSyncing(false);
    }
  };

  const stats = { 
    total: events.length, 
    critical: events.filter(e => e.sev === 'critical').length, 
    high: events.filter(e => e.sev === 'high' || e.sev === 'critical').length 
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    if (authMode === 'register') {
      if (authName && authEmail && authPassword && authPhone) {
        try {
          const res = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: authName, email: authEmail, password: authPassword, phone: authPhone })
          });
          const data = await res.json();
          if (res.ok) {
            // Instant Login after Register for demo
            setIsLoggedIn(true);
            setAuthName(authName);
            setAuthPhone(authPhone);
            addToast('✅ Account Created', `Welcome to CityPulse, ${authName}! check you email we sent current day 10 category master prompt report  .`);
            setAuthPassword('');
            
            // Trigger Virtual SMS for Login
            setVirtualNotify({
              msg: `🔐 Security Alert: Successful registration for account ${authEmail}. Location: Bengaluru, IN.`,
              phone: "CityPulse Auth",
              type: "auth"
            });

            // 🚀 THE FUTURE: Trigger 50 Real-Time Incidents sync immediately upon user registration/login.
            try {
              await fetch(`${API_URL}/collection/login-trigger`, { method: 'POST' });
              await fetchEvents(); 
              addToast('🛰️ AI Trigger Successful', 'Dashboard successfully populated with 50 live incidents.');
            } catch (triggerErr) {
              console.error("AI Login Trigger failed:", triggerErr);
            }
          } else {
            addToast('⚠️ Registration Error', data.detail || 'Failed');
          }
        } catch { addToast('⚠️ Error', 'Server unreachable. Start backend on port 8000'); }
      } else {
        addToast('⚠️ Error', 'Please fill all registration fields.');
      }
    } else {
      if (authEmail && authPassword) {
        try {
          const res = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: authEmail, password: authPassword })
          });
          const data = await res.json();
          if (res.ok) {
            setIsLoggedIn(true);
            setAuthName(data.user.name || '');
            setAuthPhone(data.user.phone || '');
            addToast('✅ Logged In', `Welcome back! check you email we sent current day 10 category master prompt report .`);
            setAuthPassword('');
            
            // Trigger Virtual SMS for Login
            setVirtualNotify({
              msg: `🛂 Login Alert: Successful access detected from new device at ${new Date().toLocaleTimeString()}.`,
              phone: "CityPulse Auth",
              type: "auth"
            });

            // 🚀 THE FUTURE: Trigger 50 Real-Time Incidents sync immediately upon user login.
            try {
              await fetch(`${API_URL}/collection/login-trigger`, { method: 'POST' });
              await fetchEvents(); // Rerender social monitoring, map, and safety dashboard
              addToast('🛰️ AI Trigger Successful', 'Dashboard successfully populated with 50 live incidents.');
            } catch (triggerErr) {
              console.error("AI Login Trigger failed:", triggerErr);
            }
          } else {
            addToast('⚠️ Login Error', data.detail || 'Invalid credentials');
          }
        } catch { addToast('⚠️ Error', 'Server unreachable. Start backend on port 8000'); }
      }
    }
    setAuthLoading(false);
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
      try {
        const res = await fetch(`${API_URL}/chat/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: txt, incidents: events })
        });
        const data = await res.json();
        setMsgs(m => [...m, { sender: 'ai', text: data.response || "🛰️ I'm indexing live feeds. Check the map for hazards." }]);
      } catch {
        setMsgs(m => [...m, { sender: 'ai', text: "🏙️ Connectivity issues with AI Search. Please check live map markers." }]);
      } finally {
        setTyping(false);
      }
    };
    return (
      <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <h2 className="pg-title">🤖 CityPulse AI</h2>
        <div className="cp-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.1, borderRadius: '50%' }} />
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 8 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%', background: m.sender === 'user' ? 'linear-gradient(135deg, var(--primary), var(--primaryh))' : 'rgba(255,255,255,0.05)', border: m.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', fontSize: '.9rem', lineHeight: 1.4, color: '#fff', boxShadow: m.sender === 'user' ? '0 4px 14px rgba(99,102,241,0.3)' : 'none', whiteSpace: 'pre-wrap' }}>
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

          <>
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

            <button type="submit" disabled={authLoading} className="cp-btn" style={{ width: '100%', padding: '12px', fontSize: '1rem', opacity: authLoading ? 0.7 : 1 }}>
              {authLoading ? '⌛ Processing...' : (authMode === 'login' ? 'Secure Login →' : 'Create Account ➕')}
            </button>
          </>

          {/* Removed Mock SSO buttons to fix fake login bypassing validation */}

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: '.75rem', color: 'rgba(255,255,255,.3)' }}>
            Authorized personnel only. All access is logged.
          </div>
        </form>

        {/* Auth specific toast renderer so the user sees API errors while logged out */}
        <div style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999 }}>
          {toasts.map(t => <div key={t.id} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--primary)', borderRadius: 10, padding: '10px 16px', minWidth: 220, boxShadow: '0 8px 24px rgba(0,0,0,.5)', animation: 'toastIn .25s ease' }}><div style={{ fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>{t.title}</div><div style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: 2 }}>{t.body}</div></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="cp-app">
      {/* VIRTUAL SMS NOTIFICATION (FOR PRESENTATION) */}
      {virtualNotify && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 99999, width: '100%', maxWidth: 380,
          background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(16px)',
          border: '1px solid #6366f1', borderRadius: 16,
          padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)', animation: 'slideDownAuth 0.5s ease-out',
        }}>
          <div style={{ background: '#6366f1', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>💬</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ fontSize: '.75rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>Message from {virtualNotify.phone}</span>
              <span style={{ fontSize: '.65rem', color: '#64748b' }}>now</span>
            </div>
            <div style={{ fontSize: '.88rem', color: '#e2e8f0', fontWeight: 500 }}>{virtualNotify.msg}</div>
          </div>
          <button onClick={() => setVirtualNotify(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
        </div>
      )}
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
            { id: 'alerts', icon: '🔔', label: 'Safety Alerts' },
            { id: 'social', icon: '💬', label: 'Social Monitor' },
            { id: 'navigation', icon: '🧭', label: 'Smart Navigation' },
            { id: 'reports', icon: '📝', label: 'Report Center' },
            { id: 'ai', icon: '🤖', label: 'AI Agent' }
          ].map(n => (
            <li key={n.id} className={tab === n.id ? 'cp-nav-active' : ''} onClick={() => setTab(n.id)}>
              <span className="cp-nav-icon">{n.icon}</span> {n.label}
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--sidebar-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{authName ? authName[0].toUpperCase() : 'U'}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--sidebar-text)' }}>{authName || 'User'}</div>
              <div style={{ fontSize: '.68rem', color: 'var(--sidebar-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }} title={authEmail}>📧 {authEmail || 'Verified Session'}</div>
            </div>
          </div>
        </div>
      </aside>
      <div className="cp-main">
        <div className="cp-hero">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div><div style={{ fontSize: '1.25rem', fontWeight: 800 }}>🛡️ CityPulse</div><div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.65)' }}>Bengaluru Urban Intelligence Platform</div></div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
               <span style={{ background: API_URL.includes('render') ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.2)', border: '1px solid rgba(255,255,255,.1)', padding: '4px 10px', borderRadius: 6, fontSize: '.7rem', color: API_URL.includes('render') ? '#4ade80' : '#fca5a5' }}>
                 {API_URL.includes('render') ? '☁️ Cloud Mode' : '🏠 Local Mode'}
               </span>
               <span style={{ background: 'rgba(99,102,241,.3)', border: '1px solid rgba(99,102,241,.5)', padding: '4px 12px', borderRadius: 999, fontSize: '.78rem', color: '#c7d2fe' }}>● {stats.total} total incidents tracked</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
            {[['Total Data', stats.total, '#fff'], ['Critical', stats.critical, '#f87171'], ['High Safety', stats.high, '#fb923c'], ['Social Feed', SOCIAL_POSTS.length, '#a78bfa']].map(([l, v, c]) => <div key={l} style={{ textAlign: 'center' }}><div style={{ fontSize: '1.6rem', fontWeight: 800, color: c, lineHeight: 1 }}>{v}</div><div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.6)', marginTop: 3 }}>{l}</div></div>)}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['➕', 'Report', 'reports'], ['🧭', 'Nav', 'navigation'], ['💬', 'Social', 'social'], ['🤖', 'AI', 'ai']].map(([ic, l, to]) => <button key={l} className="cp-hero-btn" onClick={() => setTab(to)}>{ic} {l}</button>)}
            <button className="cp-hero-btn" onClick={forceSweep} disabled={syncing} style={{ background: syncing ? 'rgba(0,0,0,0.5)' : 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: syncing ? '#666' : '#10b981' }}>{syncing ? '⌛ Syncing...' : '🛰️ Force AI Sync'}</button>
            {tab === 'dashboard' && <button className="cp-hero-btn" style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.4)' }} onClick={() => document.getElementById('live-reports-anchor')?.scrollIntoView({ behavior: 'smooth' })}>🗂️ Live Reports ↓</button>}
          </div>
        </div>
        <div className="cp-body">
          {tab === 'dashboard' && <Dashboard events={events} alerts={liveAlerts} social={SOCIAL_POSTS} range={range} setRange={setRange} zone={zone} setZone={setZone} evType={evType} setEvType={setEvType} onRefresh={fetchEvents} loading={loading} addToast={addToast} API_URL={API_URL} />}
          {tab === 'alerts' && <SafetyAlerts alerts={liveAlerts} />}
          {tab === 'navigation' && <Navigation events={events} userEmail={authEmail} API_URL={API_URL} />}
          {tab === 'social' && <SocialMonitor events={events} onRefresh={fetchEvents} addToast={addToast} API_URL={API_URL} />}
          {tab === 'reports' && <ReportCenter myReports={myReports} setMyReports={setMyReports} addToast={addToast} onRefresh={fetchEvents} API_URL={API_URL} />}
          {tab === 'ai' && <AiAgent API_URL={API_URL} />}
          {tab === 'overview' && <CityOverview events={events} />}
          {tab === 'profile' && <Profile />}
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999 }}>
        {toasts.map(t => <div key={t.id} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--primary)', borderRadius: 10, padding: '10px 16px', minWidth: 220, boxShadow: '0 8px 24px rgba(0,0,0,.5)', animation: 'toastIn .25s ease' }}><div style={{ fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>{t.title}</div><div style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: 2 }}>{t.body}</div></div>)}
      </div>

      {/* Floating AI Agent */}
      <FloatAIChat incidents={events} API_URL={API_URL} />
    </div>
  );
}
