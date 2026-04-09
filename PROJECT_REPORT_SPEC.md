# 🛡️ CityPulse: Urban Intelligence & Safety Platform
### 8th Semester Project Documentation

---

## 1. Executive Summary
**CityPulse** is a decentralized, AI-driven urban safety and intelligence platform designed to enhance citizen safety in Bangalore. The platform integrates real-time navigation, AI-based incident reporting, and centralized administrative oversight to provide a "safety-first" routing experience.

## 2. Technical Stack (The "Tech Stack")

### 🎨 Frontend (User & Admin)
- **React.js (v18)**: Core UI framework for a responsive, component-based architecture.
- **Leaflet.js**: High-performance interactive map engine for spatial data visualization.
- **Glassmorphism CSS**: Modern, premium aesthetics with translucent surfaces and vibrant gradients.
- **Recharts.js**: Real-time safety analytics and incident trend visualization in the Admin dashboard.

### ⚙️ Backend (Intelligence API)
- **FastAPI (Python)**: High-performance, asynchronous web framework for high-speed API handling.
- **SQLAlchemy (SQLite)**: Local persistence for user credentials and incident history.
- **Firebase Realtime Database**: Cloud-based synchronization for cross-platform data persistence and live state sharing.
- **Pydantic**: Data validation and strict typing for incoming report payloads.

### 🤖 Artificial Intelligence & Maps
- **Google Gemini Pro (via RapidAPI)**: NLP engine for preprocessing raw reports into structured, actionable data.
- **OSRM (Open Source Routing Machine)**: Industrial-grade routing engine for multi-alternative route calculation.
- **Nominatim API**: Reverse geocoding for translating map coordinates into human-readable Bangalore addresses.

---

## 3. Data Collection & Preprocessing Pipeline

### 📥 Data Collection
Data is collected through three primary streams:
1.  **User Reports**: Citizens submit raw text, images, or videos of urban hazards (floods, accidents, road blockages).
2.  **Social Monitor**: Automated scraping of live safety-related status updates (simulated via Social Monitor module).
3.  **GPS Momentum**: Real-time device metadata (Lat/Lng) captured via `navigator.geolocation`.

### 🧠 AI Preprocessing
When a user submits a "Raw Incident Report":
1.  The report is sent to the **Gemini-Pro NLP Engine**.
2.  The AI extracts: **Event Type**, **Severity (Critical/High/Medium)**, **Location Name**, and a **Concise Summary**.
3.  It assigns a **Map Icon** (e.g., 🌊 for flood, 🚗 for accident).
4.  **Pin Prediction**: The AI maps the incident to the precise GPS coordinates provided by the user's map picker or current position.

---

## 4. Smart Navigation & Route Mapping

### 🧭 Multi-Alternative Routing
- The system calculates up to **3 alternative routes** for any destination using the OSRM engine.
- **AI Safety Scoring**: Every route is analyzed against the **SQLite Incident Database**.
- **Penalty Logic**: Routes passing through "Critical" incident zones receive a heavy score penalty.
- **Result**: The user sees a "Safest Route" with a **100-point AI Reliability Score**.

### 🗺️ Map Visibility & Modes
- Users can switch between **Standard**, **Dark (Night Mode)**, and **Satellite** views.
- Active hazards are rendered as **Interactive Circles** on the map with a 500m "Danger Radius".

---

## 5. Intelligence Notification Engine

### 📧 User Live-Ride Notifications
The system implements a dual-stage notification logic via **SMTP (Gmail API)**:
1.  **Ride Initiation**: Upon selecting a "Safest Route" and starting a ride, the backend generates a rich HTML summary of the route, weather, and identified hazards.
2.  **Dynamic Hazard Pushing**: As the user moves, the system constantly monitors their GPS position. If they enter a 800m proximity to a new hazard, a **Priority Hazard Alert** is pushed to their email instantly.

---

## 6. Administrative Dashboard
The Admin portal serves as the command center for city authorities:
- **Live Incidents View**: A real-time, auto-refreshing feed of all AI-preprocessed reports.
- **Moderation Intelligence**: Admins can verify or dismiss AI-calculated severities.
- **Cloud Sync**: All verified data is pushed to **Firebase Realtime Database** to ensure the User App data remains globally consistent.

---

## 7. Security & Authentication
- **Verified Sessions**: User data is protected via local database authentication.
- **Authorized Push**: Notification emails are only sent to the verified email address linked to the active login ID, ensuring total user privacy and reliability.

---
**Prepared by:** [Dhanush] | **Department:** [Computer Science Engineering] | **Project Year:** 2026
