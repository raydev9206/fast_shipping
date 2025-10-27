import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Delivery } from '../../models/delivery.model';
import { User } from '../../models/user.model';

/**
 * Reusable Delivery Card Component
 * Displays delivery information in a card format
 * Used across multiple pages: delivery list, conciliations, etc.
 */
@Component({
  selector: 'app-delivery-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="delivery-card"
      [class]="'status-' + delivery.status"
      [class.assigned]="delivery.status !== 'available'"
      [class.available]="delivery.status === 'available'"
      [class.urgent]="isUrgent()"
    >
      <!-- Card Header -->
      <div class="card-header">
        <div class="delivery-title-section">
          <h3 class="delivery-title">{{ delivery.title }}</h3>
          <div class="delivery-status">
            <span
              class="status-badge"
              [class]="'badge-' + delivery.status"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                *ngIf="delivery.status === 'available'"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M8 12L11 15L16 9"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                *ngIf="delivery.status === 'assigned'"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M12 6V12L16 14"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                *ngIf="delivery.status === 'in_transit'"
              >
                <path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                *ngIf="delivery.status === 'completed'"
              >
                <path
                  d="M22 11.08V12C21.9988 14.8306 20.8299 17.5376 18.7782 19.469C16.7264 21.4004 13.9337 22.3963 11.0726 22.26C8.21153 22.1237 5.49305 20.8691 3.51093 18.8003C1.52881 16.7315 0.440001 13.9905 0.440001 11.08C0.440001 8.16948 1.52881 5.42854 3.51093 3.35972C5.49305 1.2909 8.21153 0.0363037 11.0726 0.00000011938C13.9337 -0.0363034 16.7264 0.593743 18.7782 2.52503C20.8299 4.45633 21.9988 7.16329 22 10V11.08Z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M22 11.08V12C21.9988 14.8306 20.8299 17.5376 18.7782 19.469C16.7264 21.4004 13.9337 22.3963 11.0726 22.26C8.21153 22.1237 5.49305 20.8691 3.51093 18.8003C1.52881 16.7315 0.440001 13.9905 0.440001 11.08C0.440001 8.16948 1.52881 5.42854 3.51093 3.35972C5.49305 1.2909 8.21153 0.0363037 11.0726 0.00000011938C13.9337 -0.0363034 16.7264 0.593743 18.7782 2.52503C20.8299 4.45633 21.9988 7.16329 22 10V11.08Z"
                  fill="currentColor"
                />
              </svg>
              {{ delivery.status | titlecase }}
            </span>
          </div>
        </div>

        <div class="delivery-actions">
          <!-- Take delivery action (for delivery personnel) -->
          <button
            *ngIf="delivery.status === 'available' && currentUser?.role === 'delivery'"
            (click)="takeDelivery.emit(delivery)"
            class="btn btn-primary btn-sm"
            title="Take this delivery"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M20 8V14M17 11H23"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Take
          </button>

          <!-- Complete delivery action -->
          <button
            *ngIf="delivery.status === 'in_transit' && canCompleteDelivery()"
            (click)="completeDelivery.emit(delivery)"
            class="btn btn-success btn-sm"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 11.08V12C21.9988 14.8306 20.8299 17.5376 18.7782 19.469C16.7264 21.4004 13.9337 22.3963 11.0726 22.26C8.21153 22.1237 5.49305 20.8691 3.51093 18.8003C1.52881 16.7315 0.440001 13.9905 0.440001 11.08C0.440001 8.16948 1.52881 5.42854 3.51093 3.35972C5.49305 1.2909 8.21153 0.0363037 11.0726 0.00000011938C13.9337 -0.0363034 16.7264 0.593743 18.7782 2.52503C20.8299 4.45633 21.9988 7.16329 22 10V11.08Z"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M22 11.08V12C21.9988 14.8306 20.8299 17.5376 18.7782 19.469C16.7264 21.4004 13.9337 22.3963 11.0726 22.26C8.21153 22.1237 5.49305 20.8691 3.51093 18.8003C1.52881 16.7315 0.440001 13.9905 0.440001 11.08C0.440001 8.16948 1.52881 5.42854 3.51093 3.35972C5.49305 1.2909 8.21153 0.0363037 11.0726 0.00000011938C13.9337 -0.0363034 16.7264 0.593743 18.7782 2.52503C20.8299 4.45633 21.9988 7.16329 22 10V11.08Z"
                fill="currentColor"
              />
            </svg>
            Complete Delivery
          </button>

          <!-- View details action -->
          <button
            (click)="viewDelivery.emit(delivery.id)"
            class="btn btn-secondary btn-sm"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                stroke="currentColor"
                stroke-width="2"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            View Details
          </button>

          <!-- Cancel delivery action -->
          <button
            *ngIf="canCancelDelivery()"
            (click)="cancelDelivery.emit(delivery)"
            class="btn btn-warning btn-sm"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Cancel Delivery
          </button>

          <!-- Reconcile delivery action (for moderators) -->
          <button
            *ngIf="delivery.status === 'completed' && !delivery.isReconciled && currentUser?.role === 'moderator'"
            (click)="reconcileDelivery.emit(delivery)"
            class="btn btn-info btn-sm"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Reconcile
          </button>
        </div>
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <!-- Description -->
        <div class="delivery-description">
          <p>{{ delivery.description }}</p>
        </div>

        <!-- Delivery Info Grid -->
        <div class="info-grid">
          <div class="info-item">
            <div class="info-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5 7 1 12 1S21 5 21 10Z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle
                  cx="12"
                  cy="10"
                  r="3"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div class="info-content">
              <div class="info-label">Pickup Location</div>
              <div class="info-value">{{ delivery.pickupLocation }}</div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5 7 1 12 1S21 5 21 10Z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle
                  cx="12"
                  cy="10"
                  r="3"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div class="info-content">
              <div class="info-label">Delivery Location</div>
              <div class="info-value">{{ delivery.deliveryLocation }}</div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <polyline
                  points="12,6 12,12 16,14"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div class="info-content">
              <div class="info-label">Estimated Time</div>
              <div class="info-value">{{ delivery.estimatedDeliveryTime | date : "short" }}</div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="info-content">
              <div class="info-label">Value</div>
              <div class="info-value font-semibold">{{ delivery.packageDetails.value }}</div>
            </div>
          </div>
        </div>

        <!-- Delivery Meta -->
        <div class="delivery-meta">
          <div class="meta-item">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="2"
              />
              <polyline
                points="12,6 12,12 16,14"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Created: {{ delivery.createdAt | date : "short" }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .delivery-card {
      background: var(--bg-surface);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-base);
      border: 1px solid var(--border-color);
      overflow: hidden;
      transition: all var(--transition-base);
      position: relative;
      animation: slideInUp 0.5s ease-out;
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
    }

    .delivery-card:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-6px) scale(1.02);
      border-color: var(--primary-300);
    }

    .delivery-card.available {
      border-left: 4px solid var(--primary-500);
    }

    .delivery-card.assigned {
      border-left: 4px solid var(--warning-500);
    }

    .delivery-card.status-in_transit {
      border-left: 4px solid var(--secondary-500);
    }

    .delivery-card.status-completed {
      border-left: 4px solid var(--success-600);
    }

    .delivery-card.urgent {
      border-left: 4px solid var(--error-500);
      animation: pulse 2s infinite;
    }

    /* Card Header */
    .card-header {
      padding: var(--space-5);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-4);
    }

    .delivery-title-section {
      flex: 1;
    }

    .delivery-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
      line-height: var(--line-height-tight);
    }

    .delivery-status {
      display: flex;
      align-items: center;
    }

    .delivery-actions {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    /* Card Body */
    .card-body {
      padding: var(--space-5);
    }

    .delivery-description {
      margin-bottom: var(--space-5);
    }

    .delivery-description p {
      color: var(--text-secondary);
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
      margin-bottom: var(--space-5);
    }

    @media (min-width: 640px) {
      .info-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (min-width: 1024px) {
      .info-grid {
        gap: var(--space-5);
      }
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
    }

    .info-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .info-content {
      flex: 1;
    }

    .info-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-1);
    }

    .info-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .info-value.font-semibold {
      font-weight: var(--font-weight-semibold);
    }

    /* Delivery Meta */
    .delivery-meta {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      padding-top: var(--space-4);
      border-top: 1px solid var(--border-color);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    /* Action Buttons */
    .delivery-actions .btn {
      flex: 1;
      min-width: 100px;
      justify-content: center;
      transition: all var(--transition-base);
      border: 2px solid transparent;
      border-radius: var(--radius-xl);
      font-weight: var(--font-weight-medium);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      font-size: var(--font-size-sm);
      padding: var(--space-2) var(--space-4);
    }

    .delivery-actions .btn svg {
      width: 14px;
      height: 14px;
    }

    .delivery-actions .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(107, 90, 64, 0.3);
    }

    /* Dark mode for action buttons */
    [data-theme="dark"] .delivery-actions .btn {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    [data-theme="dark"] .delivery-actions .btn:hover {
      box-shadow: 0 4px 12px rgba(143, 122, 83, 0.4);
    }

    /* Status Badge */
    .status-badge {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-badge svg {
      width: 12px;
      height: 12px;
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .card-header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-3);
        padding: var(--space-4);
      }

      .delivery-actions {
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        gap: var(--space-1);
      }

      .delivery-actions .btn {
        width: 100%;
        min-width: unset;
        justify-content: center;
        font-size: var(--font-size-sm);
        padding: var(--space-2) var(--space-3);
      }

      .delivery-actions .btn svg {
        width: 12px;
        height: 12px;
      }

      .delivery-title {
        font-size: var(--font-size-base);
        line-height: var(--line-height-normal);
      }

      .card-body {
        padding: var(--space-4);
      }

      .delivery-description {
        margin-bottom: var(--space-4);
      }

      .delivery-description p {
        font-size: var(--font-size-sm);
      }

      .info-grid {
        gap: var(--space-3);
        margin-bottom: var(--space-4);
      }

      .info-icon {
        width: 28px;
        height: 28px;
      }

      .info-label {
        font-size: var(--font-size-xs);
      }

      .info-value {
        font-size: var(--font-size-sm);
      }

      .meta-item {
        font-size: var(--font-size-xs);
      }

      .status-badge {
        font-size: var(--font-size-xs);
        padding: var(--space-1) var(--space-2);
      }

      .status-badge svg {
        width: 10px;
        height: 10px;
      }
    }

    @media (min-width: 641px) {
      .card-header {
        flex-direction: row;
        align-items: flex-start;
      }

      .delivery-actions {
        flex-direction: row;
        flex-wrap: wrap;
      }

      .delivery-title {
        font-size: var(--font-size-lg);
      }
    }

    /* Animations */
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  ],
})
export class DeliveryCardComponent {
  @Input() delivery!: Delivery;
  @Input() currentUser: User | null = null;

