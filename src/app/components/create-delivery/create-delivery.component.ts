import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Delivery } from '../../models/delivery.model';
import { Location } from '../../models/location.model';
import { LocationMapComponent } from '../shared/location-map.component';
import { DeliveryService } from '../../services/delivery.service';
import { AuthService } from '../../services/auth.service';

/**
 * Component for creating new delivery requests
 * Only accessible by moderators to create delivery assignments
 */
@Component({
  selector: 'app-create-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule, LocationMapComponent],
  template: `
    <div class="create-delivery-container">
      <div class="header">
        <h1>Create New Delivery</h1>
        <p>Fill out the form below to create a new delivery request for delivery personnel.</p>
      </div>

      <!-- Progress Steps -->
      <div class="progress-container">
        <div class="progress-steps">
          <div class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
            <div class="step-number">1</div>
            <div class="step-label">
              <span class="desktop-label">Basic Info</span>
              <span class="mobile-label">Info</span>
            </div>
          </div>
          <div class="step-connector" [class.active]="currentStep > 1"></div>
          <div class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
            <div class="step-number">2</div>
            <div class="step-label">
              <span class="desktop-label">Locations</span>
              <span class="mobile-label">Map</span>
            </div>
          </div>
          <div class="step-connector" [class.active]="currentStep > 2"></div>
          <div class="step" [class.active]="currentStep >= 3" [class.completed]="currentStep > 3">
            <div class="step-number">3</div>
            <div class="step-label">
              <span class="desktop-label">Package Details</span>
              <span class="mobile-label">Package</span>
            </div>
          </div>
          <div class="step-connector" [class.active]="currentStep > 3"></div>
          <div class="step" [class.active]="currentStep >= 4">
            <div class="step-number">4</div>
            <div class="step-label">
              <span class="desktop-label">Review</span>
              <span class="mobile-label">Review</span>
            </div>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="currentStep / 4 * 100"></div>
        </div>
      </div>

      <form (ngSubmit)="onSubmit()" #deliveryForm="ngForm" class="delivery-form">
        <!-- Step 1: Basic Information -->
        <div class="form-section" *ngIf="currentStep === 1">
          <div class="step-header">
            <h2> Basic Information</h2>
            <p>Enter the delivery title and description</p>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="title">Delivery Title: *</label>
              <input
                type="text"
                id="title"
                name="title"
                [(ngModel)]="delivery.title"
                required
                #title="ngModel"
                class="form-control"
                placeholder="e.g., Medical Supplies Delivery, Document Transfer"
              />
              <div class="error-message" *ngIf="title.invalid && title.touched">
                Delivery title is required.
              </div>
            </div>

            <div class="form-group">
              <label for="deliveryZone">Delivery Zone: *</label>
              <select
                id="deliveryZone"
                name="deliveryZone"
                [(ngModel)]="delivery.deliveryZone"
                required
                #deliveryZone="ngModel"
                class="form-control"
              >
                <option value="">Select a zone</option>
                <option value="Havana">Havana</option>
                <option value="Santiago de Cuba">Santiago de Cuba</option>
                <option value="Camagüey">Camagüey</option>
                <option value="Holguín">Holguín</option>
                <option value="Santa Clara">Santa Clara</option>
                <option value="Guantánamo">Guantánamo</option>
                <option value="Bayamo">Bayamo</option>
                <option value="Cienfuegos">Cienfuegos</option>
                <option value="Pinar del Río">Pinar del Río</option>
                <option value="Las Tunas">Las Tunas</option>
                <option value="Matanzas">Matanzas</option>
                <option value="Ciego de Ávila">Ciego de Ávila</option>
                <option value="Sancti Spíritus">Sancti Spíritus</option>
                <option value="Isla de la Juventud">Isla de la Juventud</option>
              </select>
              <div class="error-message" *ngIf="deliveryZone.invalid && deliveryZone.touched">
                Please select a delivery zone.
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description: *</label>
            <textarea
              id="description"
              name="description"
              [(ngModel)]="delivery.description"
              required
              #description="ngModel"
              class="form-control textarea"
              rows="4"
              placeholder="Provide detailed information about the delivery requirements, special instructions, or any other relevant details..."
            ></textarea>
            <div class="error-message" *ngIf="description.invalid && description.touched">
              Description is required.
            </div>
          </div>
        </div>

        <!-- Step 2: Locations -->
        <div class="form-section" *ngIf="currentStep === 2">
          <div class="step-header">
            <h2> Delivery Locations</h2>
            <p>Select pickup and delivery locations on the map</p>
          </div>

          <div class="form-group">
            <label>Pickup Location: *</label>
            <div class="map-field" [class.error]="!pickupLocation && formSubmitted">
              <div *ngIf="!pickupLocation">
                <app-location-map
                  title="Select Pickup Location"
                  height="300px"
                  [centerLatitude]="22.0"
                  [centerLongitude]="-79.5"
                  [initialZoom]="6"
                  instructionText="Click on the map to select where the package should be picked up"
                  (locationSelected)="onPickupLocationSelected($event)"
                ></app-location-map>
              </div>
              <div *ngIf="pickupLocation" class="location-selected">
                <div class="location-info">
                  <div class="location-icon"></div>
                  <div class="location-details">
                    <strong>Selected Pickup:</strong>
                    <span>{{ pickupLocation.address || delivery.pickupLocation }}</span>
                    <span class="coordinates" *ngIf="pickupLocation.address">({{ pickupLocation.latitude | number:'1.6-6' }}, {{ pickupLocation.longitude | number:'1.6-6' }})</span>
                  </div>
                </div>
                <div class="location-actions">
                  <button
                    type="button"
                    (click)="clearPickupLocation()"
                    class="btn btn-secondary btn-sm"
                  >
                    Change Location
                  </button>
                </div>
              </div>
              <div class="field-error" *ngIf="!pickupLocation && formSubmitted">
                Please select a pickup location on the map.
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Delivery Destination: *</label>
            <div class="map-field" [class.error]="!deliveryDestination && formSubmitted">
              <div *ngIf="!deliveryDestination">
                <app-location-map
                  title="Select Delivery Destination"
                  height="300px"
                  [centerLatitude]="22.0"
                  [centerLongitude]="-79.5"
                  [initialZoom]="6"
                  instructionText="Click on the map to select where the package should be delivered"
                  (locationSelected)="onDeliveryLocationSelected($event)"
                ></app-location-map>
              </div>
              <div *ngIf="deliveryDestination" class="location-selected">
                <div class="location-info">
                  <div class="location-icon"></div>
                  <div class="location-details">
                    <strong>Selected Destination:</strong>
                    <span>{{ deliveryDestination.address || delivery.deliveryLocation }}</span>
                    <span class="coordinates" *ngIf="deliveryDestination.address">({{ deliveryDestination.latitude | number:'1.6-6' }}, {{ deliveryDestination.longitude | number:'1.6-6' }})</span>
                  </div>
                </div>
                <div class="location-actions">
                  <button
                    type="button"
                    (click)="clearDeliveryLocation()"
                    class="btn btn-secondary btn-sm"
                  >
                    Change Location
                  </button>
                </div>
              </div>
              <div class="field-error" *ngIf="!deliveryDestination && formSubmitted">
                Please select a delivery destination on the map.
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="estimatedDeliveryTime">Estimated Delivery Time: *</label>
            <input
              type="datetime-local"
              id="estimatedDeliveryTime"
              name="estimatedDeliveryTime"
              [(ngModel)]="delivery.estimatedDeliveryTime"
              required
              #estimatedDeliveryTime="ngModel"
              class="form-control"
            />
            <div class="help-text">
              Select the approximate date and time when this delivery should be completed.
            </div>
            <div class="error-message" *ngIf="estimatedDeliveryTime.invalid && estimatedDeliveryTime.touched">
              Estimated delivery time is required.
            </div>
          </div>
        </div>

        <!-- Step 3: Package Details -->
        <div class="form-section" *ngIf="currentStep === 3">
          <div class="step-header">
            <h2> Package Details</h2>
            <p>Specify the package information and requirements</p>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="weight">Weight: *</label>
              <input
                type="text"
                id="weight"
                name="weight"
                [(ngModel)]="packageWeight"
                required
                #weight="ngModel"
                class="form-control"
                placeholder="e.g., 2kg, 500g"
              />
              <div class="error-message" *ngIf="weight.invalid && weight.touched">
                Weight is required.
              </div>
            </div>

            <div class="form-group">
              <label for="dimensions">Dimensions: *</label>
              <input
                type="text"
                id="dimensions"
                name="dimensions"
                [(ngModel)]="packageDimensions"
                required
                #dimensions="ngModel"
                class="form-control"
                placeholder="e.g., 30x20x10cm"
              />
              <div class="error-message" *ngIf="dimensions.invalid && dimensions.touched">
                Dimensions are required.
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="value">Package Value: *</label>
              <input
                type="text"
                id="value"
                name="value"
                [(ngModel)]="packageValue"
                required
                #value="ngModel"
                class="form-control"
                placeholder="e.g., $1200, $50"
              />
              <div class="error-message" *ngIf="value.invalid && value.touched">
                Package value is required.
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  [(ngModel)]="packageFragile"
                  name="fragile"
                  class="checkbox-custom"
                />
                Fragile Package
              </label>
              <div class="help-text">
                Check if the package contains fragile items that require special handling.
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Review -->
        <div class="form-section" *ngIf="currentStep === 4">
          <div class="step-header">
            <h2> Review & Confirm</h2>
            <p>Review all information before creating the delivery</p>
          </div>

          <div class="review-card">
            <div class="review-section">
              <h3> Basic Information</h3>
              <div class="review-item">
                <strong>Title:</strong> {{ delivery.title }}
              </div>
              <div class="review-item">
                <strong>Zone:</strong> {{ delivery.deliveryZone }}
              </div>
              <div class="review-item">
                <strong>Description:</strong> {{ delivery.description }}
              </div>
            </div>

            <div class="review-section">
              <h3> Locations</h3>
              <div class="review-item">
                <strong>Pickup:</strong> {{ pickupLocation?.address || delivery.pickupLocation }}
              </div>
              <div class="review-item">
                <strong>Destination:</strong> {{ deliveryDestination?.address || delivery.deliveryLocation }}
              </div>
              <div class="review-item">
                <strong>Estimated Time:</strong> {{ delivery.estimatedDeliveryTime | date:'medium' }}
              </div>
            </div>

            <div class="review-section">
              <h3> Package Details</h3>
              <div class="review-item">
                <strong>Weight:</strong> {{ delivery.packageDetails?.weight }}
              </div>
              <div class="review-item">
                <strong>Dimensions:</strong> {{ delivery.packageDetails?.dimensions }}
              </div>
              <div class="review-item">
                <strong>Value:</strong> {{ delivery.packageDetails?.value }}
              </div>
              <div class="review-item">
                <strong>Fragile:</strong> {{ delivery.packageDetails?.fragile ? 'Yes' : 'No' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="form-actions">
          <button
            type="button"
            (click)="previousStep()"
            class="btn btn-secondary"
            *ngIf="currentStep > 1"
          >
            Previous
          </button>

          <div class="spacer" *ngIf="currentStep > 1"></div>

          <button
            type="button"
            (click)="nextStep()"
            class="btn btn-primary"
            *ngIf="currentStep < 4"
          >
            Next
          </button>

          <button
            type="submit"
            class="btn btn-success"
            *ngIf="currentStep === 4"
            [disabled]="!deliveryForm.form.valid || isSubmitting"
          >
            {{ isSubmitting ? 'Creating Delivery...' : ' Create Delivery' }}
          </button>
        </div>

        <div class="success-message" *ngIf="successMessage">
          {{ successMessage }}
        </div>

        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  `,
  styles: [`
    .create-delivery-container {
      max-width: 900px;
      margin: 0 auto;
      padding: var(--space-6);
    }

    .header {
      margin-bottom: var(--space-8);
      text-align: center;
      padding: var(--space-6);
      background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
      border-radius: var(--radius-2xl);
      border: 1px solid var(--primary-200);
    }

    .header h1 {
      color: var(--text-primary);
      margin-bottom: var(--space-2);
      font-size: var(--font-size-3xl);
    }

    .header p {
      color: var(--text-secondary);
      margin: 0;
      font-size: var(--font-size-lg);
    }

    /* Progress Container */
    .progress-container {
      margin-bottom: var(--space-8);
      padding: var(--space-4);
      background: var(--bg-surface);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
    }

    .progress-steps {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-4);
      position: relative;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
      min-width: 100px;
      position: relative;
    }

    .step:not(.active):not(.completed) {
      opacity: 0.5;
    }

    .step.active {
      background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
      color: var(--primary-800);
      transform: scale(1.05);
      z-index: 10;
    }

    .step.completed {
      background: linear-gradient(135deg, var(--success-100), var(--success-200));
      color: var(--success-800);
    }

    .step-number {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: var(--bg-primary);
      border: 2px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-base);
      transition: all var(--transition-base);
    }

    .step.active .step-number,
    .step.completed .step-number {
      background: var(--white);
      border-color: var(--primary-500);
      color: var(--primary-700);
    }

    .step-connector {
      flex: 1;
      height: 2px;
      background: var(--border-color);
      margin: 0 var(--space-4);
      transition: all var(--transition-base);
      min-width: 40px;
    }

    .step-connector.active {
      background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
    }

    .step-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      text-align: center;
      line-height: var(--line-height-tight);
    }

    /* Desktop labels - shown on larger screens */
    .desktop-label {
      display: block;
    }

    /* Mobile labels - shown on smaller screens */
    .mobile-label {
      display: none;
    }

    /* Responsive labels */
    @media (max-width: 768px) {
      .desktop-label {
        display: none;
      }

      .mobile-label {
        display: block;
      }
    }

    @media (min-width: 769px) {
      .desktop-label {
        display: block;
      }

      .mobile-label {
        display: none;
      }
    }

    .progress-bar {
      height: 4px;
      background: var(--bg-secondary);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
      border-radius: var(--radius-full);
      transition: width 0.3s ease;
    }

    .delivery-form {
      background: var(--bg-surface);
      padding: var(--space-6);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
      width: 100%;
      background: var(--bg-surface);
      padding: var(--space-6);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
    }

    .form-section {
      margin-bottom: var(--space-6);
      animation: slideInUp 0.3s ease-out;
    }

    .step-header {
      text-align: center;
      margin-bottom: var(--space-6);
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--border-color);
    }

    .step-header h2 {
      color: var(--text-primary);
      margin-bottom: var(--space-2);
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
    }

    .step-header p {
      color: var(--text-secondary);
      margin: 0;
      font-size: var(--font-size-base);
    }

    .form-group {
      margin-bottom: var(--space-5);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    label {
      display: block;
      margin-bottom: var(--space-2);
      color: var(--text-primary);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-base);
    }

    .form-control {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      box-sizing: border-box;
      transition: all var(--transition-base);
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(191, 163, 110, 0.1);
    }

    .form-control::placeholder {
      color: var(--text-muted);
    }

    textarea.form-control {
      resize: vertical;
      min-height: 100px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: var(--font-weight-medium);
      gap: var(--space-2);
    }

    .checkbox-custom {
      width: 20px;
      height: 20px;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-md);
      position: relative;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .checkbox-custom:hover {
      border-color: var(--primary-500);
    }

    .checkbox-input:checked + .checkbox-custom {
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      border-color: var(--primary-500);
    }

    .checkbox-input:checked + .checkbox-custom::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 14px;
      font-weight: bold;
    }

    .help-text {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
      margin-top: var(--space-1);
      margin-left: var(--space-2);
    }

    .form-actions {
      display: flex;
      gap: var(--space-4);
      justify-content: space-between;
      align-items: center;
      margin-top: var(--space-6);
      padding-top: var(--space-6);
      border-top: 1px solid var(--border-color);
    }

    .spacer {
      flex: 1;
    }

    .btn {
      padding: var(--space-3) var(--space-6);
      border: none;
      border-radius: var(--radius-xl);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      transition: all var(--transition-base);
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
      min-height: 48px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Review Card */
    .review-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
      margin-bottom: var(--space-4);
    }

    .review-section {
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--border-color);
    }

    .review-section:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .review-section h3 {
      color: var(--text-primary);
      margin-bottom: var(--space-3);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
    }

    .review-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-2) 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .review-item:last-child {
      border-bottom: none;
    }

    .review-item strong {
      color: var(--text-primary);
      font-weight: var(--font-weight-medium);
    }

    /* Location selected styles */
    .location-selected {
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      background: var(--bg-secondary);
      margin-top: var(--space-2);
      transition: all var(--transition-base);
    }

    .location-info {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
    }

    .location-icon {
      font-size: var(--font-size-xl);
      flex-shrink: 0;
    }

    .location-details {
      flex: 1;
    }

    .location-details strong {
      color: var(--text-primary);
      font-weight: var(--font-weight-semibold);
      display: block;
      margin-bottom: var(--space-1);
    }

    .location-details span {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
    }

    .coordinates {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      font-family: var(--font-family-mono);
      margin-top: var(--space-1);
    }

    .location-actions {
      display: flex;
      justify-content: flex-end;
    }

    .map-field {
      border-radius: var(--radius-lg);
      transition: border-color var(--transition-base);
      border: 1px solid var(--border-color);
      background: var(--bg-primary);
    }

    .map-field.error {
      border: 2px solid var(--error-500);
      background-color: rgba(239, 68, 68, 0.05);
    }

    .field-error {
      color: var(--error-600);
      font-size: var(--font-size-sm);
      margin-top: var(--space-2);
      padding: var(--space-2);
      background-color: rgba(239, 68, 68, 0.1);
      border-radius: var(--radius-md);
      border: 1px solid rgba(239, 68, 68, 0.2);
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

    .form-group .error-message {
      background-color: transparent;
      border: none;
      padding: var(--space-2) 0 0 0;
      font-size: var(--font-size-sm);
      text-align: left;
      margin-top: var(--space-1);
    }

    /* Dark mode styles */
    [data-theme="dark"] .header {
      background: linear-gradient(135deg, var(--dark-primary-50), var(--dark-primary-100));
      border-color: var(--dark-primary-200);
    }

    [data-theme="dark"] .header h1 {
      color: var(--dark-text-primary);
    }

    [data-theme="dark"] .header p {
      color: var(--dark-text-secondary);
    }

    [data-theme="dark"] .progress-container {
      background: var(--dark-bg-surface);
      border-color: var(--dark-border);
    }

    [data-theme="dark"] .step:not(.active):not(.completed) {
      opacity: 0.3;
    }

    [data-theme="dark"] .step.active {
      background: linear-gradient(135deg, var(--dark-primary-200), var(--dark-primary-300));
      color: var(--dark-primary-800);
    }

    [data-theme="dark"] .step.completed {
      background: linear-gradient(135deg, var(--dark-success-200), var(--dark-success-300));
      color: var(--dark-success-800);
    }

    [data-theme="dark"] .step-number {
      background: var(--dark-bg-primary);
      border-color: var(--dark-border);
      color: var(--dark-text-primary);
    }

    [data-theme="dark"] .step-connector {
      background: var(--dark-border);
    }

    [data-theme="dark"] .step-connector.active {
      background: linear-gradient(90deg, var(--dark-primary-500), var(--dark-primary-600));
    }

    [data-theme="dark"] .delivery-form {
      background: var(--dark-bg-surface);
      border-color: var(--dark-border);
    }

    [data-theme="dark"] .step-header {
      border-color: var(--dark-border);
    }

    [data-theme="dark"] .step-header h2 {
      color: var(--dark-text-primary);
    }

    [data-theme="dark"] .step-header p {
      color: var(--dark-text-secondary);
    }

    [data-theme="dark"] .form-control {
      background: var(--dark-bg-primary);
      border-color: var(--dark-border);
      color: var(--dark-text-primary);
    }

    [data-theme="dark"] .form-control:focus {
      border-color: var(--dark-primary-500);
      box-shadow: 0 0 0 3px rgba(212, 184, 133, 0.1);
    }

    [data-theme="dark"] .form-control::placeholder {
      color: var(--dark-text-muted);
    }

    [data-theme="dark"] .checkbox-custom {
      border-color: var(--dark-border);
      background: var(--dark-bg-primary);
    }

    [data-theme="dark"] .checkbox-custom:hover {
      border-color: var(--dark-primary-500);
    }

    [data-theme="dark"] .review-card {
      background: var(--dark-bg-secondary);
      border-color: var(--dark-border);
    }

    [data-theme="dark"] .review-section h3 {
      color: var(--dark-text-primary);
    }

    [data-theme="dark"] .review-section {
      border-color: var(--dark-border);
    }

    [data-theme="dark"] .review-item {
      border-color: rgba(255, 255, 255, 0.05);
    }

    [data-theme="dark"] .review-item strong {
      color: var(--dark-text-primary);
    }

    [data-theme="dark"] .location-selected {
      background: var(--dark-bg-secondary);
      border-color: var(--dark-border);
    }

    [data-theme="dark"] .location-info strong {
      color: var(--dark-text-primary);
    }

    [data-theme="dark"] .location-details span {
      color: var(--dark-text-secondary);
    }

    [data-theme="dark"] .coordinates {
      color: var(--dark-text-muted);
    }

    [data-theme="dark"] .map-field {
      border-color: var(--dark-border);
      background: var(--dark-bg-primary);
    }

    [data-theme="dark"] .map-field.error {
      border-color: var(--dark-error-500);
      background-color: rgba(239, 68, 68, 0.1);
    }

    [data-theme="dark"] .field-error {
      background-color: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      color: var(--dark-error-400);
    }

    [data-theme="dark"] .form-actions {
      border-color: var(--dark-border);
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

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
      min-width: 100px;
      position: relative;
      flex: 0 0 auto;
    }

    .step-number {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: var(--bg-primary);
      border: 2px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-base);
      transition: all var(--transition-base);
    }

    .step-connector {
      flex: 1;
      height: 2px;
      background: var(--border-color);
      margin: 0 var(--space-4);
      transition: all var(--transition-base);
      min-width: 40px;
    }

    /* Responsive optimizations for different screen sizes */
    @media (max-width: 1024px) {
      .step {
        min-width: 80px;
        padding: var(--space-2);
        gap: var(--space-1);
      }

      .step-number {
        width: 36px;
        height: 36px;
        font-size: var(--font-size-sm);
      }

      .step-connector {
        margin: 0 var(--space-3);
        min-width: 30px;
      }
    }

    @media (max-width: 768px) {
      .create-delivery-container {
        padding: var(--space-4);
        margin: 0 var(--space-2);
      }

      .header {
        padding: var(--space-4);
        margin-bottom: var(--space-6);
      }

      .header h1 {
        font-size: var(--font-size-2xl);
      }

      .header p {
        font-size: var(--font-size-base);
      }

      .progress-container {
        padding: var(--space-3);
        margin-bottom: var(--space-6);
      }

      .delivery-form {
        padding: var(--space-4);
      }

      .step-header {
        margin-bottom: var(--space-4);
        padding-bottom: var(--space-3);
      }

      .step-header h2 {
        font-size: var(--font-size-xl);
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: var(--space-3);
      }

      .form-actions {
        flex-direction: column;
        gap: var(--space-3);
        margin-top: var(--space-4);
        padding-top: var(--space-4);
      }

      .spacer {
        display: none;
      }

      .btn {
        width: 100%;
        justify-content: center;
        padding: var(--space-2);
      }

      .step {
        min-width: 60px;
        padding: var(--space-1);
        gap: 2px;
        max-width: 80px;
      }

      .step-number {
        width: 28px;
        height: 28px;
        font-size: 10px;
      }

      .step-label {
        font-size: 10px;
        line-height: 1.2;
      }

      .progress-steps {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        gap: var(--space-3);
        justify-content: center;
        align-items: center;
        max-width: 300px;
        margin: 0 auto var(--space-4) auto;
      }

      .step {
        min-width: auto;
        padding: var(--space-2);
        gap: var(--space-1);
        flex: none;
        max-width: none;
        justify-self: center;
      }

      .step-number {
        width: 32px;
        height: 32px;
        font-size: var(--font-size-xs);
      }

      .step-label {
        font-size: var(--font-size-xs);
      }

      .step-connector {
        display: none;
      }

      .progress-bar {
        height: 6px;
      }
    }

    @media (max-width: 480px) {
      .step {
        min-width: 50px;
        max-width: 70px;
        padding: 2px;
      }

      .step-number {
        width: 24px;
        height: 24px;
        font-size: 9px;
      }

      .step-label {
        font-size: 9px;
      }
    }
  `]
})
export class CreateDeliveryComponent {
  delivery: Partial<Delivery> = {
    title: '',
    description: '',
    deliveryZone: '',
    pickupLocation: '',
    deliveryLocation: '',
    estimatedDeliveryTime: '',
    packageDetails: {
      weight: '',
      dimensions: '',
      fragile: false,
      value: ''
    },
    status: 'available',
    assignedTo: null,
    evidenceImages: []
  };

