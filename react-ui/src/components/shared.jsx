import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { BANGALORE, SEV_COLOR } from '../data/mockData';

/* ─── Haversine distance (km) ─── */
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ─── Map tile configs ─── */
const TILES = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    label: '🌙 Dark',
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    label: '☀️ Light',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, GeoEye',
    subdomains: '',
    label: '🛰️ Satellite',
  },
  streets: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    label: '🗺️ Streets',
  },
};

/* ─── Severity-colored animated pin ─── */
export const zoneIcon = (ev, isDark = true) => {
  const color = SEV_COLOR[ev.sev] || '#6366f1';
  const borderColor = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)';
  const pulse = (ev.sev === 'critical' || ev.sev === 'high')
    ? `<div style="position:absolute;width:52px;height:52px;border-radius:50%;background:${color};opacity:0.25;animation:mapPulse 1.8s infinite;top:-8px;left:-8px;pointer-events:none;"></div>`
    : '';
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:36px;height:36px;">
        ${pulse}
        <div style="
          width:36px;height:36px;border-radius:50%;
          background:${color};
          border:2.5px solid ${borderColor};
          display:flex;align-items:center;justify-content:center;
          font-size:17px;
          box-shadow:0 4px 16px ${color}88, 0 2px 6px rgba(0,0,0,0.5);
          position:relative;z-index:2;
        ">${ev.icon}</div>
      </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
  });
};

/* ─── Severity badge ─── */
export const Bdg = ({ sev }) => (
  <span style={{
    background: SEV_COLOR[sev] || '#64748b',
    color: ['medium', 'low'].includes(sev) ? '#000' : '#fff',
    fontSize: '.68rem', fontWeight: 700,
    padding: '2px 9px', borderRadius: 999,
    textTransform: 'capitalize', flexShrink: 0,
  }}>{sev}</span>
);

/* ─── Map style switcher toolbar ─── */
function MapStyleBar({ mapStyle, setMapStyle }) {
  return (
    <div style={{
      position: 'absolute', top: 10, left: 10, zIndex: 1000,
      display: 'flex', gap: 4, flexWrap: 'wrap',
    }}>
      {Object.entries(TILES).map(([key, t]) => (
        <button
          key={key}
          onClick={() => setMapStyle(key)}
          style={{
            padding: '5px 10px', borderRadius: 7, fontSize: '.7rem', fontWeight: 700,
            background: mapStyle === key
              ? (key === 'dark' ? '#6366f1' : key === 'light' ? '#f1f5f9' : key === 'satellite' ? '#1e40af' : '#0f766e')
              : 'rgba(15,23,42,0.82)',
            color: mapStyle === key ? (key === 'light' ? '#1e293b' : '#fff') : '#cbd5e1',
            border: mapStyle === key ? '2px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.15)',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all .2s',
            boxShadow: mapStyle === key ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
          }}
        >{t.label}</button>
      ))}
    </div>
  );
}

/* ─── Ultra-Visibility User Icon ─── */
export const userIcon = () => L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:24px;height:24px;z-index:9999;">
      <div style="position:absolute;width:48px;height:48px;border-radius:50%;background:#3b82f6;opacity:0.3;animation:mapPulse 1.4s infinite;top:-12px;left:-12px;pointer-events:none;"></div>
      <div style="position:absolute;width:32px;height:32px;border-radius:50%;background:#fbbf24;opacity:0.2;animation:mapPulse 2.2s infinite;top:-4px;left:-4px;pointer-events:none;animation-delay:0.5s;"></div>
      <div style="
        width:24px;height:24px;border-radius:50%;
        background:#3b82f6;
        border:2.5px solid #fff;
        box-shadow:0 0 15px #3b82f6, 0 0 5px rgba(0,0,0,0.5);
        display:flex;align-items:center;justify-content:center;
        position:relative;z-index:10;
      ">
        <div style="width:7px;height:7px;background:#fff;border-radius:50%;"></div>
      </div>
      <div style="
        position:absolute;top:-28px;left:50%;transform:translateX(-50%);
        background:#2563eb;color:#fff;font-size:11px;font-weight:800;
        padding:2px 10px;border-radius:6px;border:1.5px solid #fff;
        white-space:nowrap;box-shadow:0 4px 10px rgba(0,0,0,0.4);
      ">YOU</div>
    </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

