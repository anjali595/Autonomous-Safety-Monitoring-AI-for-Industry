# IndustrialGuard AI — Frontend Architecture Guide

This document describes the frontend as it currently exists in `Frontend/`. It distinguishes implemented prototype behavior from planned backend or AI capabilities; the UI currently uses local mock data rather than a production API.

## 1. Frontend at a glance

The frontend is a single-page application (SPA) for an industrial safety monitoring dashboard. It provides a public product landing page, demo sign-in/sign-up screens, and an authenticated dashboard experience for monitoring sensor readings, risk, alerts, incidents, and analytics.

| Area | Current implementation |
|---|---|
| Rendering model | Client-rendered React SPA |
| Application language | JavaScript with JSX |
| Build and development server | Vite |
| Routing | React Router DOM |
| Styling | Tailwind CSS v4 utilities plus a project-wide CSS design system |
| Charts | Recharts |
| 3D auth visual | Three.js with OrbitControls; procedural geometry rendered in a WebGL canvas |
| Icons | Lucide React |
| Motion | Framer Motion is installed; page-level interaction also uses CSS animations and browser APIs |
| Data | In-memory mock data and service modules under `src/data/` and `src/services/` |
| Persistence | Browser `localStorage` for the selected theme |

Dependency versions are declared in `package.json`; this guide does not duplicate version numbers so it stays in sync with the manifest.

## 2. Technology choices and why

### React 19 and React DOM

React divides the interface into reusable components and keeps interactive state close to the UI that owns it. `ReactDOM.createRoot` mounts the app in `src/main.jsx`, and `React.StrictMode` is enabled during development.

### Vite 8 and the React plugin

Vite provides the local development server and production bundling. Its React plugin supports the JSX application source. The project exposes `dev`, `build`, and `preview` scripts in `package.json`, keeping everyday development and production-preview commands simple.

### React Router DOM 7

Client-side routing gives each dashboard area a URL without requiring a full page reload. `src/App.jsx` defines routes, while `AppLayout` provides the shared shell for authenticated pages. The public home, login, and signup pages are separate from that shell.

### Tailwind CSS 4 and custom CSS

Tailwind utility classes make responsive layout and component styling local and consistent. `src/index.css` defines the shared palette, typography, base styles, scrollbar treatment, and animation utilities. This hybrid approach is useful here: utilities handle most layout, while CSS variables make application-wide visual updates possible.

### Recharts

Recharts supplies responsive SVG charts for trends and category summaries. It composes chart primitives such as axes, grid lines, tooltips, and series, while sensor/status colors communicate the safety state.

### Three.js

Three.js powers the interactive procedural industrial safety operations scene shown in the desktop login and signup panels. Its five stages depict sensor monitoring, risk scoring, alert handling, incident response, and safety analytics. Animated monitor textures show simulated sensor telemetry, a zone status map, a risk score, and incident records. OrbitControls provide the scene interaction, while the component creates and disposes its WebGL resources with the page lifecycle. The large animation module is lazy-loaded and is not mounted on mobile layouts where the left visual panel is hidden. The scene is an illustration, not a live operational connection.

### Lucide React

Lucide provides consistent, lightweight interface icons for navigation, status, controls, and empty/error states. Icons are imported by name and rendered as React components.

### Browser APIs and local storage

The landing page uses `IntersectionObserver`, `requestAnimationFrame`, and passive scroll/resize listeners for reveal/counting and responsive behavior. The dark/light theme preference is stored in `localStorage` so it persists between visits.

## 3. Source layout and responsibilities

```text
Frontend/
├── index.html                      # Document metadata, font loading, React mount point
├── package.json                    # Dependencies and npm scripts
├── FRONTEND_ARCHITECTURE.md        # This guide
└── src/
    ├── main.jsx                    # React entry point and global CSS import
    ├── App.jsx                     # Authentication demo state, theme, routes, shared layout
    ├── index.css                   # Theme tokens, base styles, animations, chart styles
    ├── data/
    │   └── mockData.js             # Sites, users, sensors, risk, alerts, incidents, analytics, settings
    ├── services/
    │   ├── sensorService.js        # Mock sensor readings and simulated refreshes
    │   ├── riskService.js          # Mock risk assessment and recalculation
    │   ├── alertService.js          # Alert listing, filtering, acknowledgement, resolution
    │   ├── incidentService.js      # Incident listing and lifecycle operations
    │   └── analyticsService.js     # Mock analytics and KPI reads
    ├── components/
    │   ├── cards/                  # KPI, risk assessment, and sensor cards
    │   ├── charts/                 # Reusable Recharts visualisations
    │   ├── common/                 # Loading, error, empty, modal, and status components
    │   ├── layout/                 # Authenticated header, sidebar, and route shell
    │   └── ui/                     # Shared visual elements, auth factory panel, and 3D scene
    └── pages/
        ├── Home.jsx                # Public product landing page
        ├── Login.jsx / Signup.jsx  # Demo authentication entry screens
        ├── Dashboard.jsx           # Safety overview and periodic sensor refresh
        ├── Sensors.jsx             # Sensor readings and history
        ├── Alerts.jsx              # Alert filtering and actions
        ├── Incidents.jsx           # Incident list and status workflow
        ├── IncidentDetail.jsx      # Incident timeline, assignment, notes, escalation
        ├── Analytics.jsx           # Historical safety charts and summaries
        └── Settings.jsx            # Profile, notification, and threshold preferences
```

## 4. App composition and navigation