  @Output() takeDelivery = new EventEmitter<Delivery>();
  @Output() completeDelivery = new EventEmitter<Delivery>();
  @Output() cancelDelivery = new EventEmitter<Delivery>();
  @Output() viewDelivery = new EventEmitter<number>();
  @Output() reconcileDelivery = new EventEmitter<Delivery>();

  constructor(private router: Router) {}

  /**
   * Check if delivery is urgent (for demo purposes)
   */
  isUrgent(): boolean {
    // Consider urgent if created more than 24 hours ago and still available
    if (this.delivery.status !== 'available') return false;

    const createdDate = new Date(this.delivery.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdDate.getTime()) / (1000 * 3600);

    return hoursDiff > 24;
  }

  /**
   * Check if current user can complete this delivery
   */
  canCompleteDelivery(): boolean {
    return this.currentUser?.role === 'delivery' &&
           this.delivery.assignedTo === this.currentUser?.id &&
           (this.delivery.status === 'in_transit' || this.delivery.status === 'assigned');
  }

  /**
   * Check if current user can cancel this delivery
   */
  canCancelDelivery(): boolean {
    if (!this.currentUser || this.currentUser.role !== 'delivery') return false;
    if (this.delivery.assignedTo !== this.currentUser.id) return false;
    if (this.delivery.status !== 'in_transit' && this.delivery.status !== 'assigned') return false;

    const estimatedTime = new Date(this.delivery.estimatedDeliveryTime);
    const now = new Date();

    return now < estimatedTime;
  }
}
