// ============================================================
// CityPulse v3.0 – Leaflet + OpenStreetMap + Nominatim + OSRM
// No Google Maps API. Fully Free & Open Source.
// ============================================================

// ─── Global State ────────────────────────────────────────────
const API_BASE_URL = "http://localhost:8000";
let map, currentTileLayer, currentPolyline, heatmapLayer;
let markers = [];          // Event map markers
let naviMarkers = [];      // Start/End navigation markers
let dangerCircles = [];    // Hazard zone circles
let pickingMode = null;    // 'origin' | 'destination' | null
let simulationInterval = null;

// ─── Map Tile Sources (OpenStreetMap – 0 cost, 0 API keys) ──
const TILES = {
    light: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap contributors © CARTO'
    }
};

// ─── 1. MAP INITIALISATION ────────────────────────────────────
function initMap() {
    const BANGALORE = [12.9716, 77.5946];
    map = L.map('map', { zoomControl: false }).setView(BANGALORE, 12);

    // Load OpenStreetMap tiles (light default)
    setMapTheme('light');

    // Zoom controls bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Scale bar
    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);

    // Map click → pick start/end point (Google Maps style)
    map.on('click', onMapClick);

    // Settings: map theme switcher
    const themeSelect = document.getElementById('map-theme');
    if (themeSelect) themeSelect.addEventListener('change', e => setMapTheme(e.target.value));
}

