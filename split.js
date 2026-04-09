const fs = require('fs');
const path = require('path');

const p = 'c:/Users/dhanu/OneDrive/Desktop/8Th sem/city/react-ui/src/App.jsx';
let code = fs.readFileSync(p, 'utf8');

// The best way to split is to write a regex or manual string slice that finds functions.
// Actually, it's safer to just rewrite App.jsx correctly. But since I can't easily write 800 lines of App.jsx, I will use a structured refactor.
// This is somewhat complex. Instead of full regex, I will extract Auth.jsx and Page components.

fs.mkdirSync('c:/Users/dhanu/OneDrive/Desktop/8Th sem/city/react-ui/src/components', { recursive: true });

const shared = `import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { BANGALORE, ZONE_COLOR, SEV_COLOR } from '../data/mockData';

export const zoneIcon = ev => L.divIcon({
  className: '',
  html: \`<div style="width:32px;height:32px;border-radius:50%;background:\${ZONE_COLOR[ev.zone] || '#6366f1'};border:2.5px solid rgba(255,255,255,.75);display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 3px 10px rgba(0,0,0,.5)">\${ev.icon}</div>\`,
  iconSize: [32, 32], iconAnchor: [16, 16]
});

export const Bdg = ({ sev }) => <span style={{ background: SEV_COLOR[sev] || '#64748b', color: ['medium', 'low'].includes(sev) ? '#000' : '#fff', fontSize: '.68rem', fontWeight: 700, padding: '2px 9px', borderRadius: 999, textTransform: 'capitalize', flexShrink: 0 }}>{sev}</span>;

export function LiveMap({ events, height = '380px', circles = false, zoom = 12 }) {
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

export function nominatim(q, set) {
  if (q.length < 2) { set([]); return; }
  fetch(\`https://nominatim.openstreetmap.org/search?format=json&q=\${encodeURIComponent(q + ', Bengaluru')}&limit=5\`)
    .then(r => r.json()).then(d => set(d.map(p => ({ name: p.display_name.split(',').slice(0, 2).join(', '), lat: p.lat, lon: p.lon })))).catch(() => set([]));
}
`;

fs.writeFileSync('c:/Users/dhanu/OneDrive/Desktop/8Th sem/city/react-ui/src/components/shared.jsx', shared);

console.log("Shared written.");
