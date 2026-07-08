import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Button } from '../../shared/components/button/button';

type AuthTab = 'signin' | 'signup';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly activeTab = signal<AuthTab>('signin');
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly signInForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly signUpForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected setTab(tab: AuthTab): void {
    this.activeTab.set(tab);
    this.errorMessage.set(null);
  }

  protected submitSignIn(): void {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.errorMessage.set(null);

    this.auth
      .login(this.signInForm.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.toast.show('Welcome back!', 'success');
          this.router.navigate(['/dashboard']);
        },
        error: () => this.errorMessage.set('Invalid email or password. Please try again.'),
      });
  }

  protected submitSignUp(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.errorMessage.set(null);

    this.auth
      .register(this.signUpForm.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.toast.show('Account created! Check your email to activate, then sign in.', 'success');
          this.setTab('signin');
        },
        error: () => this.errorMessage.set('Could not create your account. Please try again.'),
      });
  }
}
