# IndustrialGuard AI — Frontend Design Specification

**Stage:** Pre-development frontend specification  
**Scope:** Frontend only  
**Backend:** Not implemented  
**Data/API:** Use mock/local data only until backend integration is explicitly requested.

## 1. Product Identity

**IndustrialGuard AI** is a proposed AI-powered industrial safety monitoring platform. The frontend should help Safety Officers, Shift Supervisors, and Plant Managers understand site safety, inspect alerts, manage incidents, and review trends.

Core experience:

**Monitor → Understand → Act → Learn**

The UI must feel like a serious industrial safety operations product, not a generic admin dashboard.

## 2. Frontend-Only Boundary

### Build now
- React.js web application
- JavaScript
- Tailwind CSS
- Recharts
- Client-side routing
- Responsive desktop/tablet layouts
- Dashboard
- Sensors/status
- Alerts
- Incidents
- Incident detail/review
- Analytics
- Settings
- Site selector
- Reusable UI components
- Mock/local data and state

### Do NOT build now
- FastAPI backend
- REST API integration
- WebSocket connection
- SQLite/PostgreSQL
- Real authentication
- JWT
- ESP32 communication
- Actual sensor ingestion
- Real ML inference
- Actual computer-vision inference
- Email/SMS/buzzer integration
- Cloud deployment
- Backend business logic

The frontend may simulate live updates and alerts entirely in the browser for demonstration. Organize the code so future API/WebSocket integration can replace the mock layer without rewriting the UI.

## 3. Strict Technology Stack

Use only:
- React.js
- JavaScript
- Tailwind CSS
- Recharts
- React Router if routing is required
- Native browser/local state where useful

Do not introduce:
- Next.js
- Angular
- Vue
- Bootstrap
- Material UI
- Ant Design
- Chakra UI
- Streamlit
- Gradio
- backend frameworks
- database packages

Avoid unnecessary dependencies.

## 4. Visual Direction

Style: **industrial control room + modern enterprise SaaS + safety operations center**

The product should feel:
- industrial
- trustworthy
- modern
- technical
- calm in normal conditions
- highly visible during safety events
- professional enough for enterprise use

Avoid:
- neon cyberpunk
- gaming dashboards
- cartoon illustrations
- excessive glassmorphism
- excessive gradients
- huge decorative graphics
- generic robot/AI art
- overly dense tables

## 5. Color System

Use a restrained neutral foundation.

**Base**
- deep charcoal / near-black for navigation
- white/soft white for primary surfaces
- cool neutral grays for supporting content
- subtle blue accent for primary actions

**Safety states**
- SAFE → green
- WARNING → amber
- CRITICAL → red

Never use color alone to communicate severity. Combine color with text and an icon/marker.

Examples:
- `● SAFE`
- `▲ WARNING`
- `! CRITICAL`

## 6. Typography

Use a clean modern sans-serif.

Recommended hierarchy:
- App title: 24–30px
- Page title: 24–28px
- Section heading: 18–20px
- Card title: 14–16px
- Body: 14–15px
- Supporting text: 12–13px
- Critical metric/value: 28–40px

Prioritize readability over compactness.

## 7. Global Layout

Desktop-first application shell:

```text
┌──────────────────────────────────────────────────────────────┐
│ Site • System status • Notifications • User                 │
├──────────────┬───────────────────────────────────────────────┤
│ Sidebar      │ Main Content                                  │
│              │                                               │
│ Dashboard    │                                               │
│ Sensors      │                                               │
│ Alerts       │                                               │
│ Incidents    │                                               │
│ Analytics    │                                               │
│ Settings     │                                               │
└──────────────┴───────────────────────────────────────────────┘
```

Sidebar:
- IndustrialGuard wordmark
- Dashboard
- Sensors
- Alerts
- Incidents
- Analytics
- Settings
- User/role area
- active-route indicator

Header:
- selected site
- current system state
- notifications
- user avatar/name
- role

## 8. Dashboard — Primary Screen

Show:
- site selector
- system status banner
- overall risk score
- active alerts
- open incidents
- sensors online
- critical events today
- sensor cards
- risk trend
- active alerts list
- recent incidents

### Overall Risk Panel
Include:
- risk score
- SAFE/WARNING/CRITICAL
- timestamp
- short explanation

### Sensor Cards
Temperature, humidity, gas, smoke:
- current value
- unit
- status
- small trend indicator
- last updated time

### Charts
Use Recharts for:
- risk over time
- sensor trends
- incident counts where relevant

### Alerts
Show 3–5 latest:
- severity
- title
- source
- location
- timestamp
- action

### Incidents
Show:
- incident ID
- type
- severity
- status
- time
- action

All readings are synthetic/demo data at this stage.

## 9. Sensors Screen

Purpose: inspect environmental inputs.

Include:
- site selector
- health summary
- sensor cards
- sensor history charts
- last updated
- online/offline status

Example:

```text
GAS SENSOR
Normal
42 ppm
Updated 8 sec ago
```

Do not imply these are real industrial measurements.

## 10. Alerts Screen

Filters:
- severity
- site
- zone
- source
- status
- time range

Alert table:
- severity
- alert
- source
- zone
- time
- status
- action

Alert detail:
- event title
- severity
- source
- time
- evidence placeholder
- sensor context
- CV event summary
- recommended next step
- Open Incident action

Interactions are frontend-only.

## 11. Incidents Screen

Summary cards:
- Open
- Assigned
- Critical
- Resolved Today

Table:
- Incident ID
- Type
- Severity
- Site/Zone
- Created
- Assigned To
- Status
- Action

Incident detail:
- incident ID
- severity
- event timeline
- source data
- sensor context
- vision context
- evidence placeholder
- assignee
- notes
- status

