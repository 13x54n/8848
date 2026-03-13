import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideGithub } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { NavbarComponent } from '../../components/navbar/navbar';
import { AuthService } from '../../services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.parent?.get('password')?.value;
  const confirm = control.value;
  return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, HlmIconImports],
  providers: [provideIcons({ lucideGithub })],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, passwordMatchValidator]],
    });
  }

  ngOnInit(): void {
    this.form.get('password')?.valueChanges.subscribe(() => {
      this.form.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.errorMessage = '';
      this.loading = true;
      const { email, password } = this.form.getRawValue();
      this.authService.signup(email, password).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message ?? 'Sign up failed. Please try again.';
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