/* --- Map re-center helper --- */
function ChangeMapView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

/* ─── Premium LiveMap component ─── */
export function LiveMap({
  events = [],
  height = '380px',
  circles = false,
  zoom = 12,
  center = BANGALORE,
  userLoc = null,
  mapStyle = 'dark',
  setMapStyle,
  rangeKm = 0,         // 0 = no filter, show all
  showRangeCircle = false,
}) {
  const tile = TILES[mapStyle] || TILES.dark;
  const isDark = mapStyle === 'dark' || mapStyle === 'satellite';

  // Filter events by range from PROVIDED center
  const displayed = useMemo(() => {
    if (!rangeKm || rangeKm <= 0) return events;
    return events.filter(ev => {
      if (!ev.lat || !ev.lng) return false;
      return haversine(center[0], center[1], ev.lat, ev.lng) <= rangeKm;
    });
  }, [events, rangeKm, center]);

  const critCount = displayed.filter(e => e.sev === 'critical').length;
  const highCount = displayed.filter(e => e.sev === 'high').length;

  const popupStyle = isDark
    ? { bg: '#1e293b', border: 'rgba(255,255,255,0.12)', text: '#f1f5f9', muted: '#64748b' }
    : { bg: '#ffffff', border: 'rgba(0,0,0,0.15)', text: '#1e293b', muted: '#64748b' };

  return (
    <div style={{
      position: 'relative',
      borderRadius: 14,
      overflow: 'hidden',
      border: isDark ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(0,0,0,0.15)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
    }}>
      <style>{`
        @keyframes mapPulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          70%  { transform: scale(2.4); opacity: 0;   }
          100% { transform: scale(2.4); opacity: 0;   }
        }
        .leaflet-popup-content-wrapper {
          background: ${popupStyle.bg} !important;
          border: 1px solid ${popupStyle.border} !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important;
          color: ${popupStyle.text} !important;
        }
        .leaflet-popup-tip { background: ${popupStyle.bg} !important; }
        .leaflet-popup-close-button { color: #94a3b8 !important; top: 8px !important; right: 10px !important; }
        .leaflet-control-zoom a {
          background: ${isDark ? '#1e293b' : '#ffffff'} !important;
          border-color: ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)'} !important;
          color: ${isDark ? '#f1f5f9' : '#1e293b'} !important;
          font-weight: 700;
        }
        .leaflet-control-zoom a:hover {
          background: ${isDark ? '#334155' : '#f1f5f9'} !important;
        }
        .leaflet-control-attribution {
          background: ${isDark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.85)'} !important;
          color: ${isDark ? '#475569' : '#94a3b8'} !important;
          font-size: 10px !important;
          backdrop-filter: blur(6px) !important;
        }
        .leaflet-control-attribution a { color: #6366f1 !important; }
        .leaflet-bar { border-radius: 8px !important; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important; }
      `}</style>

      <MapContainer center={center} zoom={zoom} style={{ height, width: '100%' }} zoomControl={true}>
        <ChangeMapView center={center} />
        {/* Active tile layer */}
        <TileLayer
          key={mapStyle}
          url={tile.url}
          attribution={tile.attribution}
          subdomains={tile.subdomains || 'abc'}
          maxZoom={19}
        />

        {/* User location marker */}
        {userLoc && (
          <Marker position={userLoc} icon={userIcon()}>
            <Popup>
              <div style={{ fontWeight: 700, fontSize: '.9rem' }}>🚗 Your Current Location</div>
              <div style={{ fontSize: '.75rem', color: '#64748b' }}>Monitoring urban incidents in your vicinity.</div>
            </Popup>
          </Marker>
        )}

        {/* Range radius circle */}
        {showRangeCircle && rangeKm > 0 && (
          <Circle
            center={center}
            radius={rangeKm * 1000}
            pathOptions={{
              color: '#6366f1',
              fillColor: '#6366f1',
              fillOpacity: 0.04,
              weight: 2,
              dashArray: '6 8',
            }}
          />
        )}

        {/* Dashed critical rings */}
        {displayed.filter(e => e.sev === 'critical').map(ev => (
          <Circle key={`crit-${ev.id}`} center={[ev.lat, ev.lng]} radius={700}
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.06, weight: 1, dashArray: '4 6' }} />
        ))}

        {/* Optional coverage circles for high/critical */}
        {circles && displayed.filter(e => e.sev === 'high' || e.sev === 'critical').map(ev => (
          <Circle key={`cov-${ev.id}`} center={[ev.lat, ev.lng]} radius={450}
            pathOptions={{ color: SEV_COLOR[ev.sev], fillColor: SEV_COLOR[ev.sev], fillOpacity: 0.1, weight: 1.5 }} />
        ))}

        {/* Event markers */}
        {displayed.map(ev => (
          <Marker key={ev.id} position={[ev.lat, ev.lng]} icon={zoneIcon(ev, isDark)}>
            <Popup>
              <div style={{ minWidth: 190 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.5rem' }}>{ev.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '.9rem', color: SEV_COLOR[ev.sev] }}>{ev.title}</div>
                    <div style={{ fontSize: '.72rem', color: popupStyle.muted }}>{ev.zone || ''}{ev.time ? ` · ${ev.time}` : ''}</div>
                  </div>
                </div>
                {ev.desc && <div style={{ fontSize: '.8rem', color: popupStyle.muted, lineHeight: 1.6, marginBottom: 8, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, paddingTop: 8 }}>{ev.desc}</div>}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ background: SEV_COLOR[ev.sev] + '22', border: `1px solid ${SEV_COLOR[ev.sev]}55`, color: SEV_COLOR[ev.sev], padding: '2px 8px', borderRadius: 999, fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase' }}>{ev.sev}</span>
                  <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a78bfa', padding: '2px 8px', borderRadius: 999, fontSize: '.68rem' }}>{ev.type || ev.event_type || 'Event'}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map style switcher — top-left */}
      {setMapStyle && <MapStyleBar mapStyle={mapStyle} setMapStyle={setMapStyle} />}

      {/* Severity legend — top-right */}
      <div style={{
        position: 'absolute', top: 10, right: 10, zIndex: 1000,
        background: isDark ? 'rgba(15,23,42,0.82)' : 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(10px)',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.12)',
        borderRadius: 10, padding: '10px 12px',
        fontSize: '.72rem', color: isDark ? '#cbd5e1' : '#334155',
      }}>
        <div style={{ fontWeight: 700, fontSize: '.68rem', color: isDark ? '#94a3b8' : '#64748b', marginBottom: 8, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Severity</div>
        {[['critical', '#ef4444'], ['high', '#ef4444'], ['medium', '#f97316'], ['low', '#22c55e']].map(([s, c]) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block', flexShrink: 0, boxShadow: `0 0 6px ${c}88` }} />
            <span style={{ textTransform: 'capitalize' }}>{s}</span>
          </div>
        ))}
      </div>

      {/* Event counters — bottom-left */}
      <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1000, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <div style={{ background: isDark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.12)', borderRadius: 999, padding: '4px 12px', fontSize: '.72rem', color: isDark ? '#94a3b8' : '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          {displayed.length} events{rangeKm > 0 ? ` within ${rangeKm}km` : ''}
        </div>
        {critCount > 0 && (
          <div style={{ background: 'rgba(239,68,68,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 999, padding: '4px 12px', fontSize: '.72rem', color: '#fca5a5', fontWeight: 700 }}>
            🔴 {critCount} critical
          </div>
        )}
        {highCount > 0 && (
          <div style={{ background: 'rgba(249,115,22,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(249,115,22,0.4)', borderRadius: 999, padding: '4px 12px', fontSize: '.72rem', color: '#fdba74', fontWeight: 700 }}>
            🟠 {highCount} high
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Nominatim geocoder helper ─── */
export function nominatim(q, set) {
  if (q.length < 2) { set([]); return; }
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ', Bengaluru')}&limit=5`)
    .then(r => r.json())
    .then(d => set(d.map(p => ({ name: p.display_name.split(',').slice(0, 2).join(', '), lat: p.lat, lon: p.lon }))))
    .catch(() => set([]));
}
