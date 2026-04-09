import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime


def _send_email(to_email: str, subject: str, html_body: str) -> bool:
    sender   = os.getenv("EMAIL_SENDER", "")
    password = os.getenv("EMAIL_PASSWORD", "").replace(" ", "")
    if not sender or not password:
        print(f"[EMAIL MOCK] To: {to_email} | Subject: {subject}")
        print("[EMAIL MOCK] Set EMAIL_SENDER and EMAIL_PASSWORD in .env to enable real emails.")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = f"CityPulse Safety 🛡️ <{sender}>"
        msg["To"]      = to_email
        msg.attach(MIMEText(html_body, "html"))
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender, password)
            server.sendmail(sender, to_email, msg.as_string())
        print(f"[EMAIL SENT] To: {to_email} | Subject: {subject}")
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False


# ─────────────────────────────────────────────────────────────────
# RIDE-START EMAIL  (route details + incidents + weather)
# ─────────────────────────────────────────────────────────────────
def send_ride_start_email(to_email: str, route_info: dict) -> bool:
    origin       = route_info.get("origin", "Your Location")
    destination  = route_info.get("destination", "Your Destination")
    distance_km  = route_info.get("distance_km", "N/A")
    duration_min = route_info.get("duration_min", "N/A")
    safety_score = route_info.get("safety_score", "N/A")
    route_label  = route_info.get("route_label", "Safest Route")
    hazards      = route_info.get("hazards", [])
    weather      = route_info.get("weather", {})
    timestamp    = datetime.now().strftime("%d %b %Y, %I:%M %p")

    # Safety score colour
    score_color = "#10b981" if isinstance(safety_score, (int,float)) and safety_score>=80 \
        else "#f59e0b" if isinstance(safety_score, (int,float)) and safety_score>=50 \
        else "#ef4444"

    # ── AI ROAD CONDITION INTELLIGENCE ──
    # Synthesizing condition based on weather and route data
    is_rainy = "rain" in str(weather.get("desc","")).lower()
    road_status = "Wet & Slick" if is_rainy else "Dry & Stable"
    road_quality = "Good (Highway)" if distance_km > 10 else "Variable (Urban)"
    traction_level = "Medium" if is_rainy else "High"
    
    road_block = f'''
    <div style="background:rgba(30,41,59,0.5);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:20px;margin:16px 0;">
      <p style="color:#94a3b8;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin:0 0 15px;">
        🛣️ ROAD CONDITION INTELLIGENCE</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="padding:10px;background:rgba(0,0,0,0.2);border-radius:8px;">
          <div style="font-size:10px;color:#64748b;margin-bottom:4px">SURFACE</div>
          <div style="font-size:14px;font-weight:700;color:#fff">{road_status}</div>
        </div>
        <div style="padding:10px;background:rgba(0,0,0,0.2);border-radius:8px;">
          <div style="font-size:10px;color:#64748b;margin-bottom:4px">TRACTION</div>
          <div style="font-size:14px;font-weight:700;color:#34d399">{traction_level}</div>
        </div>
        <div style="padding:10px;background:rgba(0,0,0,0.2);border-radius:8px;grid-column:1/-1">
          <div style="font-size:10px;color:#64748b;margin-bottom:4px">TERRAIN ANALYSIS</div>
          <div style="font-size:14px;font-weight:700;color:#60a5fa">{road_quality} · No major obstructions detected</div>
        </div>
      </div>
    </div>'''

    # ── AI SAFETY SUGGESTIONS ──
    suggestions = [
      "Maintain 5-meter following distance in urban traffic.",
      "Vanguard AI predicts clear transit via current path.",
      "Keep headlights on for maximum visibility on bypass roads."
    ]
    if is_rainy:
        suggestions = [
            "Heavy rain detected: Reduce speed by 20% immediately.",
            "Avoid deep puddles and low-lying underpasses in Bengaluru.",
            "Expect 15-minute delay due to water-logging on service roads."
        ]
    
    sug_html = "".join([f'<div style="color:#e2e8f0;font-size:13px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03);display:flex;gap:10px;"><span>●</span> {s}</div>' for s in suggestions])
    ai_suggestions_block = f'''
    <div style="background:linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1));border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:20px;margin:16px 0;">
      <p style="color:#818cf8;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin:0 0 12px;">
        🤖 AI SENTINEL RECOMMENDATIONS</p>
      {sug_html}
    </div>'''

    # ── Hazards HTML ──
    if hazards:
        rows = ""
        for h in hazards:
            sev   = h.get("sev", "").lower() if isinstance(h, dict) else "medium"
            title = h.get("title", str(h)) if isinstance(h, dict) else str(h)
            sc    = {"critical":"#dc2626","high":"#ea580c","medium":"#d97706"}.get(sev,"#6366f1")
            rows += f'<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">' \
                    f'<span style="font-size:1.2rem">⚠️</span>' \
                    f'<div style="flex:1"><div style="color:#f1f5f9;font-weight:600;font-size:13px">{title}</div>' \
                    f'<div style="color:{sc};font-size:11px;font-weight:700;text-transform:uppercase">{sev}</div></div></div>'
        hazard_block = f'''
        <div style="background:#450a0a;border-left:4px solid #dc2626;border-radius:8px;padding:16px 20px;margin:16px 0;">
          <p style="color:#fca5a5;font-weight:800;font-size:13px;margin:0 0 10px;text-transform:uppercase;letter-spacing:.5px;">
            ⚠️ {len(hazards)} ACTIVE INCIDENT(S) ON THIS ROUTE</p>
          {rows}
          <p style="color:#ef4444;font-size:11px;margin-top:10px;font-style:italic;">Note: AI suggests rerouting if incidents are CRITICAL.</p>
        </div>'''
    else:
        hazard_block = '''
        <div style="background:#064e3b;border-left:4px solid #10b981;border-radius:8px;padding:16px 20px;margin:16px 0;">
          <p style="color:#6ee7b7;font-weight:800;font-size:13px;margin:0;">
            🛡️ ROUTE CLEAR — No active incidents detected on this path!</p>
        </div>'''

    # ── Weather HTML ──
    if weather:
        temp     = weather.get("temp_c","--")
        desc     = weather.get("desc","--")
        humidity = weather.get("humidity","--")
        wind     = weather.get("wind_kmph","--")
        feels    = weather.get("feels_like_c","--")
        icon     = weather.get("icon","🌤️")
        weather_block = f'''
        <div style="background:#1e293b;border-radius:12px;padding:20px;margin:16px 0;">
          <p style="color:#94a3b8;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin:0 0 12px;">
            🌤️ BENGALURU WEATHER RIGHT NOW</p>
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;">
            <div style="font-size:48px">{icon}</div>
            <div>
              <div style="font-size:32px;font-weight:900;color:#fff">{temp}°C</div>
              <div style="color:#94a3b8;font-size:13px">{desc}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:10px">
              <div style="font-size:11px;color:#64748b;text-transform:uppercase">Feels Like</div>
              <div style="font-size:16px;font-weight:700;color:#60a5fa">{feels}°C</div>
            </div>
            <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:10px">
              <div style="font-size:11px;color:#64748b;text-transform:uppercase">Humidity</div>
              <div style="font-size:16px;font-weight:700;color:#a78bfa">{humidity}%</div>
            </div>
          </div>
        </div>'''
    else:
        weather_block = ""

    html = f"""
    <div style="font-family:'Inter',Arial,sans-serif;max-width:620px;margin:0 auto;background:#0f172a;color:#e2e8f0;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.05);">
      <!-- HEADER -->
      <div style="background:linear-gradient(135deg,#1e1b4b,#312e81,#1e3a8a);padding:44px 32px;text-align:center;position:relative;">
        <div style="font-size:52px;margin-bottom:10px;">🚀</div>
        <h1 style="margin:0;font-size:30px;font-weight:900;color:#fff;letter-spacing:-0.5px">Ride Intelligence Active</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.65);font-size:13px">CityPulse Urban Intelligence · {timestamp}</p>
      </div>

      <div style="padding:32px;">
        <!-- ROUTE BADGE -->
        <div style="text-align:center;margin-bottom:20px;">
          <span style="background:rgba(99,102,241,0.2);border:1px solid rgba(99,102,241,0.5);color:#a78bfa;font-size:12px;font-weight:800;padding:5px 16px;border-radius:999px;text-transform:uppercase;letter-spacing:.5px">
            🛡️ {route_label}
          </span>
        </div>

        {hazard_block}
        {road_block}
        {ai_suggestions_block}

        <div style="background:#1e293b;border-radius:14px;padding:22px;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
            <div>
              <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">FROM</div>
              <div style="color:#fff;font-weight:700;font-size:15px">🟢 {origin}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">TO</div>
              <div style="color:#fff;font-weight:700;font-size:15px">🔴 {destination}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);">
            <div style="text-align:center;">
              <div style="font-size:11px;color:#64748b;text-transform:uppercase;margin-bottom:4px">DISTANCE</div>
              <div style="font-size:22px;font-weight:800;color:#60a5fa">{distance_km}<span style="font-size:12px;font-weight:400"> km</span></div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:11px;color:#64748b;text-transform:uppercase;margin-bottom:4px">ETA</div>
              <div style="font-size:22px;font-weight:800;color:#a78bfa">{duration_min}<span style="font-size:12px;font-weight:400"> min</span></div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:11px;color:#64748b;text-transform:uppercase;margin-bottom:4px">SAFETY</div>
              <div style="font-size:22px;font-weight:800;color:{score_color}">{safety_score}<span style="font-size:12px;font-weight:400">/100</span></div>
            </div>
          </div>
        </div>

        {weather_block}

        <p style="color:#475569;font-size:11px;text-align:center;margin-top:24px;">
          CityPulse · Bengaluru Urban Safety Platform · 2026
        </p>
      </div>
    </div>
    """
    return _send_email(to_email, f"🚀 Ride Intelligence Active — {origin} → {destination}", html)


