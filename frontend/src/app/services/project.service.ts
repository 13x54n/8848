import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

export interface CreateProjectRequest {
  name: string;
  repoUrl: string;
  rootDir?: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  repoUrl: string;
  rootDir: string;
  projectType: string;
  status: string;
  port: number | null;
  userId: number;
  createdAt: string;
}

export type LogEventType = 'log' | 'complete' | 'error';

export interface LogEvent {
  type: LogEventType;
  data: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private get apiUrl(): string {
    return '/api/projects';
  }

  createProject(request: CreateProjectRequest): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(this.apiUrl, {
      name: request.name,
      repoUrl: request.repoUrl,
      rootDir: request.rootDir || undefined,
    });
  }

  getProject(id: number): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.apiUrl}/${id}`);
  }

  listProjects(): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(this.apiUrl);
  }

  /**
   * Stream build logs via SSE. Uses fetch to support Authorization header.
   * Calls onLog for each log line, onComplete when done, onError on failure.
   */
  async streamLogs(
    projectId: number,
    callbacks: {
      onLog: (line: string) => void;
      onComplete: () => void;
      onError: (message: string) => void;
    }
  ): Promise<void> {
    const token = this.authService.getToken();
    const url = `${this.apiUrl}/${projectId}/logs`;
    const headers: Record<string, string> = {
      Accept: 'text/event-stream',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      callbacks.onError(`Failed to connect: ${response.status}`);
      callbacks.onComplete();
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      callbacks.onError('No response body');
      callbacks.onComplete();
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let currentEvent = 'log';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('event:')) {
            currentEvent = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            const eventData = line.slice(5).replace(/^ /, '');
            if (currentEvent === 'log') {
              callbacks.onLog(eventData);
            } else if (currentEvent === 'complete') {
              callbacks.onComplete();
              return;
            } else if (currentEvent === 'error') {
              callbacks.onError(eventData);
              callbacks.onComplete();
              return;
            }
          }
        }
      }

      callbacks.onComplete();
    } catch (e) {
      callbacks.onError(e instanceof Error ? e.message : 'Stream error');
      callbacks.onComplete();
    }
  }
}
