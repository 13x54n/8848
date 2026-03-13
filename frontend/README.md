# 8848 Frontend

Angular application for the 8848 platform. A Vercel-style dashboard for deploying and managing projects, with authentication (email/password and GitHub OAuth), project overview, usage metrics, and new project creation.

## Tech Stack

- **Angular 21**
- **TypeScript 5.9**
- **Tailwind CSS 4**
- **Spartan UI** (ng-icons, helm components)
- **Angular SSR** – Server-side rendering
- **RxJS** – Reactive programming

## Prerequisites

- Node.js 20+
- npm 11+

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm start
```

The app runs at `http://localhost:4200`. API requests are proxied to `http://localhost:8080` via `proxy.conf.json`.

### 3. Build for Production

```bash
npm run build
```

Output is in `dist/frontend/`.

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Shared components
│   │   │   └── navbar/
│   │   ├── guards/              # Route guards
│   │   │   ├── auth.guard.ts    # Protects dashboard routes
│   │   │   └── guest.guard.ts   # Redirects guests from auth pages
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts  # Adds JWT to requests
│   │   ├── pages/
│   │   │   ├── auth-callback/   # OAuth callback handler
│   │   │   ├── dashboard/       # Dashboard layout & pages
│   │   │   ├── landing/
│   │   │   ├── login/
│   │   │   │   ├── pricing/
│   │   │   │   └── signup/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── github.service.ts
│   │   │   └── theme.service.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   └── app.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── libs/ui/                      # Spartan UI components
├── proxy.conf.json               # API proxy config
├── angular.json
└── package.json
```

## Routes

| Path | Component | Guard | Description |
|------|-----------|-------|-------------|
| `/` | Landing | guest | Home page |
| `/pricing` | Pricing | guest | Pricing page |
| `/login` | Login | guest | Login form |
| `/signup` | Signup | guest | Registration form |
| `/auth/callback` | AuthCallback | — | OAuth callback handler |
| `/dashboard` | DashboardLayout | auth | Dashboard shell |
| `/dashboard/overview` | Overview | auth | Projects & usage overview |
| `/dashboard/new-project` | NewProject | auth | Create new project |
| `/dashboard/usage` | Usage | auth | Usage metrics |
| `/dashboard/projects` | Projects | auth | Projects list |
| `/dashboard/analytics` | Analytics | auth | Analytics |
| `/dashboard/speed-insights` | SpeedInsights | auth | Speed insights |
| `/dashboard/cdn` | CDN | auth | CDN settings |
| `/dashboard/storage` | Storage | auth | Storage |
| `/dashboard/agent` | Agent | auth | Agent |
| `/dashboard/support` | Support | auth | Support |
| `/dashboard/settings` | Settings | auth | Settings |

## Services

### AuthService

- `login(email, password)` – Email/password login
- `signup(email, password)` – Registration
- `logout()` – Clear session and redirect to login
- `getToken()` / `setToken()` – JWT storage
- `getEmail()` / `setEmail()` – User email
- `isAuthenticated()` – Check if logged in
- `getGithubLoginUrl()` – Redirect URL for GitHub OAuth
- `getGithubConnectUrl()` – Redirect URL for GitHub connect

### GithubService

- `isConnected()` – Check if GitHub is linked
- `setConnected()` / `connect()` / `disconnect()` – Local state
- `checkConnectionFromBackend()` – Fetch status from backend

### ThemeService

- `toggle()` – Toggle dark/light mode
- `isDark()` – Current theme

## Key Features

### Authentication

- **Email/Password**: Login and signup forms
- **GitHub OAuth**: "Login with GitHub" on login/signup
- **Auth Callback**: Handles OAuth redirect, stores token, navigates to dashboard

### Dashboard

- **Overview**: Project cards, recent previews, usage metrics
- **New Project**: Import from GitHub or clone template; Connect GitHub flow
- **Sidebar**: Navigation, search, user info

### Styling

- Dark theme (Vercel-inspired)
- Tailwind CSS
- Spartan UI components
- Responsive layout

## Configuration

### API Proxy

`proxy.conf.json` forwards `/api` to `http://localhost:8080` during development:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false
  }
}
```

### Backend URL

For OAuth redirects (GitHub connect), the frontend uses `http://localhost:8080` directly so cookies are set on the backend domain. This is hardcoded in `AuthService`; update for production.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server (port 4200) |
| `npm run build` | Production build |
| `npm run watch` | Watch mode build |
| `npm test` | Run unit tests (Vitest) |
| `npm run serve:ssr:frontend` | Serve SSR build |

## Development

### Code Generation

```bash
ng generate component component-name
ng generate service service-name
ng generate guard guard-name
```

### Linting & Formatting

- Prettier for formatting
- EditorConfig for consistency
