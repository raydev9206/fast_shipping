import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable Error Message component
 * Features consistent styling and icon display
 */
@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-message" *ngIf="message" [class.shake]="animate">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      {{ message }}
    </div>
  `,
  styles: [`
    .error-message {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3);
      background-color: var(--error-50);
      border: 1px solid var(--error-200);
      border-radius: var(--radius-lg);
      color: var(--error-700);
      font-size: var(--font-size-sm);
      margin-bottom: var(--space-4);
    }

    .error-message.shake {
      animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .error-message {
        padding: var(--space-2);
        font-size: var(--font-size-xs);
        margin-bottom: var(--space-3);
      }
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message = '';
  @Input() animate = false;
}
