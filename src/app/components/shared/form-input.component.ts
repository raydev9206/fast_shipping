import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Reusable Form Input component with icon and validation
 * Features consistent styling and validation display
 */
@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="form-group">
      <label [for]="inputId" class="form-label" *ngIf="label">
        <svg *ngIf="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path [attr.d]="icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ label }}
        <span *ngIf="required" class="required-indicator">*</span>
      </label>
      <div class="input-wrapper">
        <input
          [type]="currentType"
          [id]="inputId"
          [name]="name"
          [placeholder]="placeholder"
          [required]="required"
          [disabled]="disabled"
          [class.error]="hasError"
          class="form-input"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
        />
        <div class="input-icon" *ngIf="showSuccessIcon && value">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <button
          *ngIf="type === 'password' && showPasswordToggle"
          type="button"
          class="password-toggle"
          (click)="togglePassword()"
          tabindex="-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path *ngIf="!showPassword" d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle *ngIf="!showPassword" cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path *ngIf="showPassword" d="M9.88 9.88C10.32 9.44 10.95 9.17 11.59 9.17C12.23 9.17 12.86 9.44 13.3 9.88L9.88 9.88Z" stroke="currentColor" stroke-width="2"/>
            <path *ngIf="showPassword" d="M14.12 14.12C13.68 14.56 13.05 14.83 12.41 14.83C11.77 14.83 11.14 14.56 10.7 14.12L14.12 14.12Z" stroke="currentColor" stroke-width="2"/>
            <path *ngIf="showPassword" d="M3 3L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="form-error" *ngIf="hasError && errorMessage">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .form-group {
      margin-bottom: var(--space-5);
    }

    .form-label.required::after {
      content: ' *';
      color: var(--error-500);
    }

    .input-wrapper {
      position: relative;
    }

    .form-input {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      padding-right: var(--space-12);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      line-height: var(--line-height-normal);
      background-color: var(--bg-surface);
      color: var(--text-primary);
      transition: all var(--transition-base);
      font-family: inherit;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px var(--primary-100);
      transform: translateY(-1px);
    }

    .form-input.error {
      border-color: var(--error-500);
      box-shadow: 0 0 0 3px var(--error-100);
    }

    .form-input::placeholder {
      color: var(--text-muted);
    }

    .input-icon {
      position: absolute;
      right: var(--space-3);
      top: 50%;
      transform: translateY(-50%);
      color: var(--success-600);
      pointer-events: none;
    }

    .password-toggle {
      position: absolute;
      right: var(--space-3);
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: var(--space-1);
      border-radius: var(--radius-sm);
      transition: all var(--transition-base);
    }

    .password-toggle:hover {
      color: var(--text-secondary);
      background-color: var(--bg-primary);
    }

    .form-error {
      margin-top: var(--space-1);
      font-size: var(--font-size-sm);
      color: var(--error-600);
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-2);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .form-input {
        font-size: 16px; /* Prevents zoom on iOS */
        padding: var(--space-3) var(--space-3);
        padding-right: var(--space-10);
      }

      .form-label {
        font-size: var(--font-size-xs);
      }
    }
  `]
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() inputId = '';
  @Input() name = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'password' | 'email' = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() icon = '';
  @Input() showSuccessIcon = false;
  @Input() showPasswordToggle = false;
  @Input() hasError = false;
  @Input() errorMessage = '';

  value = '';
  showPassword = false;

  get currentType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }

  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
