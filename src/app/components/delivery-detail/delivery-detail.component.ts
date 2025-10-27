import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryService } from '../../services/delivery.service';
import { AuthService } from '../../services/auth.service';
import { Delivery } from '../../models/delivery.model';
import { User } from '../../models/user.model';

/**
 * Component for viewing and managing individual delivery details
 * Allows delivery completion with evidence image upload
 */
@Component({
  selector: 'app-delivery-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="delivery-detail-container" *ngIf="delivery; else loading">
      <div class="header">
        <div class="header-content">
          <div>
            <h1>{{ delivery.title }}</h1>
            <p class="delivery-status">
              Status:
              <span class="status-badge" [class]="'status-' + delivery.status">
                {{ delivery.status | titlecase }}
              </span>
            </p>
          </div>
          <div class="header-actions">
            <button (click)="goBack()" class="btn btn-secondary">
              ← Back to Deliveries
            </button>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="delivery-info">
          <div class="info-section">
            <h2>Delivery Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <label>Description:</label>
                <p>{{ delivery.description }}</p>
              </div>
              <div class="info-item">
                <label>Delivery Zone:</label>
                <p>{{ delivery.deliveryZone }}</p>
              </div>
              <div class="info-item">
                <label>Created:</label>
                <p>{{ delivery.createdAt | date:'medium' }}</p>
              </div>
              <div class="info-item" *ngIf="delivery.completedAt">
                <label>Completed:</label>
                <p>{{ delivery.completedAt | date:'medium' }}</p>
              </div>
              <div class="info-item" *ngIf="delivery.assignedTo">
                <label>Assigned to:</label>
                <p>Delivery Person #{{ delivery.assignedTo }}</p>
              </div>
              <div class="info-item">
                <label>Pickup Location:</label>
                <p>{{ delivery.pickupLocation }}</p>
              </div>
              <div class="info-item">
                <label>Delivery Location:</label>
                <p>{{ delivery.deliveryLocation }}</p>
              </div>
              <div class="info-item">
                <label>Estimated Delivery Time:</label>
                <p>{{ delivery.estimatedDeliveryTime | date:'medium' }}</p>
              </div>
              <div class="info-item" *ngIf="delivery.actualDeliveryTime">
                <label>Actual Delivery Time:</label>
                <p>{{ delivery.actualDeliveryTime | date:'medium' }}</p>
              </div>
              <div class="info-item" *ngIf="delivery.startedAt">
                <label>Started At:</label>
                <p>{{ delivery.startedAt | date:'medium' }}</p>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h2>Package Details</h2>
            <div class="info-grid">
              <div class="info-item">
                <label>Weight:</label>
                <p>{{ delivery.packageDetails.weight }}</p>
              </div>
              <div class="info-item">
                <label>Dimensions:</label>
                <p>{{ delivery.packageDetails.dimensions }}</p>
              </div>
              <div class="info-item">
                <label>Value:</label>
                <p>{{ delivery.packageDetails.value }}</p>
              </div>
              <div class="info-item">
                <label>Fragile:</label>
                <p>
                  <span [class]="delivery.packageDetails.fragile ? 'text-danger' : 'text-success'">
                    {{ delivery.packageDetails.fragile ? 'Yes - Handle with care' : 'No' }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Evidence section for completed deliveries -->
          <div class="info-section" *ngIf="delivery.evidenceImages.length > 0">
            <h2>Delivery Evidence</h2>
            <div class="evidence-grid">
              <div
                class="evidence-item"
                *ngFor="let image of delivery.evidenceImages"
              >
                <img [src]="image" [alt]="'Evidence image'" class="evidence-image" />
              </div>
            </div>
          </div>
        </div>

        <div class="delivery-actions">
          <!-- Actions for delivery personnel -->
          <div class="action-card" *ngIf="currentUser?.role === 'delivery' && canManageDelivery()">
            <h3>Delivery Actions</h3>

            <div class="action-buttons">
              <button
                *ngIf="delivery.status === 'assigned'"
                (click)="startDelivery()"
                class="btn btn-warning btn-full"
              >
                Start Delivery
              </button>

              <button
                *ngIf="delivery.status === 'in_transit' && canManageDelivery()"
                (click)="showCompleteForm = true"
                class="btn btn-success btn-full"
              >
                Complete Delivery
              </button>

              <button
                *ngIf="delivery.status === 'in_transit' && canManageDelivery()"
                (click)="onCancelDelivery()"
                [disabled]="isSubmitting"
                class="btn btn-warning btn-full"
              >
                {{ isSubmitting ? 'Cancelling...' : 'Cancel Delivery' }}
              </button>
            </div>
          </div>

          <!-- Moderator actions -->
          <div class="action-card" *ngIf="currentUser?.role === 'moderator' && isCreator()">
            <h3>Moderator Actions</h3>
            <p>You can view delivery progress and evidence here.</p>
          </div>

          <!-- Delivery completion form -->
          <div class="action-card" *ngIf="showCompleteForm && canManageDelivery()">
            <h3>Complete Delivery</h3>
            <p>Upload evidence images to confirm delivery completion.</p>

            <form (ngSubmit)="onCompleteDelivery()" class="evidence-form">
              <div class="form-group">
                <label for="evidenceImages">Evidence Images:</label>
                <input
                  type="file"
                  id="evidenceImages"
                  (change)="onFileSelected($event)"
                  multiple
                  accept="image/*"
                  class="file-input"
                />
                <div class="file-help">
                  Select one or more images showing delivery completion evidence.
                </div>
              </div>

              <div class="selected-files" *ngIf="selectedFiles.length > 0">
                <p><strong>Selected files:</strong></p>
                <ul>
                  <li *ngFor="let file of selectedFiles">{{ file.name }}</li>
                </ul>
              </div>

              <div class="form-actions">
                <button
                  type="button"
                  (click)="cancelComplete()"
                  class="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="selectedFiles.length === 0 || isUploading"
                  class="btn btn-success"
                >
                  {{ isUploading ? 'Uploading...' : 'Complete Delivery' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Edit delivery time form for delivery personnel -->
          <div class="action-card" *ngIf="currentUser?.role === 'delivery' && canManageDelivery() && delivery?.status === 'in_transit' && !showCompleteForm">
            <h3>Update Delivery Time</h3>
            <p>Set the actual delivery time before completing the delivery.</p>

            <form (ngSubmit)="updateDeliveryTime()" class="time-form">
              <div class="form-group">
                <label for="actualDeliveryTime">Actual Delivery Time:</label>
                <input
                  type="datetime-local"
                  id="actualDeliveryTime"
                  [(ngModel)]="actualDeliveryTimeInput"
                  name="actualDeliveryTime"
                  class="form-control"
                  [value]="delivery?.actualDeliveryTime || ''"
                />
                <div class="help-text">
                  Update the actual time when the delivery will be or was completed.
                </div>
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn btn-primary btn-full"
                  [disabled]="!actualDeliveryTimeInput"
                >
                  Update Delivery Time
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="success-message" *ngIf="successMessage">
        {{ successMessage }}
      </div>

      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <p>Loading delivery details...</p>
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div class="debug-info" style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; font-size: 12px;">
          <strong>Debug Info:</strong><br>
          Current User: {{ currentUser?.id }} ({{ currentUser?.role }})<br>
          Route ID: {{ route.snapshot.paramMap.get('id') }}<br>
          API Base URL: http://localhost:3000
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .delivery-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-5);
    }

    .header {
      margin-bottom: var(--space-8);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header h1 {
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
    }

    .delivery-status {
      margin: 0;
      color: var(--text-secondary);
      font-size: var(--font-size-base);
    }

    .status-badge {
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      display: inline-block;
    }

    .status-available {
      background: linear-gradient(135deg, var(--success-100), var(--success-200));
      color: var(--success-800);
      border: 1px solid var(--success-300);
    }

    .status-assigned {
      background: linear-gradient(135deg, var(--warning-100), var(--warning-200));
      color: var(--warning-800);
      border: 1px solid var(--warning-300);
    }

    .status-in_transit {
      background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
      color: var(--primary-800);
      border: 1px solid var(--primary-300);
    }

    .status-completed {
      background: linear-gradient(135deg, var(--success-100), var(--success-200));
      color: var(--success-800);
      border: 1px solid var(--success-300);
    }

    .status-cancelled {
      background: linear-gradient(135deg, var(--error-100), var(--error-200));
      color: var(--error-800);
      border: 1px solid var(--error-300);
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-6);
    }

    .delivery-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .info-section {
      background: var(--bg-surface);
      padding: var(--space-5);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
    }

    .info-section h2 {
      color: var(--text-primary);
      margin: 0 0 var(--space-4) 0;
      border-bottom: 2px solid var(--primary-500);
      padding-bottom: var(--space-2);
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }

    .info-item {
      display: flex;
      flex-direction: column;
      padding: var(--space-3);
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
    }

    .info-item label {
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: var(--space-1);
      font-size: var(--font-size-sm);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .info-item p {
      margin: 0;
      color: var(--text-secondary);
      line-height: 1.5;
      font-size: var(--font-size-base);
    }

    .text-danger {
      color: var(--error-600);
      font-weight: var(--font-weight-semibold);
    }

    .text-success {
      color: var(--success-600);
      font-weight: var(--font-weight-semibold);
    }

    .evidence-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-4);
      margin-top: var(--space-4);
    }

    .evidence-item {
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: var(--bg-primary);
      transition: all var(--transition-base);
    }

    .evidence-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
      border-color: var(--primary-300);
    }

    .evidence-image {
      width: 100%;
      height: 150px;
      object-fit: cover;
      display: block;
    }

    .delivery-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .action-card {
      background: var(--bg-surface);
      padding: var(--space-5);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
    }

    .action-card h3 {
      color: var(--text-primary);
      margin: 0 0 var(--space-4) 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
    }

    .action-card p {
      color: var(--text-secondary);
      margin: 0 0 var(--space-4) 0;
      line-height: 1.5;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .btn {
      padding: var(--space-3) var(--space-5);
      border: none;
      border-radius: var(--radius-xl);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      transition: all var(--transition-base);
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
      min-height: 48px;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 25%, var(--primary-700) 75%, var(--primary-800) 100%);
      color: var(--white);
      box-shadow: 0 4px 16px rgba(107, 90, 64, 0.3);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-500) 25%, var(--primary-600) 75%, var(--primary-700) 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(107, 90, 64, 0.4);
    }

    .btn-secondary {
      background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
      color: var(--text-primary);
      border: 2px solid var(--border-color);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--bg-primary);
      border-color: var(--primary-300);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(107, 90, 64, 0.2);
    }

    .btn-success {
      background: linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 50%, var(--success-700) 100%);
      color: var(--white);
      border: 2px solid transparent;
      box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .btn-success:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--success-400) 0%, var(--success-500) 50%, var(--success-600) 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
    }

    .btn-warning {
      background: linear-gradient(135deg, var(--warning-500) 0%, var(--warning-600) 50%, var(--warning-700) 100%);
      color: var(--white);
      border: 2px solid transparent;
      box-shadow: 0 4px 16px rgba(251, 191, 36, 0.3);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .btn-warning:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--warning-400) 0%, var(--warning-500) 50%, var(--warning-600) 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
    }

    .btn-full {
      width: 100%;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Dark mode styles */
    [data-theme="dark"] .status-available {
      background: linear-gradient(135deg, var(--dark-success-100), var(--dark-success-200));
      color: var(--dark-success-800);
      border-color: var(--dark-success-300);
    }

    [data-theme="dark"] .status-assigned {
      background: linear-gradient(135deg, var(--dark-warning-100), var(--dark-warning-200));
      color: var(--dark-warning-800);
      border-color: var(--dark-warning-300);
    }

    [data-theme="dark"] .status-in_transit {
      background: linear-gradient(135deg, var(--dark-primary-100), var(--dark-primary-200));
      color: var(--dark-primary-800);
      border-color: var(--dark-primary-300);
    }

    [data-theme="dark"] .status-completed {
      background: linear-gradient(135deg, var(--dark-success-100), var(--dark-success-200));
      color: var(--dark-success-800);
      border-color: var(--dark-success-300);
    }

    [data-theme="dark"] .status-cancelled {
      background: linear-gradient(135deg, var(--dark-error-100), var(--dark-error-200));
      color: var(--dark-error-800);
      border-color: var(--dark-error-300);
    }

    [data-theme="dark"] .btn-primary {
      background: linear-gradient(135deg, var(--dark-primary-400) 0%, var(--dark-primary-500) 25%, var(--dark-primary-600) 75%, var(--dark-primary-700) 100%);
      box-shadow: 0 4px 16px rgba(143, 122, 83, 0.4);
    }

    [data-theme="dark"] .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--dark-primary-300) 0%, var(--dark-primary-400) 25%, var(--dark-primary-500) 75%, var(--dark-primary-600) 100%);
      box-shadow: 0 8px 25px rgba(143, 122, 83, 0.5);
    }

    [data-theme="dark"] .btn-secondary {
      background: linear-gradient(135deg, var(--dark-bg-secondary) 0%, var(--dark-bg-primary) 100%);
      border-color: var(--dark-border);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    [data-theme="dark"] .btn-secondary:hover:not(:disabled) {
      background: var(--dark-bg-primary);
      border-color: var(--dark-primary-300);
      box-shadow: 0 4px 12px rgba(143, 122, 83, 0.3);
    }

    [data-theme="dark"] .btn-success {
      background: linear-gradient(135deg, var(--dark-success-500) 0%, var(--dark-success-600) 50%, var(--dark-success-700) 100%);
      box-shadow: 0 4px 16px rgba(122, 141, 69, 0.4);
    }

    [data-theme="dark"] .btn-success:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--dark-success-400) 0%, var(--dark-success-500) 50%, var(--dark-success-600) 100%);
      box-shadow: 0 8px 25px rgba(122, 141, 69, 0.5);
    }

    [data-theme="dark"] .btn-warning {
      background: linear-gradient(135deg, var(--dark-warning-500) 0%, var(--dark-warning-600) 50%, var(--dark-warning-700) 100%);
      box-shadow: 0 4px 16px rgba(166, 110, 53, 0.4);
    }

    [data-theme="dark"] .btn-warning:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--dark-warning-400) 0%, var(--dark-warning-500) 50%, var(--dark-warning-600) 100%);
      box-shadow: 0 8px 25px rgba(166, 110, 53, 0.5);
    }

    .evidence-form {
      margin-top: var(--space-4);
    }

    .form-group {
      margin-bottom: var(--space-4);
    }

    .form-group label {
      display: block;
      margin-bottom: var(--space-2);
      color: var(--text-primary);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
    }

    .file-input {
      width: 100%;
      padding: var(--space-3);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-lg);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: var(--font-size-base);
      transition: all var(--transition-base);
    }

    .file-input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(191, 163, 110, 0.1);
    }

    .file-help {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
      margin-top: var(--space-1);
    }

    .selected-files {
      margin-top: var(--space-4);
      padding: var(--space-4);
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
    }

    .selected-files p {
      margin: 0 0 var(--space-2) 0;
      color: var(--text-primary);
      font-weight: var(--font-weight-semibold);
    }

    .selected-files ul {
      margin: var(--space-2) 0 0 0;
      padding-left: var(--space-5);
    }

    .selected-files li {
      margin-bottom: var(--space-1);
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
    }

    .form-actions {
      display: flex;
      gap: var(--space-3);
      margin-top: var(--space-4);
    }

    .success-message {
      background: linear-gradient(135deg, var(--success-100), var(--success-200));
      color: var(--success-800);
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      margin-top: var(--space-4);
      text-align: center;
      border: 1px solid var(--success-300);
      font-weight: var(--font-weight-semibold);
    }

    .error-message {
      background: linear-gradient(135deg, var(--error-100), var(--error-200));
      color: var(--error-800);
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      margin-top: var(--space-4);
      text-align: center;
      border: 1px solid var(--error-300);
      font-weight: var(--font-weight-semibold);
    }

    .loading-container {
      text-align: center;
      padding: var(--space-12);
      color: var(--text-secondary);
      font-size: var(--font-size-lg);
    }

    /* Dark mode for messages and form elements */
    [data-theme="dark"] .success-message {
      background: linear-gradient(135deg, var(--dark-success-100), var(--dark-success-200));
      color: var(--dark-success-800);
      border-color: var(--dark-success-300);
    }

    [data-theme="dark"] .error-message {
      background: linear-gradient(135deg, var(--dark-error-100), var(--dark-error-200));
      color: var(--dark-error-800);
      border-color: var(--dark-error-300);
    }

    [data-theme="dark"] .file-input {
      background: var(--dark-bg-primary);
      border-color: var(--dark-border);
      color: var(--dark-text-primary);
    }

    [data-theme="dark"] .file-input:focus {
      border-color: var(--dark-primary-500);
      box-shadow: 0 0 0 3px rgba(212, 184, 133, 0.1);
    }

    [data-theme="dark"] .selected-files {
      background: var(--dark-bg-secondary);
      border-color: var(--dark-border);
    }

    [data-theme="dark"] .selected-files p {
      color: var(--dark-text-primary);
    }

    [data-theme="dark"] .selected-files li {
      color: var(--dark-text-secondary);
    }

    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
        gap: var(--space-4);
      }

      .header-content {
        flex-direction: column;
        gap: var(--space-4);
      }

      .form-actions {
        flex-direction: column;
      }

      .evidence-grid {
        grid-template-columns: 1fr;
      }

      .info-item {
        padding: var(--space-2);
      }
    }
  `]
})
export class DeliveryDetailComponent implements OnInit {
  delivery: Delivery | null = null;
  currentUser: User | null = null;
  showCompleteForm = false;
  selectedFiles: File[] = [];
  isUploading = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  actualDeliveryTimeInput = '';

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private deliveryService: DeliveryService,
    private authService: AuthService
  ) {}

  /**
   * Initialize component and load delivery details
   */
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('Current user loaded:', user);
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Route param id:', this.route.snapshot.paramMap.get('id'));
    console.log('Parsed ID:', id);
    if (id) {
      this.loadDelivery(id);
    } else {
      this.errorMessage = 'No delivery ID provided in the URL.';
      console.error('No delivery ID found in route params');
    }
  }

  /**
   * Load delivery details by ID
   */
  loadDelivery(id: number): void {
    console.log('Loading delivery with ID:', id);
    this.deliveryService.getDelivery(id).subscribe({
      next: (delivery) => {
        console.log('Successfully loaded delivery:', delivery);
        this.delivery = delivery;
        // Initialize the time input with current delivery time or empty string
        this.actualDeliveryTimeInput = delivery.actualDeliveryTime || '';
      },
      error: (error) => {
        console.error('Error loading delivery:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message
        });
        this.errorMessage = `Failed to load delivery details. Error: ${error.status} ${error.statusText}`;
      }
    });
  }

  /**
   * Check if current user can manage this delivery
   */
  canManageDelivery(): boolean {
    return this.delivery?.assignedTo === this.currentUser?.id;
  }

  /**
   * Check if current user is the creator of this delivery
   */
  isCreator(): boolean {
    return this.delivery?.createdBy === this.currentUser?.id;
  }

  /**
   * Navigate back to deliveries list
   */
  goBack(): void {
    this.router.navigate(['/deliveries']);
  }

  /**
   * Start the delivery (mark as in transit)
   */
  startDelivery(): void {
    // This method is no longer needed as delivery automatically starts when taken
    if (this.delivery) {
      this.deliveryService.startDelivery(this.delivery.id).subscribe({
        next: (updatedDelivery) => {
          this.delivery = updatedDelivery;
          this.successMessage = 'Delivery started successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = 'Failed to start delivery.';
          console.error('Error starting delivery:', error);
        }
      });
    }
  }

  /**
   * Handle file selection for evidence images
   */
  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  /**
   * Update the actual delivery time
   */
  updateDeliveryTime(): void {
    if (!this.delivery || !this.actualDeliveryTimeInput) {
      return;
    }

    this.deliveryService.updateDelivery(this.delivery.id, { actualDeliveryTime: this.actualDeliveryTimeInput }).subscribe({
      next: (updatedDelivery) => {
        this.delivery = updatedDelivery;
        this.successMessage = 'Delivery time updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update delivery time.';
        console.error('Error updating delivery time:', error);
      }
    });
  }

  /**
   * Cancel delivery completion
   */
  cancelComplete(): void {
    this.showCompleteForm = false;
    this.selectedFiles = [];
  }

  /**
   * Cancel delivery (only by assigned delivery person)
   */
  onCancelDelivery(): void {
    if (!this.delivery) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.deliveryService.cancelDelivery(this.delivery.id).subscribe({
      next: (updatedDelivery: Delivery) => {
        this.delivery = updatedDelivery;
        this.isSubmitting = false;
        this.successMessage = 'Delivery cancelled successfully. It\'s now available for other delivery personnel.';
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/deliveries']);
        }, 3000);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to cancel delivery. Please try again.';
        console.error('Error cancelling delivery:', error);
      }
    });
  }

  /**
   * Complete delivery with evidence images
   */
  onCompleteDelivery(): void {
    if (!this.delivery || this.selectedFiles.length === 0) {
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';

    // For demo purposes, we'll simulate image upload
    const imageUrls = this.selectedFiles.map((file: File) =>
      `https://via.placeholder.com/300x200?text=${encodeURIComponent(file.name)}`
    );

    // Use the actual delivery time if set, otherwise use current time
    const deliveryTime = this.actualDeliveryTimeInput || new Date().toISOString();

    this.deliveryService.completeDelivery(this.delivery.id, imageUrls).subscribe({
      next: (updatedDelivery: Delivery) => {
        // Update the delivery time if it was set by the delivery person
        if (this.actualDeliveryTimeInput && this.delivery) {
          this.deliveryService.updateDelivery(this.delivery.id, { actualDeliveryTime: this.actualDeliveryTimeInput }).subscribe({
            next: (finalDelivery: Delivery) => {
              this.delivery = finalDelivery;
              this.showCompleteForm = false;
              this.selectedFiles = [];
              this.isUploading = false;
              this.successMessage = 'Delivery completed successfully!';
              setTimeout(() => this.successMessage = '', 3000);
            },
            error: (error: any) => {
              console.error('Error updating delivery time:', error);
              // Still show success since delivery was completed
              this.delivery = updatedDelivery;
              this.showCompleteForm = false;
              this.selectedFiles = [];
              this.isUploading = false;
              this.successMessage = 'Delivery completed successfully!';
              setTimeout(() => this.successMessage = '', 3000);
            }
          });
        } else {
          this.delivery = updatedDelivery;
          this.showCompleteForm = false;
          this.selectedFiles = [];
          this.isUploading = false;
          this.successMessage = 'Delivery completed successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        }
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to complete delivery.';
        this.isUploading = false;
        console.error('Error completing delivery:', error);
      }
    });
  }
}
