import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';

/**
 * Modern Header component for navigation and user information
 * Features improved design with icons, animations, and responsive layout
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <header class="header" *ngIf="currentUser">
      <div class="container">
        <div class="header-content">
          <!-- Logo Section (simplified) -->
          <div class="logo-section" (click)="navigateHome()">
            <div class="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M8 9L12 13L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <!-- Navigation Section (Desktop only) -->
          <nav class="nav-section">
            <div class="nav-links">
              <!-- Navigation links for all authenticated users -->
              <a
                routerLink="/deliveries"
                routerLinkActive="active"
                class="nav-link"
                title="View Deliveries"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 7L12 3L4 7L12 11L20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4 12L12 16L20 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4 17L12 21L20 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Deliveries</span>
              </a>

              <!-- Navigation links specific to moderators -->
              <a
                *ngIf="currentUser.role === 'moderator'"
                routerLink="/create-delivery"
                routerLinkActive="active"
                class="nav-link"
                title="Create Delivery"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Create Delivery</span>
              </a>
            </div>
          </nav>

          <!-- Right Section: User Info, Theme Toggle and Mobile Menu -->
          <div class="header-actions">
            <!-- User Info (Desktop only) -->
            <div class="header-user-info">
              <div class="user-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="user-details">
                <div class="user-name">{{ currentUser.name }}</div>
                <div class="user-role">
                  <span class="badge" [class.badge-primary]="currentUser.role === 'moderator'" [class.badge-secondary]="currentUser.role === 'delivery'">
                    {{ currentUser.role | titlecase }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Theme Toggle -->
            <div class="header-theme-toggle">
              <app-theme-toggle></app-theme-toggle>
            </div>

            <!-- Desktop Logout Button -->
            <button
              (click)="logout()"
              class="btn btn-ghost btn-sm desktop-logout-btn"
              title="Logout"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="desktop-only">Logout</span>
            </button>

            <!-- Mobile Menu Toggle -->
            <button
              class="mobile-menu-toggle"
              (click)="toggleMobileMenu()"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileMenuOpen">
        <div class="container">
          <div class="mobile-nav-links">
            <a
              routerLink="/deliveries"
              routerLinkActive="active"
              class="mobile-nav-link"
              (click)="closeMobileMenu()"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7L12 3L4 7L12 11L20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 12L12 16L20 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 17L12 21L20 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Deliveries
            </a>

            <a
              *ngIf="currentUser.role === 'moderator'"
              routerLink="/create-delivery"
              routerLinkActive="active"
              class="mobile-nav-link"
              (click)="closeMobileMenu()"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Create Delivery
            </a>

            <!-- User Info in Mobile Menu (only for mobile) -->
            <div class="mobile-user-info">
              <div class="mobile-user-name">{{ currentUser.name }}</div>
              <span class="badge" [class.badge-primary]="currentUser.role === 'moderator'" [class.badge-secondary]="currentUser.role === 'delivery'">
                {{ currentUser.role | titlecase }}
              </span>
            </div>

            <!-- Logout Button in Mobile Menu -->
            <button
              (click)="logout()"
              class="mobile-logout-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 25%, var(--primary-900) 75%, #3a2f1f 100%);
      color: var(--white);
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(107, 90, 64, 0.2);
      overflow: visible;
    }

    /* Dark mode header styling */
    [data-theme="dark"] .header {
      background: linear-gradient(135deg, var(--dark-primary-400) 0%, var(--dark-primary-500) 25%, var(--dark-primary-600) 75%, var(--dark-primary-700) 100%);
      border-bottom: 1px solid rgba(143, 122, 83, 0.2);
    }

    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 30%, transparent 70%, rgba(191, 163, 110, 0.05) 100%);
      pointer-events: none;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) 0;
      position: relative;
    }

    /* Logo Section (simplified) */
    .logo-section {
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .logo-section:hover {
      transform: scale(1.02);
    }

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      z-index: 1;
    }

    .logo-section:hover .logo-icon {
      background-color: rgba(255, 255, 255, 0.25);
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
    }

    /* Dark mode logo icon */
    [data-theme="dark"] .logo-icon {
      background-color: rgba(143, 122, 83, 0.15);
      border: 1px solid rgba(143, 122, 83, 0.2);
    }

    [data-theme="dark"] .logo-section:hover .logo-icon {
      background-color: rgba(143, 122, 83, 0.25);
      box-shadow: 0 0 15px rgba(143, 122, 83, 0.3);
    }

    /* Header Actions (User Info, Theme Toggle and Mobile Menu) */
    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    /* Header User Info - Show only on desktop */
    .header-user-info {
      display: none;
      align-items: center;
      gap: var(--space-3);
    }

    @media (min-width: 769px) {
      .header-user-info {
        display: flex;
      }
    }

    @media (max-width: 768px) {
      .header-user-info {
        display: none;
      }
    }

    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: var(--radius-full);
      transition: all var(--transition-base);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      z-index: 1;
    }

    .header-user-info:hover .user-avatar {
      background-color: rgba(255, 255, 255, 0.25);
      transform: scale(1.05);
      box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
    }

    /* Dark mode user avatar */
    [data-theme="dark"] .user-avatar {
      background-color: rgba(143, 122, 83, 0.15);
      border: 1px solid rgba(143, 122, 83, 0.2);
    }

    [data-theme="dark"] .header-user-info:hover .user-avatar {
      background-color: rgba(143, 122, 83, 0.25);
      box-shadow: 0 0 12px rgba(143, 122, 83, 0.3);
    }

    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-1);
    }

    .user-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--white);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      position: relative;
      z-index: 1;
    }

    .user-role {
      opacity: 0.9;
    }

    /* Desktop Logout Button */
    .desktop-logout-btn {
      opacity: 0.8;
      transition: all var(--transition-base);
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      z-index: 1;
    }

    .desktop-logout-btn:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    /* Dark mode desktop logout button */
    [data-theme="dark"] .desktop-logout-btn {
      background: rgba(143, 122, 83, 0.1);
      border: 1px solid rgba(143, 122, 83, 0.2);
    }

    [data-theme="dark"] .desktop-logout-btn:hover {
      background: rgba(143, 122, 83, 0.2);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    /* Desktop only text */
    .desktop-only {
      display: inline;
    }

    @media (max-width: 768px) {
      .desktop-only {
        display: none;
      }
    }

    /* Navigation Section - Show only on desktop */
    .nav-section {
      display: none;
    }

    @media (min-width: 769px) {
      .nav-section {
        display: flex;
        align-items: center;
      }
    }

    @media (max-width: 768px) {
      .nav-section {
        display: none;
      }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      transition: all var(--transition-base);
      position: relative;
      z-index: 1;
      border: 1px solid transparent;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.15);
      color: var(--white);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
      color: var(--white);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background-color: var(--white);
      border-radius: var(--radius-full);
      box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
    }

    /* User Section - Hidden (not used in simplified header) */
    .user-section {
      display: none;
    }

    .user-info,
    .user-avatar,
    .user-details,
    .user-name,
    .user-role,
    .logout-btn {
      display: none;
    }

    /* Mobile Menu */
    .mobile-menu-toggle {
      display: none;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
      z-index: 10;
    }

    .mobile-menu-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    /* Dark mode mobile menu toggle */
    [data-theme="dark"] .mobile-menu-toggle:hover {
      background-color: rgba(143, 122, 83, 0.1);
    }

    .mobile-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--bg-surface);
      border-radius: 0 0 var(--radius-xl) var(--radius-xl);
      box-shadow: var(--shadow-2xl);
      border: 1px solid var(--border-color);
      border-top: none;
      display: none;
      z-index: 1000;
      transition: all var(--transition-base);
      opacity: 0;
      transform: translateY(-10px);
    }

    /* Dark mode mobile menu */
    [data-theme="dark"] .mobile-menu {
      background: var(--dark-bg-surface);
      border: 1px solid var(--dark-border);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
    }

    .mobile-menu.open {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }

    .mobile-nav-links {
      padding: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      color: var(--text-primary);
      text-decoration: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      transition: all var(--transition-base);
      border: 1px solid transparent;
    }

    .mobile-nav-link:hover {
      background: var(--bg-primary);
      color: var(--primary-600);
      border-color: var(--primary-200);
      transform: translateX(4px);
    }

    .mobile-nav-link.active {
      background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
      color: var(--primary-700);
      border-color: var(--primary-300);
    }

    /* Mobile User Info - Show only on mobile */
    .mobile-user-info {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-4);
      border-top: 1px solid var(--border-color);
      margin-top: var(--space-2);
      background: var(--bg-primary);
    }

    @media (min-width: 769px) {
      .mobile-user-info {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .mobile-user-info {
        display: flex;
      }
    }

    /* Mobile Logout Button - Show only on mobile */
    .mobile-logout-btn {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      margin: var(--space-2) var(--space-4) var(--space-4);
      background: var(--bg-primary);
      color: var(--error-600);
      text-decoration: none;
      border: 1px solid var(--error-200);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      transition: all var(--transition-base);
      cursor: pointer;
      width: calc(100% - 2 * var(--space-4));
    }

    @media (min-width: 769px) {
      .mobile-logout-btn {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .mobile-logout-btn {
        display: flex;
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-content {
        padding: var(--space-3) 0;
      }

      .header-actions {
        gap: var(--space-2);
      }

      .mobile-menu-toggle {
        display: flex;
      }

      .header-theme-toggle {
        display: none;
      }

      .desktop-logout-btn {
        display: none;
      }

      .header-user-info {
        display: none;
      }
    }

    @media (min-width: 769px) {
      .mobile-menu-toggle {
        display: none;
      }

      .mobile-menu {
        display: none !important;
      }
    }

    @media (max-width: 640px) {
      .header-content {
        padding: var(--space-2) 0;
      }

      .logo-icon {
        width: 32px;
        height: 32px;
      }

      .mobile-menu {
        border-radius: 0 0 var(--radius-lg) var(--radius-lg);
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Initialize component and subscribe to current user changes
   */
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  /**
   * Navigate to home page based on user role
   */
  navigateHome(): void {
    if (this.currentUser) {
      if (this.currentUser.role === 'moderator') {
        this.router.navigate(['/create-delivery']);
      } else {
        this.router.navigate(['/deliveries']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Log out current user and redirect to login
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMobileMenu();
  }

  /**
   * Toggle mobile menu visibility
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
