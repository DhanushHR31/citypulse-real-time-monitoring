export const BANGALORE = [12.9716, 77.5946];

export const ZONE_COLOR = {
    Central: '#60a5fa', North: '#4ade80', South: '#facc15',
    East: '#f87171', West: '#fb923c', 'IT/Tech': '#a78bfa',
    Industrial: '#94a3b8', Peripheral: '#64748b',
};

export const SEV_COLOR = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#22c55e' };

export const EVENTS = [
    { id: 1, title: 'Transformer blast', loc: 'MG Road, Central', zone: 'Central', sev: 'medium', type: 'Power', lat: 12.9752, lng: 77.6091, time: '8h ago', icon: '⚡', desc: 'Power outage affecting 200 homes.' },
    { id: 2, title: 'Metro work ongoing', loc: 'Brigade Road, Central', zone: 'Central', sev: 'medium', type: 'Works', lat: 12.9716, lng: 77.6076, time: '6h ago', icon: '🚧', desc: 'Night metro construction, lane closures.' },
    { id: 3, title: 'Event crowd', loc: 'Shivajinagar', zone: 'Central', sev: 'low', type: 'Festival', lat: 12.9880, lng: 77.5978, time: '3h ago', icon: '👥', desc: 'Large gathering at grounds, traffic slow.' },
    { id: 4, title: 'Power cut', loc: 'Shivajinagar', zone: 'Central', sev: 'medium', type: 'Power', lat: 12.9840, lng: 77.5960, time: '4h ago', icon: '⚡', desc: 'Scheduled maintenance causing outage.' },
    { id: 5, title: 'Women Safety Alert', loc: 'Whitefield IT Corridor', zone: 'East', sev: 'high', type: 'Crime', lat: 12.9698, lng: 77.7499, time: '2h ago', icon: '⚠️', desc: 'Increased security patrol needed.' },
    { id: 6, title: 'Heavy Traffic', loc: 'Silk Board Junction', zone: 'South', sev: 'medium', type: 'Accidents', lat: 12.9177, lng: 77.6228, time: '1h ago', icon: '🚦', desc: '45+ min delays. Use alternatives.' },
    { id: 7, title: 'Flash Flood Warning', loc: 'Bellandur Lake', zone: 'East', sev: 'critical', type: 'Floods', lat: 12.9261, lng: 77.6760, time: '30m ago', icon: '🌊', desc: 'Heavy rain causing waterlogging.' },
    { id: 8, title: 'Road accident', loc: 'Outer Ring Road', zone: 'East', sev: 'high', type: 'Accidents', lat: 12.9352, lng: 77.6834, time: '45m ago', icon: '🚗', desc: 'Multi-vehicle accident, 2km tailback.' },
    { id: 9, title: 'Crowd gathering', loc: 'Cubbon Park', zone: 'Central', sev: 'low', type: 'Rally', lat: 12.9796, lng: 77.5909, time: '2h ago', icon: '🎭', desc: 'Political rally, area cordoned.' },
    { id: 10, title: 'Fire incident', loc: 'Peenya Industrial', zone: 'North', sev: 'high', type: 'Fire', lat: 13.0284, lng: 77.5170, time: '1h ago', icon: '🔥', desc: 'Factory fire under control.' },
    { id: 11, title: 'Water supply cut', loc: 'Koramangala 5th Block', zone: 'South', sev: 'medium', type: 'Works', lat: 12.9352, lng: 77.6269, time: '5h ago', icon: '🚱', desc: 'Pipeline maintenance, restored by 6PM.' },
    { id: 12, title: 'Signal failure', loc: 'Hebbal Flyover', zone: 'North', sev: 'medium', type: 'Accidents', lat: 13.0359, lng: 77.5970, time: '3h ago', icon: '🚦', desc: 'Traffic light failure, police deployed.' },
    { id: 13, title: 'VIP convoy', loc: 'Raj Bhavan Road', zone: 'Central', sev: 'low', type: 'VIP', lat: 12.9998, lng: 77.5950, time: '1h ago', icon: '🚔', desc: 'State convoy, expect 15-min delay.' },
    { id: 14, title: 'Gas leak', loc: 'Indiranagar 100ft Rd', zone: 'East', sev: 'high', type: 'Fire', lat: 12.9784, lng: 77.6408, time: '2h ago', icon: '☠️', desc: 'LPG leak, area evacuated.' },
    { id: 15, title: 'Storm damage', loc: 'JP Nagar, South', zone: 'South', sev: 'medium', type: 'Weather', lat: 12.9063, lng: 77.5857, time: '4h ago', icon: '🌩️', desc: 'Fallen trees blocking road.' },
    { id: 16, title: 'Campus protest', loc: 'IISc Campus', zone: 'North', sev: 'low', type: 'Campus', lat: 13.0219, lng: 77.5671, time: '6h ago', icon: '📢', desc: 'Student demonstration.' },
    { id: 17, title: 'Hospital emergency', loc: 'Manipal Hospital', zone: 'West', sev: 'high', type: 'Hospital', lat: 12.9592, lng: 77.5487, time: '1h ago', icon: '🏥', desc: 'Mass casualty drill, ambulance lanes clear.' },
    { id: 18, title: 'Metro disruption', loc: 'Majestic Metro Station', zone: 'Central', sev: 'medium', type: 'Metro', lat: 12.9772, lng: 77.5707, time: '2h ago', icon: '🚇', desc: 'Signalling failure, 20-min delays.' },
];

