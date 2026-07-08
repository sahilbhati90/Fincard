import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { AuthCredentials, AuthSession, RegisterPayload, User } from '../models/user.model';

const SESSION_KEY = 'fincard.session';

interface LoginResponse {
  email: string;
  fullName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly session = signal<AuthSession | null>(this.restoreSession());

  readonly user = computed<User | null>(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);

  login(credentials: AuthCredentials): Observable<AuthSession> {
    return this.http.post<LoginResponse>('/login', credentials, { withCredentials: true }).pipe(
        map((res) => this.toSession(res)),
        tap((session) => this.persistSession(session)),
        catchError(() => throwError(() => new Error('Invalid credentials'))),
    );
  }

  register(payload: RegisterPayload): Observable<{ message: string }> {
    const [firstname, ...rest] = payload.fullName.trim().split(' ');
    const lastname = rest.join(' ') || firstname;

    return this.http
        .post('/api/v1/registration', {
          firstname,
          lastname,
          email: payload.email,
          password: payload.password,
        }, { responseType: 'text' })
        .pipe(
            map(() => ({ message: 'Registered! Check your email to activate your account.' })),
            catchError(() => throwError(() => new Error('Could not create account'))),
        );
  }

  logout(): Observable<unknown> {
    return this.http.post('/logout', {}, { withCredentials: true }).pipe(
      catchError(() => of(null)),
      tap(() => {
        this.clearSession();
        this.router.navigate(['/login']);
      }),
    );
  }

  updateCurrentUser(changes: Partial<Pick<User, 'fullName' | 'avatarUrl'>>): void {
    const currentSession = this.session();
    if (!currentSession) return;

    this.persistSession({
      ...currentSession,
      user: {
        ...currentSession.user,
        ...changes,
      },
    });
  }

  getToken(): string | null {
    return this.session()?.token ?? null;
  }

  private toSession(res: LoginResponse): AuthSession {
    return {
      token: 'session-cookie', // real auth ab cookie se hoti hai, token sirf placeholder hai
      refreshToken: '',
      expiresAt: Date.now() + 1000 * 60 * 60 * 8,
      user: {
        id: res.email,
        fullName: res.fullName,
        email: res.email,
        avatarUrl: 'images/1.png',
        role: 'owner',
      },
    };
  }

  private persistSession(session: AuthSession): void {
    this.session.set(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  private clearSession(): void {
    this.session.set(null);
    localStorage.removeItem(SESSION_KEY);
  }

  private restoreSession(): AuthSession | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const parsed: AuthSession = JSON.parse(raw);
      return parsed.expiresAt > Date.now() ? parsed : null;
    } catch {
      return null;
    }
  }
}