Frontend-only actions:
- Assign
- Add note
- Escalate
- Resolve

## 12. Analytics Screen

Purpose: identify patterns and hotspots.

Use Recharts for:
1. risk score over time
2. alerts by severity
3. incidents by category
4. hazard frequency
5. resolution status
6. zone hotspot comparison

Metrics:
- average risk score
- critical incidents
- most frequent hazard
- highest-risk zone
- average resolution time

Do not use fabricated claims such as “40% safer” or “80% fewer incidents.”

## 13. Settings Screen

Frontend-only:
- profile information
- role display
- selected site
- notification preferences UI
- safety-threshold configuration UI mockup
- interface preferences

Do not claim that security-sensitive settings are persisted to a backend.

## 14. Users and Role UX

Planned roles:

### Safety Officer
Focus:
- live status
- alerts
- incidents
- trends

### Shift Supervisor
Focus:
- immediate alerts
- event context
- action notes
- incident closure/escalation

### Plant Manager
Focus:
- trends
- hotspots
- resolution metrics

For the frontend prototype, role switching can be simulated locally. Do not implement real authorization.

## 15. Core UX Flows

### Safety Officer
```text
Login placeholder
→ Select Site
→ Dashboard
→ Review Alert
→ Open Incident
→ Assign / Resolve
→ Review Analytics
```

### Shift Supervisor
```text
Alert
→ Inspect Event
→ Confirm Condition
→ Add Action Note
→ Close / Escalate
```

### Plant Manager
```text
Dashboard
→ Analytics
→ Identify Trend / Hotspot
→ Review Incidents
→ Decide Preventive Action
```

## 16. Component Architecture

Suggested structure:

```text
src/
├── assets/
├── components/
│   ├── layout/
│   ├── cards/
│   ├── charts/
│   ├── alerts/
│   ├── incidents/
│   ├── sensors/
│   └── common/
├── pages/
│   ├── Dashboard.jsx
│   ├── Sensors.jsx
│   ├── Alerts.jsx
│   ├── Incidents.jsx
│   ├── IncidentDetail.jsx
│   ├── Analytics.jsx
│   └── Settings.jsx
├── data/
│   └── mockData.js
├── hooks/
├── utils/
├── App.jsx
├── main.jsx
└── index.css
```

Keep mock data isolated from UI components.

## 17. Mock Data

Use realistic but clearly synthetic values.

Example:

```js
{
  temperature: 34.2,
  humidity: 58,
  gas: 41,
  smoke: 8,
  riskScore: 34,
  safetyState: "WARNING"
}
```

Optional browser-only simulation:
- update values periodically
- occasionally generate a warning
- open an alert
- change incident state locally

Never imply the values are from a real industrial facility.

## 18. Loading, Empty and Error States

Every major screen should include:
- loading state
- empty state
- error state

Examples:
- `Loading safety data...`
- `No active incidents`
- `Unable to load dashboard data`

Use generic frontend messages because no backend exists yet.

## 19. Accessibility

Use:
- semantic HTML
- keyboard navigation
- visible focus states
- sufficient contrast
- accessible icon labels
- severity text + icon + color
- readable chart context
- no color-only communication

## 20. Interaction Principles

Useful interactions:
- alert → detail
- incident → detail
- incident status → local state update
- site selector → switch mock data
- filters → local filtering
- charts → tooltips

Avoid:
- excessive animations
- decorative motion
- flashing/strobing critical alerts
- auto-playing content

## 21. Safety-State UX

### SAFE
`SAFE — No high-priority hazards detected`

### WARNING
`WARNING — Elevated gas reading detected`

### CRITICAL
`CRITICAL — Multiple safety signals require immediate review`

Do not present prototype thresholds as certified industrial safety limits.

## 22. AI Explanation UI

Keep AI explanations simple and transparent.

Example:

```text
Risk Score: 78 — CRITICAL

Contributing signals:
• Gas level elevated
• Temperature trending upward
• PPE event detected

Why this matters:
Multiple risk indicators are active at the same time.
```

Do not claim exact causes unless the underlying model actually supports that conclusion.

## 23. Future Backend Boundary

Use a frontend service layer:

```text
UI Components
      ↓
Frontend Service Layer
      ↓
Future REST API / WebSocket
```

For now the service layer should return local/mock data only.

## 24. Responsive Behaviour

Primary targets:
- desktop
- tablet

At smaller widths:
- collapse sidebar
- stack cards
- allow horizontal table scrolling
- preserve readable text

Mobile-native application is not part of v1.

## 25. Frontend Quality Checklist

- [ ] React.js only
- [ ] JavaScript
- [ ] Tailwind CSS
- [ ] Recharts
- [ ] No Streamlit/Gradio
- [ ] No backend code
- [ ] No database code
- [ ] No real API calls
- [ ] No fake production claims
- [ ] Dashboard is primary screen
- [ ] Alerts are easy to understand
- [ ] Incidents have a clear lifecycle
- [ ] Analytics are readable
- [ ] Safety states are explicit
- [ ] Desktop/tablet responsive
- [ ] Keyboard accessible
- [ ] Mock data isolated
- [ ] Reusable components
- [ ] Ready for future backend integration

## 26. Frontend Definition of Done

A user should be able to:

```text
Open app
→ Select site
→ View safety dashboard
→ Inspect sensor status
→ Review an alert
→ Open an incident
→ Assign / update / resolve locally
→ View analytics
→ Navigate across major screens
```

Everything can be powered by mock/local data at this stage.

The frontend must look and behave like a credible product prototype while remaining honest that the backend, real sensors, ML inference, and computer vision services are not connected yet.