`src/main.jsx` mounts `App` into the `#root` element defined in `index.html` and imports the global stylesheet. `App` owns top-level state:

- The demo authenticated/not-authenticated state and current user.
- The selected plant/site and top-level system state.
- The theme preference and persistence.

When signed out, the router exposes the landing page and the login/signup routes. In the demo flow, the sign-in and sign-up pages call the shared login callback; this is UI state, not server-backed authentication. When signed in, `AppLayout` wraps the dashboard routes with the responsive `Sidebar` and `Header`. Unknown authenticated routes redirect to the dashboard.

The authenticated route set is:

| URL | Page | Purpose |
|---|---|---|
| `/` | Dashboard | Safety KPIs, overall risk, sensor summaries, trends, active alerts, recent incidents |
| `/sensors` | Sensors | Sensor status and readings |
| `/alerts` | Alerts | Alert list, severity/status filters, acknowledgement and resolution |
| `/incidents` | Incidents | Incident list and workflow |
| `/incidents/:id` | Incident detail | One incident's details and timeline |
| `/analytics` | Analytics | Historical charts and summary metrics |
| `/settings` | Settings | Profile, notification, and safety-threshold controls |

## 5. Theme system

The theme is owned by `App.jsx`. Dark mode is the default unless `ig-darkMode` is explicitly set to `"false"` in local storage. The preference is passed into the shared layout and header; the header's sun/moon control toggles it. On each change, the app:

1. Persists the preference in `localStorage`.
2. Adds/removes the `dark` class on the document root.
3. Updates the browser `color-scheme` so native controls match the selected theme.

`src/index.css` defines light colors in Tailwind's `@theme` design tokens and overrides the semantic surface, text, border, and status-background tokens under `html.dark`. Pages and reusable components that use semantic classes such as `bg-surface`, `text-text`, `border-border`, and `bg-warning-bg` then update together. Chart tooltips and axis/grid styling use the same theme tokens so chart surfaces remain legible as well.

The public marketing and authentication pages intentionally retain their dark visual identity. The switch is surfaced in the authenticated dashboard header, where the complete dashboard shell and token-based dashboard pages use the selected palette.

## 6. Styling, typography, and responsive behavior

The `@theme` section in `src/index.css` is the central design system: it defines display/body/monospace font families and shared brand, surface, text, border, and safety-status colors. `index.html` preconnects to Google Fonts and loads Space Grotesk, Plus Jakarta Sans, and JetBrains Mono. System fallbacks are included in the CSS.

Responsive behavior is primarily implemented with Tailwind breakpoints (`sm`, `md`, `lg`, and wider custom sizing). Examples include:

- A collapsible desktop sidebar and an off-canvas mobile sidebar.
- A mobile navigation menu on the landing page.
- Grid layouts that change column count as viewport space increases.
- Fluid type sizes using CSS `clamp()` helpers for hero, heading, body, and small text.
- Wider content limits for large displays and large-screen-specific spacing.

The landing page uses a shader background, section navigation, animated statistic counters, and a centered “Scroll to explore” control that moves to the capabilities section. CSS animations are used for entrance, reveal, status-pulse, and scrolling effects; the landing-page counter/reveal behavior uses browser observers and animation frames.

## 7. Data flow and current prototype limits

Page components call service functions rather than reading all mock collections directly. The services currently return in-memory data from `src/data/mockData.js` and use short artificial delays to model asynchronous loading. This creates a seam for replacing mock implementations with API requests later without making page components own low-level data access.

The dashboard loads sensors, risk, alerts, and incidents together. After initial loading it simulates sensor and risk refreshes every eight seconds. Alert and incident services perform local filtering and in-memory state changes; analytics are read from a static mock data object.

Important current limitations:

- There is no API client or server integration in this frontend service layer.
- Demo sign-in does not verify credentials or establish a secure session.
- Mock service mutations are held in JavaScript memory and do not survive a full reload.
- Settings are currently component state; the settings screen describes its application preferences as local state only.
- The installed charting and animation libraries do not imply that a production analytics or AI backend is connected.

These are prototype boundaries, not claims about the intended full platform.

## 8. Shared UI components

- **Cards:** `KPICard`, `RiskPanel`, and `SensorCard` standardise metric, assessment, and live-reading presentation.
- **Charts:** chart modules under `components/charts/` provide reusable trend, severity, resolution, incident-category, hazard-frequency, and zone visualisations.
- **Common states:** `LoadingState`, `EmptyState`, and `ErrorState` give pages consistent feedback; `Modal` and `StatusBadge` provide shared interaction/status presentation.
- **Layout:** `Header` owns the dashboard theme control, site selector, notifications, user menu, and mobile menu trigger. `Sidebar` owns route navigation and its desktop collapse/mobile close action.

## 9. Accessibility and interaction notes

The UI uses semantic buttons and links for actions/navigation, labels for form fields, accessible names for icon-only controls, and an `aria-pressed` state on the dashboard theme button. Keyboard focus receives a visible `:focus-visible` outline from the global stylesheet. The sidebar navigation has an accessible navigation label, and the theme is expressed with CSS colors rather than image-only state.

When adding new screens or components, prefer semantic design tokens over literal light-only colors so the dashboard theme stays consistent. Give icon-only buttons accessible names, keep focus visible, and provide loading/empty/error feedback for asynchronous states.

## 10. Local development and production build

From `Frontend/`:

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` runs Vite's production bundler. There is currently no test, lint, or type-check script declared in `package.json`; add those as the project introduces corresponding tooling and automated coverage.
