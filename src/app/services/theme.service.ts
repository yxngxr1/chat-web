import { Injectable, computed, effect, inject, signal } from '@angular/core';

export interface AppTheme {
  name: 'light' | 'dark' | 'system' ;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private appTheme = signal<'light' | 'dark' | 'system'>('light');

  private themes: AppTheme[] = [
    { name: 'light', icon: 'light_mode' },
    { name: 'dark', icon: 'dark_mode' },
    { name: 'system', icon: 'desktop_windows' },
  ] as const;
  
  selectedTheme = computed(() =>
    this.themes.find((t) => t.name === this.appTheme())
  );

  getThemes() {
    return this.themes;
  }

  setTheme(theme: 'light' | 'dark' | 'system') {
    this.appTheme.set(theme);
  }

  constructor() {
    const savedTheme = localStorage.getItem('appTheme') as 'light' | 'dark' | 'system';
    if (savedTheme && this.themes.some(t => t.name === savedTheme)) {
      this.appTheme.set(savedTheme);
    }

    effect(() => {
      const appTheme = this.appTheme();
      localStorage.setItem('appTheme', appTheme);
      const colorScheme = appTheme === 'system' ? 'light dark' : appTheme;
      document.body.style.setProperty('color-scheme', colorScheme);
    });
  }
}