import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-callback-page">
      @if (error) {
        <p class="auth-callback-error">{{ error }}</p>
        <a routerLink="/login" class="auth-callback-link">Back to Login</a>
      } @else if (loading) {
        <p class="auth-callback-loading">Signing you in...</p>
      }
    </div>
  `,
  styles: [`
    .auth-callback-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      gap: 1rem;
    }
    .auth-callback-loading, .auth-callback-error {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.8);
    }
    .auth-callback-error { color: #ef4444; }
    .auth-callback-link {
      color: #3b82f6;
      text-decoration: none;
    }
    .auth-callback-link:hover { text-decoration: underline; }
  `],
})
export class AuthCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  loading = true;
  error = '';

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');

    if (token && email) {
      this.authService.setToken(token);
      this.authService.setEmail(email);
      this.loading = false;
      this.router.navigate(['/dashboard']);
    } else {
      this.error = this.route.snapshot.queryParamMap.get('error') ?? 'Authentication failed.';
      this.loading = false;
    }
  }
}
