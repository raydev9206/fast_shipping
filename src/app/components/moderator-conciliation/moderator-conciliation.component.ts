import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryConciliation, ConciliationFilter } from '../../models/conciliation.model';
import { DeliveryService } from '../../services/delivery.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-moderator-conciliation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="conciliation-page">
      <div class="page-header">
        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">Reconciliations</h1>
            <p class="page-subtitle">
              Manage financial reconciliations for all completed deliveries
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

        <!-- Platform Summary -->
        <div class="platform-summary" *ngIf="platformSummary">
          <div class="summary-title">Platform Summary</div>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-number">{{ platformSummary.totalDeliveries }}</div>
              <div class="summary-label">Total Deliveries</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">\${{ platformSummary.totalCommissions.toFixed(2) }}</div>
              <div class="summary-label">Total Earnings</div>
            </div>
            <div class="summary-item success">
              <div class="summary-number">{{ platformSummary.reconciledDeliveries }}</div>
              <div class="summary-label">Reconciled</div>
            </div>
            <div class="summary-item warning">
              <div class="summary-number">{{ platformSummary.pendingDeliveries }}</div>
              <div class="summary-label">Pending</div>
              <div class="summary-sublabel">\${{ platformSummary.pendingCommissions.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="tabs-container">
        <div class="tabs-nav">
          <button
            class="tab-button"
            [class.active]="activeTab === 'pending'"
            (click)="setActiveTab('pending')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Pending ({{ pendingConciliations.length }})
          </button>
          <button
            class="tab-button"
            [class.active]="activeTab === 'reconciled'"
            (click)="setActiveTab('reconciled')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12C21.9988 14.8306 20.8299 17.5376 18.7782 19.469C16.7264 21.4004 13.9337 22.3963 11.0726 22.26C8.21153 22.1237 5.49305 20.8691 3.51093 18.8003C1.52881 16.7315 0.440001 13.9905 0.440001 11.08C0.440001 8.16948 1.52881 5.42854 3.51093 3.35972C5.49305 1.2909 8.21153 0.0363037 11.0726 0.00000011938C13.9337 -0.0363034 16.7264 0.593743 18.7782 2.52503C20.8299 4.45633 21.9988 7.16329 22 10V11.08Z"
                    stroke="currentColor" stroke-width="2"/>
              <path d="M22 11.08V12C21.9988 14.8306 20.8299 17.5376 18.7782 19.469C16.7264 21.4004 13.9337 22.3963 11.0726 22.26C8.21153 22.1237 5.49305 20.8691 3.51093 18.8003C1.52881 16.7315 0.440001 13.9905 0.440001 11.08C0.440001 8.16948 1.52881 5.42854 3.51093 3.35972C5.49305 1.2909 8.21153 0.0363037 11.0726 0.00000011938C13.9337 -0.0363034 16.7264 0.593743 18.7782 2.52503C20.8299 4.45633 21.9988 7.16329 22 10V11.08Z"
                    fill="currentColor"/>
            </svg>
            Reconciled ({{ reconciledConciliations.length }})
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Pending Reconciliations Tab -->
          <div class="tab-pane" [class.active]="activeTab === 'pending'">
            <div class="conciliation-grid" *ngIf="!isLoading && pendingConciliations.length > 0">
              <div
                class="conciliation-card"
                *ngFor="let conciliation of pendingConciliations; trackBy: trackByConciliationId"
              >
                <!-- Card Header -->
                <div class="card-header">
                  <div class="delivery-info">
                    <h3 class="delivery-title">{{ conciliation.deliveryTitle }}</h3>
                    <div class="delivery-meta">
                      <span class="delivery-person">{{ conciliation.deliveryPersonName }}</span>
                      <span class="delivery-date">{{ conciliation.completedAt | date:'short' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Card Body -->
                <div class="card-body">
                  <div class="financial-info">
                    <div class="financial-row">
                      <div class="financial-item">
                        <div class="financial-label">Delivery Fee</div>
                        <div class="financial-value">\${{ conciliation.deliveryFee.toFixed(2) }}</div>
                      </div>
                      <div class="financial-item">
                        <div class="financial-label">Delivery Person Earnings (90%)</div>
                        <div class="financial-value text-success">\${{ conciliation.deliveryPersonEarnings.toFixed(2) }}</div>
                      </div>
                      <div class="financial-item">
                        <div class="financial-label">Platform Commission (10%)</div>
                        <div class="financial-value text-primary">\${{ conciliation.platformCommission.toFixed(2) }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Card Footer -->
                <div class="card-footer">
                  <button
                    (click)="reconcileDelivery(conciliation.deliveryId)"
                    class="btn btn-success btn-sm"
                    [disabled]="isReconciling"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11.08V12C21.9988 14.8306 20.8299 17.5376 18.7782 19.469C16.7264 21.4004 13.9337 22.3963 11.0726 22.26C8.21153 22.1237 5.49305 20.8691 3.51093 18.8003C1.52881 16.7315 0.440001 13.9905 0.440001 11.08C0.440001 8.16948 1.52881 5.42854 3.51093 3.35972C5.49305 1.2909 8.21153 0.0363037 11.0726 0.00000011938C13.9337 -0.0363034 16.7264 0.593743 18.7782 2.52503C20.8299 4.45633 21.9988 7.16329 22 10V11.08Z"
                            stroke="currentColor" stroke-width="2"/>
                      <path d="M22 11.08V12C21.9988 14.8306 20.8299 17.5376 18.7782 19.469C16.7264 21.4004 13.9337 22.3963 11.0726 22.26C8.21153 22.1237 5.49305 20.8691 3.51093 18.8003C1.52881 16.7315 0.440001 13.9905 0.440001 11.08C0.440001 8.16948 1.52881 5.42854 3.51093 3.35972C5.49305 1.2909 8.21153 0.0363037 11.0726 0.00000011938C13.9337 -0.0363034 16.7264 0.593743 18.7782 2.52503C20.8299 4.45633 21.9988 7.16329 22 10V11.08Z"
                            fill="currentColor"/>
                    </svg>
                    Conciliar
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div class="empty-state" *ngIf="!isLoading && pendingConciliations.length === 0">
              <div class="empty-content">
                <div class="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12C21.9988 14.8306 20.8299 17.5376 18.7782 19.469C16.7264 21.4004 13.9337 22.3963 11.0726 22.26C8.21153 22.1237 5.49305 20.8691 3.51093 18.8003C1.52881 16.7315 0.440001 13.9905 0.440001 11.08C0.440001 8.16948 1.52881 5.42854 3.51093 3.35972C5.49305 1.2909 8.21153 0.0363037 11.0726 0.00000011938C13.9337 -0.0363034 16.7264 0.593743 18.7782 2.52503C20.8299 4.45633 21.9988 7.16329 22 10V11.08Z"
                          stroke="currentColor" stroke-width="2"/>
                    <path d="M22 11.08V12C21.9988 14.8306 20.8299 17.5376 18.7782 19.469C16.7264 21.4004 13.9337 22.3963 11.0726 22.26C8.21153 22.1237 5.49305 20.8691 3.51093 18.8003C1.52881 16.7315 0.440001 13.9905 0.440001 11.08C0.440001 8.16948 1.52881 5.42854 3.51093 3.35972C5.49305 1.2909 8.21153 0.0363037 11.0726 0.00000011938C13.9337 -0.0363034 16.7264 0.593743 18.7782 2.52503C20.8299 4.45633 21.9988 7.16329 22 10V11.08Z"
                          fill="currentColor"/>
                  </svg>
                </div>
                <h3 class="empty-title">¡Excellent!</h3>
                <p class="empty-message">
                  All completed deliveries have been reconciled. There are no pending deliveries to process.
                </p>
              </div>
            </div>
          </div>

          <!-- Reconciled Tab -->
          <div class="tab-pane" [class.active]="activeTab === 'reconciled'">
            <div class="conciliation-grid" *ngIf="!isLoading && reconciledConciliations.length > 0">
              <div
                class="conciliation-card reconciled"
                *ngFor="let conciliation of reconciledConciliations; trackBy: trackByConciliationId"
              >
                <!-- Card Header -->
                <div class="card-header">
                  <div class="delivery-info">
                    <h3 class="delivery-title">{{ conciliation.deliveryTitle }}</h3>
                    <div class="delivery-meta">
                      <span class="delivery-person">{{ conciliation.deliveryPersonName }}</span>
                      <span class="delivery-date">{{ conciliation.completedAt | date:'short' }}</span>
                    </div>
                  </div>
                  <div class="reconciled-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11.08V12C21.9988 14.8306 20.8299 17.5376 18.7782 19.469C16.7264 21.4004 13.9337 22.3963 11.0726 22.26C8.21153 22.1237 5.49305 20.8691 3.51093 18.8003C1.52881 16.7315 0.440001 13.9905 0.440001 11.08C0.440001 8.16948 1.52881 5.42854 3.51093 3.35972C5.49305 1.2909 8.21153 0.0363037 11.0726 0.00000011938C13.9337 -0.0363034 16.7264 0.593743 18.7782 2.52503C20.8299 4.45633 21.9988 7.16329 22 10V11.08Z"
                            stroke="currentColor" stroke-width="2"/>
                      <path d="M22 11.08V12C21.9988 14.8306 20.8299 17.5376 18.7782 19.469C16.7264 21.4004 13.9337 22.3963 11.0726 22.26C8.21153 22.1237 5.49305 20.8691 3.51093 18.8003C1.52881 16.7315 0.440001 13.9905 0.440001 11.08C0.440001 8.16948 1.52881 5.42854 3.51093 3.35972C5.49305 1.2909 8.21153 0.0363037 11.0726 0.00000011938C13.9337 -0.0363034 16.7264 0.593743 18.7782 2.52503C20.8299 4.45633 21.9988 7.16329 22 10V11.08Z"
                            fill="currentColor"/>
                    </svg>
                    Reconciled
                  </div>
                </div>

                <!-- Card Body -->
                <div class="card-body">
                  <div class="financial-info">
                    <div class="financial-row">
                      <div class="financial-item">
                        <div class="financial-label">Delivery Fee</div>
                        <div class="financial-value">\${{ conciliation.deliveryFee.toFixed(2) }}</div>
                      </div>
                      <div class="financial-item">
                        <div class="financial-label">Delivery Person Earnings (90%)</div>
                        <div class="financial-value text-success">\${{ conciliation.deliveryPersonEarnings.toFixed(2) }}</div>
                      </div>
                      <div class="financial-item">
                        <div class="financial-label">Platform Commission (10%)</div>
                        <div class="financial-value text-primary">\${{ conciliation.platformCommission.toFixed(2) }}</div>
                      </div>
                    </div>

                    <div class="financial-row" *ngIf="conciliation.reconciledAt">
                      <div class="financial-item">
                        <div class="financial-label">Reconciled at</div>
                        <div class="financial-value">{{ conciliation.reconciledAt | date:'short' }}</div>
                      </div>
                      <div class="financial-item">
                        <div class="financial-label">Reconciled by</div>
                        <div class="financial-value">{{ conciliation.reconciledByName || 'Admin' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div class="empty-state" *ngIf="!isLoading && reconciledConciliations.length === 0">
              <div class="empty-content">
                <div class="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3 class="empty-title">There are no conciliations</h3>
                <p class="empty-message">
                  When you process reconciliations, they will appear here so you can review the history.
                </p>
              </div>
            </div>
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

    .platform-summary {
      background: var(--bg-surface);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
      padding: var(--space-6);
      box-shadow: var(--shadow-sm);
    }

    .summary-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-4) 0;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--space-4);
    }

    .summary-item {
      text-align: center;
      padding: var(--space-4);
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
    }

    .summary-item.success {
      border-left: 4px solid var(--success-500);
      background: linear-gradient(135deg, var(--bg-primary) 0%, rgba(34, 197, 94, 0.03) 100%);
    }

    .summary-item.warning {
      border-left: 4px solid var(--warning-500);
      background: linear-gradient(135deg, var(--bg-primary) 0%, rgba(245, 158, 11, 0.03) 100%);
    }

    .summary-number {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin-bottom: var(--space-1);
    }

    .summary-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
    }

    .summary-sublabel {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      margin-top: var(--space-0-5);
    }

    .tabs-container {
      background: var(--bg-surface);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .tabs-nav {
      display: flex;
      gap: var(--space-1);
      padding: var(--space-4);
      border-bottom: 1px solid var(--border-color);
      background: var(--bg-primary);
    }

    .tab-button {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all var(--transition-base);
      text-decoration: none;
      white-space: nowrap;
    }

    .tab-button:hover {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
      border-color: var(--primary-300);
    }

    .tab-button.active {
      background-color: var(--primary-500);
      color: white;
      border-color: var(--primary-500);
    }

    .tab-content {
      padding: var(--space-6);
      min-height: 400px;
    }

    .tab-pane {
      display: none;
    }

    .tab-pane.active {
      display: block;
    }

    .conciliation-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
      gap: var(--space-4);
    }

    .conciliation-card {
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      overflow: hidden;
      transition: all var(--transition-base);
    }

    .conciliation-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .conciliation-card.reconciled {
      border-left: 4px solid var(--success-500);
      background: linear-gradient(135deg, var(--bg-surface) 0%, rgba(34, 197, 94, 0.03) 100%);
    }

    .card-header {
      padding: var(--space-4);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-3);
    }

    .delivery-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
      line-height: var(--line-height-tight);
    }

    .delivery-meta {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .delivery-person {
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .reconciled-badge {
      display: flex;
      align-items: center;
      gap: var(--space-1-5);
      padding: var(--space-1) var(--space-2);
      background: var(--success-100);
      color: var(--success-700);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      white-space: nowrap;
    }

    .card-body {
      padding: var(--space-4);
    }

    .financial-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .financial-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: var(--space-4);
    }

    .financial-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .financial-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .financial-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .financial-value.text-success {
      color: var(--success-600);
    }

    .financial-value.text-primary {
      color: var(--primary-600);
    }

    .card-footer {
      padding: var(--space-4);
      background: var(--bg-primary);
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
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
      grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
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
      .financial-row {
        grid-template-columns: 1fr;
      }

      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .conciliation-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ModeratorConciliationComponent implements OnInit {
  pendingConciliations: DeliveryConciliation[] = [];
  reconciledConciliations: DeliveryConciliation[] = [];
  platformSummary: any = null;
  activeTab = 'pending';
  isLoading = false;
  isReconciling = false;
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

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  loadData(): void {
    this.isLoading = true;

    // Load all conciliations
    this.deliveryService.getAllConciliations().subscribe({
      next: (conciliations) => {
        this.pendingConciliations = conciliations.filter(c => !c.isReconciled);
        this.reconciledConciliations = conciliations.filter(c => c.isReconciled);

        // Calculate platform summary
        this.calculatePlatformSummary(conciliations);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading conciliations:', error);
        this.isLoading = false;
      }
    });
  }

  calculatePlatformSummary(conciliations: DeliveryConciliation[]): void {
    const totalDeliveries = conciliations.length;
    const totalCommissions = conciliations.reduce((sum, c) => sum + c.platformCommission, 0);
    const reconciledDeliveries = conciliations.filter(c => c.isReconciled).length;
    const pendingDeliveries = conciliations.filter(c => !c.isReconciled).length;
    const pendingCommissions = conciliations
      .filter(c => !c.isReconciled)
      .reduce((sum, c) => sum + c.platformCommission, 0);

    this.platformSummary = {
      totalDeliveries,
      totalCommissions,
      reconciledDeliveries,
      pendingDeliveries,
      pendingCommissions
    };
  }

  reconcileDelivery(deliveryId: number): void {
    if (!this.currentUser || this.isReconciling) return;

    this.isReconciling = true;

    this.deliveryService.reconcileDelivery(deliveryId, this.currentUser.id).subscribe({
      next: (updatedDelivery) => {
        this.loadData(); // Reload data to update UI
        this.isReconciling = false;
      },
      error: (error) => {
        console.error('Error reconciling delivery:', error);
        this.isReconciling = false;
      }
    });
  }

  trackByConciliationId(index: number, conciliation: DeliveryConciliation): number {
    return conciliation.deliveryId;
  }
}
