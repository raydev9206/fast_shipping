import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Delivery } from '../../models/delivery.model';
import { User } from '../../models/user.model';

/**
 * Reusable Delivery Stats Component
 * Displays delivery statistics in a grid layout
 * Used across multiple pages: delivery list, dashboard, etc.
 */
@Component({
  selector: 'app-delivery-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="header-stats"
      *ngIf="isDataReady()"
    >
      <div class="stat-item" *ngIf="currentUser?.role === 'delivery'">
        <div class="stat-number text-primary">
          {{ getMyAssignedDeliveries() }}
        </div>
        <div class="stat-label">My Assigned</div>
      </div>
      <div class="stat-item">
        <div class="stat-number text-success">
          {{ getAvailableDeliveries() }}
        </div>
        <div class="stat-label">Available</div>
      </div>
      <div class="stat-item">
        <div class="stat-number text-warning">
          {{ getInProgressDeliveries() }}
        </div>
        <div class="stat-label">In Progress</div>
      </div>
      <div class="stat-item">
        <div class="stat-number text-success">
          {{ getCompletedDeliveries() }}
        </div>
        <div class="stat-label">Completed</div>
      </div>
      <div class="stat-item">
        <div class="stat-number text-primary">
          {{ getReconciledDeliveries() }}
        </div>
        <div class="stat-label">Reconciled</div>
      </div>
      <div class="stat-item" *ngIf="currentUser?.role === 'moderator'">
        <div class="stat-number text-primary">
          {{ getTotalDeliveries() }}
        </div>
        <div class="stat-label">Total Deliveries</div>
      </div>
    </div>
  `,
  styles: [
    `
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
  `,
  ],
})
export class DeliveryStatsComponent {
  @Input() deliveries: Delivery[] = [];
  @Input() myAssignedDeliveries: Delivery[] = [];
  @Input() currentUser: User | null = null;

  /**
   * Check if data is loaded and ready for display
   */
  isDataReady(): boolean {
    return (this.deliveries.length > 0 || this.myAssignedDeliveries.length > 0) &&
           this.currentUser !== null;
  }
  getMyAssignedDeliveries(): number {
    if (this.currentUser?.role === "delivery" && this.currentUser?.id) {
      return this.myAssignedDeliveries.filter(
        d => d.assignedTo !== null && d.assignedTo === this.currentUser!.id
      ).length;
    }
    return 0;
  }

  /**
   * Get number of available deliveries
   */
  getAvailableDeliveries(): number {
    return this.deliveries.filter((d) => d.status === "available" && d.assignedTo === null).length;
  }

  /**
   * Get number of in-progress deliveries (from both lists)
   */
  getInProgressDeliveries(): number {
    let inProgressCount = 0;

    // Count in-progress deliveries from available list
    const availableInProgress = this.deliveries.filter(
      (d) => (d.status === "in_transit" || d.status === "assigned") && d.assignedTo !== null
    ).length;
    inProgressCount += availableInProgress;

    // Count in-progress deliveries from assigned list (filtering by current user)
    if (this.currentUser?.role === "delivery" && this.currentUser?.id) {
      const assignedInProgress = this.myAssignedDeliveries.filter(
        (d) => (d.status === "in_transit" || d.status === "assigned") &&
               d.assignedTo !== null && d.assignedTo === this.currentUser!.id
      ).length;
      inProgressCount += assignedInProgress;
    } else {
      // For moderators, count all in-progress deliveries from assigned list
      const assignedInProgress = this.myAssignedDeliveries.filter(
        (d) => (d.status === "in_transit" || d.status === "assigned") && d.assignedTo !== null
      ).length;
      inProgressCount += assignedInProgress;
    }

    return inProgressCount;
  }

  /**
   * Get number of completed deliveries (from both lists)
   */
  getCompletedDeliveries(): number {
    let completedCount = 0;

    // Count completed deliveries from available list
    const availableCompleted = this.deliveries.filter(
      (d) => d.status === "completed"
    ).length;
    completedCount += availableCompleted;

    // Count completed deliveries from assigned list (filtering by current user)
    if (this.currentUser?.role === "delivery" && this.currentUser?.id) {
      const assignedCompleted = this.myAssignedDeliveries.filter(
        (d) => d.status === "completed" && d.assignedTo !== null && d.assignedTo === this.currentUser!.id
      ).length;
      completedCount += assignedCompleted;
    } else {
      // For moderators, count all completed deliveries from assigned list
      const assignedCompleted = this.myAssignedDeliveries.filter(
        (d) => d.status === "completed"
      ).length;
      completedCount += assignedCompleted;
    }

    return completedCount;
  }

  /**
   * Get number of reconciled deliveries (from both lists)
   */
  getReconciledDeliveries(): number {
    let reconciledCount = 0;

    // Count reconciled deliveries from available list
    const availableReconciled = this.deliveries.filter(
      (d) => d.status === "completed" && d.isReconciled === true
    ).length;
    reconciledCount += availableReconciled;

    // Count reconciled deliveries from assigned list (filtering by current user)
    if (this.currentUser?.role === "delivery" && this.currentUser?.id) {
      const assignedReconciled = this.myAssignedDeliveries.filter(
        (d) => d.status === "completed" && d.isReconciled === true &&
               d.assignedTo !== null && d.assignedTo === this.currentUser!.id
      ).length;
      reconciledCount += assignedReconciled;
    } else {
      // For moderators, count all reconciled deliveries from assigned list
      const assignedReconciled = this.myAssignedDeliveries.filter(
        (d) => d.status === "completed" && d.isReconciled === true
      ).length;
      reconciledCount += assignedReconciled;
    }

    return reconciledCount;
  }

  /**
   * Get total number of deliveries
   */
  getTotalDeliveries(): number {
    let totalCount = 0;

    // Count deliveries from available list (only available ones)
    const availableDeliveries = this.deliveries.filter(
      (d) => d.status === "available" && d.assignedTo === null
    ).length;
    totalCount += availableDeliveries;

    // Count deliveries from assigned list (filtering by current user for delivery personnel)
    if (this.currentUser?.role === "delivery" && this.currentUser?.id) {
      const myDeliveries = this.myAssignedDeliveries.filter(
        d => d.assignedTo !== null && d.assignedTo === this.currentUser!.id
      ).length;
      totalCount += myDeliveries;
    } else {
      // For moderators, count all deliveries from assigned list
      totalCount += this.myAssignedDeliveries.length;
    }

    return totalCount;
  }
}