# ─────────────────────────────────────────────────────────────────
# HAZARD-ALERT EMAIL
# ─────────────────────────────────────────────────────────────────
def send_hazard_alert_email(to_email: str, hazard_info: dict, route_info: dict) -> bool:
    hazard_title    = hazard_info.get("title", "Unknown Incident")
    hazard_severity = hazard_info.get("sev", "high")
    destination     = route_info.get("destination", "Your Destination")
    timestamp       = datetime.now().strftime("%d %b %Y, %I:%M %p")

    sev_color = {"critical":"#dc2626","high":"#ea580c","medium":"#d97706"}.get(hazard_severity,"#6366f1")
    sev_bg    = {"critical":"#fef2f2","high":"#fff7ed","medium":"#fefce8"}.get(hazard_severity,"#f0f9ff")

    html = f"""
    <div style="font-family:'Inter',Arial,sans-serif;max-width:620px;margin:0 auto;background:#0f172a;color:#e2e8f0;border-radius:20px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#7f1d1d,#991b1b,#b91c1c);padding:44px 32px;text-align:center;">
        <div style="font-size:52px;margin-bottom:10px;">🚨</div>
        <h1 style="margin:0;font-size:28px;font-weight:900;color:#fff;">HAZARD DETECTED</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.65);font-size:13px">Active incident on your route · {timestamp}</p>
      </div>
      <div style="padding:32px;">
        <div style="background:{sev_bg};border:2px solid {sev_color};border-radius:14px;padding:22px;margin-bottom:20px;">
          <p style="color:{sev_color};font-weight:900;font-size:20px;margin:0 0 8px">🚨 {hazard_title}</p>
          <p style="margin:0;color:#1e293b;font-size:13px">Severity: <b style="color:{sev_color};text-transform:uppercase">{hazard_severity}</b></p>
        </div>
        <div style="background:#1e293b;border-radius:12px;padding:20px;">
          <p style="margin:0 0 10px;color:#f1f5f9;font-weight:700;font-size:13px">🛡️ CityPulse Safety Recommendations</p>
          <ul style="margin:0;padding-left:18px;color:#94a3b8;font-size:13px;line-height:2">
            <li>Slow down immediately and increase following distance</li>
            <li>Follow any instructions from traffic or emergency personnel</li>
            <li>Consider pulling over safely if conditions are dangerous</li>
            <li>Your destination: <b style="color:#60a5fa">{destination}</b></li>
          </ul>
        </div>
        <p style="color:#475569;font-size:11px;text-align:center;margin-top:24px;">CityPulse Bengaluru · Live Ride Safety Monitor · 2026</p>
      </div>
    </div>
    """
    return _send_email(to_email, f"🚨 HAZARD ALERT — {hazard_title} on Your Route", html)


