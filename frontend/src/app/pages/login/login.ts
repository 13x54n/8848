import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideGithub } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { NavbarComponent } from '../../components/navbar/navbar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, HlmIconImports],
  providers: [provideIcons({ lucideGithub })],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    const error = this.route.snapshot.queryParamMap.get('error');
    if (error === 'github_auth_failed') {
      this.errorMessage = 'GitHub authentication failed. Please try again.';
    } else if (error === 'github_not_configured') {
      this.errorMessage = 'GitHub OAuth is not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.';
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.errorMessage = '';
      this.loading = true;
      const { email, password } = this.form.getRawValue();
      this.authService.login(email, password).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message ?? 'Login failed. Please try again.';
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