  // Map location properties
  pickupLocation: Location | null = null;
  deliveryDestination: Location | null = null;

  // Wizard properties
  currentStep = 1;
  formSubmitted = false;

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private deliveryService: DeliveryService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Handle pickup location selection from map
   */
  onPickupLocationSelected(location: Location): void {
    this.pickupLocation = location;
    this.delivery.pickupLocation = location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  /**
   * Handle delivery destination selection from map
   */
  onDeliveryLocationSelected(location: Location): void {
    this.deliveryDestination = location;
    this.delivery.deliveryLocation = location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  /**
   * Clear pickup location
   */
  clearPickupLocation(): void {
    this.pickupLocation = null;
    this.delivery.pickupLocation = '';
  }

  /**
   * Clear delivery location
   */
  clearDeliveryLocation(): void {
    this.deliveryDestination = null;
    this.delivery.deliveryLocation = '';
  }

  /**
   * Navigate to the next step in the wizard
   */
  nextStep(): void {
    if (this.canProceedToNextStep()) {
      this.currentStep++;
    }
  }

  /**
   * Navigate to the previous step in the wizard
   */
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  /**
   * Check if we can proceed to the next step
   */
  private canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!(this.delivery.title && this.delivery.description && this.delivery.deliveryZone);
      case 2:
        return !!(this.pickupLocation && this.deliveryDestination && this.delivery.estimatedDeliveryTime);
      case 3:
        return !!(this.delivery.packageDetails?.weight && this.delivery.packageDetails?.dimensions && this.delivery.packageDetails?.value);
      default:
        return false;
    }
  }