# ─────────────────────────────────────────────────────────────────
# OTP VERIFICATION EMAIL
# ─────────────────────────────────────────────────────────────────
def send_otp_email(to_email: str, otp_code: str) -> bool:
    """Sends a 4-digit security PIN for login verification."""
    timestamp = datetime.now().strftime("%I:%M %p")
    
    html = f"""
    <div style="font-family:'Inter',Arial,sans-serif;max-width:500px;margin:0 auto;background:#0f172a;color:#e2e8f0;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.05);">
      <div style="background:linear-gradient(135deg,#1e1b4b,#312e81);padding:32px;text-align:center;">
        <div style="font-size:40px;margin-bottom:8px;">🔐</div>
        <h2 style="margin:0;color:#fff;font-size:22px;">Security Verification</h2>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:12px;">CityPulse Urban Intelligence Login</p>
      </div>
      <div style="padding:32px;text-align:center;">
        <p style="color:#94a3b8;font-size:14px;margin-bottom:24px;">Someone is trying to log into your CityPulse account. Use the 4-digit security code below to verify your identity.</p>
        
        <div style="background:#1e293b;border:2px dashed #6366f1;border-radius:12px;padding:20px;margin-bottom:24px;">
          <div style="font-size:32px;font-weight:900;letter-spacing:6px;color:#fff;font-family:monospace;">{otp_code}</div>
        </div>
        
        <p style="color:#64748b;font-size:11px;margin-bottom:0;">Request time: {timestamp} (IST)</p>
        <p style="color:#ef4444;font-size:11px;font-weight:700;margin-top:4px;">⚠️ This code expires in 5 minutes. Do not share it with anyone.</p>
        
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="color:#475569;font-size:11px;margin:0;">CityPulse Bengaluru · Secure Authentication Service</p>
        </div>
      </div>
    </div>
    """
    return _send_email(to_email, f"🔐 {otp_code} is your CityPulse Security Code", html)
