import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Location } from '../models/location.model';

export interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
}

export interface GeocodeResponse {
  features: Array<{
    properties: GeocodeResult;
    geometry: {
      coordinates: [number, number];
    };
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private readonly nominatimUrl = 'https://nominatim.openstreetmap.org';

  constructor(private http: HttpClient) {}

  /**
   * Reverse geocode coordinates to get address
   */
  reverseGeocode(location: Location): Observable<string> {
    const url = `${this.nominatimUrl}/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=16&addressdetails=1`;

    return this.http.get<GeocodeResult>(url).pipe(
      map(result => result.display_name || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`)
    );
  }

  /**
   * Search for locations by query
   */
  searchLocations(query: string): Observable<Location[]> {
    const url = `${this.nominatimUrl}/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;

    return this.http.get<GeocodeResult[]>(url).pipe(
      map(results =>
        results.map(result => ({
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          address: result.display_name
        }))
      )
    );
  }
}
