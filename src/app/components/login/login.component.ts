import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import {
  FormInputComponent,
  FormButtonComponent,
  LoadingSpinnerComponent,
  ErrorMessageComponent,
} from "../shared";

/**
 * Modern Login component for user authentication
 * Features improved design with icons, animations, and better UX
 */
@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormInputComponent,
    FormButtonComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
  ],
  template: `
    <div class="login-page">
      <div class="login-wrapper">
        <!-- Login Card -->
        <div class="login-card">
          <!-- Header Section -->
          <div class="login-header">
            <div class="logo-section">
              <div class="logo-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8 9L12 13L16 9"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="logo-text">
                <h1>Fast shipping</h1>
                <p>Welcome back! Please sign in to continue.</p>
              </div>
            </div>
          </div>

          <!-- Login Form -->
          <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="login-form">
            <!-- Username Field -->
            <app-form-input
              label="Username"
              inputId="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              icon="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
              [(ngModel)]="credentials.username"
              [showSuccessIcon]="true"
              [required]="true"
            ></app-form-input>

            <!-- Password Field -->
            <app-form-input
              label="Password"
              inputId="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              icon="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15ZM12 15V21M8 19H16"
              [(ngModel)]="credentials.password"
              [showPasswordToggle]="true"
              [required]="true"
            ></app-form-input>

            <!-- Error Message -->
            <app-error-message
              [message]="errorMessage"
              [animate]="true"
            ></app-error-message>

            <!-- Loading State -->
            <app-loading-spinner
              *ngIf="isLoading"
              text="Signing in..."
            ></app-loading-spinner>

            <!-- Submit Button -->
            <app-form-button
              text="Sign In"
              icon="M15 3H9C6.79086 3 5 4.79086 5 7V17C5 19.2091 6.79086 21 9 21H15C17.2091 21 19 19.2091 19 17V7C19 4.79086 17.2091 3 15 3Z"
              [isLoading]="isLoading"
              [disabled]="!credentials.username || !credentials.password"
            ></app-form-button>
          </form>
        </div>

       
      </div>
    </div>
  `,
  styles: [
    `
      .login-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        padding: var(--space-4);
      }

      .login-page::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 1;
      }

      .login-page::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23bfa36e" fill-opacity="0.03"><circle cx="30" cy="30" r="2"/></g></svg>');
        pointer-events: none;
        z-index: 2;
        opacity: 0.7;
      }

      .login-wrapper {
        width: 100%;
        max-width: 480px;
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 100vh;
      }

      .login-card {
        border-radius: var(--radius-2xl);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15),
          0 10px 30px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--border-color);
        overflow: hidden;
        backdrop-filter: blur(25px);
        animation: slideUp 0.8s ease-out;
        width: 100%;
        position: relative;
        border-top: none;
      }

      .login-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent,
          var(--primary-400),
          var(--primary-500),
          var(--primary-400),
          transparent
        );
        opacity: 0.8;
        box-shadow: 0 0 10px rgba(191, 163, 110, 0.3);
      }

      .login-card::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.03) 0%,
            transparent 30%,
            transparent 70%,
            rgba(191, 163, 110, 0.02) 100%
          ),
          radial-gradient(
            circle at 50% 0%,
            rgba(191, 163, 110, 0.05) 0%,
            transparent 50%
          );
        pointer-events: none;
        border-radius: inherit;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Header Section */
      .login-header {
        padding: var(--space-8) var(--space-6) var(--space-6);
        text-align: center;
        background: linear-gradient(
          135deg,
          var(--primary-700) 0%,
          var(--primary-800) 25%,
          var(--primary-900) 75%,
          #3a2f1f 100%
        );
        color: var(--white);
        position: relative;
        overflow: hidden;
        border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
      }

      /* Dark mode header with enhanced contrast */
      [data-theme="dark"] .login-header {
        background: linear-gradient(
          135deg,
          var(--dark-primary-400) 0%,
          var(--dark-primary-500) 25%,
          var(--dark-primary-600) 75%,
          var(--dark-primary-700) 100%
        );
      }

      .login-header::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 40%
          ),
          radial-gradient(
            circle at 70% 70%,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 50%
          ),
          linear-gradient(
            45deg,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 30%,
            transparent 60%
          );
        pointer-events: none;
      }

      .login-header::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.1) 0%,
          transparent 25%,
          transparent 75%,
          rgba(0, 0, 0, 0.1) 100%
        );
        pointer-events: none;
      }

      .logo-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-4);
      }

      .logo-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: var(--radius-2xl);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        z-index: 1;
        transition: all var(--transition-base);
      }

      .logo-icon:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      }

      .logo-text h1 {
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        margin: 0;
        letter-spacing: -0.025em;
        color: var(--white);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        position: relative;
        z-index: 1;
      }

      .logo-text p {
        font-size: var(--font-size-base);
        opacity: 0.9;
        margin: var(--space-1) 0 0;
        font-weight: var(--font-weight-normal);
        color: var(--white);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        position: relative;
        z-index: 1;
      }

      /* Form Section */
      .login-form {
        padding: var(--space-6) var(--space-6) var(--space-4);
      }

      /* Background Elements */
      .background-elements {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        pointer-events: none;
      }

      .bg-shape {
        position: absolute;
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          var(--primary-200),
          var(--primary-300),
          var(--primary-400)
        );
        opacity: 0.2;
        animation: float 8s ease-in-out infinite;
        border: 2px solid rgba(191, 163, 110, 0.4);
        box-shadow: 0 0 30px rgba(191, 163, 110, 0.2);
      }

      .shape-1 {
        width: 200px;
        height: 200px;
        top: 10%;
        left: -10%;
        animation-delay: 0s;
        background: linear-gradient(
          135deg,
          var(--primary-300),
          var(--primary-400),
          var(--primary-500)
        );
        opacity: 0.25;
      }

      .shape-2 {
        width: 150px;
        height: 150px;
        top: 60%;
        right: -10%;
        animation-delay: 3s;
        background: linear-gradient(
          135deg,
          var(--primary-200),
          var(--primary-300),
          var(--primary-400)
        );
        opacity: 0.2;
      }

      .shape-3 {
        width: 100px;
        height: 100px;
        bottom: 20%;
        left: 20%;
        animation-delay: 6s;
        background: linear-gradient(
          135deg,
          var(--primary-400),
          var(--primary-500),
          var(--primary-600)
        );
        opacity: 0.15;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0px) rotate(0deg) scale(1);
          opacity: 0.15;
        }
        25% {
          transform: translateY(-15px) rotate(90deg) scale(1.05);
          opacity: 0.25;
        }
        50% {
          transform: translateY(-30px) rotate(180deg) scale(1.1);
          opacity: 0.3;
        }
        75% {
          transform: translateY(-15px) rotate(270deg) scale(1.05);
          opacity: 0.25;
        }
      }

      /* Responsive Design */
      @media (max-width: 640px) {
        .login-page {
          padding: var(--space-2);
        }

        .login-wrapper {
          max-width: 100%;
        }

        .login-card {
          border-radius: var(--radius-xl);
        }

        .login-header {
          padding: var(--space-6) var(--space-4) var(--space-4);
        }

        .logo-icon {
          width: 48px;
          height: 48px;
        }

        .logo-text h1 {
          font-size: var(--font-size-xl);
        }

        .login-form {
          padding: var(--space-4);
        }
      }
    `,
  ],
})
export class LoginComponent {
  credentials = {
    username: "",
    password: "",
  };

  errorMessage = "";
  isLoading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Handles user login attempt
   * Validates credentials and redirects based on user role
   */
  onLogin(): void {
    if (this.isLoading) return;

    this.errorMessage = "";
    this.isLoading = true;

    this.authService.login(this.credentials).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user) {
          // Navigate based on user role
          if (user.role === "moderator") {
            this.router.navigate(["/create-delivery"]);
          } else {
            this.router.navigate(["/deliveries"]);
          }
        } else {
          this.errorMessage = "Invalid username or password";
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = "Login failed. Please try again.";
        console.error("Login error:", error);
      },
    });
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
