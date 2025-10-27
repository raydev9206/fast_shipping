import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="theme-toggle"
      (click)="toggleTheme()"
      [attr.aria-label]="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
      [title]="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <!-- Sun icon (light mode) -->
      <svg
        *ngIf="!isDarkMode"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
        <path stroke="currentColor" stroke-width="2" stroke-linecap="round"
              d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>

      <!-- Moon icon (dark mode) -->
      <svg
        *ngIf="isDarkMode"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  `,
  styles: [`
    .theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: var(--white);
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all var(--transition-base);
      position: relative;
      z-index: 1;
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    }

    .theme-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
    }

    .theme-toggle:focus {
      outline: 2px solid rgba(255, 255, 255, 0.5);
      outline-offset: 2px;
    }

    .theme-toggle:active {
      transform: scale(0.95);
    }

    /* Dark mode specific styling */
    [data-theme="dark"] .theme-toggle {
      color: var(--dark-text-secondary);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    [data-theme="dark"] .theme-toggle:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--dark-primary-600);
      box-shadow: 0 0 15px rgba(212, 184, 133, 0.4);
    }

    [data-theme="dark"] .theme-toggle:focus {
      outline: 2px solid rgba(212, 184, 133, 0.5);
      outline-offset: 2px;
    }

    /* Smooth transition animation */
    .theme-toggle svg {
      transition: all var(--transition-base);
    }

    /* Mobile responsive */
    @media (max-width: 640px) {
      .theme-toggle {
        width: 36px;
        height: 36px;
      }

      .theme-toggle svg {
        width: 18px;
        height: 18px;
      }
    }
  `]
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  private subscription?: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.subscription = this.themeService.currentTheme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
