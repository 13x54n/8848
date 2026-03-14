import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, timeout, catchError, of } from 'rxjs';

const STORAGE_KEY = 'github_connected';

export interface UserProfile {
  email: string;
  name: string | null;
  avatarUrl: string | null;
  githubConnected: boolean;
}

export interface RepoInfo {
  id: number;
  name: string;
  fullName: string;
  isPrivate: boolean;
  htmlUrl: string | null;
  cloneUrl: string | null;
  description: string | null;
  defaultBranch: string;
  projectType: string | null;
  updatedAt: string | null;
  stargazersCount?: number;
}

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly http = inject(HttpClient);
  private get storage(): Storage | null {
    return typeof window !== 'undefined' ? localStorage : null;
  }

  isConnected(): boolean {
    const stored = this.storage?.getItem(STORAGE_KEY);
    return stored === 'true';
  }

  setConnected(connected: boolean): void {
    this.storage?.setItem(STORAGE_KEY, String(connected));
  }

  connect(): void {
    this.setConnected(true);
  }

  disconnect(): void {
    this.setConnected(false);
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('/api/user/me');
  }

  getRepos(search?: string): Observable<RepoInfo[]> {
    const params = search?.trim() ? { q: search.trim() } : undefined;
    return this.http.get<RepoInfo[]>('/api/user/repos', { params }).pipe(
      timeout(15000),
      catchError(() => of([] as RepoInfo[])),
    );
  }

  checkConnectionFromBackend(): Promise<boolean> {
    return firstValueFrom(
      this.http.get<UserProfile>('/api/user/me').pipe(
        timeout(10000),
        catchError(() => of(null)),
      )
    ).then(res => {
      const connected = res?.githubConnected ?? false;
      this.setConnected(connected);
      return connected;
    }).catch(() => {
      this.setConnected(false);
      return false;
    });
  }
}
