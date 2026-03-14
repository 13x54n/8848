# GitHub OAuth Setup Guide

This guide walks you through configuring direct GitHub OAuth for login and signup in the 8848 application. The app requests `user:email`, `read:user`, and `repo` scopes to fetch:
- **Email** – from profile or /user/emails
- **Name** – from profile
- **Avatar** – profile image URL
- **Repos** – public and private repositories (via `GET /api/user/repos`)

## 1. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name**: 8848 (or any name)
   - **Homepage URL**: `http://localhost:4200` (or your production URL)
   - **Authorization callback URL**: `http://localhost:8080/api/auth/github/callback` (backend handles the callback)
3. Click **Register application**.
4. Copy the **Client ID** and generate a **Client Secret**.

## 2. Configure the Backend

Set environment variables or add to `backend/src/main/resources/application.properties`:

```properties
# GitHub OAuth - required for "Login with GitHub"
github.client-id=your_github_client_id
github.client-secret=your_github_client_secret
github.redirect-uri=http://localhost:8080/api/auth/github/callback
frontend.url=http://localhost:4200
```

For production, use your production URLs:
- `github.redirect-uri`: `https://your-api-domain.com/api/auth/github/callback`
- `frontend.url`: `https://your-app-domain.com`

## 3. Flow

1. User clicks **Login with GitHub** or **Sign up with GitHub** on `/login` or `/signup`.
2. Frontend redirects to `/api/auth/github?state=login` (proxied to backend).
3. Backend redirects to GitHub's authorization page.
4. User authorizes → GitHub redirects to backend callback.
5. Backend exchanges code for user info, creates/finds user, generates JWT.
6. Backend redirects to `{frontend.url}/auth/callback?token=...&email=...`.
7. Frontend stores token and navigates to dashboard.

## Troubleshooting

### "GitHub OAuth is not configured"
- Ensure `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set (or in application.properties).
- Restart the backend after changing config.

### "GitHub authentication failed"
- Check that the callback URL in your GitHub OAuth App exactly matches `github.redirect-uri`.
- Ensure the backend can reach GitHub's API (no firewall/proxy blocking).

### Redirect URI mismatch (GitHub error)
- The callback URL in GitHub OAuth App must be exactly: `http://localhost:8080/api/auth/github/callback` for local dev.
- No trailing slash; must match the backend's `github.redirect-uri` exactly.
