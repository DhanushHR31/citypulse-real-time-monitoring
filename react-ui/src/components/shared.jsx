import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { ZONE_COLOR, SEV_COLOR } from '../data/mockData';

export function zoneIcon(ev) {
    const color = ZONE_COLOR[ev.zone] || '#94a3b8';
    return L.divIcon({
        className: '',
        html: `<div style="width:32px;height:32px;border-radius:50%;background:${color};border:2.5px solid rgba(255,255,255,.7);display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 3px 8px rgba(0,0,0,.45);cursor:pointer">${ev.icon}</div>`,
        iconSize: [32, 32], iconAnchor: [16, 16]
    });
}

export function SevBadge({ sev }) {
    return (
        <span style={{
            background: SEV_COLOR[sev] || '#64748b', color: sev === 'medium' ? '#000' : '#fff',
            fontSize: '.68rem', fontWeight: 700, padding: '2px 9px', borderRadius: 999,
            textTransform: 'capitalize', flexShrink: 0
        }}>{sev}</span>
    );
}

export function Card({ children, style = {}, className = '' }) {
    return <div className={`cp-card ${className}`} style={style}>{children}</div>;
}

export function PanelHeader({ children }) {
    return <div className="cp-panel-hdr">{children}</div>;
}

export function Btn({ children, onClick, disabled, style = {}, outline = false }) {
    return (
        <button onClick={onClick} disabled={disabled}
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: outline ? 'transparent' : 'var(--primary)',
                color: outline ? 'var(--primaryh)' : '#fff',
                border: outline ? '1px solid var(--primary)' : 'none',
                borderRadius: 9, padding: '9px 18px', fontSize: '.88rem', fontWeight: 700,
                cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .6 : 1,
                fontFamily: 'inherit', transition: 'all .2s', ...style
            }}>
            {children}
        </button>
    );
}

export function Input({ value, onChange, placeholder, type = 'text' }) {
    return (
        <input value={value} onChange={onChange} placeholder={placeholder} type={type}
            style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
                padding: '9px 13px', color: 'var(--text)', fontSize: '.88rem', width: '100%',
                outline: 'none', fontFamily: 'inherit'
            }} />
    );
}

export function LiveMap({ events, height = '340px', showCircles = false, zoom = 12, center }) {
    const BANGALORE = center || [12.9716, 77.5946];
    return (
        <MapContainer center={BANGALORE} zoom={zoom} style={{ height, width: '100%' }} zoomControl={true}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OSM" />
            {events.map(ev => (
                <Marker key={ev.id} position={[ev.lat, ev.lng]} icon={zoneIcon(ev)}>
                    <Popup>
                        <b style={{ color: SEV_COLOR[ev.sev] }}>{ev.icon} {ev.title}</b>
                        <p style={{ margin: '5px 0', fontSize: '.85em', color: '#555' }}>{ev.desc}</p>
                        <small style={{ color: '#888' }}>{ev.zone} · {ev.time}</small><br />
                        <SevBadge sev={ev.sev} />
                    </Popup>
                </Marker>
            ))}
            {showCircles && events.filter(e => e.sev === 'high' || e.sev === 'critical').map(ev => (
                <Circle key={ev.id} center={[ev.lat, ev.lng]} radius={400} color="#ef4444" fillOpacity={0.18} />
            ))}
        </MapContainer>
    );
}
