import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Redirects authenticated users to /dashboard.
 * Use on public routes (landing, pricing, login, signup) so logged-in users
 * stay within the dashboard ecosystem.
 */
export const guestGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return router.createUrlTree(['/dashboard']);
  }
  return true;
};
