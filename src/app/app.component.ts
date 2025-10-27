import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { ThemeService } from './services/theme.service';

/**
 * Main application component for Fast shipping
 * Features modern layout with improved spacing and animations
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <main class="main-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-primary);
    }

    .main-content {
      flex: 1;
      padding: var(--space-6) 0;
      position: relative;
    }

    .content-wrapper {
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 var(--space-4);
      animation: fadeIn 0.4s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .main-content {
        padding: var(--space-4) 0;
      }

      .content-wrapper {
        padding: 0 var(--space-3);
      }
    }

    @media (max-width: 640px) {
      .main-content {
        padding: var(--space-3) 0;
      }

      .content-wrapper {
        padding: 0 var(--space-2);
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Fast shipping';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Initialize theme service and listen to system changes
    this.themeService.listenToSystemTheme();
  }
}
