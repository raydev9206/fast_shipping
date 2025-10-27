import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { GeocodingService } from '../../services/geocoding.service';
import { Location } from '../../models/location.model';

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface MapLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

@Component({
  selector: 'app-location-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container" [style.--map-height]="height">
      <div class="map-header">
        <h4>{{ title }}</h4>
        <div class="map-actions" *ngIf="showActions">
          <button
            type="button"
            (click)="clearLocation()"
            class="btn btn-secondary btn-sm"
            [disabled]="!selectedLocation"
          >
            Clear
          </button>
        </div>
      </div>

      <div class="map-wrapper">
        <div #mapContainer class="leaflet-map"></div>
      </div>

      <div class="location-info" *ngIf="selectedLocation">
        <div class="info-item">
          <strong>Coordinates:</strong>
          {{ selectedLocation.latitude | number:'1.6-6' }}, {{ selectedLocation.longitude | number:'1.6-6' }}
        </div>
        <div class="info-item" *ngIf="selectedLocation.address">
          <strong>Address:</strong>
          {{ selectedLocation.address }}
        </div>
      </div>

      <div class="map-instructions" *ngIf="!selectedLocation">
        {{ instructionText }}
      </div>
    </div>
  `,
  styles: [`
    .map-container {
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: var(--bg-surface);
    }

    .map-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-3) var(--space-4);
      border-bottom: 1px solid var(--border-color);
      background: var(--bg-primary);
    }

    .map-header h4 {
      margin: 0;
      color: var(--text-primary);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
    }

    .map-actions {
      display: flex;
      gap: var(--space-2);
    }

    .map-wrapper {
      position: relative;
      width: 100%;
      height: var(--map-height, 300px);
    }

    .leaflet-map {
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .location-info {
      padding: var(--space-3) var(--space-4);
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
      font-size: var(--font-size-sm);
    }

    .info-item {
      margin-bottom: var(--space-1);
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .map-instructions {
      padding: var(--space-4);
      text-align: center;
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
    }

    /* Dark mode support */
    [data-theme="dark"] .map-container {
      border-color: var(--dark-border);
    }

    [data-theme="dark"] .map-header {
      background: var(--dark-bg-primary);
      border-color: var(--dark-border);
    }

    [data-theme="dark"] .map-header h4 {
      color: var(--dark-text-primary);
    }

    [data-theme="dark"] .location-info {
      background: var(--dark-bg-secondary);
      border-color: var(--dark-border);
    }

    [data-theme="dark"] .map-instructions {
      background: var(--dark-bg-secondary);
      border-color: var(--dark-border);
      color: var(--dark-text-secondary);
    }
  `]
})
export class LocationMapComponent implements OnInit, OnDestroy, OnChanges {
  @Input() title = 'Select Location';
  @Input() height = '300px';
  @Input() showActions = true;
  @Input() instructionText = 'Click on the map to select a location';

  // Map configuration inputs
  @Input() centerLatitude = 22.0; // Better center of Cuba (latitude) - slightly north
  @Input() centerLongitude = -79.5; // Better center of Cuba (longitude) - slightly west
  @Input() initialZoom = 6; // Zoom level for wider view of Cuba and Caribbean region

  @Output() locationSelected = new EventEmitter<Location>();
  @Output() locationCleared = new EventEmitter<void>();

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  selectedLocation: Location | null = null;
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  constructor(private geocodingService: GeocodingService) {}

  ngOnInit(): void {
    // Use setTimeout to ensure styles are applied before initializing map
    setTimeout(() => {
      this.initializeMap();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['height'] && this.map) {
      // Update map container height and invalidate size
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initializeMap(): void {
    // Initialize map with configurable center and zoom (default: Cuba with wide view)
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [this.centerLatitude, this.centerLongitude],
      zoom: this.initialZoom
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Add click listener to map
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.onMapClick(e.latlng.lat, e.latlng.lng);
    });
  }

  private onMapClick(latitude: number, longitude: number): void {
    const location: Location = {
      latitude,
      longitude
    };

    // Get address from coordinates
    this.geocodingService.reverseGeocode(location).subscribe({
      next: (address) => {
        location.address = address;

        this.selectedLocation = location;

        // Remove previous marker
        if (this.marker) {
          this.map?.removeLayer(this.marker);
        }

        // Add new marker
        if (this.map) {
          this.marker = L.marker([latitude, longitude])
            .addTo(this.map)
            .bindPopup(`<strong>${address}</strong><br/>${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
            .openPopup();
        }

        // Emit the selected location
        this.locationSelected.emit(this.selectedLocation);
      },
      error: (error) => {
        console.error('Error getting address:', error);
        // Still proceed with coordinates only
        this.selectedLocation = location;

        // Remove previous marker
        if (this.marker) {
          this.map?.removeLayer(this.marker);
        }

        // Add new marker
        if (this.map) {
          this.marker = L.marker([latitude, longitude])
            .addTo(this.map)
            .bindPopup(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
            .openPopup();
        }

        // Emit the selected location
        this.locationSelected.emit(this.selectedLocation);
      }
    });
  }

  clearLocation(): void {
    this.selectedLocation = null;

    // Remove marker
    if (this.marker) {
      this.map?.removeLayer(this.marker);
      this.marker = null;
    }

    this.locationCleared.emit();
  }

  // Method to programmatically set a location
  setLocation(location: Location): void {
    this.onMapClick(location.latitude, location.longitude);
  }
}
