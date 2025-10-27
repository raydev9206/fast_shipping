/**
 * Location interface for map coordinates and address
 */
export interface Location {
  /** Latitude coordinate */
  latitude: number;

  /** Longitude coordinate */
  longitude: number;

  /** Human-readable address (optional) */
  address?: string;
}
