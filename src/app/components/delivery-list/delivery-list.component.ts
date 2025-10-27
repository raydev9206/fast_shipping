import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Router } from "@angular/router";
import { DeliveryService } from "../../services/delivery.service";
import { AuthService } from "../../services/auth.service";
import { Delivery } from "../../models/delivery.model";
import { User } from "../../models/user.model";
import { DeliveryCardComponent } from "../shared/delivery-card.component";
import { DeliveryStatsComponent } from "../shared/delivery-stats.component";

/**
 * Modern Delivery List component
 * Features improved design with cards, icons, and enhanced visual states
 */
@Component({
  selector: "app-delivery-list",
  standalone: true,
  imports: [CommonModule, RouterLink, DeliveryCardComponent, DeliveryStatsComponent],
  template: ` <div class="delivery-page">
    <div class="container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">
              {{
                currentUser?.role === "moderator"
                  ? "All Deliveries"
                  : "My Delivery Dashboard"
              }}
            </h1>
            <p class="page-subtitle">
              {{
                currentUser?.role === "moderator"
                  ? "Manage and track all delivery assignments"
                  : "Manage your assigned deliveries and find new opportunities"
              }}
            </p>
          </div>

          <div class="header-actions">
            <a
              [routerLink]="currentUser?.role === 'delivery' ? '/my-conciliations' : '/conciliations'"
              class="btn btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="mobile-hidden">
                {{ currentUser?.role === 'delivery' ? 'My Conciliations' : 'Conciliations' }}
              </span>
            </a>

            <button
              (click)="refreshDeliveries()"
              class="btn btn-secondary"
              [disabled]="isLoading"
              title="Refresh deliveries"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4V9H4.1M4.1 9C5.2 5.7 8.2 3 12 3C16.4 3 20 6.6 20 11M4.1 9H9M20 20V15H19.9M19.9 15C18.8 18.3 15.8 21 12 21C7.6 21 4 17.4 4 13M19.9 15H15"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="mobile-hidden">Refresh</span>
            </button>
          </div>
        </div>

        <!-- Filters and Stats -->
        <app-delivery-stats
          [deliveries]="deliveries"
          [myAssignedDeliveries]="myAssignedDeliveries"
          [currentUser]="currentUser"
        ></app-delivery-stats>
      </div>

      <!-- Tabs Navigation (only for delivery personnel) -->
      <div class="tabs-container" *ngIf="currentUser?.role === 'delivery'">
        <div class="tabs-nav">
          <button
            class="tab-button"
            [class.active]="activeTab === 'assigned'"
            (click)="setActiveTab('assigned')"
          >
            <svg
              width="16"
              height="16"
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
            My Assigned ({{ myAssignedDeliveries.length }})
          </button>
          <button
            class="tab-button"
            [class.active]="activeTab === 'available'"
            (click)="setActiveTab('available')"
          >
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
              <path
                d="M8 12L11 15L16 9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Available ({{ deliveries.length }})
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- My Assigned Deliveries Tab -->
        <div
          class="tab-pane"
          [class.active]="
            activeTab === 'assigned' || currentUser?.role === 'moderator'
          "
        >
          <div class="delivery-grid" *ngIf="!isLoading">
            <app-delivery-card
              *ngFor="
                let delivery of currentUser?.role === 'delivery'
                  ? myAssignedDeliveries
                  : deliveries;
                trackBy: trackByDeliveryId
              "
              [delivery]="delivery"
              [currentUser]="currentUser"
              (takeDelivery)="takeDelivery($event)"
              (completeDelivery)="completeDelivery($event)"
              (cancelDelivery)="cancelDelivery($event)"
              (viewDelivery)="viewDelivery($event)"
              (reconcileDelivery)="reconcileDelivery($event)"
            ></app-delivery-card>
          </div>
        </div>
        <!-- Available Deliveries Tab -->
        <div class="tab-pane" [class.active]="activeTab === 'available'">
          <!-- Available Deliveries Section (for delivery personnel) -->
          <div
            class="available-deliveries-section"
            *ngIf="currentUser?.role === 'delivery' && deliveries.length > 0"
          >
            <div class="section-header">
              <h2 class="section-title">Available Deliveries</h2>
              <p class="section-subtitle">
                New delivery opportunities you can take
              </p>
            </div>
          </div>

          <div class="delivery-grid" *ngIf="!isLoading">
            <app-delivery-card
              *ngFor="let delivery of deliveries; trackBy: trackByDeliveryId"
              [delivery]="delivery"
              [currentUser]="currentUser"
              (takeDelivery)="takeDelivery($event)"
              (completeDelivery)="completeDelivery($event)"
              (cancelDelivery)="cancelDelivery($event)"
              (viewDelivery)="viewDelivery($event)"
              (reconcileDelivery)="reconcileDelivery($event)"
            ></app-delivery-card>
          </div>
        </div>
      </div>
    </div>
  </div>`,
  styles: [
    `
    .delivery-page {
      min-height: calc(100vh - 80px);
      background-color: var(--bg-primary);
      padding: var(--space-6) 0;
    }

    /* Page Header */
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

    .header-info {
      flex: 1;
    }

    .page-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
      letter-spacing: -0.025em;
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

    /* Header Stats */
    .header-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: var(--space-4);
      padding: var(--space-4);
      background: var(--bg-secondary);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      display: block;
      margin-bottom: var(--space-1);
    }

    .stat-number.text-success {
      color: var(--success-600);
    }

    .stat-number.text-warning {
      color: var(--warning-600);
    }

    .stat-number.text-primary {
      color: var(--primary-600);
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      font-weight: var(--font-weight-medium);
    }

    /* Loading State */
    .loading-state {
      margin-top: var(--space-8);
    }

    .loading-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }

    @media (min-width: 640px) {
      .loading-grid {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: var(--space-5);
      }
    }

    @media (min-width: 1024px) {
      .loading-grid {
        grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
        gap: var(--space-6);
      }
    }

    .loading-card {
      background: var(--bg-surface);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
      height: 280px;
      position: relative;
      overflow: hidden;
    }

    .loading-shimmer {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    /* Delivery Grid Responsive */
    .delivery-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }

    @media (min-width: 640px) {
      .delivery-grid {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: var(--space-5);
      }
    }

    @media (min-width: 1024px) {
      .delivery-grid {
        grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
        gap: var(--space-6);
      }
    }

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
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
      margin-bottom: var(--space-5);
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

    .action-buttons {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .action-buttons .btn {
      flex: 1;
      min-width: 100px;
      justify-content: center;
      transition: all var(--transition-base);
      border: 2px solid transparent;
      border-radius: var(--radius-xl);
      font-weight: var(--font-weight-medium);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .action-buttons .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(107, 90, 64, 0.3);
    }

    /* Dark mode for action buttons */
    [data-theme="dark"] .action-buttons .btn {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    [data-theme="dark"] .action-buttons .btn:hover {
      box-shadow: 0 4px 12px rgba(143, 122, 83, 0.4);
    }

    /* Card Footer */
    .card-footer {
      padding: var(--space-4) var(--space-5) var(--space-5);
      background-color: var(--bg-primary);
      border-top: 1px solid var(--border-color);
    }

    /* Empty State */
    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
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
      background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
      border-radius: var(--radius-2xl);
      margin: 0 auto var(--space-6) auto;
      border: 1px solid var(--border-color);
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
      margin: 0 0 var(--space-6) 0;
    }

    .empty-actions {
      display: flex;
      justify-content: center;
    }

    /* Section Headers */
    .my-deliveries-section,
    .available-deliveries-section {
      margin-bottom: var(--space-8);
    }

    .section-header {
      margin-bottom: var(--space-6);
      padding-bottom: var(--space-4);
      border-bottom: 2px solid var(--border-color);
    }

    .section-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
      letter-spacing: -0.025em;
    }

    .section-subtitle {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0;
      line-height: var(--line-height-relaxed);
    }

    /* Tabs System */
    .tabs-container {
      margin-bottom: var(--space-6);
      border-bottom: 1px solid var(--border-color);
    }

    .tabs-nav {
      display: flex;
      gap: var(--space-1);
      margin-bottom: -1px;
    }

    .tab-button {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      background: transparent;
      border: 1px solid transparent;
      border-bottom: none;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
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
    }

    .tab-button.active {
      background-color: var(--bg-surface);
      color: var(--primary-600);
      border-color: var(--border-color);
      border-bottom-color: var(--bg-surface);
    }

    .tab-content {
      background-color: var(--bg-surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      padding: var(--space-6);
      min-height: 200px;
    }

    .tab-pane {
      display: none;
    }

    .tab-pane.active {
      display: block;
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  ],
})
export class DeliveryListComponent implements OnInit {
  deliveries: Delivery[] = [];
  myAssignedDeliveries: Delivery[] = [];
  currentUser: User | null = null;
  isLoading = false;
  activeTab: "assigned" | "available" = "assigned"; // Default to assigned deliveries

  constructor(
    private deliveryService: DeliveryService,
    private authService: AuthService,
    public router: Router
  ) {}

  /**
   * Initialize component and load deliveries
   */
  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.loadDeliveries();
    });
  }

  /**
   * Load deliveries based on user role
   */
  loadDeliveries(): void {
    this.isLoading = true;

    if (this.currentUser?.role === "moderator") {
      // Moderators see all deliveries they created
      this.deliveryService
        .getDeliveriesByModerator(this.currentUser.id)
        .subscribe({
          next: (deliveries) => {
            this.deliveries = deliveries;
            this.myAssignedDeliveries = [];
            this.isLoading = false;
          },
          error: (error) => {
            console.error("Error loading deliveries:", error);
            this.isLoading = false;
          },
        });
    } else {
      // Delivery personnel see available deliveries and their assigned ones separately
      let completedCalls = 0;
      const totalCalls = 2;

      const checkCompletion = () => {
        completedCalls++;
        if (completedCalls === totalCalls) {
          this.isLoading = false;
        }
      };

      this.deliveryService.getAvailableDeliveries().subscribe({
        next: (availableDeliveries) => {
          this.deliveries = availableDeliveries;
          checkCompletion();
        },
        error: (error) => {
          console.error("Error loading available deliveries:", error);
          this.isLoading = false;
        },
      });

      // Also load their assigned deliveries separately
      if (this.currentUser) {
        this.deliveryService.getMyDeliveries(this.currentUser.id).subscribe({
          next: (myDeliveries) => {
            this.myAssignedDeliveries = myDeliveries;
            checkCompletion();
          },
          error: (error) => {
            console.error("Error loading my deliveries:", error);
            this.isLoading = false;
          },
        });
      }
    }
  }

  /**
   * Switch between tabs
   */
  setActiveTab(tab: "assigned" | "available"): void {
    this.activeTab = tab;
  }

  /**
   * Assign delivery to current user (delivery personnel only)
   */
  takeDelivery(delivery: Delivery): void {
    if (this.currentUser && delivery.status === "available") {
      // Prevent multiple clicks on the same delivery
      delivery.status = "assigned";
      this.isLoading = true;

      this.deliveryService
        .assignDelivery(delivery.id, this.currentUser.id)
        .subscribe({
          next: (updatedDelivery) => {
            // Remove from available deliveries list
            const availableIndex = this.deliveries.findIndex(
              (d) => d.id === delivery.id
            );
            if (availableIndex !== -1) {
              this.deliveries.splice(availableIndex, 1);
            }
            // Add to assigned deliveries list
            this.myAssignedDeliveries.push(updatedDelivery);
            this.isLoading = false;
          },
          error: (error) => {
            console.error("Error taking delivery:", error);
            // Revert the status change on error
            delivery.status = "available";
            this.isLoading = false;
            // TODO: Show error message to user
          },
        });
    }
  }

  /**
   * Start a delivery (mark as in transit)
   */
  startDelivery(delivery: Delivery): void {
    // This method is no longer needed as delivery automatically starts when taken
    this.deliveryService
      .startDelivery(delivery.id)
      .subscribe({
        next: (updatedDelivery) => {
          const index = this.deliveries.findIndex((d) => d.id === delivery.id);
          if (index !== -1) {
            this.deliveries[index] = updatedDelivery;
          }
        },
        error: (error) => {
          console.error("Error starting delivery:", error);
        },
      });
  }

  /**
   * View delivery details (navigate to detail page)
   */
  viewDelivery(deliveryId: number): void {
    this.router.navigate(["/delivery", deliveryId]);
  }

  /**
   * Check if delivery can be cancelled (before estimated delivery time)
   */
  canCancelDelivery(delivery: Delivery): boolean {
    if (delivery.status !== "in_transit" && delivery.status !== "assigned") return false;

    const estimatedTime = new Date(delivery.estimatedDeliveryTime);
    const now = new Date();

    return now < estimatedTime;
  }

  /**
   * Complete a delivery (mark as completed)
   */
  completeDelivery(delivery: Delivery): void {
    if (
      this.currentUser &&
      delivery.assignedTo === this.currentUser.id &&
      (delivery.status === "in_transit" || delivery.status === "assigned")
    ) {
      this.deliveryService.completeDelivery(delivery.id, []).subscribe({
        next: (updatedDelivery) => {
          // Update local delivery status in assigned list
          const index = this.myAssignedDeliveries.findIndex(
            (d) => d.id === delivery.id
          );
          if (index !== -1) {
            this.myAssignedDeliveries[index] = updatedDelivery;
          }
          // Also update in available deliveries if it exists there
          const availableIndex = this.deliveries.findIndex(
            (d) => d.id === delivery.id
          );
          if (availableIndex !== -1) {
            this.deliveries[availableIndex] = updatedDelivery;
          }
        },
        error: (error) => {
          console.error("Error completing delivery:", error);
          // TODO: Show error message to user
        },
      });
    }
  }

  /**
   * Cancel a delivery (only for assigned delivery personnel)
   */
  cancelDelivery(delivery: Delivery): void {
    if (
      this.currentUser &&
      delivery.assignedTo === this.currentUser.id &&
      (delivery.status === "in_transit" || delivery.status === "assigned")
    ) {
      this.deliveryService.cancelDelivery(delivery.id).subscribe({
        next: (updatedDelivery) => {
          // Update local delivery status in assigned list
          const index = this.myAssignedDeliveries.findIndex(
            (d) => d.id === delivery.id
          );
          if (index !== -1) {
            this.myAssignedDeliveries[index] = updatedDelivery;
          }
          // Also update in available deliveries if it exists there
          const availableIndex = this.deliveries.findIndex(
            (d) => d.id === delivery.id
          );
          if (availableIndex !== -1) {
            this.deliveries[availableIndex] = updatedDelivery;
          }
        },
        error: (error) => {
          console.error("Error cancelling delivery:", error);
        },
      });
    }
  }

  /**
   * Reconcile a delivery (mark as settled) - for moderators
   */
  reconcileDelivery(delivery: Delivery): void {
    if (this.currentUser?.role === 'moderator') {
      this.deliveryService.reconcileDelivery(delivery.id, this.currentUser.id).subscribe({
        next: (updatedDelivery) => {
          // Update local delivery status in both lists
          const assignedIndex = this.myAssignedDeliveries.findIndex(
            (d) => d.id === delivery.id
          );
          if (assignedIndex !== -1) {
            this.myAssignedDeliveries[assignedIndex] = updatedDelivery;
          }

          const availableIndex = this.deliveries.findIndex(
            (d) => d.id === delivery.id
          );
          if (availableIndex !== -1) {
            this.deliveries[availableIndex] = updatedDelivery;
          }
        },
        error: (error) => {
          console.error('Error reconciling delivery:', error);
        },
      });
    }
  }

  /**
   * Track by function for ngFor optimization
   */
  trackByDeliveryId(index: number, delivery: Delivery): number {
    return delivery.id;
  }

  /**
   * Refresh deliveries data
   */
  refreshDeliveries(): void {
    this.loadDeliveries();
  }
}
