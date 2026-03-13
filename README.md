# 8848

A Vercel-style platform for deploying and managing projects. Includes authentication (email/password and GitHub OAuth), project overview, usage metrics, and new project creation with GitHub import.

## Project Structure

```
8848/
├── backend/          # Spring Boot REST API
├── frontend/         # Angular SPA
└── README.md
```

## Quick Start

### Prerequisites

- **Java 17+** and **Maven** (backend)
- **Node.js 20+** and **npm 11+** (frontend)
- **MySQL 8+** (database)

### 1. Database

```sql
CREATE DATABASE project8848;
```

### 2. Backend

```bash
cd backend
# Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET for GitHub OAuth (optional)
./mvnw spring-boot:run
```

Runs at `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Runs at `http://localhost:4200`.

## Documentation

- **[Backend Documentation](backend/README.md)** – API reference, configuration, data model
- **[Frontend Documentation](frontend/README.md)** – Routes, services, project structure

## Features

- **Authentication**: Email/password and GitHub OAuth
- **Dashboard**: Overview, projects, usage, recent previews
- **New Project**: Import from GitHub or clone templates
- **GitHub Integration**: Connect GitHub to import repositories
