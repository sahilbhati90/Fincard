import { Injectable, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'fincard.theme';

/**
 * Owns the light/dark/system theme preference, persists it to
 * localStorage, and applies it to the document via a data attribute
 * so every component can theme purely off CSS custom properties.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly media = window.matchMedia('(prefers-color-scheme: dark)');

  readonly mode = signal<ThemeMode>(this.readStoredMode());
  readonly resolvedTheme = signal<'light' | 'dark'>(this.resolve(this.mode()));

  constructor() {
    this.media.addEventListener('change', () => {
      if (this.mode() === 'system') {
        this.resolvedTheme.set(this.resolve('system'));
      }
    });

    effect(() => {
      const resolved = this.resolve(this.mode());
      this.resolvedTheme.set(resolved);
      document.documentElement.setAttribute('data-theme', resolved);
      localStorage.setItem(STORAGE_KEY, this.mode());
    });
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  toggle(): void {
    this.setMode(this.resolvedTheme() === 'dark' ? 'light' : 'dark');
  }

  private resolve(mode: ThemeMode): 'light' | 'dark' {
    if (mode === 'system') {
      return this.media.matches ? 'dark' : 'light';
    }
    return mode;
  }

  private readStoredMode(): ThemeMode {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return stored ?? 'system';
  }
}
