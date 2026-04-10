import React, { useState, useEffect } from 'react';

export default function AdminLogs({ API_URL }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/users/logs`)
      .then(res => res.json())
      .then(data => { setLogs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '24px 40px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #fff, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>User Login Logs</h1>
          <p style={{ color: '#94a3b8', fontSize: '.85rem', marginTop: 4 }}>Security Monitoring & SQLite Performance Logs</p>
        </div>
        <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', padding: '6px 14px', borderRadius: 999, fontSize: '.75rem', fontWeight: 600, border: '1px solid rgba(34, 197, 94, 0.2)' }}>● SQLite Live Sync</div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading secure logs...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontSize: '.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event ID</th>
                <th style={{ padding: '16px 24px', fontSize: '.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User / Email</th>
                <th style={{ padding: '16px 24px', fontSize: '.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                <th style={{ padding: '16px 24px', fontSize: '.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Info</th>
                <th style={{ padding: '16px 24px', fontSize: '.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background .2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '16px 24px', fontSize: '.85rem', color: '#cbd5e1' }}>#{log.id}</td>
                  <td style={{ padding: '16px 24px', fontSize: '.85rem', color: '#fff', fontWeight: 600 }}>{log.username}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ background: log.action === 'LOGIN' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(168, 85, 247, 0.15)', color: log.action === 'LOGIN' ? '#60a5fa' : '#c084fc', padding: '4px 10px', borderRadius: 6, fontSize: '.7rem', fontWeight: 700 }}>{log.action}</span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '.85rem', color: '#94a3b8' }}>{log.info || 'Web Portal'}</td>
                  <td style={{ padding: '16px 24px', fontSize: '.85rem', color: '#94a3b8' }}>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                   <td colSpan="5" style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No logs found in SQLite session.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
