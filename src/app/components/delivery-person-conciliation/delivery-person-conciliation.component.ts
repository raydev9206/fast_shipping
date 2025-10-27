import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Delivery } from '../../models/delivery.model';
import { ConciliationSummary } from '../../models/conciliation.model';
import { DeliveryService } from '../../services/delivery.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-delivery-person-conciliation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="conciliation-page">
      <div class="page-header">
        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">My Conciliations</h1>
            <p class="page-subtitle">
              Review your completed deliveries and the money you need to pay to the platform
            </p>
          </div>

          <div class="header-actions">
            <button
              (click)="loadData()"
              class="btn btn-primary"
              [disabled]="isLoading"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4V9H4.1M4.1 9C5.2 5.7 8.2 3 12 3C16.4 3 20 6.6 20 11M4.1 9H9M20 20V15H19.9M19.9 15C18.8 18.3 15.8 21 12 21C7.6 21 4 17.4 4 13M19.9 15H15"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="mobile-hidden">Refresh</span>
            </button>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="summary-cards" *ngIf="conciliationSummary">
          <div class="summary-card">
            <div class="summary-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="summary-content">
              <div class="summary-value">\${{ conciliationSummary.totalEarnings.toFixed(2) }}</div>
              <div class="summary-label">Total Earnings</div>
            </div>
          </div>

          <div class="summary-card warning">
            <div class="summary-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="summary-content">
              <div class="summary-value">\${{ conciliationSummary.amountToPay.toFixed(2) }}</div>
              <div class="summary-label">You need to pay</div>
              <div class="summary-sublabel">10% commission</div>
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="summary-content">
              <div class="summary-value">{{ conciliationSummary.totalDeliveries }}</div>
              <div class="summary-label">Total Deliveries</div>
            </div>
          </div>

          <div class="summary-card danger" *ngIf="conciliationSummary.pendingDeliveries > 0">
            <div class="summary-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="summary-content">
              <div class="summary-value">{{ conciliationSummary.pendingDeliveries }}</div>
              <div class="summary-label">Pending</div>
              <div class="summary-sublabel">\${{ conciliationSummary.pendingValue.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Completed Deliveries List -->
      <div class="deliveries-section">
        <div class="section-header">
          <h2 class="section-title">Completed Deliveries</h2>
          <p class="section-subtitle">
            {{ completedDeliveries.length }} completed deliveries
          </p>
        </div>

        <div class="delivery-grid" *ngIf="!isLoading && completedDeliveries.length > 0">
          <div
            class="delivery-card"
            *ngFor="let delivery of completedDeliveries; trackBy: trackByDeliveryId"
            [class.reconciled]="delivery.isReconciled"
            [class.pending]="!delivery.isReconciled"
          >
            <!-- Card Header -->
            <div class="card-header">
              <div class="delivery-title-section">
                <h3 class="delivery-title">{{ delivery.title }}</h3>
                <div class="delivery-status">
                  <span class="status-badge" [class]="'badge-' + (delivery.isReconciled ? 'success' : 'warning')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                         *ngIf="delivery.isReconciled">
                      <path d="M22 11.08V12C21.9988 14.8306 20.8299 17.5376 18.7782 19.469C16.7264 21.4004 13.9337 22.3963 11.0726 22.26C8.21153 22.1237 5.49305 20.8691 3.51093 18.8003C1.52881 16.7315 0.440001 13.9905 0.440001 11.08C0.440001 8.16948 1.52881 5.42854 3.51093 3.35972C5.49305 1.2909 8.21153 0.0363037 11.0726 0.00000011938C13.9337 -0.0363034 16.7264 0.593743 18.7782 2.52503C20.8299 4.45633 21.9988 7.16329 22 10V11.08Z"
                            stroke="currentColor" stroke-width="2"/>
                      <path d="M22 11.08V12C21.9988 14.8306 20.8299 17.5376 18.7782 19.469C16.7264 21.4004 13.9337 22.3963 11.0726 22.26C8.21153 22.1237 5.49305 20.8691 3.51093 18.8003C1.52881 16.7315 0.440001 13.9905 0.440001 11.08C0.440001 8.16948 1.52881 5.42854 3.51093 3.35972C5.49305 1.2909 8.21153 0.0363037 11.0726 0.00000011938C13.9337 -0.0363034 16.7264 0.593743 18.7782 2.52503C20.8299 4.45633 21.9988 7.16329 22 10V11.08Z"
                            fill="currentColor"/>
                    </svg>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                         *ngIf="!delivery.isReconciled">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ delivery.isReconciled ? 'Reconciled' : 'Pending' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body">
              <div class="delivery-info">
                <div class="info-row">
                  <div class="info-item">
                    <div class="info-label">Valor de Entrega</div>
                    <div class="info-value">\${{ delivery.deliveryFee?.toFixed(2) }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Tu Ganancia (90%)</div>
                    <div class="info-value text-success">\${{ (delivery.deliveryFee ?? 0 * 0.9)?.toFixed(2) }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Comisión Plataforma (10%)</div>
                    <div class="info-value text-warning">\${{ (delivery.deliveryFee ?? 0 * 0.1)?.toFixed(2) }}</div>
                  </div>
                </div>

                <div class="info-row">
                  <div class="info-item">
                    <div class="info-label">Fecha de Entrega</div>
                    <div class="info-value">{{ delivery.completedAt | date:'short' }}</div>
                  </div>
                  <div class="info-item" *ngIf="delivery.isReconciled">
                    <div class="info-label">Conciliada el</div>
                    <div class="info-value">{{ delivery.reconciledAt | date:'short' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="!isLoading && completedDeliveries.length === 0">
          <div class="empty-content">
            <div class="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="empty-title">No completed deliveries</h3>
            <p class="empty-message">
              When you complete deliveries, they will appear here so you can view the financial summary.
            </p>
          </div>
        </div>

        <!-- Loading State -->
        <div class="loading-state" *ngIf="isLoading">
          <div class="loading-grid">
            <div class="loading-card" *ngFor="let item of [1,2,3,4,5,6]">
              <div class="loading-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .conciliation-page {
      min-height: calc(100vh - 80px);
      background-color: var(--bg-primary);
      padding: var(--space-6) 0;
    }

    .page-header {
      margin-bottom: var(--space-8);
    }

    .header-content {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: var(--space-6);
      gap: var(--space-4);
    }

    .page-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
    }

    .page-subtitle {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      margin: 0;
      line-height: var(--line-height-relaxed);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-4);
    }

    .summary-card {
      background: var(--bg-surface);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
      padding: var(--space-6);
      box-shadow: var(--shadow-sm);
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .summary-card.warning {
      border-left: 4px solid var(--warning-500);
      background: linear-gradient(135deg, var(--bg-surface) 0%, rgba(245, 158, 11, 0.03) 100%);
    }

    .summary-card.danger {
      border-left: 4px solid var(--error-500);
      background: linear-gradient(135deg, var(--bg-surface) 0%, rgba(239, 68, 68, 0.03) 100%);
    }

    .summary-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: var(--primary-100);
      border-radius: var(--radius-xl);
      color: var(--primary-600);
    }

    .summary-card.warning .summary-icon {
      background: var(--warning-100);
      color: var(--warning-600);
    }

    .summary-card.danger .summary-icon {
      background: var(--error-100);
      color: var(--error-600);
    }

    .summary-content {
      flex: 1;
    }

    .summary-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      line-height: 1.2;
    }

    .summary-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
      margin-top: var(--space-1);
    }

    .summary-sublabel {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      margin-top: var(--space-0-5);
    }

    .deliveries-section {
      background: var(--bg-surface);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
      padding: var(--space-6);
    }

    .section-header {
      margin-bottom: var(--space-6);
    }

    .section-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
    }

    .section-subtitle {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0;
    }

    .delivery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: var(--space-4);
    }

    .delivery-card {
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      overflow: hidden;
      transition: all var(--transition-base);
    }

    .delivery-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .delivery-card.reconciled {
      border-left: 4px solid var(--success-500);
      background: linear-gradient(135deg, var(--bg-surface) 0%, rgba(34, 197, 94, 0.03) 100%);
    }

    .delivery-card.pending {
      border-left: 4px solid var(--warning-500);
      background: linear-gradient(135deg, var(--bg-surface) 0%, rgba(245, 158, 11, 0.03) 100%);
    }

    .card-header {
      padding: var(--space-4);
      border-bottom: 1px solid var(--border-color);
    }

    .delivery-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
    }

    .delivery-status {
      display: flex;
      align-items: center;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: var(--space-1-5);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-success {
      background: var(--success-100);
      color: var(--success-700);
    }

    .badge-warning {
      background: var(--warning-100);
      color: var(--warning-700);
    }

    .card-body {
      padding: var(--space-4);
    }

    .delivery-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .info-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: var(--space-4);
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .info-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .info-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .info-value.text-success {
      color: var(--success-600);
    }

    .info-value.text-warning {
      color: var(--warning-600);
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      padding: var(--space-8);
    }

    .empty-content {
      text-align: center;
      max-width: 400px;
    }

    .empty-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background: var(--primary-100);
      border-radius: var(--radius-2xl);
      color: var(--primary-600);
      margin: 0 auto var(--space-6) auto;
    }

    .empty-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
    }

    .empty-message {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .loading-state {
      margin-top: var(--space-8);
    }

    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: var(--space-4);
    }

    .loading-card {
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      height: 200px;
      position: relative;
      overflow: hidden;
    }

    .loading-shimmer {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    @media (max-width: 768px) {
      .info-row {
        grid-template-columns: 1fr;
      }

      .summary-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DeliveryPersonConciliationComponent implements OnInit {
  completedDeliveries: Delivery[] = [];
  conciliationSummary: ConciliationSummary | null = null;
  isLoading = false;
  currentUser: any = null;

  constructor(
    private deliveryService: DeliveryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadData();
      }
    });
  }

  loadData(): void {
    this.isLoading = true;

    // Load completed deliveries
    if (this.currentUser) {
      this.deliveryService.getCompletedDeliveriesByPerson(this.currentUser.id).subscribe({
        next: (deliveries) => {
          this.completedDeliveries = deliveries;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading completed deliveries:', error);
          this.isLoading = false;
        }
      });

      // Load conciliation summary
      this.deliveryService.getConciliationSummary(this.currentUser.id).subscribe({
        next: (summary) => {
          this.conciliationSummary = summary;
        },
        error: (error) => {
          console.error('Error loading conciliation summary:', error);
        }
      });
    }
  }

  trackByDeliveryId(index: number, delivery: Delivery): number {
    return delivery.id;
  }
}