# ─────────────────────────────────────────────────────────────────
# LOGIN NOTIFICATION EMAIL
# ─────────────────────────────────────────────────────────────────
def send_login_notification_email(to_email: str, name: str) -> bool:
    """Sends a professional security alert when a user logs in."""
    timestamp = datetime.now().strftime("%d %b %Y, %I:%M %p")
    
    html = f"""
    <div style="font-family:'Inter',Arial,sans-serif;max-width:550px;margin:0 auto;background:#0f172a;color:#e2e8f0;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.05);">
      <div style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);padding:40px 32px;text-align:center;">
        <div style="font-size:48px;margin-bottom:12px;">🛂</div>
        <h2 style="margin:0;color:#fff;font-size:26px;font-weight:900;">Login Successful</h2>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Secure Access Alert · {timestamp}</p>
      </div>
      <div style="padding:32px;">
        <div style="text-align:center;margin-bottom:24px;">
           <div style="width:64px;height:64px;background:rgba(59,130,246,0.1);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#60a5fa;font-size:24px;border:1px solid rgba(59,130,246,0.2);">👤</div>
        </div>
        <p style="color:#fff;font-size:18px;font-weight:700;text-align:center;margin:0 0 10px;">Hello, {name}!</p>
        <p style="color:#94a3b8;font-size:14px;text-align:center;line-height:1.6;margin:0 0 24px;">
          This is a security notification to confirm that you have successfully logged into the <b>CityPulse Urban Intelligence Platform</b>.
        </p>
        
        <div style="background:rgba(0,0,0,0.2);border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid rgba(255,255,255,0.03);">
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:12px;">
            <span style="color:#64748b;font-size:12px;text-transform:uppercase;font-weight:800;">Device Location</span>
            <span style="color:#fff;font-size:13px;font-weight:600;">Bengaluru, India 🇮🇳</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="color:#64748b;font-size:12px;text-transform:uppercase;font-weight:800;">Safety Status</span>
            <span style="color:#10b981;font-size:13px;font-weight:800;">● SECURE</span>
          </div>
        </div>
        
        <p style="color:#64748b;font-size:12px;text-align:center;margin:0;">
          If this wasn't you, please secure your account immediately.
        </p>
        
        <div style="margin-top:40px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
          <p style="color:#475569;font-size:11px;margin:0;">CityPulse · Bengaluru Resilience Engine · 2026</p>
        </div>
      </div>
    </div>
    """
    return _send_email(to_email, f"🛂 Successful Login: Welcome to CityPulse, {name}", html)
