import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable Form Label component with icon support
 * Features consistent styling for form labels
 */
@Component({
  selector: 'app-form-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [for]="for" class="form-label" [class.required]="required">
      <svg
        *ngIf="icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path [attr.d]="icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      {{ text }}
    </label>
  `,
  styles: [`
    .form-label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-2);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--gray-700);
    }

    .form-label.required::after {
      content: ' *';
      color: var(--error-500);
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .form-label {
        font-size: var(--font-size-xs);
        margin-bottom: var(--space-1);
      }
    }
  `]
})
export class FormLabelComponent {
  @Input() text = '';
  @Input() for = '';
  @Input() icon = '';
  @Input() required = false;
}
