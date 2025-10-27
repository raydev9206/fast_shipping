/**
 * Delivery model representing a delivery request
 * Contains all information about a delivery assignment
 */
export interface Delivery {
  /** Unique identifier for the delivery */
  id: number;

  /** Delivery title/name */
  title: string;

  /** Detailed description of the delivery */
  description: string;

  /** Geographic zone where delivery should be made */
  deliveryZone: string;

  /** Pickup location where delivery person should collect the package */
  pickupLocation: string;

  /** Final delivery destination */
  deliveryLocation: string;

  /** Estimated delivery time provided by moderator */
  estimatedDeliveryTime: string;

  /** Actual delivery time set by delivery person */
  actualDeliveryTime: string | null;

  /** Package details including weight, dimensions, etc. */
  packageDetails: {
    weight: string;
    dimensions: string;
    fragile: boolean;
    value: string;
  };

  /** Current status of the delivery */
  status: 'available' | 'assigned' | 'in_transit' | 'completed' | 'cancelled';

  /** ID of the user who created the delivery (moderator) */
  createdBy: number;

  /** ID of the user assigned to the delivery (delivery person) */
  assignedTo: number | null;

  /** Timestamp when delivery was created */
  createdAt: string;

  /** Timestamp when delivery person started the delivery */
  startedAt: string | null;

  /** Timestamp when delivery was completed */
  completedAt: string | null;

  /** Array of evidence image URLs for delivery completion */
  evidenceImages: string[];

  /** Whether this delivery has been reconciled (settled financially) */
  isReconciled?: boolean;

  /** Timestamp when delivery was reconciled */
  reconciledAt?: string | null;

  /** ID of the user who reconciled the delivery (moderator) */
  reconciledBy?: number | null;

  /** Delivery fee extracted from package value for easier calculation */
  deliveryFee?: number;
}
