import React from 'react';

const TECH_STACK = [
  { category: 'Frontend Architecture', tools: ['React 18', 'Vite', 'Leaflet.js (Map)', 'Recharts (Analytics)', 'Lucide Icons', 'Vanilla CSS-in-JS Architecture'] },
  { category: 'Backend Intelligence', tools: ['FastAPI (Python)', 'SQLAlchemy (ORM)', 'SQLite (Session Logs)', 'Uvicorn', 'Pydantic (Validation)'] },
  { category: 'AI & Data Processing', tools: ['Google Gemini API (via RapidAPI)', 'GNews Global News Indexing', 'Twitter Aggregator', 'Natural Language Processing (Preprocessing)'] },
  { category: 'Geospatial Services', tools: ['OpenStreetMap (Map Tiles)', 'Nominatim (Geocoding)', 'OSRM (Open Source Routing Machine)'] },
  { category: 'Security & Auth', tools: ['SHA-256 Hashing', 'Session-based Login Logs', 'Role-based Access Control (Admin/User)'] }
];

const API_ENDPOINTS = [
  { name: 'Dashboard Events', endpoint: '/events/', method: 'GET', description: 'Fetches all 310+ live and simulated city-wide incidents.' },
  { name: 'AI Safety Chat', endpoint: '/chat/', method: 'POST', description: 'Gemini-powered location intelligence and safety advisory bridge.' },
  { name: 'Social Collection', endpoint: '/collection/fetch-all', method: 'POST', description: 'Triggers multi-source (News/Twitter/Insta) data collection.' },
  { name: 'Routing Engine', endpoint: '/navigation/route', method: 'POST', description: 'Calculates the safest route by avoiding incident-heavy zones.' },
  { name: 'User Management', endpoint: '/users/register', method: 'POST', description: 'Registers new city pulse accounts in SQLite database.' },
  { name: 'Security Logs', endpoint: '/users/logs', method: 'GET', description: 'Retrieves administrative user login activity logs.' }
];

export default function TechnologyStack() {
  return (
    <div style={{ padding: '24px 40px', height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #fff, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Urban Intelligence Stack</h1>
        <p style={{ color: '#94a3b8', fontSize: '.85rem', marginTop: 4 }}>End-to-End Tools & Technology Framework</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, marginBottom: 40 }}>
        {TECH_STACK.map(s => (
          <div key={s.category} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '.9rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 10 }}>{s.category}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {s.tools.map(t => <span key={t} style={{ background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '.75rem', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>Central API Integration Table</h2>
          <p style={{ color: '#94a3b8', fontSize: '.85rem', marginBottom: 20 }}>Every active endpoint used in the CityPulse Smart Dashboard architecture.</p>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '16px 24px', fontSize: '.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>API Interface</th>
                  <th style={{ padding: '16px 24px', fontSize: '.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Endpoint Path</th>
                  <th style={{ padding: '16px 24px', fontSize: '.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Protocol</th>
                  <th style={{ padding: '16px 24px', fontSize: '.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Functionality</th>
                </tr>
              </thead>
              <tbody>
                {API_ENDPOINTS.map(api => (
                   <tr key={api.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px 24px', fontSize: '.9rem', color: '#fff', fontWeight: 600 }}>{api.name}</td>
                      <td style={{ padding: '16px 24px' }}><code style={{ background: '#000', color: '#4ade80', padding: '4px 8px', borderRadius: 6, fontSize: '.75rem' }}>{api.endpoint}</code></td>
                      <td style={{ padding: '16px 24px', fontSize: '.8rem', fontWeight: 800, color: '#3b82f6' }}>{api.method}</td>
                      <td style={{ padding: '16px 24px', fontSize: '.8rem', color: '#94a3b8' }}>{api.description}</td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
