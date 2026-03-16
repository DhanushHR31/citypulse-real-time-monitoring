import React, { useState, useEffect } from 'react';
import {
  Home, Users, Database, BarChart2, Globe, Zap, Shield, Code, Bot,
  PocketKnife, FileText, Settings, Search, Edit2, Star, Share, X, Mail, Copy, Trash2, Check
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './index.css';

const TABS = [
  { id: 'overview', icon: <Home size={16} />, label: 'Overview' },
  { id: 'users', icon: <Users size={16} />, label: 'Users' },
  { id: 'data', icon: <Database size={16} />, label: 'Data', hasMenu: true },
  { id: 'analytics', icon: <BarChart2 size={16} />, label: 'Analytics', badge: 'Beta' },
  { id: 'domains', icon: <Globe size={16} />, label: 'Domains' },
  { id: 'integrations', icon: <Zap size={16} />, label: 'Integrations' },
  { id: 'security', icon: <Shield size={16} />, label: 'Security' },
  { id: 'code', icon: <Code size={16} />, label: 'Code' },
  { id: 'agents', icon: <Bot size={16} />, label: 'Agents' },
  { id: 'automations', icon: <PocketKnife size={16} />, label: 'Automations' },
  { id: 'logs', icon: <FileText size={16} />, label: 'Logs' },
  { id: 'api', icon: <Code size={16} />, label: 'API' },
  { id: 'settings', icon: <Settings size={16} />, label: 'Settings', hasMenu: true },
];

const TABLES = [
  'IncidentReport', 'SafetyAlert', 'LiveSession', 'SocialMediaAlert',
  'RoadConditionReport', 'RouteAlert', 'TrendingTag',
  'BangaloreCityAlert', 'BangaloreTagMonitor'
];

// dynamic users state will be handled below

const trafficData = [
  { time: 'Feb 25, 08:21 AM', visitors: 10 },
  { time: 'Feb 26, 11:04 AM', visitors: 45 },
  { time: 'Feb 26, 02:00 PM', visitors: 15 },
  { time: 'Feb 27, 09:00 AM', visitors: 38 },
  { time: 'Feb 27, 07:07 PM', visitors: 20 },
];

export default function App() {
  const [tab, setTab] = useState('settings');
  const [dataTab, setDataTab] = useState(TABLES[0]);
  const [settingsTab, setSettingsTab] = useState('app_settings');
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = () => {
    fetch('http://localhost:8000/users/')
      .then(res => res.json())
      .then(data => setUsersList(data))
      .catch(err => console.error("Failed to fetch users", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetch(`http://localhost:8000/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) { console.error('Delete failed', err); }
  };

  const saveUser = async (u) => {
    try {
      await fetch(`http://localhost:8000/users/${u.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: u.name, email: u.email, phone: u.phone, role: u.role })
      });
      setEditingUser(null);
      fetchUsers();
    } catch (err) { console.error('Update failed', err); }
  };

  const filteredUsers = usersList.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50/50 text-[#171717] font-sans antialiased">
      {/* SIDEBAR */}
      <div className="w-[260px] bg-white border-r border-[#eaeaea] flex flex-col pt-3 shrink-0">
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 text-[#888]" size={14} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#f7f7f7] border border-[#eaeaea] rounded-md py-1.5 pl-8 pr-3 text-[13px] outline-none focus:border-[#999] transition-colors"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto mt-2 pb-6">
          <ul className="space-y-[2px] px-2">
            {TABS.map((t, idx) => (
              <React.Fragment key={t.id}>
                {/* Data submenu injection */}
                {(tab === 'data' && idx > 2 && idx < 4) && (
                  <div className="pl-6 border-l border-[#eaeaea] ml-[22px] mb-3 mt-1 space-y-2">
                    {TABLES.map(table => (
                      <div
                        key={table}
                        className={`text-[13px] cursor-pointer hover:text-[#000] ${dataTab === table ? 'text-[#000] font-medium' : 'text-[#666]'}`}
                        onClick={() => setDataTab(table)}
                      >
                        {table}
                      </div>
                    ))}
                  </div>
                )}

                {/* Settings submenu injection */}
                {(tab === 'settings' && t.id === 'settings') && (
                  <div className="pl-6 border-l border-[#eaeaea] ml-[22px] mb-3 mt-1 space-y-2">
                    {[
                      { id: 'app_settings', label: 'App Settings' },
                      { id: 'auth', label: 'Authentication' },
                      { id: 'template', label: 'App Template' }
                    ].map(st => (
                      <div
                        key={st.id}
                        className={`text-[13px] cursor-pointer hover:text-[#000] py-1 px-2 rounded-md ${settingsTab === st.id ? 'bg-[#f0f0f0] text-[#000] font-medium' : 'text-[#666]'}`}
                        onClick={() => setSettingsTab(st.id)}
                      >
                        {st.label}
                      </div>
                    ))}
                  </div>
                )}

                <li>
                  <button
                    onClick={() => setTab(t.id)}
                    className={`nav-item w-full flex items-center justify-between text-[13.5px] py-[7px] px-3 rounded-md transition-colors ${tab === t.id || (tab === 'data' && t.id === 'data') ? 'bg-[#f0f0f0] font-medium text-[#111]' : 'text-[#444] hover:bg-[#fafafa]'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={tab === t.id ? 'text-[#111]' : 'text-[#666]'}>{t.icon}</span>
                      {t.label}
                    </div>
                    {t.badge && <span className="text-[10px] uppercase tracking-wider font-semibold text-[#666]">{t.badge}</span>}
                    {t.hasMenu && t.id !== 'data' && <span className="text-[10px] text-[#888]">⌄</span>}
                    {t.hasMenu && t.id === 'data' && <span className="text-[10px] text-[#888]">{tab === 'data' ? '⌃' : '⌄'}</span>}
                  </button>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="p-10 max-w-5xl">
            <div className="flex justify-between items-start mb-10">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl bg-[#0f172a] flex items-center justify-center flex-shrink-0 border border-[#eaeaea] shadow-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                  <span className="text-[10px] text-cyan-400 z-10 font-mono tracking-widest opacity-80 mt-8">CITYPULSE</span>
                  <div className="absolute top-3 w-8 h-[2px] bg-cyan-400 rotate-[-15deg]" />
                  <div className="absolute top-2 left-6 w-[2px] h-8 bg-blue-500 rotate-[45deg]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight">CityPulse</h1>
                    <Edit2 size={14} className="text-[#888] cursor-pointer" />
                  </div>
                  <p className="text-[13px] text-[#666] mt-1.5 max-w-2xl leading-relaxed">
                    Your digital guardian for real-time safety and incident reporting. SafeHaven empowers you to report unsafe conditions, view live incident maps, and receive critical alerts, creating a safer environment for everyone.
                  </p>
                  <p className="text-[12px] text-[#888] mt-1">Created 6 months ago</p>
                </div>
              </div>
              <div className="flex gap-2 text-[#888]">
                <button className="p-1.5 hover:bg-gray-100 rounded-md"><Star size={18} /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded-md"><Edit2 size={18} /></button>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button className="flex items-center gap-2 bg-white border border-[#eaeaea] shadow-sm px-4 py-1.5 rounded-md text-[13.5px] font-medium hover:bg-gray-50 transition-colors">
                Open App
              </button>
              <button className="flex items-center gap-2 bg-white border border-[#eaeaea] shadow-sm px-4 py-1.5 rounded-md text-[13.5px] font-medium hover:bg-gray-50 transition-colors">
                <Share size={14} /> Share App
              </button>
            </div>

            <div className="grid grid-cols-[1.5fr_1fr] gap-6">
              <div className="space-y-6">
                <div className="bg-white border border-[#eaeaea] rounded-lg p-5 shadow-sm">
                  <h3 className="font-semibold text-[15px] mb-1">App Visibility</h3>
                  <p className="text-[13px] text-[#666] mb-4">Control who can access your application</p>

                  <div className="border border-[#eaeaea] rounded-md p-2.5 flex justify-between items-center mb-4 bg-white cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-2 text-[14px]"><Globe size={16} className="text-[#666]" /> Public</div>
                    <span className="text-[#888] text-xs">⌄</span>
                  </div>

                  <label className="flex items-center gap-2 text-[13.5px] cursor-pointer">
                    <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    Require login to access
                  </label>
                </div>

                <div className="bg-white border border-[#eaeaea] rounded-lg p-5 shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-[15px] mb-1">Platform Badge</h3>
                    <p className="text-[13px] text-[#666]">The "Edit with Base44" badge is currently visible on your app.</p>
                  </div>
                  <button className="flex items-center gap-2 bg-white border border-[#eaeaea] shadow-sm px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-gray-50">
                    <X size={14} /> Hide Badge
                  </button>
                </div>
              </div>

              <div>
                <div className="bg-white border border-[#eaeaea] rounded-lg p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-[15px] mb-1">Invite Users</h3>
                      <p className="text-[13px] text-[#666]">Grow your user base by inviting others</p>
                    </div>
                    <Users size={18} className="text-[#888]" />
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 border border-[#eaeaea] rounded-md py-2 text-[13.5px] font-medium hover:bg-gray-50">Copy Link</button>
                    <button className="flex-1 bg-blue-600 text-white rounded-md py-2 text-[13.5px] font-medium hover:bg-blue-700">Send Invites</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="p-8 max-w-[1200px]">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                <p className="text-[14px] text-[#666] mt-1">Manage the app's users and their roles</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 border border-[#eaeaea] bg-white rounded-md hover:bg-gray-50"><Settings size={16} /></button>
                <button className="bg-[#111] text-white px-4 py-1.5 rounded-md text-[13.5px] font-medium">Invite User</button>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <button className="bg-white border border-[#eaeaea] shadow-sm px-10 py-1.5 rounded-md text-[13.5px] font-medium">Users</button>
              <button className="text-[#666] px-4 py-1.5 rounded-md text-[13.5px]">Pending requests</button>
            </div>

            <div className="bg-white border border-[#eaeaea] rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#eaeaea] flex justify-between items-center">
                <h3 className="font-medium text-[15px]">Users</h3>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 text-[#888]" size={14} />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by Email or Name" className="pl-8 pr-4 py-1.5 text-[13px] border border-[#eaeaea] rounded-md focus:outline-none w-64" />
                  </div>
                  <button className="text-[13px] border border-[#eaeaea] rounded-md px-3 flex items-center gap-1.5 bg-[#fcfcfc]">all roles ⌄</button>
                </div>
              </div>
              <table className="w-full text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-[#eaeaea] text-[#666] bg-[#fafafa]">
                    <th className="font-normal px-4 py-3 w-[25%]">Name</th>
                    <th className="font-normal px-4 py-3 w-[15%]">Role</th>
                    <th className="font-normal px-4 py-3 w-[25%]">Email</th>
                    <th className="font-normal px-4 py-3 w-[15%]">phone</th>
                    <th className="font-normal px-4 py-3 w-[15%]">location</th>
                    <th className="font-normal px-4 py-3 w-[5%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr className="border-b border-[#eaeaea]">
                      <td colSpan="6" className="px-4 py-8 text-center text-[#666]">No users found.</td>
                    </tr>
                  )}
                  {filteredUsers.map((u, i) => (
                    <tr key={u.id || i} className="border-b border-[#eaeaea] hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {editingUser?.id === u.id ?
                          <input className="border border-[#ccc] px-2 py-1 text-sm rounded w-full" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} />
                          : <div className="font-medium text-[#111]">{u.name}</div>
                        }
                      </td>
                      <td className="px-4 py-3 text-[#555]">
                        {editingUser?.id === u.id ?
                          <select className="border border-[#ccc] px-2 py-1 text-sm rounded" value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}><option>admin</option><option>user</option></select>
                          : u.role
                        }
                      </td>
                      <td className="px-4 py-3 text-[#555]">
                        {editingUser?.id === u.id ?
                          <input className="border border-[#ccc] px-2 py-1 text-sm rounded w-full" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} />
                          : u.email
                        }
                      </td>
                      <td className="px-4 py-3 text-[#888]">
                        {editingUser?.id === u.id ?
                          <input className="border border-[#ccc] px-2 py-1 text-sm rounded w-full" value={editingUser.phone} onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })} />
                          : (u.phone || '-')
                        }
                      </td>
                      <td className="px-4 py-3 text-[#888]">{u.location || '-'}</td>
                      <td className="px-4 py-3 flex justify-end gap-2 items-center h-[52px]">
                        {editingUser?.id === u.id ? (
                          <>
                            <button onClick={() => saveUser(editingUser)} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded"><Check size={16} /></button>
                            <button onClick={() => setEditingUser(null)} className="text-gray-500 hover:bg-gray-100 p-1.5 rounded"><X size={16} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setEditingUser(u)} className="text-gray-500 hover:text-black hover:bg-gray-100 p-1.5 rounded"><Edit2 size={14} /></button>
                            <button onClick={() => deleteUser(u.id)} className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={14} /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DATA */}
        {tab === 'data' && (
          <div className="p-8 max-w-5xl">
            <h1 className="text-2xl font-semibold tracking-tight mb-6">Database Table: <span className="text-blue-600 font-mono text-xl">{dataTab}</span></h1>
            <div className="bg-white border border-[#eaeaea] rounded-lg shadow-sm p-8 flex flex-col items-center justify-center text-center h-[400px]">
              <Database size={48} className="text-[#ccc] mb-4" />
              <h3 className="font-medium text-lg">No rows found in {dataTab}</h3>
              <p className="text-[#666] text-[14px] mt-2 max-w-sm">This table exists in the database but currently contains no records. Add rows via your application or API.</p>
              <button className="mt-6 bg-[#111] text-white px-4 py-2 rounded-md text-[13.5px] font-medium">Add Row</button>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {tab === 'analytics' && (
          <div className="p-8 max-w-[1200px]">
            <div className="flex justify-between items-end mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
              <div className="text-[13px] text-emerald-600 font-medium flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> 1 Live visitors</div>
            </div>

            <div className="flex gap-6 mb-6 border-b border-[#eaeaea]">
              <button className="pb-2 border-b-2 border-black font-medium text-[14px]">Traffic Overview</button>
              <button className="pb-2 text-[#666] text-[14px] hover:text-black">Sales Overview</button>
            </div>

            <div className="bg-white border border-[#eaeaea] rounded-lg shadow-sm p-5 mb-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <button className="border border-[#eaeaea] rounded-md p-1.5 bg-gray-50"><Settings size={14} /></button>
                  <button className="border border-[#eaeaea] rounded-md px-3 py-1 bg-white text-[13px] flex items-center gap-1.5">Last 7 days ⌄</button>
                  <button className="border border-[#eaeaea] rounded-md px-3 py-1 bg-white text-[13px] flex items-center gap-1.5 text-[#666]">Filter</button>
                </div>
                <button className="bg-[#111] text-white px-3 py-1.5 rounded-md text-[13px] font-medium flex items-center gap-1.5"><span className="text-lg leading-none">+</span> Add event</button>
              </div>

              <div className="flex gap-12 mb-8">
                <div>
                  <div className="text-[13px] text-[#666] mb-1">Total Visits ⓘ</div>
                  <div className="text-2xl font-semibold">45 <span className="text-emerald-500 text-sm font-medium ml-1">↑ 27%</span></div>
                </div>
                <div>
                  <div className="text-[13px] text-[#666] mb-1">Unique Visitors ⓘ</div>
                  <div className="text-2xl font-semibold">9 <span className="text-emerald-500 text-sm font-medium ml-1">↑ 20%</span></div>
                </div>
                <div>
                  <div className="text-[13px] text-[#666] mb-1">Visit Duration ⓘ</div>
                  <div className="text-2xl font-semibold">3.6 seconds <span className="text-emerald-500 text-sm font-medium ml-1">↑ 494%</span></div>
                </div>
              </div>

              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData}>
                    <defs>
                      <linearGradient id="colorO" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} dy={10} />
                    <Tooltip cursor={{ stroke: '#ccc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} />
                    <Area type="monotone" dataKey="visitors" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorO)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Page Traffic */}
              <div className="bg-white border border-[#eaeaea] rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4 text-[13px] font-medium">Page Traffic <span className="text-xs text-[#888]">•••</span></div>
                <div className="space-y-3">
                  {[
                    { name: '/dashboard', v: 92 },
                    { name: '/Navigation', v: 42 },
                    { name: '/BangaloreCityOverview', v: 23 },
                    { name: '/NearbyEvents', v: 16 }
                  ].map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-[13px] relative z-10 w-full group">
                      <div className="absolute inset-y-0 left-0 bg-blue-50 -z-10 rounded" style={{ width: `${p.v}%` }} />
                      <span className="py-1.5 px-2 truncate group-hover:text-blue-600">{p.name}</span>
                      <span className="py-1.5 px-2 text-[#666]">{p.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Country */}
              <div className="bg-white border border-[#eaeaea] rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4 text-[13px] font-medium">Country <span className="text-xs text-[#888]">•••</span></div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[13px] relative z-10 w-full group">
                    <div className="absolute inset-y-0 left-0 bg-blue-50 -z-10 rounded w-[100%]" />
                    <span className="py-1.5 px-2 flex items-center gap-2">🇮🇳 India</span>
                    <span className="py-1.5 px-2 text-[#666]">48</span>
                  </div>
                </div>
              </div>

              {/* OS */}
              <div className="bg-white border border-[#eaeaea] rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4 text-[13px] font-medium">Operating System <span className="text-xs text-[#888]">•••</span></div>
                <div className="space-y-3">
                  {[
                    { name: 'Windows', v: 41, w: '90%' },
                    { name: 'Android', v: 4, w: '10%' }
                  ].map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-[13px] relative z-10 w-full group">
                      <div className="absolute inset-y-0 left-0 bg-blue-50 -z-10 rounded" style={{ width: p.w }} />
                      <span className="py-1.5 px-2">{p.name}</span>
                      <span className="py-1.5 px-2 text-[#666]">{p.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referrer */}
              <div className="bg-white border border-[#eaeaea] rounded-lg shadow-sm p-4 row-span-2 flex flex-col">
                <div className="flex justify-between items-center mb-4 text-[13px] font-medium">Referrer <span className="text-xs text-[#888]">•••</span></div>
                <div className="space-y-3 flex-1">
                  {[
                    { name: 'Direct', v: 27, w: '100%' },
                    { name: 'https://preview-sandbox...', v: 6, w: '25%' },
                    { name: 'https://appverter.com/', v: 4, w: '15%' },
                    { name: 'https://preview-sandbox...', v: 3, w: '10%' }
                  ].map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-[13px] relative z-10 w-full group">
                      <div className="absolute inset-y-0 left-0 bg-blue-50 -z-10 rounded" style={{ width: p.w }} />
                      <span className="py-1.5 px-2 truncate w-[75%]">{p.name}</span>
                      <span className="py-1.5 px-2 text-[#666]">{p.v}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-8 border border-dashed border-[#ccc] rounded-lg text-center text-[#666] hover:bg-gray-50 flex flex-col items-center justify-center gap-1 text-[13px]">
                  <span className="text-xl">+</span>
                  <span className="font-medium text-black">Create custom event</span>
                  <span className="text-xs text-[#888]">Measure specific actions users take in your app.</span>
                </button>
              </div>

              {/* Devices */}
              <div className="bg-white border border-[#eaeaea] rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4 text-[13px] font-medium">Devices <span className="text-xs text-[#888]">•••</span></div>
                <div className="space-y-3">
                  {[
                    { name: 'desktop', v: 44, w: '95%' },
                    { name: 'mobile', v: 4, w: '10%' }
                  ].map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-[13px] relative z-10 w-full group">
                      <div className="absolute inset-y-0 left-0 bg-blue-50 -z-10 rounded" style={{ width: p.w }} />
                      <span className="py-1.5 px-2">{p.name}</span>
                      <span className="py-1.5 px-2 text-[#666]">{p.v}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECURITY */}
        {tab === 'security' && (
          <div className="p-8 max-w-5xl">
            <h1 className="text-[17px] font-semibold tracking-tight mb-2">App Security</h1>
            <p className="text-[13.5px] text-[#666] mb-8">Configure row-level security policies to control who can access your app's data</p>

            <div className="bg-white border border-[#eaeaea] rounded-lg shadow-sm p-4 flex justify-between items-center mb-10">
              <div>
                <div className="font-medium text-[14.5px]">Scan Issues</div>
                <div className="text-[13px] text-[#666]">Scan typically takes a few minutes to complete</div>
              </div>
              <button className="bg-[#111] text-white px-4 py-2 rounded-md text-[13.5px] font-medium">Start Security Check</button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[15px] font-medium flex items-center gap-2"><Database size={16} /> Data Entities</h2>
              <button className="border border-[#eaeaea] rounded-md px-3 py-1 bg-white text-[12px] flex items-center gap-1.5 bg-gray-50 shadow-sm"><span className="w-1.5 h-1.5 bg-[#888] rounded-full" /> 9 entities</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {TABLES.map((t) => (
                <div key={t} className="bg-white border border-[#eaeaea] rounded-lg shadow-sm p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-medium text-[13.5px]">{t}</span>
                    <span className="border border-[#eaeaea] bg-gray-50 text-[10px] uppercase font-bold text-[#666] px-2 py-0.5 rounded shadow-sm">Public</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12.5px] text-[#ef4444]">
                    <span className="w-4 h-4 rounded-full border border-[#ef4444] text-center leading-none flex items-center justify-center text-[10px]">!</span>
                    All users have full access
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div className="p-8 max-w-4xl">
            {settingsTab === 'app_settings' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white border border-[#eaeaea] rounded-lg shadow-sm">
                  <div className="p-5 border-b border-[#eaeaea]">
                    <h3 className="text-[14px] font-medium mb-4">App Info</h3>
                    <div className="flex justify-between items-center bg-[#fafafa] border border-[#eaeaea] rounded-md p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#0f172a] border border-[#eaeaea] flex items-center justify-center relative overflow-hidden flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                          <span className="text-[6px] text-cyan-400 z-10 font-mono tracking-widest opacity-80 mt-4">CITYPULSE</span>
                        </div>
                        <span className="text-[13px] font-medium">App Logo</span>
                      </div>
                      <button className="text-[13px] font-medium hover:bg-white border border-transparent hover:border-[#eaeaea] hover:shadow-sm px-3 py-1.5 rounded transition">Edit Logo</button>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-[13.5px] font-medium">App description</h3>
                      <button className="text-[#888] hover:text-black hover:bg-gray-100 p-1.5 rounded"><Edit2 size={14} /></button>
                    </div>
                    <p className="text-[13px] text-[#666] leading-relaxed">
                      Your digital guardian for real-time safety and incident reporting. SafeHaven empowers you to report unsafe conditions, view live incident maps, and receive critical alerts, creating a safer environment for everyone.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[#eaeaea] rounded-lg shadow-sm p-5">
                  <h3 className="text-[14px] font-medium mb-6">General Settings</h3>

                  <div className="mb-6 flex justify-between items-center">
                    <div>
                      <div className="text-[13.5px] font-medium">Main Page</div>
                      <div className="text-[12px] text-[#888]">Set the default landing page for your app</div>
                    </div>
                    <button className="border border-[#eaeaea] bg-white text-[13px] px-3 py-1.5 rounded flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/5">
                      Dashboard ⌄
                    </button>
                  </div>

                  <hr className="border-[#eaeaea] mb-6" />

                  <div className="mb-6 flex justify-between items-start">
                    <div>
                      <div className="text-[13.5px] font-medium">App Visibility</div>
                      <div className="text-[12px] text-[#888]">Control who can access your application</div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <button className="border border-[#eaeaea] bg-white text-[13px] px-3 py-1.5 rounded flex items-center gap-2 hover:bg-gray-50">
                        <Globe size={14} className="text-[#666]" /> Public ⌄
                      </button>
                      <label className="flex items-center gap-2 text-[12.5px] cursor-pointer">
                        <div className="w-[14px] h-[14px] bg-black rounded-[3px] flex items-center justify-center">
                          <svg width="8" height="6" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        Require login to access
                      </label>
                    </div>
                  </div>

                  <hr className="border-[#eaeaea] mb-6" />

                  <div className="mb-6 flex justify-between items-center">
                    <div>
                      <div className="text-[13.5px] font-medium">Platform Badge</div>
                      <div className="text-[12px] text-[#888]">Show or hide the "Edit with Base44" badge on your app.</div>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#f97316] bg-[#fff7ed] px-2 py-0.5 rounded-sm w-max border border-[#ffedd5]">
                        <span>💎</span> Hiding this badge is available on paid plans. <a href="#" className="underline">Upgrade plan</a>
                      </div>
                    </div>
                    <div className="w-9 h-5 bg-black rounded-full p-0.5 cursor-pointer flex justify-end">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>

                  <hr className="border-[#eaeaea] mb-6" />

                  <div className="mb-6 flex justify-between items-center">
                    <div>
                      <div className="text-[13.5px] font-medium">Entity Creator Visibility</div>
                      <div className="text-[12px] text-[#888]">Show or hide who created each record in your app's data tables.</div>
                    </div>
                    <div className="w-9 h-5 bg-black rounded-full p-0.5 cursor-pointer flex justify-end">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>

                  <hr className="border-[#eaeaea] mb-6" />

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[13.5px] font-medium">Clone App</div>
                      <div className="text-[12px] text-[#888]">Create a duplicate of this app</div>
                    </div>
                    <button className="border border-[#eaeaea] bg-white text-[13px] font-medium px-4 py-1.5 rounded flex items-center gap-2 hover:bg-gray-50">
                      <Copy size={14} className="text-[#666]" /> Create Copy
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-[#eaeaea] rounded-lg shadow-sm p-5">
                  <h3 className="text-[14px] font-medium mb-6">Advanced Capabilities</h3>

                  <div className="mb-6 flex justify-between items-center">
                    <div>
                      <div className="text-[13.5px] font-medium">AI Agents</div>
                      <div className="text-[12px] text-[#888]">Build AI agents into your app using Base44's AI agents infrastructure</div>
                    </div>
                    <div className="w-9 h-5 bg-[#eaeaea] rounded-full p-0.5 cursor-pointer flex justify-start">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>

                  <hr className="border-[#eaeaea] mb-6" />

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[13.5px] font-medium">Test Data</div>
                      <div className="text-[12px] text-[#888]">Use test data to safely test changes without affecting live data.</div>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#f97316] bg-[#fff7ed] px-2 py-0.5 rounded-sm w-max border border-[#ffedd5]">
                        <span>💎</span> Available only for Builder plan and above. <a href="#" className="underline">Upgrade plan</a>
                      </div>
                    </div>
                    <div className="w-9 h-5 bg-[#eaeaea] rounded-full p-0.5 cursor-pointer flex justify-start">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>

                <div className="border border-red-200 bg-red-50/50 rounded-lg p-5">
                  <h3 className="text-[14px] font-medium text-red-600 mb-4">Danger Zone</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[13.5px] font-medium">Delete App</div>
                      <div className="text-[12px] text-[#888]">Permanently remove this app and all its data</div>
                    </div>
                    <button className="border border-red-200 text-red-600 bg-white text-[13px] font-medium px-4 py-1.5 rounded hover:bg-red-50 transition">
                      Delete App
                    </button>
                  </div>
                </div>
              </div>
            )}

            {settingsTab === 'auth' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="mb-6 max-w-2xl">
                  <h2 className="text-[18px] font-semibold mb-1">Authentication</h2>
                  <p className="text-[13.5px] text-[#666]">Configure the authentication methods that members of your app can use to log in to CityPulse.</p>
                </div>

                <div className="flex flex-col gap-4 max-w-3xl">
                  {/* Email & Password */}
                  <div className="bg-white border border-[#eaeaea] rounded-lg p-4 flex justify-between items-center shadow-sm">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-[#111] text-white rounded-[10px] flex items-center justify-center">
                        <Mail size={18} />
                      </div>
                      <div>
                        <div className="text-[14px] font-medium tracking-tight">Email and password authentication</div>
                        <div className="text-[12.5px] text-[#666]">Members can log in with email and password</div>
                      </div>
                    </div>
                    <div className="w-11 h-6 bg-black rounded-full p-0.5 cursor-pointer flex justify-end">
                      <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>

                  {/* Google Auth with Sub-options */}
                  <div className="bg-white border border-[#eaeaea] rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 flex justify-between items-center bg-white z-10 relative">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 border border-[#eaeaea] rounded-[10px] flex items-center justify-center bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                          <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        </div>
                        <div>
                          <div className="text-[14px] font-medium tracking-tight">Google authentication</div>
                          <div className="text-[12.5px] text-[#666]">Members can log in with a Google account</div>
                        </div>
                      </div>
                      <div className="w-11 h-6 bg-black rounded-full p-0.5 cursor-pointer flex justify-end">
                        <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-1 border-t border-[#eaeaea]/50 bg-[#fafafa]">
                      <div className="flex items-center gap-2 mb-3 mt-3">
                        <div className="w-3.5 h-3.5 rounded-full border-[3px] border-[#111] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-black rounded-full" /></div>
                        <span className="text-[13px] font-medium">Use the default Base44 OAuth</span>
                      </div>
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-3.5 h-3.5 rounded-full border border-[#ccc] mt-1" />
                        <div>
                          <div className="text-[13px] text-[#666] flex items-center gap-2">
                            Use a custom OAuth from Google console
                            <span className="text-[10px] text-[#f97316] bg-[#fff7ed] px-1.5 py-0.5 rounded border border-[#ffedd5] font-medium">💎 Builder+</span>
                            <span className="text-[11px] text-[#f97316] hover:underline cursor-pointer">Upgrade now</span>
                          </div>
                          <div className="text-[12px] text-[#888] mt-0.5">Ensure users log in using your custom Google authentication. <a href="#" className="text-blue-500 underline">Here's how to set it up</a></div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button className="bg-[#888] text-white px-4 py-1.5 rounded-md text-[13px] font-medium cursor-not-allowed">Update</button>
                      </div>
                    </div>
                  </div>

                  {/* Microsoft */}
                  <div className="bg-white border border-[#eaeaea] rounded-lg p-4 flex justify-between items-center shadow-sm">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 border border-[#eaeaea] rounded-[10px] flex items-center justify-center shadow-sm">
                        <svg className="w-4 h-4" viewBox="0 0 21 21"><path d="M0 0h10v10H0V0zm11 0h10v10H11V0zM0 11h10v10H0V11zm11 0h10v10H11V11z" fill="#00a4ef" /></svg>
                      </div>
                      <div>
                        <div className="text-[14px] font-medium tracking-tight">Microsoft authentication</div>
                        <div className="text-[12.5px] text-[#666]">Members can log in with a Microsoft account</div>
                      </div>
                    </div>
                    <div className="w-11 h-6 bg-black rounded-full p-0.5 cursor-pointer flex justify-end">
                      <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="bg-white border border-[#eaeaea] rounded-lg p-4 flex justify-between items-center shadow-sm">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 border border-[#eaeaea] rounded-[10px] flex items-center justify-center shadow-sm bg-[#1877f2]">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                      </div>
                      <div>
                        <div className="text-[14px] font-medium tracking-tight">Facebook authentication</div>
                        <div className="text-[12.5px] text-[#666]">Members can log in with a Facebook account</div>
                      </div>
                    </div>
                    <div className="w-11 h-6 bg-black rounded-full p-0.5 cursor-pointer flex justify-end">
                      <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>

                  {/* Apple */}
                  <div className="bg-white border border-[#eaeaea] rounded-lg p-4 flex justify-between items-center shadow-sm">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 border border-[#eaeaea] rounded-[10px] flex items-center justify-center text-black shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.62-1.503 3.608-2.981 1.15-1.682 1.625-3.311 1.649-3.398-.035-.013-3.185-1.222-3.215-4.881-.026-3.056 2.502-4.53 2.625-4.603-1.43-2.091-3.647-2.378-4.441-2.417-1.996-.134-4.008 1.216-5.463 1.216z" /><path d="M15.42 4.144c.839-1.015 1.405-2.427 1.251-3.829-1.196.048-2.66.797-3.53 1.846-.78.911-1.458 2.365-1.275 3.73 1.344.104 2.712-.729 3.554-1.747z" /></svg>
                      </div>
                      <div>
                        <div className="text-[14px] font-medium tracking-tight">Apple authentication</div>
                        <div className="text-[12.5px] text-[#666]">Members can log in with an Apple account</div>
                      </div>
                    </div>
                    <div className="w-11 h-6 bg-[#eaeaea] rounded-full p-0.5 cursor-pointer flex justify-start">
                      <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>

                  <div className="text-center text-[#888] text-[12px] my-2">or</div>

                  {/* SSO */}
                  <div className="bg-white border border-[#eaeaea] rounded-lg p-5 flex justify-between items-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] pb-6 hover:border-gray-300 transition-colors">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-[#0f172a] rounded-[10px] flex items-center justify-center flex-shrink-0 text-white shadow-md">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-[14.5px] font-medium tracking-tight text-[#111]">Single Sign-on (SSO)</div>
                          <span className="text-[10px] text-[#f97316] bg-[#fff7ed] px-2 py-0.5 rounded-sm border border-[#ffedd5] font-medium tracking-wide">✨ Elite Early Preview</span>
                        </div>
                        <div className="text-[13px] text-[#666] mt-1 max-w-sm">Allow members to log in using a custom SSO that fits your organization's needs.</div>
                        <a href="#" className="text-[13px] text-blue-600 font-medium hover:underline inline-block mt-1">Learn more about SSO</a>
                      </div>
                    </div>
                    <button className="border border-[#eaeaea] bg-white text-[13px] font-medium px-4 py-2 rounded-md hover:bg-gray-50 shadow-sm transition-all focus:ring-2 focus:ring-black/5">
                      Set Up
                    </button>
                  </div>

                </div>
              </div>
            )}

            {settingsTab === 'template' && (
              <div className="animate-in fade-in duration-300 h-full flex flex-col items-center justify-center text-center mt-20">
                <h1 className="text-2xl font-semibold tracking-tight mb-2">Turn your app into a reusable template</h1>
                <p className="text-[14.5px] text-[#666] max-w-lg mb-12">Make it easy for you and others to reuse your setup and quickly build their own apps.</p>

                <div className="border border-[#eaeaea] rounded-xl p-8 bg-white shadow-sm w-full max-w-3xl text-left mb-6">
                  <div className="text-[14.5px] font-medium mb-6">Which type of template do you want to create?</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-[1.5px] border-[#111] bg-[#fafafa] rounded-lg p-5 cursor-pointer relative shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                      <Globe size={18} className="text-[#111] mb-3" />
                      <h3 className="font-semibold text-[14.5px] mb-1.5 text-[#111]">Public template</h3>
                      <p className="text-[13px] text-[#666] leading-relaxed">Share this to all Base44 users. Choose whether to offer it for free or sell it.</p>
                    </div>
                    <div className="border border-[#eaeaea] bg-white rounded-lg p-5 cursor-pointer hover:border-gray-300 transition-colors">
                      <div className="mb-3 w-5 h-5 flex items-center justify-center opacity-70">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" /><path d="M14 2v6h6" /><path d="M3 15h6" /><path d="M3 18h6" /></svg>
                      </div>
                      <h3 className="font-medium text-[14.5px] mb-1.5">Workspace-only</h3>
                      <p className="text-[13px] text-[#888] leading-relaxed">Share this template exclusively with your workspace members.</p>
                    </div>
                  </div>
                </div>

                <button className="bg-[#888] text-white px-6 py-2.5 rounded-md text-[14px] font-medium opacity-90 hover:opacity-100 transition shadow-sm">
                  Create
                </button>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
