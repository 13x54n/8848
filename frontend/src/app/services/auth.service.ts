import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthResponse {
  token: string | null;
  email: string | null;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = '/api/auth';
  private readonly backendUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        if (res.token && res.email) {
          this.setToken(res.token);
          this.setEmail(res.email);
        }
      })
    );
  }

  signup(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, { email, password }).pipe(
      tap((res) => {
        if (res.token && res.email) {
          this.setToken(res.token);
          this.setEmail(res.email);
        }
      })
    );
  }

  private get storage(): Storage | null {
    return typeof window !== 'undefined' ? localStorage : null;
  }

  setToken(token: string): void {
    this.storage?.setItem('token', token);
  }

  getToken(): string | null {
    return this.storage?.getItem('token') ?? null;
  }

  setEmail(email: string): void {
    this.storage?.setItem('email', email);
  }

  getEmail(): string | null {
    return this.storage?.getItem('email') ?? null;
  }

  logout(): void {
    this.storage?.removeItem('token');
    this.storage?.removeItem('email');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getGithubLoginUrl(): string {
    return `${this.backendUrl}/api/auth/github?state=login`;
  }

  getGithubConnectUrl(): string {
    const token = this.getToken();
    if (!token) return '';
    return `${this.backendUrl}/api/auth/github/connect?token=${encodeURIComponent(token)}`;
  }
}
