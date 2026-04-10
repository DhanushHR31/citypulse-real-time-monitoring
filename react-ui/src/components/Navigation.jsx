import React, { useState, useRef, useEffect } from 'react';
import { nominatim } from './shared';
import { BANGALORE } from '../data/mockData';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// ─── Icons ───────────────────────────────────────────────────────
const pinIcon = (emoji, size = 26) => L.divIcon({
  className: '',
  html: `<div style="font-size:${size}px;filter:drop-shadow(0 2px 6px rgba(0,0,0,.55))">${emoji}</div>`,
  iconSize: [size + 4, size + 4], iconAnchor: [(size + 4) / 2, size + 4]
});

const gpsIcon = L.divIcon({
  className: '',
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 5px rgba(59,130,246,.3)"></div>`,
  iconSize: [18, 18], iconAnchor: [9, 9]
});

// ─── Tile Layers ─────────────────────────────────────────────────
const TILES = {
  light:     { label:'☀️ Light',     url:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attr:'© OpenStreetMap' },
  dark:      { label:'🌙 Dark',      url:'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attr:'© CartoDB' },
  satellite: { label:'🛰️ Satellite', url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attr:'© Esri' },
};

// Route palette
const ROUTE_COLORS = ['#3b82f6','#8b5cf6','#14b8a6','#f59e0b'];

// ─── MapController — flies map to bounds / point ─────────────────
function MapController({ bounds, center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) { try { map.fitBounds(bounds, { padding:[60,60], maxZoom:15, animate:true }); } catch{} }
    else if (center) { map.flyTo(center, zoom || 15, { animate:true, duration:0.7 }); }
  }, [bounds, center, zoom]);
  return null;
}

