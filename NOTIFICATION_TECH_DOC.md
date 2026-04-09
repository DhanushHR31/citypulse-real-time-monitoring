# 🛡️ CityPulse: Intelligence Notification & Security Protocol
### Technical Architecture & Delivery Documentation

---

## 🚀 1. Notification Ecosystem Overview
The CityPulse notification system is a high-priority, event-driven module designed to bridge the gap between AI-detected urban hazards and direct citizen action. It utilizes professional delivery protocols to ensure safety alerts reach users during critical moments of their journey.

## ⚙️ 2. Core Delivery Technology
The system relies on a **Triple-Tier Notification Architecture**:

### A. SMTP Engine (Email Protocol)
- **Language**: Python 3.x
- **Library**: `smtplib` & `email.mime`
- **Gateway**: Google SMTP Relay (`smtp.gmail.com`)
- **Protocol**: **SMTP_SSL** (Secure Sockets Layer)
- **Port**: `465` (High-security encrypted tunnel)
- **Formatting**: Multi-part MIME templates with embedded CSS for premium branding.

### B. SMS Protocol (Simulation Layer)
- **Logic**: Real-time push to the user's registered phone number.
- **Presentation**: Simulated via terminal-streamed SMS packets for 8th-semester demonstration and offline capability.

### C. Geofencing Strategy (Proximity Pushing)
- **Tech Stack**: Haversine Formula (GPS Distance calculation).
- **Trigger**: System pushes an alert only when a user's `navigator.geolocation` coordinate is within **800 meters** of a critical incident.

---

## 🔐 3. Authentication Protocol (4-Digit OTP)
The system implements **MFA (Multi-Factor Authentication)** to secure urban data:
1.  **Generation**: The FastAPI backend generates a cryptographically random **4-digit numeric PIN**.
2.  **Persistence**: The PIN is stored in a `pending_otps` memory block with the user's session metadata.
3.  **Delivery**: Both Email and SMS triggers are fired simultaneously.
4.  **Verification**: The backend compares the user's input against the memory block before activating the JWT/Role session.

---

## 🏎️ 4. Live Ride Intelligence Pipeline
This is the most complex notification flow:
1.  **Data Integration**: System fetches **Live Bengaluru Weather** (via wttr.in) and **Route Incidents** (via SQLite).
2.  **HTML Synthesis**: A dynamic HTML template is generated, injecting:
    *   **AI Safety Score** (0-100%)
    *   **Temperature & Wind Speed**
    *   **Route Maneuver List**
3.  **Automated Push**: Sent instantly the second the user clicks "Start Ride".

---

## 🛠️ 5. Implementation Summary
| Feature | Technology Used |
| :--- | :--- |
| **Email Protocol** | SMTP over SSL (smtplib) |
| **Logic Layer** | FastAPI (Asynchronous Python) |
| **Security** | 4-Digit Numeric PIN (random.choices) |
| **Weather** | wttr.in API (JSON Integration) |
| **Maps & Routing** | Leaflet.js + OSRM Engine |
| **Frontend** | React 18 (Responsive Web) |

---
**Prepared by:** [Dhanush] | **Project:** CityPulse Urban Safety | 2026
