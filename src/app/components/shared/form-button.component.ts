import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable Form Button component
 * Features consistent styling, loading states, and icons
 */
@Component({
  selector: 'app-form-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="submit"
      class="btn btn-primary btn-lg form-btn"
      [disabled]="disabled || isLoading"
      (click)="onClick.emit($event)"
    >
      <span *ngIf="!isLoading">{{ text }}</span>
      <span *ngIf="isLoading">{{ loadingText || 'Please wait...' }}</span>
      <svg
        *ngIf="icon && !isLoading"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path [attr.d]="icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div *ngIf="isLoading" class="btn-spinner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 2A10 10 0 0 1 12 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    </button>
  `,
  styles: [`
    .form-btn {
      width: 100%;
      margin-top: var(--space-2);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      padding: var(--space-4) var(--space-6);
      border-radius: var(--radius-xl);
      transition: all var(--transition-base);
      border: none;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 25%, var(--primary-900) 75%, #3a2f1f 100%);
      color: var(--white);
      box-shadow: 0 4px 16px rgba(107, 90, 64, 0.4);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    /* Dark mode button styling */
    [data-theme="dark"] .form-btn {
      background: linear-gradient(135deg, var(--dark-primary-400) 0%, var(--dark-primary-500) 25%, var(--dark-primary-600) 75%, var(--dark-primary-700) 100%);
      box-shadow: 0 4px 16px rgba(143, 122, 83, 0.4);
    }

    .form-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }

    .form-btn:not(:disabled):hover {
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 25%, var(--primary-800) 75%, var(--primary-900) 100%);
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(107, 90, 64, 0.5);
    }

    /* Dark mode hover state */
    [data-theme="dark"] .form-btn:not(:disabled):hover {
      background: linear-gradient(135deg, var(--dark-primary-300) 0%, var(--dark-primary-400) 25%, var(--dark-primary-500) 75%, var(--dark-primary-600) 100%);
      box-shadow: 0 8px 25px rgba(143, 122, 83, 0.5);
    }

    .form-btn:not(:disabled):hover::before {
      left: 100%;
    }

    .form-btn:not(:disabled):active {
      transform: translateY(-1px);
    }

    .form-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 2px 8px rgba(107, 90, 64, 0.3);
    }

    /* Dark mode disabled state */
    [data-theme="dark"] .form-btn:disabled {
      box-shadow: 0 2px 8px rgba(143, 122, 83, 0.3);
    }

    .btn-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .form-btn {
        padding: var(--space-3) var(--space-4);
        font-size: var(--font-size-base);
      }
    }
  `]
})
export class FormButtonComponent {
  @Input() text = 'Submit';
  @Input() loadingText = 'Please wait...';
  @Input() icon = '';
  @Input() disabled = false;
  @Input() isLoading = false;
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'success' = 'primary';

  @Output() onClick = new EventEmitter<Event>();
}
