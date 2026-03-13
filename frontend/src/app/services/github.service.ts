import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const STORAGE_KEY = 'github_connected';

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

  checkConnectionFromBackend(): Promise<boolean> {
    return this.http.get<{ githubConnected: boolean }>('/api/user/me')
      .toPromise()
      .then(res => {
        const connected = res?.githubConnected ?? false;
        this.setConnected(connected);
        return connected;
      })
      .catch(() => false);
  }
}