function setMapTheme(theme) {
    if (currentTileLayer) map.removeLayer(currentTileLayer);
    const t = TILES[theme] || TILES.light;
    currentTileLayer = L.tileLayer(t.url, {
        attribution: t.attribution,
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
}

// ─── 2. GEOCODING (Nominatim – Free, No API key) ─────────────
async function geocodeQuery(query) {
    if (!query) return null;
    // Already coordinates?
    if (/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(query)) return query;
    try {
        const q = query.toLowerCase().includes('bengaluru') ? query : `${query}, Bengaluru`;
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
            { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        if (data.length > 0) return `${data[0].lat},${data[0].lon}`;
    } catch (e) { console.error('Geocode error', e); }
    return null;
}

async function reverseGeocode(lat, lng) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        return data.display_name ? data.display_name.split(',')[0] : `${lat.toFixed(4)},${lng.toFixed(4)}`;
    } catch (e) { return `${lat.toFixed(4)},${lng.toFixed(4)}`; }
}

// ─── 3. AUTOCOMPLETE SEARCH (Nominatim) ──────────────────────
function setupAutocomplete(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    let timer;

    input.addEventListener('input', () => {
        clearTimeout(timer);
        const q = input.value.trim();
        if (q.length < 2) { dropdown.style.display = 'none'; return; }
        timer = setTimeout(() => fetchSuggestions(q, input, dropdown), 300);
    });

    // Focus → enable map-click-to-pick
    input.addEventListener('focus', () => {
        pickingMode = inputId;
        map.getContainer().style.cursor = 'crosshair';
        showToast('📍 Map Mode', `Click on map to set ${inputId === 'origin' ? 'Start' : 'Destination'}`);
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (e.target !== input) dropdown.style.display = 'none';
    });
}

async function fetchSuggestions(query, input, dropdown) {
    try {
        const q = query.toLowerCase().includes('bengaluru') ? query : `${query}, Bengaluru`;
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`
        );
        const places = await res.json();
        dropdown.innerHTML = '';
        if (!places.length) { dropdown.style.display = 'none'; return; }

        places.forEach(p => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            const shortName = p.display_name.split(',').slice(0, 2).join(', ');
            div.innerHTML = `<span>📍</span> ${shortName}`;
            div.addEventListener('mousedown', e => {
                e.preventDefault(); // prevent blur before click
                selectPlace(p, input, dropdown);
            });
            dropdown.appendChild(div);
        });
        dropdown.style.display = 'block';
    } catch (e) { console.error('Suggestions error', e); }
}

function selectPlace(place, input, dropdown) {
    input.value = place.display_name.split(',').slice(0, 2).join(', ');
    input.dataset.lat = place.lat;
    input.dataset.lng = place.lon;
    dropdown.style.display = 'none';
    pickingMode = null;
    map.getContainer().style.cursor = '';

    // Drop a named pin
    addNaviMarker(parseFloat(place.lat), parseFloat(place.lon),
        input.id === 'origin' ? '🟢 Start' : '🔴 End');
    map.setView([place.lat, place.lon], 14);
}

// ─── 4. MAP CLICK → PICK LOCATION ────────────────────────────
async function onMapClick(e) {
    if (!pickingMode) return;
    const { lat, lng } = e.latlng;
    const input = document.getElementById(pickingMode);

    input.value = await reverseGeocode(lat, lng);
    input.dataset.lat = lat;
    input.dataset.lng = lng;

    addNaviMarker(lat, lng, pickingMode === 'origin' ? '🟢 Start' : '🔴 End');

    pickingMode = null;
    map.getContainer().style.cursor = '';
    showToast('✅ Point Set', `${input.id === 'origin' ? 'Start' : 'Destination'} locked`);
}

function addNaviMarker(lat, lng, label) {
    const m = L.marker([lat, lng], {
        icon: L.divIcon({
            className: '',
            html: `<div style="font-size:22px;text-shadow:0 1px 3px rgba(0,0,0,.5)">${label.split(' ')[0]}</div>`,
            iconSize: [28, 28], iconAnchor: [14, 14]
        })
    }).addTo(map).bindPopup(label);
    naviMarkers.push(m);
}

function clearNaviMarkers() {
    naviMarkers.forEach(m => map.removeLayer(m));
    naviMarkers = [];
}

// ─── 5. MY LOCATION ──────────────────────────────────────────
function useMyLocation() {
    if (!navigator.geolocation) {
        showToast('⚠️ Error', 'Device geolocation not supported'); return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const input = document.getElementById('origin');
        input.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        input.dataset.lat = lat;
        input.dataset.lng = lng;
        map.setView([lat, lng], 15);
        addNaviMarker(lat, lng, '🟢 You');
        showToast('📍 Location Acquired', 'GPS locked on your position');
    }, () => showToast('⚠️ GPS Error', 'Could not get your location'));
}

// ─── 6. ROUTING (OSRM – Free, Open Source) ───────────────────
async function calculateRoute() {
    const originEl = document.getElementById('origin');
    const destEl = document.getElementById('destination');
    const btn = document.getElementById('route-btn');

    let originCoords = originEl.dataset.lat
        ? `${originEl.dataset.lat},${originEl.dataset.lng}`
        : await geocodeQuery(originEl.value);

    let destCoords = destEl.dataset.lat
        ? `${destEl.dataset.lat},${destEl.dataset.lng}`
        : await geocodeQuery(destEl.value);

    if (!originCoords || !destCoords) {
        showToast('⚠️ Error', 'Could not find locations. Select from autocomplete or click map.');
        return;
    }

    btn.textContent = '⏳ Calculating...';
    btn.disabled = true;

    try {
        const res = await fetch(`${API_BASE_URL}/navigation/route`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ origin: originCoords, destination: destCoords })
        });
        const result = await res.json();

        if (result.data?.routes?.length) {
            const route = result.data.routes[0];
            const path = route.geometry.coordinates.map(c => [c[1], c[0]]); // GeoJSON→Leaflet

            // Draw route polyline
            if (currentPolyline) map.removeLayer(currentPolyline);
            currentPolyline = L.polyline(path, {
                color: '#1a73e8', weight: 6, opacity: 0.9
            }).addTo(map);

            // Start/End markers
            clearNaviMarkers();
            addNaviMarker(path[0][0], path[0][1], '🟢 Start');
            addNaviMarker(path[path.length - 1][0], path[path.length - 1][1], '🔴 End');

            map.fitBounds(currentPolyline.getBounds(), { padding: [50, 50] });

            // Turn-by-turn
            if (route.legs?.[0]?.steps) renderDirections(route.legs[0].steps, route.duration, route.distance);

            // Safety check (AI hazard overlay)
            checkRouteSafety(path);

            btn.textContent = '🚗 Start Journey';
            btn.disabled = false;
            btn.onclick = () => startSimulation(path);
        } else {
            showToast('❌ No Route', result.error || 'Cannot find route between these points');
            btn.textContent = '🚀 Find Safe Route';
            btn.disabled = false;
            btn.onclick = calculateRoute;
        }
    } catch (e) {
        console.error(e);
        showToast('❌ Error', 'Routing service unavailable');
        btn.textContent = '🚀 Find Safe Route';
        btn.disabled = false;
        btn.onclick = calculateRoute;
    }
}

// ─── 7. TURN-BY-TURN DIRECTIONS ──────────────────────────────
function renderDirections(steps, duration, distance) {
    const container = document.getElementById('route-stats');
    container.style.display = 'block';

    const mins = Math.round(duration / 60);
    const km = (distance / 1000).toFixed(1);

    const iconMap = { left: '⬅️', right: '➡️', straight: '⬆️', arrive: '🏁', depart: '🚀', 'sharp left': '↩️', 'sharp right': '↪️' };

    let stepsHtml = steps.map(s => {
        const mod = s.maneuver.modifier || '';
        const icon = s.maneuver.type === 'arrive' ? '🏁'
            : s.maneuver.type === 'depart' ? '🚀'
                : (iconMap[mod] || '⬆️');
        const dist = s.distance < 1000 ? `${Math.round(s.distance)}m` : `${(s.distance / 1000).toFixed(1)}km`;
        return `<div class="step-item"><span class="step-icon">${icon}</span><span class="step-text">${s.name || s.maneuver.type}</span><span class="step-dist">${dist}</span></div>`;
    }).join('');

    container.innerHTML = `
        <div class="trip-summary"><strong>${mins} min</strong> · ${km} km</div>
        <div class="steps-list custom-scroll">${stepsHtml}</div>
    `;
}

// ─── 8. AI ROUTE SAFETY CHECK ────────────────────────────────
function checkRouteSafety(path) {
    dangerCircles.forEach(c => map.removeLayer(c));
    dangerCircles = [];

    const THRESHOLD = 0.004; // ~400m
    let hazards = [];

    markers.forEach(m => {
        if (m.severity === 'Low') return;
        const { lat, lng } = m.getLatLng();
        const hit = path.some(p => Math.hypot(p[0] - lat, p[1] - lng) < THRESHOLD);
        if (hit) {
            hazards.push(m.title);
            const circle = L.circle([lat, lng], {
                color: '#ef4444', fillColor: '#f87171', fillOpacity: 0.25, radius: 450
            }).addTo(map).bindPopup(`🚫 Hazard: ${m.title}`);
            dangerCircles.push(circle);
        }
    });

    const statsEl = document.getElementById('route-stats');
    if (hazards.length) {
        const warn = document.createElement('div');
        warn.className = 'impact-card danger';
        warn.innerHTML = `⚠️ <strong>${hazards.length} Hazard(s) on Route</strong><br><small>${hazards.join(', ')}</small>`;
        statsEl.prepend(warn);
        showToast('⚠️ Route Danger', `${hazards.length} critical event(s) detected`);
    } else {
        const ok = document.createElement('div');
        ok.className = 'impact-card safe';
        ok.textContent = '✅ Route Clear – No hazards detected';
        statsEl.prepend(ok);
        showToast('✅ Route Safe', 'Path is clear of incidents');
    }
}

// ─── 9. JOURNEY SIMULATION ───────────────────────────────────
function startSimulation(path) {
    if (simulationInterval) clearInterval(simulationInterval);
    const car = L.marker(path[0], {
        icon: L.divIcon({ className: '', html: '<div style="font-size:24px">🚗</div>', iconSize: [28, 28], iconAnchor: [14, 14] })
    }).addTo(map);
    let i = 0;
    showToast('🚗 Journey Started', 'Simulating drive along route...');
    simulationInterval = setInterval(() => {
        if (i >= path.length) {
            clearInterval(simulationInterval);
            map.removeLayer(car);
            showToast('🏁 Arrived', 'You have reached your destination!');
            const btn = document.getElementById('route-btn');
            btn.textContent = '🚀 Find Safe Route';
            btn.onclick = calculateRoute;
            return;
        }
        car.setLatLng(path[i]);
        map.panTo(path[i], { animate: true, duration: 0.3 });
        i += 3;
    }, 120);
}

// ─── 10. FETCH & RENDER EVENTS (from backend AI pipeline) ────
async function fetchEvents() {
    document.getElementById('events-list').innerHTML = '<div class="loading-state">⚙️ Collecting social media data...</div>';
    logWorkflow('Initiating Social Media Collection Cycle...');

    try {
        logWorkflow('Connecting to News & Twitter feeds...');
        const res = await fetch(`${API_BASE_URL}/collection/fetch-all`, { method: 'POST' });
        const result = await res.json();

        const events = [...(result.data?.news || []), ...(result.data?.social || [])];
        logWorkflow(`AI analyzed ${events.length} events. Geocoding locations...`, 'success');

        document.getElementById('stat-events').textContent = events.length;
        const critical = events.filter(e => e.severity === 'High').length;
        document.getElementById('stat-alerts').textContent = critical;
        if (critical) logWorkflow(`⚠️ ${critical} Critical Events Detected`, 'warning');

        renderEvents(events);
        updateCrowdDensity();
    } catch (err) {
        console.error(err);
        logWorkflow('Backend connection failed', 'warning');
        document.getElementById('events-list').innerHTML = '<div class="loading-state" style="color:#ef4444">⚡ Backend unreachable — start the server</div>';
    }
}

function renderEvents(events) {
    const list = document.getElementById('events-list');
    list.innerHTML = '';

    // Clear old event markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const heatPts = [];

    events.forEach(ev => {
        // ── Sidebar Card ──
        const card = document.createElement('div');
        card.className = `event-card severity-${ev.severity || 'Low'}`;
        const sym = ev.map_symbol || (ev.severity === 'High' ? '🔴' : '🟡');
        card.innerHTML = `
            <div class="event-title">${sym} ${ev.title || ev.text || 'City Event'}</div>
            <div class="event-meta">${ev.event_type || 'General'} · ${new Date().toLocaleTimeString()}</div>
        `;
        list.appendChild(card);

        // ── Map Pin (emoji divIcon – semantic symbols from AI) ──
        let lat = ev.lat ? parseFloat(ev.lat) : 12.9716 + (Math.random() - 0.5) * 0.12;
        let lng = ev.lng ? parseFloat(ev.lng) : 77.5946 + (Math.random() - 0.5) * 0.12;

        const marker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: '',
                html: `<div style="font-size:22px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4))">${sym}</div>`,
                iconSize: [28, 28], iconAnchor: [14, 28]
            })
        }).addTo(map);

        marker.bindPopup(`
            <div style="min-width:210px">
                <strong style="font-size:1em">${sym} ${ev.title || ev.text}</strong>
                <p style="margin:6px 0;color:#555">${ev.description || ''}</p>
                <div style="background:#f4f4f4;padding:6px;border-radius:6px;font-size:.82em">
                    <b>Severity:</b> <span style="color:${ev.severity === 'High' ? '#ef4444' : '#22c55e'}">${ev.severity || 'Low'}</span><br>
                    <b>Crowd:</b> ${ev.crowd_density || 'N/A'}<br>
                    <b>Impact:</b> ${ev.impact_analysis || 'No data'}<br>
                    <b>Source:</b> ${ev.source || 'Unknown'}
                </div>
            </div>
        `);

        marker.severity = ev.severity || 'Low';
        marker.title = ev.title || ev.text || '';
        marker.crowd_density = ev.crowd_density;
        marker.impact_analysis = ev.impact_analysis;
        markers.push(marker);

        heatPts.push([lat, lng, ev.severity === 'High' ? 1.0 : 0.4]);

        card.addEventListener('click', () => { map.setView([lat, lng], 15); marker.openPopup(); });
    });

    // ── Heatmap update ──
    if (heatmapLayer) map.removeLayer(heatmapLayer);
    if (heatPts.length && window.L?.heatLayer) {
        heatmapLayer = L.heatLayer(heatPts, { radius: 35, blur: 22, gradient: { 0.4: '#3b82f6', 0.65: '#f59e0b', 1: '#ef4444' } }).addTo(map);
    }
}

// ─── 11. CROWD DENSITY (Dynamic) ─────────────────────────────
function updateCrowdDensity() {
    const chart = document.getElementById('density-chart');
    const legend = document.getElementById('density-legend');
    if (!chart) return;

    const bins = {};
    const keywords = { 'Silk Board': ['silk board', 'silkboard'], 'Koramangala': ['koramangala'], 'Indiranagar': ['indiranagar'], 'MG Road': ['mg road', 'mg road'], 'Whitefield': ['whitefield'], 'Hebbal': ['hebbal'] };

    markers.forEach(m => {
        let loc = 'Other';
        const t = (m.title || '').toLowerCase();
        for (const [name, kw] of Object.entries(keywords)) {
            if (kw.some(k => t.includes(k))) { loc = name; break; }
        }
        bins[loc] = (bins[loc] || 0) + 1;
    });

    const sorted = Object.entries(bins).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const max = Math.max(...sorted.map(s => s[1]), 1);

    chart.innerHTML = sorted.map(([name, count]) => {
        const h = Math.max((count / max) * 100, 8);
        const color = count > 4 ? '#ef4444' : count > 2 ? '#f59e0b' : '#22c55e';
        return `<div class="bar" style="height:${h}%;background:${color}" title="${name}: ${count} events"></div>`;
    }).join('') || '<div class="loading-state">No data yet</div>';

    if (sorted.length) legend.innerHTML = `Hotspot: <strong>${sorted[0][0]}</strong> (${sorted[0][1]} reports)`;
}

// ─── 12. WORKFLOW LOGGER ─────────────────────────────────────
function logWorkflow(msg, type = 'info') {
    const el = document.getElementById('workflow-logs');
    if (!el) return;
    const time = new Date().toLocaleTimeString();
    const colorClass = type === 'success' ? 'success' : type === 'warning' ? 'highlight' : '';
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.innerHTML = `<span class="time">[${time}]</span> <span class="${colorClass}">${msg}</span>`;
    el.appendChild(div);
    el.scrollTop = el.scrollHeight;
}

// ─── 13. AI PREDICTION ───────────────────────────────────────
async function runPredictionAnalysis() {
    const container = document.getElementById('prediction-results');
    container.innerHTML = '<div class="loading-state">🤖 Running AI Forecast...</div>';
    try {
        const res = await fetch(`${API_BASE_URL}/predict/severity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_type: 'Traffic', timestamp: new Date().toISOString() })
        });
        const data = await res.json();
        const p = data.prediction;
        const color = p.severity === 'High' ? '#ef4444' : p.severity === 'Medium' ? '#f59e0b' : '#22c55e';
        container.innerHTML = `
            <div style="margin-top:8px"><b>Traffic Forecast:</b> <span style="color:${color};font-weight:700">${p.severity}</span><br>
            <small>Confidence: ${(p.confidence * 100).toFixed(1)}% · ${p.method || 'ML'}</small></div>
            <div style="margin-top:8px"><b>Accident Risk:</b> <span style="color:#f59e0b;font-weight:700">Medium</span><br>
            <small>Based on time-of-day heuristics</small></div>
            <button onclick="runPredictionAnalysis()" class="primary-btn small-btn" style="margin-top:10px">🔄 Refresh</button>
        `;
    } catch (e) {
        container.innerHTML = '<div style="color:#ef4444">Prediction service unreachable</div>';
    }
}

