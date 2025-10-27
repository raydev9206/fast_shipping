import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<Theme>('light');
  public currentTheme$ = this.currentTheme.asObservable();

  constructor() {
    // Load theme from localStorage or system preference
    this.loadTheme();
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): Theme {
    return this.currentTheme.value;
  }

  /**
   * Set theme and persist to localStorage
   */
  setTheme(theme: Theme): void {
    this.currentTheme.next(theme);
    localStorage.setItem('mi-repartidor-theme', theme);

    // Apply theme to document
    this.applyTheme(theme);
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Load theme from localStorage or system preference
   */
  private loadTheme(): void {
    const savedTheme = localStorage.getItem('mi-repartidor-theme') as Theme;

    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      this.applyTheme(savedTheme);
      this.currentTheme.next(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme: Theme = prefersDark ? 'dark' : 'light';
      this.applyTheme(theme);
      this.currentTheme.next(theme);
    }
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: Theme): void {
    const htmlElement = document.documentElement;

    if (theme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.removeAttribute('data-theme');
    }
  }

  /**
   * Listen to system theme changes
   */
  listenToSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('mi-repartidor-theme');
      if (!savedTheme) {
        const theme: Theme = e.matches ? 'dark' : 'light';
        this.applyTheme(theme);
        this.currentTheme.next(theme);
      }
    });
  }
}
