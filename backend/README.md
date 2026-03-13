# 8848 Backend

Spring Boot REST API backend for the 8848 platform. Handles authentication (email/password and GitHub OAuth), user management, and project-related operations.

## Tech Stack

- **Java 17**
- **Spring Boot 4.0.3**
- **Spring Security** – JWT authentication
- **Spring Data JPA** – Database access
- **MySQL** – Primary database
- **JJWT** – JWT generation and validation
- **Jackson** – JSON serialization

## Prerequisites

- Java 17+
- MySQL 8+
- Maven 3.6+ (or use included `./mvnw`)

## Quick Start

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE project8848;
```

### 2. Configuration

Copy or edit `src/main/resources/application.properties`. Key settings:

| Property | Description | Default |
|----------|-------------|---------|
| `spring.datasource.url` | MySQL connection URL | `jdbc:mysql://localhost:3306/project8848` |
| `spring.datasource.username` | Database username | `root` |
| `spring.datasource.password` | Database password | — |
| `jwt.secret` | Secret key for JWT signing | — |
| `jwt.expiration` | JWT expiry (ms) | `86400000` (24h) |
| `github.client-id` | GitHub OAuth app client ID | — |
| `github.client-secret` | GitHub OAuth app client secret | — |
| `github.redirect-uri` | OAuth callback URL | `http://localhost:8080/api/auth/github/callback` |
| `frontend.url` | Frontend base URL for redirects | `http://localhost:4200` |

### 3. GitHub OAuth (Optional)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set **Authorization callback URL** to `http://localhost:8080/api/auth/github/callback`
4. Set environment variables:
   ```bash
   export GITHUB_CLIENT_ID=your_client_id
   export GITHUB_CLIENT_SECRET=your_client_secret
   ```

### 4. Run

```bash
./mvnw spring-boot:run
```

The API runs at `http://localhost:8080`.

## API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register with email/password | No |
| POST | `/api/auth/login` | Login with email/password | No |
| GET | `/api/auth/github` | Start GitHub OAuth (redirects) | No |
| GET | `/api/auth/github/callback` | GitHub OAuth callback | No |
| GET | `/api/auth/github/connect` | Link GitHub to existing user | No |

#### Signup Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Auth Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "email": "user@example.com",
  "message": "Login successful"
}
```

### User

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/user/me` | Get current user profile | Yes |

#### User Me Response

```json
{
  "email": "user@example.com",
  "githubConnected": true
}
```

### Protected Endpoints

All endpoints except `/api/auth/*` require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Project Structure

```
backend/
├── src/main/java/xyz/minginc/_8848/backend/
│   ├── BackendApplication.java      # Entry point
│   ├── config/                      # Configuration
│   ├── controller/
│   │   ├── AuthController.java      # Auth endpoints
│   │   ├── UserController.java      # User endpoints
│   │   └── GlobalExceptionHandler.java
│   ├── dto/
│   │   ├── AuthResponse.java
│   │   ├── LoginRequest.java
│   │   └── SignupRequest.java
│   ├── entity/
│   │   └── User.java                # User model
│   ├── repository/
│   │   └── UserRepository.java
│   ├── security/
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtService.java
│   │   ├── SecurityConfig.java
│   │   └── UserDetailsServiceImpl.java
│   └── service/
│       └── GithubOAuthService.java  # GitHub OAuth flow
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## Data Model

### User

| Field | Type | Description |
|-------|------|-------------|
| id | Long | Primary key |
| email | String | Unique, required |
| password | String | Nullable for GitHub-only users |
| githubId | String | GitHub user ID |
| githubAccessToken | String | OAuth access token |
| createdAt | Instant | Creation timestamp |

## Security

- **JWT**: Stateless authentication; tokens expire after 24 hours
- **CORS**: Configured for `http://localhost:4000` and `http://localhost:4200`
- **Password**: BCrypt hashing
- **GitHub OAuth**: Supports both sign-in and account linking

## Build & Run

```bash
# Build
./mvnw clean package

# Run JAR
java -jar target/backend-0.0.1-SNAPSHOT.jar

# Run tests
./mvnw test
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |
| `GITHUB_REDIRECT_URI` | OAuth callback URL |
| `FRONTEND_URL` | Frontend base URL |