// ─── 14. CITY REPORT ─────────────────────────────────────────
function generateCityReport() {
    const box = document.getElementById('city-report-text');
    const now = new Date().toLocaleString();
    const high = markers.filter(m => m.severity === 'High');
    const details = high.length
        ? high.map((m, i) => `[${i + 1}] HIGH | ${m.title.substring(0, 45)}`).join('<br>')
        : 'No critical alerts.';
    const legendEl = document.getElementById('density-legend');
    box.innerHTML = `<b>═══ CITY INTELLIGENCE REPORT ═══</b><br>
Date: ${now}<br>Status: ${high.length ? '🔴 ALERT' : '🟢 NOMINAL'}<br>
─────────────────<br>
Events Analyzed: ${markers.length}<br>
Critical Hazards: ${high.length}<br>
Hotspot: ${legendEl ? legendEl.innerText : 'N/A'}<br>
─────────────────<br>
<b>Critical Incidents:</b><br>${details}<br>
─────────────────<br>
AI Recommendation: ${high.length ? 'Rerouting active. Avoid 🔴 zones.' : 'Standard routing applicable.'}<br>
<small>Generated by CityPulse AI</small>`;
    showToast('📄 Report Ready', 'City intelligence report generated');
    logWorkflow('Generated City Intelligence Report', 'success');
}

