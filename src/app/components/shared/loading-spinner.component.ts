import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable Loading Spinner component
 * Features customizable size, color, and text
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-state" [class.inline]="inline">
      <div class="loading-spinner" [style.width]="size" [style.height]="size">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 2A10 10 0 0 1 12 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <span *ngIf="text" class="loading-text">{{ text }}</span>
    </div>
  `,
  styles: [`
    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      color: var(--primary-600);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .loading-state.inline {
      display: inline-flex;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      animation: spin 1s linear infinite;
    }

    .loading-text {
      font-size: var(--font-size-sm);
      color: var(--gray-600);
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .loading-state {
        gap: var(--space-1);
      }

      .loading-text {
        font-size: var(--font-size-xs);
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() text = '';
  @Input() size = '20px';
  @Input() inline = false;
}
