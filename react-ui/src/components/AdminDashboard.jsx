import React, { useState, useEffect } from 'react';
import AdminLogs from './AdminLogs';
import TechnologyStack from './TechnologyStack';

const ENTITIES = [
  { name: 'IncidentReport', status: 'PUBLIC', msg: 'All users have full access', color: '#ef4444' },
  { name: 'SafetyAlert', status: 'PUBLIC', msg: 'All users have full access', color: '#ef4444' },
  { name: 'LiveSession', status: 'PUBLIC', msg: 'All users have full access', color: '#ef4444' },
  { name: 'SocialMediaAlert', status: 'PUBLIC', msg: 'All users have full access', color: '#ef4444' },
  { name: 'RoadConditionReport', status: 'PUBLIC', msg: 'All users have full access', color: '#ef4444' },
  { name: 'RouteAlert', status: 'PUBLIC', msg: 'All users have full access', color: '#ef4444' },
  { name: 'TrendingTag', status: 'PUBLIC', msg: 'All users have full access', color: '#ef4444' },
  { name: 'BangaloreCityAlert', status: 'PUBLIC', msg: 'All users have full access', color: '#ef4444' },
  { name: 'BangaloreTagMonitor', status: 'PUBLIC', msg: 'All users have full access', color: '#ef4444' }
];

export default function AdminDashboard({ events, API_URL }) {
  const [activeTab, setActiveTab] = useState('Security');

  const SIDEBAR_ITEMS = [
    { id: 'Overview', icon: '🏠' },
    { id: 'Users', icon: '👤' },
    { id: 'Data', icon: '💾' },
    { id: 'Analytics', icon: '📊', beta: true },
    { id: 'Domains', icon: '🌐' },
    { id: 'Integrations', icon: '🔌' },
    { id: 'Security', icon: '🛡️' },
    { id: 'Code', icon: '〈 〉' },
    { id: 'Agents', icon: '🤖' },
    { id: 'Automations', icon: '⚡' },
    { id: 'Logs', icon: '📝' },
    { id: 'API', icon: '📡' },
    { id: 'Settings', icon: '⚙️' }
  ];

  return (
    <div style={{ display: 'flex', height: '100%', background: '#fafafa', color: '#1a1a1b', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* High-Fidelity Admin Sidebar */}
      <aside style={{ width: 240, background: '#fff', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <div style={{ width: 24, height: 24, background: '#1a1a1b', borderRadius: 4 }}></div>
             <span style={{ fontWeight: 600, fontSize: '.9rem' }}>admin-dashboard</span>
          </div>
        </div>
        <div style={{ padding: '16px 8px', flex: 1, overflowY: 'auto' }}>
          {SIDEBAR_ITEMS.map(item => (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                background: activeTab === item.id ? '#f3f4f6' : 'transparent',
                color: activeTab === item.id ? '#1a1a1b' : '#64748b',
                marginBottom: 2, transition: 'background .1s'
              }}
              onMouseOver={e=>!activeTab===item.id&&(e.currentTarget.style.background='#f9fafb')}
              onMouseOut={e=>!activeTab===item.id&&(e.currentTarget.style.background='transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                <span style={{ fontSize: '.85rem', fontWeight: activeTab === item.id ? 600 : 500 }}>{item.id}</span>
              </div>
              {item.beta && <span style={{ fontSize: '.6rem', fontWeight: 700, color: '#f59e0b', padding: '2px 6px', background: '#fffbeb', borderRadius: 4, border: '1px solid #fde68a' }}>BETA</span>}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
        
        {/* Security Section (Direct Port of Screenshot) */}
        {activeTab === 'Security' && (
          <div style={{ padding: 40 }}>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px 0' }}>App Security</h1>
              <p style={{ color: '#64748b', fontSize: '.85rem' }}>Configure row-level security policies to control who can access your app's data</p>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
               <div>
                  <h3 style={{ fontSize: '.95rem', fontWeight: 700, margin: '0 0 4px 0' }}>Scan Issues</h3>
                  <p style={{ color: '#64748b', fontSize: '.85rem', margin: 0 }}>Scan typically takes a few minutes to complete</p>
               </div>
               <button style={{ background: '#1a1a1b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: '.85rem' }}>Start Security Check</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>📂</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Data Entities</h3>
               </div>
               <span style={{ color: '#64748b', fontSize: '.8rem', padding: '4px 8px', background: '#f5f5f5', borderRadius: 999 }}>● {ENTITIES.length} entities</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
               {ENTITIES.map(e => (
                 <div key={e.name} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                       <span style={{ fontSize: '1rem', fontWeight: 700 }}>{e.name}</span>
                       <span style={{ fontSize: '.6rem', fontWeight: 700, color: '#64748b', padding: '2px 6px', background: '#f1f1f1', borderRadius: 4 }}>{e.status}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                       <div style={{ width: 16, height: 16, borderRadius: '50%', border: `1px solid ${e.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: e.color, fontSize: '10px', fontWeight: 900 }}>!</span>
                       </div>
                       <span style={{ color: e.color, fontSize: '.75rem', fontWeight: 500 }}>{e.msg}</span>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Logs Section */}
        {activeTab === 'Logs' && <AdminLogs API_URL={API_URL} />}

        {/* API Section */}
        {activeTab === 'API' && <TechnologyStack />}

        {/* Placeholder for other tabs */}
        {!['Security', 'Logs', 'API'].includes(activeTab) && (
          <div style={{ padding: 100, textAlign: 'center' }}>
             <div style={{ fontSize: '3rem', marginBottom: 20 }}>{SIDEBAR_ITEMS.find(i=>i.id===activeTab)?.icon}</div>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{activeTab} Management</h2>
             <p style={{ color: '#64748b' }}>This module is currently indexing data from your city project database...</p>
          </div>
        )}

      </main>
    </div>
  );
}
