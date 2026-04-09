import React, { useState, useRef } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LiveMap, Bdg } from './shared';
import { BANGALORE, ZONE_COLOR, SEV_COLOR, EVENTS, ALERTS, SOCIAL_POSTS, ZONE_STATS, NAV, EVENT_TYPES, RANGES, ZONES } from '../data/mockData';
import { MapPin, Image, Video, Send, Search, LocateFixed, ShieldAlert } from 'lucide-react';

export default function ReportCenter({ myReports, setMyReports, addToast, onRefresh }) {
  const [tab, setTab] = useState('incident');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    description: '', 
    location_name: '', 
    lat: BANGALORE[0], 
    lng: BANGALORE[1] 
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const getPos = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setForm(f => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude, location_name: 'Current GPS Location' }));
        addToast('📍 GPS Locked', 'Using your live sensor coordinates');
      });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.lat) { 
        addToast('⚠️ Action Required', 'Please provide a description and location'); 
        return; 
    }
    
    setLoading(true);
    const fd = new FormData();
    fd.append('description', form.description);
    fd.append('latitude', form.lat);
    fd.append('longitude', form.lng);
    fd.append('location_name', form.location_name || 'Mapped Location');
    if (file) fd.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/events/report-with-ai', {
        method: 'POST',
        body: fd
      });
      
      if (res.ok) {
        const data = await res.json();
        setMyReports(r => [{ 
            type: data.event_type, 
            location: data.location_name, 
            desc: data.description, 
            id: data.id, 
            status: 'Verified', 
            time: new Date().toLocaleTimeString() 
        }, ...r]);
        
        setForm({ description: '', location_name: '', lat: BANGALORE[0], lng: BANGALORE[1] });
        setFile(null); setPreview(null);
        addToast('🛡️ AI Pre-processed', 'Gemini categorized your report and pinned it to the map.');
        if (onRefresh) onRefresh(); // Update main map
      }
    } catch (err) {
      addToast('❌ Submission Failed', 'Network error or backend offline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="pg-title">📋 Citizen Intelligence Center</h2>
          <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Report urban incidents with AI pre-processing and multimedia evidence.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
           <button onClick={() => setTab('incident')} className={`cp-hero-btn ${tab==='incident'?'active':''}`} style={{ background: tab==='incident'?'var(--primary)':'rgba(255,255,255,.05)' }}>🛡️ Submit Report</button>
           <button onClick={() => setTab('history')} className={`cp-hero-btn ${tab==='history'?'active':''}`} style={{ background: tab==='history'?'var(--primary)':'rgba(255,255,255,.05)' }}>📜 My History</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 }}>
        {/* REPORT FORM */}
        {tab === 'incident' && (
          <div className="cp-card" style={{ padding: 28 }}>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="inp-grp">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ShieldAlert size={14} /> Incident Description (Analyzed by AI)</label>
                <textarea 
                  className="cp-inp" 
                  rows={4} 
                  required
                  value={form.description} 
                  placeholder="Describe what you see: 'Traffic accident near Hebbal Junction', 'Fire in a trash can', 'Waterlogging at Silk Board'..." 
                  style={{ resize: 'vertical', background: 'rgba(0,0,0,0.2)' }} 
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="inp-grp">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={14} /> Geolocation (Fixed IP)</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      className="cp-inp" 
                      value={`${form.lat.toFixed(4)}, ${form.lng.toFixed(4)}`} 
                      readOnly
                      style={{ background: 'rgba(0,0,0,0.2)', paddingRight: 40 }} 
                    />
                    <button type="button" onClick={getPos} style={{ position: 'absolute', right: 8, top: 10, background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                        <LocateFixed size={18} />
                    </button>
                  </div>
                </div>
                <div className="inp-grp">
                  <label>Location Name (Optional)</label>
                  <input className="cp-inp" value={form.location_name} placeholder="e.g. Hebbal Flyover" onChange={e => setForm(f => ({ ...f, location_name: e.target.value }))} />
                </div>
              </div>

              <div className="inp-grp">
                <label>Multimedia Evidence (Photos/Video)</label>
                <div 
                   onClick={() => fileRef.current.click()}
                   style={{ 
                        border: '2px dashed var(--border)', 
                        borderRadius: 12, 
                        padding: '30px 20px', 
                        textAlign: 'center', 
                        cursor: 'pointer',
                        background: preview ? 'rgba(0,0,0,0.4)' : 'transparent',
                        transition: 'all .25s'
                   }}
                >
                    {preview ? (
                        <div style={{ position: 'relative' }}>
                           {file.type.includes('video') ? (
                               <video src={preview} style={{ maxHeight: 120, borderRadius: 8 }} muted />
                           ) : (
                               <img src={preview} style={{ maxHeight: 120, borderRadius: 8 }} alt="Evidence" />
                           )}
                           <div style={{ marginTop: 10, fontSize: '.75rem', color: 'var(--primary)' }}>File Attached: {file.name}</div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                           <div style={{ display: 'flex', gap: 10 }}>
                              <Image size={24} className="text-muted" />
                              <Video size={24} className="text-muted" />
                           </div>
                           <div style={{ fontSize: '.85rem', color: 'var(--muted)' }}>Drag & drop or <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Browse</span></div>
                           <div style={{ fontSize: '.7rem', color: 'var(--muted)' }}>Maximum file size: 25MB (JPG, PNG, MP4)</div>
                        </div>
                    )}
                    <input type="file" ref={fileRef} hidden onChange={handleFile} accept="image/*,video/*" />
                </div>
              </div>

              <button type="submit" className="cp-btn" disabled={loading} style={{ height: 48, fontSize: '1rem', fontWeight: 700 }}>
                 {loading ? '🤖 AI Pre-processing...' : '🛰️ Submit for Verification'}
              </button>
            </form>
          </div>
        )}

        {/* MAP PREVIEW / HISTORY PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="cp-card" style={{ padding: 16 }}>
                <div style={{ fontSize: '.8rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>🗺️ PIN MARKER POSITION</div>
                <div style={{ height: 260, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <LiveMap events={[{ id: 'preview', lat: form.lat, lng: form.lng, icon: '🚨', title: 'Your Pin', desc: 'Confirm location', sev: 'high' }]} height="100%" zoom={15} />
                </div>
                <p style={{ fontSize: '.7rem', color: 'var(--muted)', marginTop: 10 }}>Click 'Locate' to use GPS. Coordinates are automatically indexed for Gemini spatial analysis.</p>
            </div>

            <div className="cp-card" style={{ padding: 16 }}>
                <div className="p-hdr" style={{ marginBottom: 16 }}>Recent Verification Activity</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {myReports.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: '.85rem' }}>No recent reports submitted.</div>
                    ) : (
                        myReports.slice(0, 3).map(r => (
                            <div key={r.id} className="ev-row" style={{ borderBottom: '1px solid rgba(255,255,255,.03)', paddingBottom: 10 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>📍</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '.8rem', fontWeight: 600 }}>{r.type}</div>
                                    <div style={{ fontSize: '.7rem', color: 'var(--muted)' }}>{r.location} · {r.time}</div>
                                </div>
                                <span style={{ background: '#22c55e', color: '#000', fontSize: '.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>{r.status}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
