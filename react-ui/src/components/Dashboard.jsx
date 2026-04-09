import React, { useState, useMemo } from 'react';
import { LiveMap, Bdg } from './shared';
import { ZONE_COLOR, SEV_COLOR, ZONE_STATS, EVENT_CATEGORIES, EVENT_TYPE_META, RANGES, ZONES, BANGALORE } from '../data/mockData';

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function parseKm(r) { return parseInt(r?.replace('km','') || '0', 10); }

const SOURCE_BADGE = {
  Twitter:      { bg: 'rgba(29,161,242,.18)',  color: '#1da1f2',  label: '𝕏 Twitter' },
  Facebook:     { bg: 'rgba(66,103,178,.18)',  color: '#4267b2',  label: 'f Facebook' },
  Instagram:    { bg: 'rgba(225,48,108,.18)',  color: '#e1306c',  label: '📷 Insta' },
  'Google News':{ bg: 'rgba(99,102,241,.18)',  color: '#a78bfa',  label: '📰 News' },
  'BBMP Feed':  { bg: 'rgba(34,197,94,.18)',   color: '#4ade80',  label: '🏗️ BBMP' },
  'IMD India':  { bg: 'rgba(59,130,246,.18)',  color: '#60a5fa',  label: '🌦️ IMD' },
  'BESCOM App': { bg: 'rgba(251,191,36,.18)',  color: '#fbbf24',  label: '⚡ BESCOM' },
  'BWSSB App':  { bg: 'rgba(56,189,248,.18)',  color: '#38bdf8',  label: '💧 BWSSB' },
  'BMTC Feed':  { bg: 'rgba(167,139,250,.18)', color: '#a78bfa',  label: '🚌 BMTC' },
};
function SourceTag({ source }) {
  const s = SOURCE_BADGE[source] || { bg: 'rgba(148,163,184,.15)', color: '#94a3b8', label: source };
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}44`, padding: '2px 8px', borderRadius: 999, fontSize: '.68rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{s.label}</span>;
}

export default function Dashboard({ events, alerts, social, range, setRange, zone, setZone, evType, setEvType, onRefresh, loading, addToast }) {
  const [mapStyle, setMapStyle] = useState('dark');
  const [catFilter, setCatFilter] = useState('All');
  const [reportExpanded, setReportExpanded] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(null);
  const [generatedReports, setGeneratedReports] = useState({});
  const [center, setCenter] = useState(BANGALORE);
  const [userGPS, setUserGPS] = useState(null);
  const [usingUserLoc, setUsingUserLoc] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [areaIntel, setAreaIntel] = useState(null);
  
  // LIVE EVENT OBSERVER: Flash toast if new critical events appear
  const lastEventCount = React.useRef(events.length);
  React.useEffect(() => {
    if (events.length > lastEventCount.current) {
      const newEv = events[events.length - 1];
      if (newEv.sev === 'critical' || newEv.sev === 'high') {
         addToast(`🚨 LIVE: ${newEv.title}`, `New ${newEv.sev} incident detected at ${newEv.loc}. Map Pin Added.`);
      }
    }
    lastEventCount.current = events.length;
  }, [events, addToast]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setCenter(loc);
        setUserGPS(loc);
        setUsingUserLoc(true);
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        let msg = "Unable to get location.";
        if (err.code === 1) msg = "Location permission denied. Please allow location access in your browser settings.";
        else if (err.code === 2) msg = "Location unavailable. Check your internet/GPS.";
        else if (err.code === 3) msg = "Location request timed out.";
        alert(msg);
        setUsingUserLoc(false);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const rangeKm = parseKm(range);

  // Filter by zone + category
  const typeFiltered = useMemo(() => events.filter(e => {
    const meta = EVENT_TYPE_META[e.type] || EVENT_TYPE_META[e.event_type] || {};
    const zonOk = zone === 'All Zones' || e.zone === zone;
    const catOk = catFilter === 'All' || meta.cat === catFilter;
    return zonOk && catOk;
  }), [events, zone, catFilter]);

  // Range filter for the report list only
  const rangeFiltered = useMemo(() => {
    if (!rangeKm) return typeFiltered;
    return typeFiltered.filter(e => e.lat && e.lng && haversine(center[0], center[1], e.lat, e.lng) <= rangeKm);
  }, [typeFiltered, rangeKm, center]);

  const stats = {
    total: rangeFiltered.length,
    critical: rangeFiltered.filter(e => e.sev === 'critical').length,
    high: rangeFiltered.filter(e => e.sev === 'high' || e.sev === 'critical').length,
    medium: rangeFiltered.filter(e => e.sev === 'medium').length,
    low: rangeFiltered.filter(e => e.sev === 'low').length,
  };

  const generateReport = async (ev) => {
    setGeneratingReport(ev.id);
    await new Promise(r => setTimeout(r, 1200));
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const report = {
      id: `RPT-${Date.now()}`,
      timestamp: now,
      event: ev,
      recommendation: ev.sev === 'critical' || ev.sev === 'high'
        ? `🚨 IMMEDIATE ACTION REQUIRED: Notify BBMP, Traffic Police, and relevant emergency services about ${ev.type} at ${ev.loc}. Deploy response team.`
        : ev.sev === 'medium'
        ? `⚠️ MONITOR CLOSELY: Alert nearby units about ${ev.type} at ${ev.loc}. Issue public advisory.`
        : `ℹ️ INFORMATIONAL: Log ${ev.type} at ${ev.loc} for city records. Monitor for escalation.`,
      actions: ev.sev === 'critical'
        ? ['📞 Alert Emergency Services', '🚑 Dispatch Ambulance', '🚒 Notify Fire Dept', '📢 Issue Public Warning', '🚔 Deploy Police Units']
        : ev.sev === 'high'
        ? ['🚔 Alert Traffic Police', '📡 Update Social Media', '🔔 Send Push Notifications', '🗺️ Update Navigation Routes']
        : ['📋 Log Incident', '📊 Update Dashboard', '📱 Notify Zone Officer'],
    };
    setGeneratedReports(r => ({ ...r, [ev.id]: report }));
    setGeneratingReport(null);
    setReportExpanded(ev.id);
  };

  return (
    <div className="dash-layout">
      <div className="dash-left">

        {/* ── MAP CARD ── */}
        <div className="cp-card">
          <div className="map-hdr">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
              📍 Bengaluru Live City Map
              <span className="live-dot">● LIVE</span>
              {loading && <span style={{ fontSize: '.7rem', color: 'var(--muted)', fontWeight: 400 }}>⏳ Fetching...</span>}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={handleUseMyLocation} disabled={isLocating}
                style={{
                  background: usingUserLoc ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${usingUserLoc ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
                  color: usingUserLoc ? '#4ade80' : 'var(--muted)',
                  padding: '4px 12px', borderRadius: 7, fontSize: '.75rem', cursor: isLocating ? 'wait' : 'pointer',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, transition: 'all .2s'
                }}>
                {isLocating ? '⏳ Locating...' : usingUserLoc ? '🛰️ GPS Active' : '📍 Use My Location'}
              </button>
              <button onClick={() => { setCenter(BANGALORE); setUsingUserLoc(false); }}
                style={{ background: !usingUserLoc ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${!usingUserLoc ? '#6366f1' : 'rgba(255,255,255,0.1)'}`, color: !usingUserLoc ? '#a78bfa' : 'var(--muted)', padding: '4px 12px', borderRadius: 7, fontSize: '.75rem', cursor: 'pointer', fontWeight: 600 }}>
                🏙️ Blr Center
              </button>
              <button onClick={onRefresh}
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a78bfa', padding: '4px 14px', borderRadius: 7, fontSize: '.75rem', cursor: 'pointer', fontWeight: 600 }}>
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Zone filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
            {ZONES.map(z => (
              <button key={z} className={`zb${zone === z ? ' za' : ''}`}
                style={zone === z && z !== 'All Zones' ? { background: ZONE_COLOR[z], color: '#000' } : {}}
                onClick={() => setZone(z)}>
                {z !== 'All Zones' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: ZONE_COLOR[z], display: 'inline-block', marginRight: 4 }} />}
                {z}
              </button>
            ))}
          </div>

          {/* Range filter + summary stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '.73rem', color: 'var(--muted)', fontWeight: 600 }}>Range:</span>
            {RANGES.map(r => (
              <button key={r} className={`rb${range === r ? ' ra' : ''}`} onClick={() => setRange(r)}>{r}</button>
            ))}
            <span style={{ fontSize: '.73rem', color: 'var(--muted)', marginLeft: 4 }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>{stats.critical} critical</span>
              {' · '}
              <span style={{ color: '#f97316', fontWeight: 700 }}>{stats.high} high</span>
              {' · '}
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>{stats.medium} medium</span>
              {' · '}
              <span style={{ color: '#22c55e', fontWeight: 700 }}>{stats.low} low</span>
            </span>
          </div>

          {/* THE MAP */}
          <LiveMap
            events={typeFiltered}
            height="380px"
            circles={true}
            zoom={12}
            center={center}
            userLoc={usingUserLoc ? userGPS : null}
            mapStyle={mapStyle}
            setMapStyle={setMapStyle}
            rangeKm={rangeKm}
            showRangeCircle={true}
          />
        </div>

        {/* ── LIVE INCIDENT REPORT PANEL ── */}
        <div className="cp-card" style={{ marginBottom: 14 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1rem' }}>
              🗂️ Live Incident Report
              <span style={{ background: '#ef4444', color: '#fff', fontSize: '.68rem', fontWeight: 700, padding: '2px 9px', borderRadius: 999 }}>{stats.critical} CRITICAL</span>
              <span className="live-dot">● LIVE</span>
            </div>
            <span style={{ fontSize: '.75rem', color: 'var(--muted)', marginLeft: 'auto' }}>
              {rangeKm > 0 ? `${rangeFiltered.length} incidents within ${range}` : `${typeFiltered.length} total incidents`}
            </span>
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {['All', 'Emergency', 'Traffic', 'Weather', 'Civic', 'Public', 'Crowd'].map(cat => {
              const colors = { Emergency:'#ef4444', Traffic:'#f97316', Weather:'#38bdf8', Civic:'#a78bfa', Public:'#22c55e', Crowd:'#f59e0b', All:'#6366f1' };
              const isActive = catFilter === cat;
              return (
                <button key={cat} onClick={() => setCatFilter(cat)} style={{
                  padding: '4px 12px', borderRadius: 7, fontSize: '.75rem', fontWeight: isActive ? 700 : 500,
                  background: isActive ? colors[cat] + '22' : 'transparent',
                  border: `1px solid ${isActive ? colors[cat] : 'rgba(255,255,255,0.1)'}`,
                  color: isActive ? colors[cat] : 'var(--muted)', cursor: 'pointer', transition: 'all .2s',
                }}>{cat}</button>
              );
            })}
          </div>

          {/* Incident cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 520, overflowY: 'auto' }}>
            {rangeFiltered.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px 0', fontSize: '.88rem' }}>
                ✅ No incidents in this filter. Bengaluru looks clear!
              </div>
            )}
            {rangeFiltered.map(ev => {
              const meta = EVENT_TYPE_META[ev.type] || EVENT_TYPE_META[ev.event_type] || { icon: '📍', color: '#64748b' };
              const rpt = generatedReports[ev.id];
              const isExpanded = reportExpanded === ev.id;
              const isLoading = generatingReport === ev.id;
              return (
                <div key={ev.id} style={{
                  background: ev.sev === 'critical' ? 'rgba(239,68,68,0.06)' : ev.sev === 'high' ? 'rgba(249,115,22,0.05)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${ev.sev === 'critical' ? 'rgba(239,68,68,0.3)' : ev.sev === 'high' ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.07)'}`,
                  borderLeft: `3px solid ${SEV_COLOR[ev.sev] || '#64748b'}`,
                  borderRadius: 10, padding: '12px 14px', transition: 'all .2s',
                }}>
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{ev.icon || meta.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, fontSize: '.88rem' }}>{ev.title}</span>
                        <Bdg sev={ev.sev} />
                      </div>
                      <div style={{ fontSize: '.72rem', color: 'var(--muted)', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span>📍 {ev.loc}</span>
                        <span>🕒 {ev.time}</span>
                        {ev.source && <SourceTag source={ev.source} />}
                        <span style={{ background: meta.color + '22', color: meta.color, border: `1px solid ${meta.color}44`, padding: '1px 7px', borderRadius: 999, fontSize: '.65rem', fontWeight: 600 }}>{ev.type || ev.event_type}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => rpt ? setReportExpanded(isExpanded ? null : ev.id) : generateReport(ev)}
                      disabled={isLoading}
                      style={{
                        padding: '5px 12px', borderRadius: 7, fontSize: '.72rem', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer',
                        background: rpt ? (isExpanded ? '#6366f1' : 'rgba(99,102,241,0.15)') : 'rgba(99,102,241,0.15)',
                        border: '1px solid rgba(99,102,241,0.35)', color: '#a78bfa', whiteSpace: 'nowrap', flexShrink: 0,
                      }}>
                      {isLoading ? '⏳ Generating...' : rpt ? (isExpanded ? '▲ Hide' : '📄 View Report') : '🤖 Make Report'}
                    </button>
                  </div>

                  {/* Description */}
                  {ev.desc && <div style={{ fontSize: '.78rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: 6 }}>{ev.desc}</div>}

                  {/* Generated Report */}
                  {rpt && isExpanded && (
                    <div style={{ marginTop: 10, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <span style={{ fontSize: '.72rem', fontWeight: 700, color: '#a78bfa' }}>📋 AI INCIDENT REPORT</span>
                        <span style={{ fontSize: '.65rem', color: 'var(--muted)', marginLeft: 'auto' }}>ID: {rpt.id} · {rpt.timestamp}</span>
                      </div>
                      <div style={{ fontSize: '.78rem', lineHeight: 1.6, color: '#cbd5e1', marginBottom: 10 }}>{rpt.recommendation}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {rpt.actions.map((action, i) => (
                          <button key={i} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#e0e7ff', padding: '4px 10px', borderRadius: 6, fontSize: '.72rem', cursor: 'pointer', transition: 'background .2s' }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.3)'}
                            onMouseOut={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}>
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="dash-right">
        {/* Neighborhood Intelligence Hub */}
        {rangeKm > 0 && (
          <div className="cp-card" style={{ border: '1px solid rgba(99,102,241,0.4)', background: 'linear-gradient(135deg, rgba(22,27,39,0.9), rgba(99,102,241,0.05))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
               <span style={{ fontSize: '1.2rem' }}>📡</span>
               <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '.65rem', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.6px' }}>Sentinel Proximity Intelligence</div>
                  <div style={{ fontSize: '.9rem', fontWeight: 800 }}>Focused Report: {zone} ({range})</div>
               </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', padding: 8, borderRadius: 8 }}>
                  <div style={{ flex: 1 }}>
                     <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#e2e8f0' }}>📍 Area Safety Rank</div>
                     <div style={{ fontSize: '.68rem', color: '#94a3b8' }}>Synthesized from {rangeFiltered.length} local pins</div>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: stats.critical > 0 ? '#ef4444' : '#10b981' }}>
                    {stats.critical > 0 ? 'STATUS: CRITICAL' : 'STATUS: NORMAL'}
                  </div>
               </div>

               <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                  <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#818cf8', marginBottom: 6 }}>🧠 POINT-WISE URBAN INTEL:</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: '.75rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                     {rangeFiltered.slice(0, 4).map((f, fi) => (
                        <li key={fi}><b>{f.title}</b>: Verified via {f.source || 'Social Media'}</li>
                     ))}
                     {rangeFiltered.length === 0 && <li>No active News/Maps hazards within {range}. Area is secure ✓</li>}
                  </ul>
               </div>

               <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', padding: 10, borderRadius: 8, marginTop: 4 }}>
                  <div style={{ fontSize: '.68rem', fontWeight: 800, color: '#a78bfa', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    📸 LIVE SOURCE DISCOVERY
                  </div>
                  <div style={{ fontSize: '.7rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    • Google Maps: Road closure data indexed.<br/>
                    • IG/Social: Scanning tagged urban video feeds...<br/>
                    • NewsAPI: Syncing local district reports.
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="cp-card">
          <div className="p-hdr">📊 Incident Summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            {[
              { label: 'Critical', count: stats.critical, color: '#ef4444' },
              { label: 'High', count: stats.high - stats.critical, color: '#f97316' },
              { label: 'Medium', count: stats.medium, color: '#f59e0b' },
              { label: 'Low', count: stats.low, color: '#22c55e' },
            ].map(s => (
              <div key={s.label} style={{ background: s.color + '12', border: `1px solid ${s.color}33`, borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.count}</div>
                <div style={{ fontSize: '.7rem', color: 'var(--muted)', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {/* Category breakdown */}
          {['Emergency', 'Traffic', 'Weather', 'Civic', 'Public', 'Crowd'].map(cat => {
            const colors = { Emergency:'#ef4444', Traffic:'#f97316', Weather:'#38bdf8', Civic:'#a78bfa', Public:'#22c55e', Crowd:'#f59e0b' };
            const count = rangeFiltered.filter(e => {
              const m = EVENT_TYPE_META[e.type] || EVENT_TYPE_META[e.event_type] || {};
              return m.cat === cat;
            }).length;
            if (!count) return null;
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: '.78rem' }}>
                <span style={{ width: 80, color: colors[cat], fontWeight: 600 }}>{cat}</span>
                <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,.07)', borderRadius: 999 }}>
                  <div style={{ height: '100%', width: `${(count / Math.max(stats.total, 1)) * 100}%`, background: colors[cat], borderRadius: 999 }} />
                </div>
                <b style={{ width: 16, textAlign: 'right', color: colors[cat] }}>{count}</b>
              </div>
            );
          })}
        </div>

        {/* Alerts */}
        <div className="cp-card">
          <div className="p-hdr">🔔 Active Alerts <span className="count-pill red">{alerts.length}</span></div>
          {alerts.map(a => (
            <div key={a.id} className={`alert-box alert-${a.sev}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span>{a.icon}</span><span style={{ fontSize: '.82rem', fontWeight: 700, flex: 1 }}>{a.title}</span><Bdg sev={a.sev} />
              </div>
              <p style={{ fontSize: '.75rem', color: 'var(--muted)', margin: '0 0 4px' }}>{a.desc}</p>
              <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.3)' }}>Expires: {a.expires}</div>
            </div>
          ))}
        </div>

        {/* Social Monitor */}
        <div className="cp-card">
          <div className="p-hdr">📡 Live Social Feed</div>
          {social.map(s => (
            <div key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,.05)', padding: '9px 0' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={`plat plat-${s.platform}`}>{s.platform === 'twitter' ? '𝕏' : s.platform === 'facebook' ? 'f' : '📷'} {s.verified && '✓'}</span>
                {s.icon && <span>{s.icon}</span>}
                <span style={{ fontSize: '.68rem', color: 'var(--muted)', marginLeft: 'auto' }}>📍{s.loc}</span>
                <Bdg sev={s.sev} />
              </div>
              <p style={{ fontSize: '.78rem', lineHeight: 1.4, margin: '0 0 4px' }}>{s.text}</p>
              {s.type && <span style={{ fontSize: '.68rem', background: 'rgba(99,102,241,0.12)', color: '#a78bfa', padding: '1px 7px', borderRadius: 999 }}>{s.type}</span>}
            </div>
          ))}
        </div>

        {/* Zone breakdown */}
        <div className="cp-card">
          <div className="p-hdr">📊 By Zone ({range})</div>
          {ZONE_STATS.map(z => (
            <div key={z.zone} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: '.78rem' }}>
              <span style={{ width: 80, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted)' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: z.color, display: 'inline-block' }} />{z.zone}
              </span>
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,.07)', borderRadius: 999 }}>
                <div style={{ height: '100%', width: `${(z.count / 16) * 100}%`, background: z.color, borderRadius: 999 }} />
              </div>
              <b style={{ width: 20, textAlign: 'right' }}>{z.count}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
