# Run IndustrialGuard AI Frontend Locally

This guide covers running the IndustrialGuard AI frontend against its Spring Boot backend on a development machine. The frontend is a Vite + React single-page application.

## Prerequisites

- **Node.js:** 20.19+ or 22.12+
- **npm:** included with Node.js
- A modern browser such as Chrome, Edge, or Firefox
- Git, if you are cloning the project

Check that Node.js and npm are available in a terminal:

```powershell
node --version
npm --version
```

If either command is not recognised, install Node.js and reopen the terminal.

## Get the project

If you already have the project files, skip this section. Otherwise, clone the repository using the URL supplied by your project team:

```powershell
git clone <repository-url>
cd <repository-folder>\Frontend
```

The commands below assume the terminal is in the `Frontend` directory (the directory containing `package.json`).

For an existing local copy in PowerShell:

```powershell
cd "D:\IndustrialGuard AI\Frontend"
```

## Install dependencies

Run this once after checkout, and again if the dependency manifest changes:

```powershell
npm install
```

This installs React, Vite, Tailwind CSS, Recharts, Lucide React, Three.js, and the other dependencies declared in `package.json`.

## Start the backend

Follow the setup steps in [`backend/README.md`](../backend/README.md) to start the API on `http://localhost:8080`. The frontend permits that origin by default. Sensor or vision events must be ingested before measured values and risk assessments are available.

## Start the frontend

The API base URL defaults to `http://localhost:8080/api/v1`. Override it before starting Vite if the backend is hosted elsewhere:

```powershell
$env:VITE_API_BASE_URL = "http://localhost:8080/api/v1"
npm run dev
```

Vite prints a local URL in the terminal, usually:

```text
http://localhost:5173/
```

Open that URL in your browser. Keep the terminal running while you use the app; Vite refreshes the browser as frontend files change. To stop the server, focus the terminal and press **Ctrl+C**.

If port 5173 is already in use, Vite normally selects another available port and prints its URL. Use the URL shown in the terminal.

To make the development server available to other devices on your local network, run:

```powershell
npm run dev -- --host 0.0.0.0
```

Only expose the server on a trusted network.

## Sign in to the demo

Select **Access Dashboard** or **Sign In** on the landing page, then use the sign-in form's demo action to enter the dashboard. This frontend currently has no credential verification or server-backed authentication; the demo sign-in action only changes the client-side app state.

The dashboard, sensors, alerts, incidents, and analytics pages use the backend API. Sensor and risk views refresh periodically. A missing reading is shown as offline; the frontend does not generate sample measurements or predictions.

Sign-in and sign-up remain demo-only because the backend does not provide authentication endpoints. User profiles, site choices, and settings are also local frontend data.

The desktop login and signup pages also display an interactive Three.js animation. A browser with WebGL enabled is needed to render it; if WebGL is unavailable, the component displays an explanatory error instead of the scene.

## Useful commands

Run these from `Frontend/`:

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Create the optimized production bundle in `dist/` |
| `npm run preview` | Serve the built `dist/` output locally for a production-style check |

Build and preview:

```powershell
npm run build
npm run preview
```

Use the local URL printed by the preview command. The generated `dist/` folder is build output; do not edit files in it directly.

## Theme preference

The dashboard's dark/light selection is saved in browser `localStorage` under `ig-darkMode`. It applies to the dashboard shell and its token-based views. Clearing the site's browser storage resets the preference to the default dark theme.

## Troubleshooting

### `npm` or `node` is not recognised

Install a supported Node.js version, close and reopen PowerShell, and retry `node --version` and `npm --version`.

### Dependencies fail to install

Check your network connection and Node.js version, then retry `npm install`. If the error reports a specific missing package or platform limitation, keep the full error output for diagnosis rather than deleting project files.

### The browser cannot connect

Confirm that `npm run dev` is still running and open the exact URL Vite printed. If the port changed, use the new port displayed in the terminal.

### A change is not visible

Wait for Vite's reload to finish. If needed, refresh the page. For a stale or unexpected UI state, clear the site data/local storage and reload; note that this also resets the saved theme preference.

### The production build fails

Run `npm install` after confirming the current Node.js version, then run `npm run build` again and review the first reported error. A bundle-size warning by itself is not a build failure if Vite reports that the build completed.

## Project entry points

- `index.html` — HTML document, font links, and React root element
- `src/main.jsx` — React entry point and global stylesheet import
- `src/App.jsx` — app routes, demo authentication state, and theme state
- `src/index.css` — shared design tokens, base styles, and animations
- `src/data/mockData.js` and `src/services/` — prototype data and frontend service layer

For a fuller explanation of frontend structure and technology choices, see [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md).
