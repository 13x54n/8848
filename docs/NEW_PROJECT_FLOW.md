# New Project Creation Flow

This document describes the end-to-end process for creating and deploying a new project on the platform.

## Overview

When a user creates a new project, the system:

1. **Clones** the repository or template to the local server
2. **Identifies** the project type (Node.js, React.js, Next.js, etc.)
3. **Builds** the project based on its type
4. **Serves** the application on an allocated port
5. **Streams** build logs to the frontend in real time
6. **Configures** domain and port assignment

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     New Project Page                              │
│  ┌──────────────┐ ┌──────────────────┐ ┌──────────────────┐    │
│  │ GitHub URL   │ │ Import from      │ │ Clone Template    │    │
│  │              │ │ GitHub           │ │                   │    │
│  └──────┬───────┘ └────────┬─────────┘ └────────┬──────────┘    │
└─────────┼──────────────────┼────────────────────┼────────────────┘
          │                  │                    │
          └──────────────────┼────────────────────┘
                             ▼
                  ┌──────────────────────┐
                  │ Clone to local server│
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │ Identify Project    │
                  │ (Node.js, React.js,  │
                  │  Next.js, etc.)      │
                  └──────────┬───────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ React.js        │ │ Node.js         │ │ Others          │
│ Use React build │ │ Build if TS or   │ │ Build and serve │
│ script, serve   │ │ serve            │ │                 │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             ▼
                  ┌──────────────────────┐
                  │ Log all build process│
                  │ in new project page  │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │ Configure wildcard   │
                  │ domain to port       │
                  │ assignment          │
                  └──────────────────────┘
```

## Project Origin Options

### 1. GitHub URL

User pastes a Git repository URL (e.g. `https://github.com/user/repo.git`). The system clones the repository.

### 2. Import from GitHub

User selects a repository from their connected GitHub account. Uses the user's GitHub token for private repos.

### 3. Clone Template

User selects a pre-defined template (e.g. Next.js Boilerplate, Chatbot). The template's `repoUrl` and `rootDir` are used.

## Backend Process

### Clone Phase

- **Tool**: JGit
- **Target**: `{projects.base-dir}/{projectId}_{safeName}/`
- **Authentication**: User's GitHub access token (for private repos)
- **Root directory**: If specified (e.g. `frontend`), the app root is `{cloneTarget}/{rootDir}`

### Project Identification

The system reads `package.json` to detect project type:

| Dependencies / Config | Project Type |
|-----------------------|--------------|
| `react-scripts`, `react-dom` | React.js |
| `next` | Next.js |
| `vue`, `@vue/cli-service` | Vue.js |
| `@angular/core` | Angular |
| `express`, `fastify`, `koa` | Node.js |
| `vite` + `react` | React.js |
| `vite` + `vue` | Vue.js |
| Fallback | Node.js |

### Build Logic by Type

**React.js / Next.js / Vue.js / Angular:**
- Run `npm run build` if the script exists
- Serve with `npm start` or `npm run dev`

**Node.js:**
- If TypeScript (`tsconfig.json` present) and `build` script exists: run `npm run build`
- Serve with `npm start`, `npm run dev`, or `node index.js`

**Others:**
- Run `npm run build` if present
- Serve with `npm run start` if present

### Port Allocation

- Range: 3000–3999
- Each project gets a unique port
- Port is passed via `PORT` environment variable to the serve process

### Log Streaming

- **Protocol**: Server-Sent Events (SSE)
- **Endpoint**: `GET /api/projects/{id}/logs`
- **Events**: `log` (build output), `complete` (success), `error` (failure)
- **Authentication**: Bearer token required

## API Reference

### Create Project

```
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "my-app",
  "repoUrl": "https://github.com/user/repo.git",
  "rootDir": "frontend"   // optional
}

Response: 201 Created
{
  "id": 1,
  "name": "my-app",
  "repoUrl": "https://github.com/user/repo.git",
  "rootDir": "1_my-app/frontend",
  "projectType": "React.js",
  "status": "PENDING",
  "port": 3000,
  "userId": 1,
  "createdAt": "2026-03-15T18:00:00Z"
}
```

### Stream Build Logs

```
GET /api/projects/{id}/logs
Authorization: Bearer <token>
Accept: text/event-stream

Events:
- event: log
  data: <line of build output>

- event: complete
  data: 

- event: error
  data: <error message>
```

### List Projects

```
GET /api/projects
Authorization: Bearer <token>

Response: 200 OK
[
  { "id": 1, "name": "my-app", ... }
]
```

### Get Project

```
GET /api/projects/{id}
Authorization: Bearer <token>
```

## Configuration

| Property | Default | Description |
|----------|---------|-------------|
| `projects.base-dir` | `./data/projects` | Base directory for cloned projects |

## Domain Configuration (Future)

The system will support wildcard domain assignment:

- Each domain maps to a project
- Server populates which port serves each domain
- Enables `myapp.example.com` → Project on port 3000
