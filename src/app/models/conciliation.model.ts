/**
 * Conciliation models for delivery settlement system
 * Handles financial reconciliation between delivery platform and delivery personnel
 */

export interface ConciliationSummary {
  /** Total deliveries completed by delivery person */
  totalDeliveries: number;

  /** Total earnings from all deliveries */
  totalEarnings: number;

  /** Platform commission (10% of total earnings) */
  platformCommission: number;

  /** Amount delivery person owes to platform */
  amountToPay: number;

  /** Deliveries pending reconciliation */
  pendingDeliveries: number;

  /** Value of pending deliveries */
  pendingValue: number;
}

export interface DeliveryConciliation {
  /** Delivery ID */
  deliveryId: number;

  /** Delivery person ID */
  deliveryPersonId: number;

  /** Delivery person name */
  deliveryPersonName: string;

  /** Delivery title */
  deliveryTitle: string;

  /** Delivery value/cost */
  deliveryFee: number;

  /** Platform commission (10%) */
  platformCommission: number;

  /** Amount delivery person keeps (90%) */
  deliveryPersonEarnings: number;

  /** Completion date */
  completedAt: string;

  /** Whether this delivery is reconciled */
  isReconciled: boolean;

  /** Reconciliation date (if reconciled) */
  reconciledAt?: string;

  /** ID of moderator who reconciled */
  reconciledBy?: number;

  /** Moderator name who reconciled */
  reconciledByName?: string;
}

export interface ConciliationFilter {
  /** Filter by delivery person ID */
  deliveryPersonId?: number;

  /** Filter by reconciliation status */
  isReconciled?: boolean;

  /** Filter by date range */
  startDate?: string;
  endDate?: string;
}