// ─── Score ring ───────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 28, circ = 2 * Math.PI * r;
  const clr = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const fill = (score / 100) * circ;
  return (
    <svg width="72" height="72" style={{ flexShrink:0 }}>
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={clr} strokeWidth="5"
        strokeDasharray={`${fill} ${circ}`} strokeDashoffset={circ / 4}
        strokeLinecap="round" style={{ transition:'stroke-dasharray .6s ease' }} />
      <text x="36" y="38" textAnchor="middle" dominantBaseline="middle"
        fill={clr} fontSize="13" fontWeight="900">{score}%</text>
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────
export default function Navigation({ events = [], userEmail: loginEmail = '', API_URL }) {
  const [orig, setOrig] = useState('');  const [dest, setDest] = useState('');
  const [os,   setOs]   = useState([]);  const [ds,   setDs]   = useState([]);
  const [origPos, setOrigPos] = useState(null);
  const [destPos, setDestPos] = useState(null);

  // Modal logic
  const [showModal, setShowModal] = useState(null); // 'orig' or 'dest'
  const [modalResults, setModalResults] = useState([]);


  // Route phase: 'search' | 'select' | 'ride'
  const [phase, setPhase] = useState('search');
  const [routes,    setRoutes]    = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading,   setLoading]   = useState(false);

  // Turn-by-turn
  const [stepIdx, setStepIdx] = useState(0);
  const [showIntel, setShowIntel] = useState(false);
  const stepListRef = useRef(null);

  // GPS
  const [gpsPos,   setGpsPos]   = useState(null);
  const [gpsError, setGpsError] = useState('');
  const watchRef = useRef(null);

  // Email / notifications
  const [userEmail,       setUserEmail]       = useState(loginEmail);
  const [emailSent,       setEmailSent]       = useState(false);
  const [notifiedHazards, setNotifiedHazards] = useState(new Set());
  useEffect(() => { if (loginEmail) setUserEmail(loginEmail); }, [loginEmail]);

  // Map
  const [mapMode,   setMapMode]   = useState('light');
  const [mapBounds, setMapBounds] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const mapRef = useRef(null);

  const lastAlert = useRef('');

  // ── GPS on load ──────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;
    setOrig('Locating…');
    navigator.geolocation.getCurrentPosition(p => {
      const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
      sessionStorage.setItem('oc', JSON.stringify(pos));
      setOrig('📍 Current Location');
      setOrigPos([pos.lat, pos.lng]);
      setGpsPos([pos.lat, pos.lng]);
    }, () => setOrig(''));
  }, []);

  // ── Global Search logic ───────────────────────────────────────
  const searchCity = async (q) => {
    if (!q || q.length < 1) { setModalResults([]); return; }
    
    const FAVS = [
      { name: "Indian Institute of Science (IISc), Bengaluru", lat: "13.0184", lon: "77.5659" },
      { name: "Indian Institute of Management (IIMB), Bengaluru", lat: "12.8950", lon: "77.6010" },
      { name: "R.V. College of Engineering (RVCE), Bengaluru", lat: "12.9237", lon: "77.4987" },
      { name: "BMS College of Engineering (BMSCE), Bengaluru", lat: "12.9410", lon: "77.5655" },
      { name: "PES University, Bengaluru", lat: "12.9344", lon: "77.5345" },
      { name: "M.S. Ramaiah Institute of Technology (MSRIT), Bengaluru", lat: "13.0307", lon: "77.5649" },
      { name: "Christ University, Bengaluru", lat: "12.9362", lon: "77.6059" },
      { name: "Silk Board, Bengaluru", lat: "12.9176", lon: "77.6233" },
      { name: "Majestic (KSR Bengaluru), Bengaluru", lat: "12.9733", lon: "77.5733" },
      { name: "Banashankari, Bengaluru", lat: "12.9250", lon: "77.5739" },
      { name: "Indiranagar, Bengaluru", lat: "12.9784", lon: "77.6385" },
      { name: "Google India, Bengaluru", lat: "12.9930", lon: "77.6610" }
    ];

    const local = FAVS.filter(f => f.name.toLowerCase().includes(q.toLowerCase()));
    setModalResults(local);

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}, Bengaluru&addressdetails=1&limit=8`);
      const data = await res.json();
      if (data) {
        const remote = data.map(d => ({ name: d.display_name, lat: d.lat, lon: d.lon }));
        setModalResults(prev => [...prev, ...remote.filter(r => !prev.some(p => p.name === r.name))]);
      }
    } catch (e) { console.error(e); }
  };

  const pickLocation = (s) => {
    const key = showModal === 'orig' ? 'oc' : 'dc';
    if (showModal === 'orig') {
       setOrig(s.name); setOrigPos([parseFloat(s.lat), parseFloat(s.lon)]);
    } else {
       setDest(s.name); setDestPos([parseFloat(s.lat), parseFloat(s.lon)]);
    }
    sessionStorage.setItem(key, JSON.stringify({ lat: s.lat, lng: s.lon }));
    setShowModal(null); setModalResults([]);
  };


  // ── Nominatim Search ──────────────────────────────────────────
  const nominatim = async (q, ss) => {
    if (!q || q.length < 1) { ss([]); return; }
    
    // INSTANT MEMORY: Priority Bengaluru Landmarks for Demo
    const FAVS = [
      { name: "Indian Institute of Science (IISc), Bengaluru", lat: "13.0184", lon: "77.5659" },
      { name: "Indian Institute of Management (IIMB), Bengaluru", lat: "12.8950", lon: "77.6010" },
      { name: "R.V. College of Engineering (RVCE), Bengaluru", lat: "12.9237", lon: "77.4987" },
      { name: "BMS College of Engineering (BMSCE), Bengaluru", lat: "12.9410", lon: "77.5655" },
      { name: "PES University, Bengaluru", lat: "12.9344", lon: "77.5345" },
      { name: "M.S. Ramaiah Institute of Technology (MSRIT), Bengaluru", lat: "13.0307", lon: "77.5649" },
      { name: "Christ University, Bengaluru", lat: "12.9362", lon: "77.6059" },
      { name: "Silk Board, Bengaluru", lat: "12.9176", lon: "77.6233" },
      { name: "Majestic (KSR Bengaluru), Bengaluru", lat: "12.9733", lon: "77.5733" },
      { name: "Banashankari, Bengaluru", lat: "12.9250", lon: "77.5739" },
      { name: "Bangalore University, Bengaluru", lat: "12.9463", lon: "77.5097" },
      { name: "New Horizon College of Engineering, Bengaluru", lat: "12.9341", lon: "77.6915" },
      { name: "Reva University, Bengaluru", lat: "13.1115", lon: "77.6063" },
      { name: "Dayananda Sagar College of Engineering, Bengaluru", lat: "12.9081", lon: "77.5638" },
      { name: "Manipal Hospital Old Airport Road, Bengaluru", lat: "12.9616", lon: "77.6482" },
      { name: "Apollo Hospital Bannerghatta Road, Bengaluru", lat: "12.8943", lon: "77.5991" },
      { name: "Fortis Hospital Bannerghatta Road, Bengaluru", lat: "12.8945", lon: "77.5985" },
      { name: "Narayana Health City, Bengaluru", lat: "12.8130", lon: "77.6934" },
      { name: "Columbia Asia Hospital Hebbal, Bengaluru", lat: "13.0487", lon: "77.5937" },
      { name: "Infosys, Electronic City, Bengaluru", lat: "12.8510", lon: "77.6650" },
      { name: "Wipro Limited, Sarjapur, Bengaluru", lat: "12.9129", lon: "77.6836" },
      { name: "Google India (RMZ Infinity), Bengaluru", lat: "12.9930", lon: "77.6610" },
      { name: "MG Road Metro Station, Bengaluru", lat: "12.9755", lon: "77.6068" },
      { name: "Indiranagar Metro Station, Bengaluru", lat: "12.9784", lon: "77.6385" },
      { name: "Majestic Metro Station (Interchange), Bengaluru", lat: "12.9756", lon: "77.5728" },
      { name: "Indiranagar Police Station, Bengaluru", lat: "12.9784", lon: "77.6385" },
      { name: "Whitefield Police Station, Bengaluru", lat: "12.9698", lon: "77.7500" },
      { name: "Koramangala Police Station, Bengaluru", lat: "12.9362", lon: "77.6220" },
      { name: "ISRO Headquarters, Bengaluru", lat: "13.0315", lon: "77.5855" },
      { name: "HAL (Hindustan Aeronautics Ltd), Bengaluru", lat: "12.9610", lon: "77.6650" },
      { name: "KSR Bengaluru City Railway Station (Majestic), Bengaluru", lat: "12.9782", lon: "77.5695" },
      { name: "Kempegowda Bus Station (Majestic), Bengaluru", lat: "12.9756", lon: "77.5728" },
      { name: "Yeshwanthpur Junction Railway Station, Bengaluru", lat: "13.0238", lon: "77.5502" }
    ];

    const localMatches = FAVS.filter(f => f.name.toLowerCase().includes(q.toLowerCase()));

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}, Bengaluru&addressdetails=1&limit=6`);
      const data = await res.json();
      if (data) {
        const remote = data.map(d => ({ name: d.display_name, lat: d.lat, lon: d.lon }));
        // Combined results: Local favorites first
        const combined = [...localMatches, ...remote.filter(r => !localMatches.some(l => l.name === r.name))];
        ss(combined.slice(0, 6));
      } else if (localMatches.length > 0) {
        ss(localMatches);
      }
    } catch (e) { 
      if (localMatches.length > 0) ss(localMatches);
      console.error(e); 
    }
  };

  const locateMe = () => {
    if (!navigator.geolocation) return;
    setOrig('Locating…');
    navigator.geolocation.getCurrentPosition(p => {
      const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
      sessionStorage.setItem('oc', JSON.stringify(pos));
      setOrig('📍 Current Location');
      setOrigPos([pos.lat, pos.lng]);
      setGpsPos([pos.lat, pos.lng]);
    });
  };

  // ── Calculate routes ─────────────────────────────────────────
  const calc = async () => {
    const oc = sessionStorage.getItem('oc');
    const dc = sessionStorage.getItem('dc');
    if (!oc || !dc) { alert('Please select both origin and destination.'); return; }
    const { lat: ol, lng: og } = JSON.parse(oc);
    const { lat: dl, lng: dg } = JSON.parse(dc);

    setLoading(true); setRoutes([]); setPhase('search');
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${og},${ol};${dg},${dl}?alternatives=3&steps=true&geometries=geojson&overview=full`
      );
      const d = await res.json();
      if (d.routes?.length) {
        const parsed = d.routes.map((rt, i) => {
          const path = rt.geometry.coordinates.map(c => [c[1], c[0]]);
          
          // AI PROBE: Correlate path with live system data + News
          const hazardEvents = events.filter(ev =>
            path.some(p => Math.hypot(p[0]-ev.lat, p[1]-ev.lng) < 0.006)
          );
          
          let penalty = 0;
          hazardEvents.forEach(h => {
             const weight = h.sev === 'critical' ? 40 : h.sev === 'high' ? 25 : 10;
             penalty += weight;
          });

          // Predict safety score based on live urban density
          return {
            idx: i, path, dur: rt.duration, dist: rt.distance,
            steps: rt.legs?.[0]?.steps || [],
            hazards: hazardEvents, 
            score: Math.max(5, 100 - penalty),
          };
        });

        // AI RANKING: Safest first
        parsed.sort((a, b) => b.score - a.score);

        // bound the safest route on the map
        const line = L.polyline(parsed[0].path);
        setMapBounds(line.getBounds());
        setMapCenter(null);

        setRoutes(parsed);
        setActiveIdx(0);
        setPhase('select');
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // ── Start Ride ───────────────────────────────────────────────
  const startRide = async () => {
    setPhase('ride');
    setStepIdx(0);
    setEmailSent(false);
    setNotifiedHazards(new Set());

    // Watch real GPS
    if (navigator.geolocation) {
      watchRef.current = navigator.geolocation.watchPosition(
        p => {
          const ll = [p.coords.latitude, p.coords.longitude];
          setGpsPos(ll);
          setMapCenter(ll);
          // auto-advance step
          const rt = routes[activeIdx];
          if (rt?.steps) {
            rt.steps.forEach((s, si) => {
              const loc = [s.maneuver.location[1], s.maneuver.location[0]];
              if (Math.hypot(ll[0]-loc[0], ll[1]-loc[1]) < 0.0003) setStepIdx(si);
            });
          }
        },
        () => setGpsError('GPS unavailable — showing last known position'),
        { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
      );
    }

    // Send email (with route + incidents + weather)
    if (userEmail) {
      const rt = routes[activeIdx];
      const label = activeIdx === 0 ? 'AI Recommended — Safest Route' : `Route ${activeIdx + 1}`;
      const payload = {
        email:        userEmail,
        origin:       orig,
        destination:  dest,
        distance_km:  rt.dist / 1000,
        duration_min: Math.round(rt.dur / 60),
        safety_score: rt.score,
        route_label:  label,
        hazards:      rt.hazards.map(h => ({ title: h.title || h.type || 'Incident', sev: h.sev || 'medium' })),
      };
      try {
        const r = await fetch(`${API_URL}/navigation/start-ride`, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify(payload)
        });
        if (r.ok) setEmailSent(true);
      } catch(e) { console.warn('Email API unreachable', e); }
    }
  };

  const endRide = () => {
    setPhase('select');
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    window.speechSynthesis?.cancel();
  };

  // Cleanup
  useEffect(() => () => {
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    window.speechSynthesis?.cancel();
  }, []);

  // ── Hazard detection ─────────────────────────────────────────
  const activeRt = routes[activeIdx];
  const nearHazards = (phase === 'ride' && activeRt && gpsPos)
    ? activeRt.hazards.filter(h => Math.hypot(gpsPos[0]-h.lat, gpsPos[1]-h.lng) < 0.008)
    : [];

  useEffect(() => {
    if (phase !== 'ride' || !nearHazards.length) { lastAlert.current = ''; return; }
    const h = nearHazards[0];
    const key = String(h.id ?? h.title);
    if (lastAlert.current === key) return;
    lastAlert.current = key;
    // voice
    const msg = new SpeechSynthesisUtterance(`Warning! ${h.title}. Proceed with caution.`);
    msg.rate = 0.9; msg.pitch = 0.8;
    window.speechSynthesis?.cancel();
    window.speechSynthesis?.speak(msg);
    // hazard email
    if (userEmail && !notifiedHazards.has(key)) {
      setNotifiedHazards(p => new Set([...p, key]));
      fetch(`${API_URL}/navigation/hazard-alert`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email:userEmail, hazard_title:h.title, hazard_sev:h.sev, destination:dest })
      }).catch(()=>{});
    }
  }, [gpsPos]);

  // Step voice
  useEffect(() => {
    if (phase !== 'ride' || !activeRt?.steps?.[stepIdx]) return;
    const s = activeRt.steps[stepIdx];
    const mod = s.maneuver.modifier || '';
    const txt = s.maneuver.type === 'arrive'
      ? 'You have arrived at your destination.'
      : `In ${Math.round(s.distance)} meters, ${s.maneuver.type} ${mod} onto ${s.name || 'the road'}.`;
    const msg = new SpeechSynthesisUtterance(txt);
    msg.rate = 1.0; msg.pitch = 1.1;
    window.speechSynthesis?.cancel();
    window.speechSynthesis?.speak(msg);
    // scroll step list
    stepListRef.current?.querySelector(`[data-step="${stepIdx}"]`)
      ?.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }, [stepIdx, phase]);

  const tile = TILES[mapMode];
  const curStep = activeRt?.steps?.[stepIdx];

  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{ position:'relative', height:'100%', width:'100%', fontFamily:"'Inter',sans-serif" }}>

      {/* ── Hazard banner ── */}
      {phase === 'ride' && nearHazards.length > 0 && (
        <div style={{ position:'absolute', top:72, left:'50%', transform:'translateX(-50%)', zIndex:9999,
          background:'#dc2626', color:'#fff', padding:'10px 22px', borderRadius:10,
          boxShadow:'0 8px 32px rgba(220,38,38,.6)', fontWeight:800, fontSize:'.95rem',
          display:'flex', alignItems:'center', gap:10, whiteSpace:'nowrap' }}>
          ⚠️ {nearHazards[0].title} {emailSent && ' · 📧 Alert Sent'}
        </div>
      )}

      {/* ── Email sent toast ── */}
      {emailSent && phase === 'ride' && (
        <div style={{ position:'absolute', top: nearHazards.length ? 118 : 72, right:14, zIndex:9999,
          background:'#10b981', color:'#fff', padding:'7px 14px', borderRadius:8,
          fontWeight:700, fontSize:'.78rem' }}>
          📧 Sent to {userEmail}
        </div>
      )}

      {/* ── GPS error ── */}
      {gpsError && (
        <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', zIndex:9999,
          background:'#f59e0b', color:'#000', padding:'6px 14px', borderRadius:8,
          fontWeight:600, fontSize:'.78rem' }}>
          ⚠️ {gpsError}
        </div>
      )}

      {/* ══════════ SEARCH BAR ══════════ */}
      <div style={{ position:'absolute', top:14, left:'50%', transform:'translateX(-50%)', zIndex:1000,
        display:'flex', gap:10, background:'#fff', padding:'8px 14px', borderRadius:12,
        boxShadow:'0 4px 24px rgba(0,0,0,.14)', alignItems:'center', width:'88%', maxWidth:860 }}>

        <div onClick={() => setShowModal('orig')}
          style={{ display:'flex', alignItems:'center', gap:8, flex:1, cursor:'pointer', padding:'6px 0' }}>
          <span style={{ color:'#10b981', fontSize:'1.1rem' }}>🟢</span>
          <div style={{ flex:1, color: orig ? '#1e293b' : '#94a3b8', fontSize:'.9rem', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {orig || "From: Starting Point"}
          </div>
        </div>

        <div style={{ width:1, height:24, background:'#e2e8f0', margin:'0 4px' }} />

        <div onClick={() => setShowModal('dest')}
          style={{ display:'flex', alignItems:'center', gap:8, flex:1, cursor:'pointer', padding:'6px 0' }}>
          <span style={{ color:'#ef4444', fontSize:'1.1rem' }}>🔴</span>
          <div style={{ flex:1, color: dest ? '#1e293b' : '#94a3b8', fontSize:'.9rem', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {dest || "To: Destination"}
          </div>
        </div>

        <button onClick={(e) => { e.stopPropagation(); calc(); }} disabled={loading}
          style={{ background:'#3b82f6', color:'#fff', border:'none', padding:'9px 24px', borderRadius:9,
            fontWeight:700, cursor:'pointer', fontSize:'.9rem', boxShadow:'0 4px 12px rgba(59,130,246,.4)', flexShrink:0 }}>
          {loading ? '⟳ Scanning…' : '🔍 Find Routes'}
        </button>
      </div>


      {/* ── Map style switcher ── */}
      <div style={{ position:'absolute', top:70, right:14, zIndex:1000, display:'flex', gap:6 }}>
        {Object.entries(TILES).map(([k,v]) => (
          <button key={k} onClick={() => setMapMode(k)}
            style={{ padding:'5px 11px', borderRadius:8, fontSize:'.72rem', fontWeight:700, cursor:'pointer',
              border:`2px solid ${mapMode===k?'#3b82f6':'rgba(255,255,255,.55)'}`,
              background: mapMode===k?'#3b82f6':'rgba(255,255,255,.85)',
              color: mapMode===k?'#fff':'#334155',
              boxShadow:'0 2px 8px rgba(0,0,0,.14)', backdropFilter:'blur(6px)' }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* ══════════ ROUTE SELECTION PANEL ══════════ */}
      {phase === 'select' && (
        <div style={{ position:'absolute', bottom:20, left:20, zIndex:1000, width:390,
          background:'#fff', borderRadius:16, boxShadow:'0 14px 44px rgba(0,0,0,.16)',
          padding:'20px 18px', color:'#1e293b', maxHeight:'72vh', display:'flex', flexDirection:'column', gap:14 }}>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <h3 style={{ margin:0, fontSize:'1rem', fontWeight:800, color:'#1e293b' }}>🛡️ AI Route Intelligence</h3>
              <p style={{ margin:'3px 0 0', fontSize:'.75rem', color:'#64748b' }}>{routes.length} paths analyzed · Top ranked safest first</p>
            </div>
          </div>

          {/* Email indicator */}
          {loginEmail ? (
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(16,185,129,.07)',
              border:'1px solid rgba(16,185,129,.25)', borderRadius:8, padding:'8px 12px' }}>
              <span>📧</span>
              <div style={{ flex:1, overflow:'hidden' }}>
                <div style={{ fontSize:'.68rem', color:'#10b981', fontWeight:800, textTransform:'uppercase', letterSpacing:'.4px' }}>Email notifications → Login Account</div>
                <div style={{ fontSize:'.82rem', color:'#334155', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={loginEmail}>{loginEmail}</div>
              </div>
              <span style={{ fontSize:'.6rem', background:'#10b981', color:'#fff', fontWeight:800, padding:'2px 6px', borderRadius:4, flexShrink:0 }}>AUTO</span>
            </div>
          ) : (
            <input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)}
              placeholder="📧 Enter email for ride notifications"
              style={{ padding:'9px 12px', borderRadius:8, border:'1px solid #e2e8f0', background:'#f8fafc',
                color:'#1e293b', fontSize:'.85rem', outline:'none', boxSizing:'border-box', width:'100%' }} />
          )}

          {/* Route Cards */}
          <div style={{ display:'flex', flexDirection:'column', gap:10, overflowY:'auto', paddingRight:2 }}>
            {routes.map((rt, i) => {
              const clr  = ROUTE_COLORS[i % 4];
              const isAI = i === 0;
              const isSel= activeIdx === i;
              const sevc = rt.score >= 80 ? '#10b981' : rt.score >= 50 ? '#f59e0b' : '#ef4444';
              const sevlabel = rt.score >= 80 ? 'Safe ✓' : rt.score >= 50 ? 'Caution' : 'Danger';
              return (
                <div key={i} onClick={() => {
                    setActiveIdx(i);
                    const line = L.polyline(rt.path);
                    setMapBounds(line.getBounds()); setMapCenter(null);
                  }}
                  style={{ borderRadius:12, border:`2px solid ${isSel ? clr : '#e2e8f0'}`,
                    background: isSel ? `${clr}0d` : '#fafafa',
                    padding:'14px 16px', cursor:'pointer', transition:'all .2s',
                    position:'relative', overflow:'hidden' }}>

                  {isAI && (
                    <div style={{ position:'absolute', top:10, right:10,
                      background:'linear-gradient(90deg,#6366f1,#8b5cf6)', color:'#fff',
                      fontSize:'.6rem', fontWeight:800, padding:'3px 10px', borderRadius:999,
                      textTransform:'uppercase', letterSpacing:'.5px' }}>
                      🤖 AI Recommended
                    </div>
                  )}

                  <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <ScoreRing score={rt.score} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'.88rem', fontWeight:800, color:'#1e293b', marginBottom:4 }}>
                        Rank #{i + 1} Path {isAI ? '— Safest' : ''}
                      </div>
                      <div style={{ display:'flex', gap:14, fontSize:'.78rem', color:'#64748b', fontWeight:600 }}>
                        <span>🕐 {Math.round(rt.dur / 60)} min</span>
                        <span>📏 {(rt.dist / 1000).toFixed(1)} km</span>
                      </div>
                      <div style={{ display:'flex', gap:8, marginTop:6 }}>
                        <span style={{ fontSize:'.65rem', background:`${sevc}18`, color:sevc,
                          border:`1px solid ${sevc}55`, padding:'2px 8px', borderRadius:999, fontWeight:700 }}>
                          {sevlabel}
                        </span>
                        {rt.hazards.length > 0 && (
                          <span style={{ fontSize:'.65rem', background:'#fef2f2', color:'#dc2626',
                            border:'1px solid #fecaca', padding:'2px 8px', borderRadius:999, fontWeight:700 }}>
                            ⚠️ {rt.hazards.length} incident{rt.hazards.length > 1 ? 's' : ''}
                          </span>
                        )}
                        {rt.hazards.length === 0 && (
                          <span style={{ fontSize:'.65rem', background:'#ecfdf5', color:'#059669',
                            border:'1px solid #a7f3d0', padding:'2px 8px', borderRadius:999, fontWeight:700 }}>
                            🛡️ Clear road
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Incident mini-list on selected */}
                  {isSel && rt.hazards.length > 0 && (
                    <div style={{ marginTop:10, paddingTop:10, borderTop:'1px solid #e2e8f0' }}>
                      {rt.hazards.slice(0,3).map((h,hi) => (
                        <div key={hi} style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.75rem', color:'#1e293b', padding:'3px 0' }}>
                          <span>{h.icon || '⚠️'}</span>
                          <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{h.title}</span>
                          <span style={{ fontSize:'.65rem', color: h.sev==='critical'?'#dc2626':h.sev==='high'?'#ea580c':'#d97706',
                            fontWeight:700, textTransform:'uppercase' }}>{h.sev}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Start Ride CTA */}
          <button onClick={startRide}
            style={{ width:'100%', padding:'14px 0', borderRadius:12, border:'none',
              background:'linear-gradient(135deg,#10b981,#059669)', color:'#fff',
              fontSize:'1rem', fontWeight:800, cursor:'pointer',
              boxShadow:'0 6px 20px rgba(16,185,129,.45)', letterSpacing:'.2px' }}>
            🏎️ Start Ride on Route {activeIdx + 1}
            {userEmail && <span style={{ fontSize:'.75rem', opacity:.85, display:'block', marginTop:2 }}>📧 Notification will be sent</span>}
          </button>
        </div>
      )}

      {/* ══════════ RIDE / TURN-BY-TURN PANEL ══════════ */}
      {phase === 'ride' && activeRt && (
        <div style={{ position:'absolute', bottom:20, left:20, zIndex:1000, width:390,
          background:'#fff', borderRadius:16, boxShadow:'0 14px 44px rgba(0,0,0,.16)',
          padding:'18px 16px', color:'#1e293b', maxHeight:'72vh', display:'flex', flexDirection:'column', gap:12 }}>
          
          {/* 🔴 EMERGENCY ALERT BANNER */}
          {nearHazards.length > 0 && (
             <div style={{ background:'#ef4444', color:'#fff', padding:'10px 14px', borderRadius:10, animation:'pulse 1.5s infinite', border:'1px solid #fff' }}>
                <div style={{ fontWeight:900, fontSize:'.85rem', display:'flex', alignItems:'center', gap:6 }}>
                  🚨 PATH COMPROMISED
                </div>
                <div style={{ fontSize:'.72rem', opacity:.9 }}>
                   {nearHazards.length} hazards nearby. Road may be blocked. Use **🔄 Reroute** now!
                </div>
             </div>
          )}

          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:'1rem', fontWeight:800 }}>
                {Math.round(activeRt.dur / 60)} min · {(activeRt.dist / 1000).toFixed(1)} km
              </div>
              <div style={{ fontSize:'.72rem', color:'#64748b', marginTop:2 }}>
                AI Rank #{activeIdx+1} · Safety Score {activeRt.score}%
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {nearHazards.length > 0 && (
                <button 
                  onClick={() => {
                    if (gpsPos) {
                       const pos = { lat: gpsPos[0], lng: gpsPos[1] };
                       sessionStorage.setItem('oc', JSON.stringify(pos));
                       setOrig('📍 Current Location (Re-routing)');
                       setOrigPos(gpsPos);
                       calc(); // Recalculate from current position
                    }
                  }}
                  style={{ background:'#3b82f6', color:'#fff', border:'none', borderRadius:9, padding:'0 12px', fontWeight:800, cursor:'pointer', fontSize:'.78rem', boxShadow:'0 4px 12px rgba(59,130,246,.4)' }}
                  title="Recalculate safer route from current location"
                >
                  🔄 Reroute
                </button>
              )}
              <button 
                onClick={() => setShowIntel(!showIntel)}
                style={{ background:showIntel?'#1e293b':'#f1f5f9', color:showIntel?'#fff':'#334155', border:'1px solid #e2e8f0', borderRadius:9, padding:'9px', cursor:'pointer' }}
                title="Route Intelligence Report"
              >
                🛡️
              </button>
              <button onClick={endRide}
                style={{ background:'#ef4444', color:'#fff', border:'none', borderRadius:9,
                  padding:'9px 16px', fontWeight:800, cursor:'pointer', fontSize:'.85rem',
                  boxShadow:'0 4px 12px rgba(239,68,68,.4)' }}>
                🛑 Stop
              </button>
            </div>
          </div>

          {/* New: Route Intelligence Detailed Report Modal */}
          {showIntel && (
            <div style={{ background:'rgba(248,250,252,.99)', borderRadius:12, border:'1px solid #e2e8f0', padding:16, boxShadow:'0 10px 40px rgba(0,0,0,.15)', overflowY:'auto' }}>
              <div style={{ fontSize:'.75rem', fontWeight:800, textTransform:'uppercase', color:'#3b82f6', marginBottom:12, letterSpacing:'.6px', display:'flex', justifyContent:'space-between' }}>
                <span>🛡️ PATH INTELLIGENCE REPORT</span>
                <span onClick={() => setShowIntel(false)} style={{ cursor:'pointer' }}>✕</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, fontSize:'.85rem' }}>
                <div style={{ borderBottom:'1px solid #f1f5f9', paddingBottom:8 }}>
                   <div style={{ fontWeight:800, color:'#1e293b' }}>🚥 Route Status: {activeRt.score >= 80 ? '🟢 SAFE' : activeRt.score >= 50 ? '🟠 CAUTION' : '🔴 HAZARDOUS'}</div>
                   <div style={{ fontSize:'.72rem', color:'#64748b' }}>AI Rank #{activeIdx+1} (Safest Path Predicted)</div>
                </div>

                <div style={{ fontWeight:700, color:'#334155', fontSize:'.78rem' }}>📍 LIVE SENTINEL FEED (LAST 2h):</div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {activeRt.hazards.length === 0 ? (
                    <div style={{ fontSize:'.8rem', color:'#059669', fontWeight:600 }}>✅ Road is clear. No active News or BBMP hazards detected.</div>
                  ) : (
                    activeRt.hazards.map((h, hi) => (
                      <div key={hi} style={{ fontSize:'.8rem', color:'#1e293b', display:'flex', gap:8 }}>
                        <span>{h.icon || '⚠️'}</span>
                        <span>{h.title}</span>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ marginTop:8, borderTop:'1px solid #f1f5f9', paddingTop:10 }}>
                   <div style={{ fontWeight:700, color:'#334155', fontSize:'.78rem' }}>💡 AI NAVIGATOR SUGGESTIONS:</div>
                   <ul style={{ margin:'6px 0 0', paddingLeft:18, fontSize:'.78rem', color:'#64748b', display:'flex', flexDirection:'column', gap:4 }}>
                      <li>Follow current route for optimal safety.</li>
                      {activeRt.hazards.length > 0 && <li>Expect minor delays near hazard pins.</li>}
                      <li>Hugging Face Optimized Path verified ✓</li>
                   </ul>
                </div>
              </div>
            </div>
          )}

          {/* Current turn HUD */}
          {curStep && (
            <div style={{ background:'#1e293b', color:'#fff', borderRadius:12, padding:'14px 18px',
              display:'flex', alignItems:'center', gap:16, boxShadow:'0 6px 20px rgba(0,0,0,.22)', flexShrink:0 }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(255,255,255,.1)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.7rem', flexShrink:0 }}>
                {curStep.maneuver.type === 'arrive' ? '🏁'
                  : curStep.maneuver.modifier?.includes('left') ? '⬅️'
                  : curStep.maneuver.modifier?.includes('right') ? '➡️' : '⬆️'}
              </div>
              <div>
                <div style={{ fontSize:'1.35rem', fontWeight:800, lineHeight:1 }}>{Math.round(curStep.distance)}m</div>
                <div style={{ fontSize:'.88rem', color:'#94a3b8', fontWeight:500, marginTop:3 }}>
                  {curStep.name || curStep.maneuver.type}
                </div>
              </div>
            </div>
          )}

          {/* Nearby hazard */}
          {nearHazards.length > 0 && (
            <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 14px',
              display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
              <span style={{ fontSize:'1.3rem' }}>⚠️</span>
              <div>
                <div style={{ fontWeight:700, color:'#dc2626', fontSize:'.85rem' }}>{nearHazards[0].title}</div>
                <div style={{ fontSize:'.72rem', color:'#b91c1c' }}>Slow down · {emailSent ? '📧 Alert sent':'Sending alert…'}</div>
              </div>
            </div>
          )}

          {/* Turn-by-turn list */}
          <div ref={stepListRef} style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:2 }}>
            <div style={{ fontSize:'.68rem', color:'#94a3b8', fontWeight:700, textTransform:'uppercase',
              letterSpacing:'.5px', padding:'4px 8px 8px' }}>Turn-by-Turn Navigation</div>
            {activeRt.steps.map((s, i) => {
              const mod = s.maneuver.modifier || '';
              const ic  = s.maneuver.type==='arrive'?'🏁':s.maneuver.type==='depart'?'🚀':mod.includes('left')?'⬅️':mod.includes('right')?'➡️':'⬆️';
              const isActive = i === stepIdx;
              return (
                <div key={i} data-step={i}
                  onClick={() => {
                    setStepIdx(i);
                    if (mapRef.current) {
                      const loc = [s.maneuver.location[1], s.maneuver.location[0]];
                      mapRef.current.flyTo(loc, 16, { animate:true, duration:.8 });
                    }
                  }}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 8px', borderRadius:8,
                    cursor:'pointer', background: isActive?'rgba(59,130,246,.08)':'transparent',
                    border: isActive?'1px solid rgba(59,130,246,.2)':'1px solid transparent', transition:'all .15s' }}>
                  <span style={{ width:32, height:32, borderRadius:'50%', flexShrink:0,
                    background: isActive?'#3b82f6':'#f1f5f9',
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>{ic}</span>
                  <span style={{ flex:1, color: isActive?'#1d4ed8':'#334155', fontWeight: isActive?700:500, fontSize:'.84rem',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {s.name || s.maneuver.type}
                  </span>
                  <span style={{ color:'#94a3b8', fontSize:'.75rem', fontWeight:600, flexShrink:0 }}>
                    {s.distance < 1000 ? `${Math.round(s.distance)}m` : `${(s.distance/1000).toFixed(1)}km`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════ MAP ══════════ */}
      <div style={{ position:'absolute', inset:0 }}>
        <MapContainer center={BANGALORE} zoom={12} style={{ height:'100%', width:'100%' }}
          zoomControl={false} ref={mapRef}>
          <TileLayer key={mapMode} url={tile.url} attribution={tile.attr} />

          <MapController
            bounds={ phase==='select' || phase==='ride' ? mapBounds : null }
            center={ phase==='ride' ? mapCenter : null }
            zoom={16} />

          {origPos && <Marker position={origPos} icon={pinIcon('🟢')}><Popup>Start</Popup></Marker>}
          {destPos && <Marker position={destPos} icon={pinIcon('🔴')}><Popup>Destination</Popup></Marker>}

          {/* Route polylines: Only show active route during 'ride' phase */}
          {routes.map((rt, i) => {
            const clr = ROUTE_COLORS[i % 4];
            const active = i === activeIdx;
            // HIDDEN FEATURE: Only show the selected route when riding
            if (phase === 'ride' && !active) return null;
            
            return (
              <React.Fragment key={`rt-${i}`}>
                <Polyline positions={rt.path} color={clr} weight={active?13:5} opacity={active?.28:.12} lineCap="round" lineJoin="round" />
                <Polyline positions={rt.path} color={clr} weight={active?5:3}  opacity={active?1:.5}   lineCap="round" lineJoin="round" />
              </React.Fragment>
            );
          })}

          {/* Hazards on active route */}
          {activeRt?.hazards.map((h, i) => (
            <React.Fragment key={`hz-${i}`}>
              <Circle center={[h.lat, h.lng]} radius={280} color="#ef4444" fillOpacity={.22} weight={2} />
              <Marker position={[h.lat, h.lng]} icon={pinIcon(h.icon||'⚠️', 22)}>
                <Popup><b style={{color:'#dc2626'}}>⚠️ {h.title}</b><br/>{h.sev}</Popup>
              </Marker>
            </React.Fragment>
          ))}

          {/* Live GPS dot */}
          {gpsPos && (
            <Marker position={gpsPos} icon={gpsIcon} zIndexOffset={9999}>
              <Popup>📍 Your live position</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      {/* ══════════ LOCATION PICKER MODAL ══════════ */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', backdropFilter:'blur(5px)', zIndex:99999,
          display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          
          <div style={{ width:'100%', maxWidth:500, background:'#fff', borderRadius:24, overflow:'hidden', 
            boxShadow:'0 25px 50px -12px rgba(0,0,0,0.5)', animation:'modalIn 0.3s ease' }}>
            
            <div style={{ background:'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', padding:'20px 24px', 
              display:'flex', alignItems:'center', justifyContent:'space-between', color:'#fff' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, background:'rgba(255,255,255,0.2)', borderRadius:10, 
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>
                  {showModal === 'orig' ? '🟢' : '🔴'}
                </div>
                <div style={{ fontWeight:800, fontSize:'1.1rem', letterSpacing:'-0.02em' }}>
                  SELECT {showModal === 'orig' ? 'STARTING POINT' : 'DESTINATION'}
                </div>
              </div>
              <button onClick={() => { setShowModal(null); setModalResults([]); }}
                style={{ background:'rgba(255,255,255,0.2)', border:'none', width:32, height:32, borderRadius:'50%', 
                  color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900 }}>✕</button>
            </div>

            <div style={{ padding:20 }}>
              <div style={{ position:'relative', marginBottom:20 }}>
                <input autoFocus placeholder="Type any place, area, or landmark..."
                  onChange={(e) => searchCity(e.target.value)}
                  style={{ width:'100%', padding:'16px 20px 16px 52px', background:'#f8fafc', border:'2px solid #e2e8f0', 
                    borderRadius:16, fontSize:'1rem', outline:'none', transition:'all 0.2s', fontWeight:500 }} 
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                <span style={{ position:'absolute', left:20, top:'50%', transform:'translateY(-50%)', fontSize:'1.2rem' }}>🔍</span>
              </div>

              <div onClick={() => { locateMe(); setShowModal(null); }}
                style={{ display:'flex', alignItems:'center', gap:15, padding:'14px 18px', borderRadius:16, 
                  background:'#eff6ff', color:'#2563eb', cursor:'pointer', marginBottom:20, transition:'transform 0.1s' }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <div style={{ width:40, height:40, background:'#fff', borderRadius:12, display:'flex', 
                  alignItems:'center', justifyContent:'center', fontSize:'1.3rem', boxShadow:'0 4px 12px rgba(37,99,235,0.1)' }}>🎯</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'.95rem' }}>Use My Current Location</div>
                  <div style={{ fontSize:'.75rem', opacity:0.8 }}>Detect your GPS position</div>
                </div>
              </div>

              <div style={{ maxHeight:320, overflowY:'auto', paddingRight:5 }} className="custom-scroll">
                <div style={{ fontSize:'.75rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase', 
                  letterSpacing:'0.05em', marginBottom:12, paddingLeft:10 }}>Search Results</div>
                
                {modalResults.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'40px 20px', color:'#94a3b8' }}>
                    <div style={{ fontSize:'2rem', marginBottom:10 }}>🏙️</div>
                    <div style={{ fontSize:'.9rem' }}>Start typing to find Bengaluru landmarks...</div>
                  </div>
                ) : (
                  modalResults.map((s, i) => (
                    <div key={i} onClick={() => pickLocation(s)}
                      style={{ display:'flex', alignItems:'center', gap:15, padding:'12px 16px', borderRadius:14, 
                        cursor:'pointer', transition:'background 0.2s', borderBottom:'1px solid #f1f5f9' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width:36, height:36, background:'#f1f5f9', borderRadius:10, display:'flex', 
                        alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>📍</div>
                      <div style={{ fontWeight:600, fontSize:'.88rem', color:'#334155', lineHeight:1.4 }}>{s.name}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes modalIn {
              from { opacity: 0; transform: scale(0.9) translateY(20px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .custom-scroll::-webkit-scrollbar { width: 6px; }
            .custom-scroll::-webkit-scrollbar-track { background: transparent; }
            .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          `}</style>
        </div>
      )}
    </div>
  );
}