  /**
   * Getter for package weight with two-way binding support
   */
  get packageWeight(): string {
    return this.delivery.packageDetails?.weight || '';
  }

  /**
   * Setter for package weight
   */
  set packageWeight(value: string) {
    if (!this.delivery.packageDetails) {
      this.delivery.packageDetails = {
        weight: '',
        dimensions: '',
        fragile: false,
        value: ''
      };
    }
    this.delivery.packageDetails!.weight = value;
  }

  /**
   * Getter for package dimensions with two-way binding support
   */
  get packageDimensions(): string {
    return this.delivery.packageDetails?.dimensions || '';
  }

  /**
   * Setter for package dimensions
   */
  set packageDimensions(value: string) {
    if (!this.delivery.packageDetails) {
      this.delivery.packageDetails = {
        weight: '',
        dimensions: '',
        fragile: false,
        value: ''
      };
    }
    this.delivery.packageDetails!.dimensions = value;
  }

  /**
   * Getter for package value with two-way binding support
   */
  get packageValue(): string {
    return this.delivery.packageDetails?.value || '';
  }

  /**
   * Setter for package value
   */
  set packageValue(value: string) {
    if (!this.delivery.packageDetails) {
      this.delivery.packageDetails = {
        weight: '',
        dimensions: '',
        fragile: false,
        value: ''
      };
    }
    this.delivery.packageDetails!.value = value;
  }