export const ALERTS = [
    { id: 1, title: 'Women Safety Alert — Whitefield', desc: 'Increased security patrol in Whitefield IT corridor.', sev: 'high', expires: 'Feb 28, 8:26 PM', icon: '⚠️', zone: 'East' },
    { id: 2, title: 'Heavy Traffic — Silk Board', desc: 'Silk Board experiencing 45+ min delays.', sev: 'medium', expires: 'Feb 28, 12:26 AM', icon: '🚦', zone: 'South' },
    { id: 3, title: 'Flash Flood Warning — Bellandur', desc: 'Heavy rain causing waterlogging near Bellandur.', sev: 'critical', expires: 'Feb 27, 10:26 PM', icon: '🌊', zone: 'East' },
    { id: 4, title: 'Women Safety — Manyata Tech', desc: 'Report of suspicious activity near Manyata gates.', sev: 'high', expires: 'Feb 28, 9:00 PM', icon: '👮', zone: 'North' },
    { id: 5, title: 'Poor Lighting — 80ft Road', desc: 'Street lights out on 80ft Road, Indiranagar.', sev: 'medium', expires: 'Feb 28, 11:00 PM', icon: '💡', zone: 'East' },
];

export const SOCIAL_POSTS = [
    { id: 1, platform: 'twitter', verified: true, user: '@BlrTrafficPolice', loc: 'Silk Board', text: 'Silk board junction is a nightmare! 45 min wait. #BangaloreTraffic', time: '2m ago', tags: ['#BangaloreTraffic'], sev: 'high' },
    { id: 2, platform: 'twitter', verified: false, user: '@BengaluruNews', loc: 'Indiranagar', text: 'Giant pothole near 100ft road near CMH. Several bikes fell. #BBMP', time: '8m ago', tags: ['#BBMP'], sev: 'medium' },
    { id: 3, platform: 'facebook', verified: true, user: 'Marathahalli Residents', loc: 'Marathahalli', text: 'Heavy waterlogging near bridge. Cars stuck. #BangaloreRains', time: '15m ago', tags: ['#BangaloreRains'], sev: 'high' },
    { id: 4, platform: 'twitter', verified: false, user: '@MajesticBlr', loc: 'Majestic', text: 'Bus fire at Majestic Bus Station. All passengers evacuated. #MajesticFire', time: '22m ago', tags: ['#MajesticFire'], sev: 'critical' },
    { id: 5, platform: 'instagram', verified: true, user: '@blr_safety', loc: 'Whitefield', text: 'Road flooded near Phoenix Marketcity. Use service road.', time: '35m ago', tags: ['#Whitefield'], sev: 'medium' },
    { id: 6, platform: 'twitter', verified: false, user: '@HSRLayout_blr', loc: 'HSR Layout', text: 'Signal at 27th main broken for 3 hours. Massive jam.', time: '1h ago', tags: ['#HSRLayout'], sev: 'medium' },
];

export const ZONE_STATS = [
    { zone: 'Central', count: 16, color: '#60a5fa' },
    { zone: 'North', count: 8, color: '#4ade80' },
    { zone: 'South', count: 11, color: '#facc15' },
    { zone: 'East', count: 5, color: '#f87171' },
    { zone: 'West', count: 7, color: '#fb923c' },
    { zone: 'IT/Tech', count: 9, color: '#a78bfa' },
];

export const NAV = [
    { id: 'dashboard', label: 'Safety Dashboard', icon: '🛡️' },
    { id: 'navigation', label: 'Smart Navigation', icon: '🧭' },
    { id: 'nearby', label: 'Nearby Events', icon: '📍' },
    { id: 'social', label: 'Social Media Monitor', icon: '💬' },
    { id: 'reports', label: 'Report Center', icon: '📋' },
    { id: 'ai', label: 'AI Agent', icon: '🤖' },
    { id: 'overview', label: 'Bangalore City Overview', icon: '🏙️' },
    { id: 'myreports', label: 'My Reports', icon: '📄' },
    { id: 'alerts', label: 'Safety Alerts', icon: '🔔' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'apidocs', label: 'API Documentation', icon: '</>' },
    { id: 'profile', label: 'Profile', icon: '👤' },
];

export const EVENT_TYPES = ['All', 'Accidents', 'Floods', 'Fire', 'Crime', 'Works', 'Power', 'Weather', 'Festival', 'Rally', 'VIP', 'Metro', 'Campus', 'Hospital'];
export const RANGES = ['2km', '5km', '10km', '20km', '50km'];
export const ZONES = ['All Zones', 'Central', 'North', 'South', 'East', 'West', 'IT/Tech', 'Industrial', 'Peripheral'];
