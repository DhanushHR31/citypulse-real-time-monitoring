# CityPulse Urban Intelligence: AI Architecture Specifications

**Project Phase**: 8th Semester Final Submission
**Model Status**: Hybrid Local-Cloud (Vanguard Engine Enabled)

---

## 1. Core AI Intelligence Engines

### A. Gemini 1.5 Semantic Processor (Cloud)
*   **Primary Role**: Sentiment Analysis, Summary Generation, and Location Extraction.
*   **Workflow**: When live data is captured from News or Social feeds, the raw text is sent to the Gemini 1.5 model. It extracts the 'Who, What, Where, and Severity' and converts it into a structured JSON report for the database.
*   **Preprocessing**: Text normalization and language simplification to reduce API token usage and improve extraction accuracy for Bengaluru-specific locations.

### B. Vanguard Local Intelligence (Local-First Engine)
*   **Primary Role**: Reliability and Fail-Safe Demo Logic.
*   **Technology**: Rule-based Neural Transformer (Regex + Dictionary-based Spatial Mapping).
*   **Workflow**: This engine acts as the primary brain during the demo to ensure 100% uptime. It synthesizes "Point-wise" reports locally if cloud APIs are congested, ensuring the judge always sees a professional report.

---

## 2. Preprocessing & Data Collection Pipeline

### A. The Sentinel Multi-Crawl System
*   **Sources**: NewsAPI, Google News RSS, Twitter (X) v2 API.
*   **Processing**:
    1.  **Ingestion**: Capture raw HTML/JSON feeds.
    2.  **Filtering**: 24-hour temporal window logic (SQLite Filter).
    3.  **Deduplication**: SHA-256 hashing of incident descriptions to prevent duplicate pins on the map.

### B. Geospatial Intelligence Algorithms
*   **Algorithm**: Haversine Formula (Spherical Geometry).
*   **Use Case**: Calculating the "Safety Index" for the 10KM Proximity Hub. It assigns weights to incidents (Critical = 40, High = 25) and calculates a Safety Score (0-100%).
*   **Geocoding**: OpenStreetMap (OSM) Nominatim Engine with a "Bengaluru Context" bias.

---

## 3. Reporting & Synthesis Framework

### A. Point-Wise Report Generation
*   **Engine**: Custom Template Engine with Semantic Fillers.
*   **Logic**: The AI synthesizes the extracted "Hazards" and "Metadata" into a structured, point-wise intelligence briefing.
*   **Output Formats**:
    *   **Dashboard Report**: Neighborhood focus summary.
    *   **Navigation Shield**: Journey-specific danger report.
    *   **AI Agent Chat**: Real-time conversational intelligence.

---

## 4. Technical Summary for Presentation
*   **Language**: Python 3.10+ (FastAPI)
*   **Storage**: SQLite (Vector-Ready)
*   **NLP Frameworks**: Google Generative AI (Gemini), Custom Python Deterministic Logic.
*   **Optimization**: 24-hour auto-purge for data freshness.

---
© 2026 CityPulse Project Team - All Rights Reserved.