  /**
   * Getter for package fragile with two-way binding support
   */
  get packageFragile(): boolean {
    return this.delivery.packageDetails?.fragile || false;
  }

  /**
   * Setter for package fragile
   */
  set packageFragile(value: boolean) {
    if (!this.delivery.packageDetails) {
      this.delivery.packageDetails = {
        weight: '',
        dimensions: '',
        fragile: false,
        value: ''
      };
    }
    this.delivery.packageDetails!.fragile = value;
  }

  /**
   * Handle form submission to create new delivery
   */
  onSubmit(): void {
    this.formSubmitted = true;

    if (!this.authService.getCurrentUser()) {
      this.errorMessage = 'You must be logged in to create a delivery.';
      return;
    }

    // Validate that locations are selected
    if (!this.pickupLocation) {
      this.errorMessage = 'Please select a pickup location on the map.';
      return;
    }

    if (!this.deliveryDestination) {
      this.errorMessage = 'Please select a delivery destination on the map.';
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const newDelivery: Partial<Delivery> = {
      ...this.delivery,
      createdBy: this.authService.getCurrentUser()!.id,
      createdAt: new Date().toISOString(),
      startedAt: null,
      actualDeliveryTime: null,
      completedAt: null
    };

    this.deliveryService.createDelivery(newDelivery).subscribe({
      next: (createdDelivery) => {
        this.isSubmitting = false;
        this.formSubmitted = false;
        this.successMessage = `Delivery "${createdDelivery.title}" has been created successfully!`;
        this.resetForm();

        // Redirect to delivery list after a short delay
        setTimeout(() => {
          this.router.navigate(['/deliveries']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formSubmitted = false;
        this.errorMessage = 'Failed to create delivery. Please try again.';
        console.error('Error creating delivery:', error);
      }
    });
  }

  /**
   * Reset the form to initial state
   */
  resetForm(): void {
    this.delivery = {
      title: '',
      description: '',
      deliveryZone: '',
      pickupLocation: '',
      deliveryLocation: '',
      estimatedDeliveryTime: '',
      packageDetails: {
        weight: '',
        dimensions: '',
        fragile: false,
        value: ''
      },
      status: 'available',
      assignedTo: null,
      evidenceImages: []
    };

    // Clear map locations
    this.pickupLocation = null;
    this.deliveryDestination = null;
    this.formSubmitted = false;
    this.currentStep = 1;
  }
}