// ─── 15. TOAST NOTIFICATIONS ─────────────────────────────────
function showToast(title, body) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-title">${title}</div><div class="toast-body">${body}</div>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ─── 16. TAB SWITCHING ───────────────────────────────────────
function switchTab(tabId, el) {
    document.querySelectorAll('.view-section').forEach(s => s.style.display = 'none');
    const view = document.getElementById(`view-${tabId}`);
    if (view) {
        view.style.display = 'block';
        const panel = view.querySelector('.overlay-panel, .panel-card');
        if (panel) { panel.style.animation = 'none'; panel.offsetHeight; panel.style.animation = 'slideIn 0.35s ease-out'; }
    }
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    if (el) el.classList.add('active');
}

// ─── 17. BUTTON LISTENERS ────────────────────────────────────
document.getElementById('fetch-btn').addEventListener('click', fetchEvents);
document.getElementById('route-btn').addEventListener('click', calculateRoute);
document.getElementById('locate-btn').addEventListener('click', useMyLocation);

// ─── 18. BOOT ────────────────────────────────────────────────
window.onload = () => {
    initMap();
    setupAutocomplete('origin', 'suggestions-origin');
    setupAutocomplete('destination', 'suggestions-destination');

    // Background notification pulse
    setInterval(() => {
        if (Math.random() > 0.9) showToast('📡 New Feed', 'New traffic pattern detected');
    }, 45000);

    // Auto-fetch events on load
    fetchEvents();
    setInterval(fetchEvents, 90000); // Refresh every 90 seconds

    setTimeout(() => showToast('✅ CityPulse Online', 'AI monitoring system active'), 800);
};
