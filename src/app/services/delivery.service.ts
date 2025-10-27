import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Delivery } from '../models/delivery.model';
import { ConciliationSummary, DeliveryConciliation, ConciliationFilter } from '../models/conciliation.model';
import { environment } from '../../environments/environment';

/**
 * Mock data for testing when JSON server is not available
 */
const MOCK_DELIVERIES: Delivery[] = [
  {
    id: 1,
    title: "Pizza Familiar + Bebidas",
    description: "Pizza grande de pepperoni con 4 refrescos para familia",
    deliveryZone: "Centro",
    pickupLocation: "Pizza Palace - Av. Central 456",
    deliveryLocation: "Torre Residencial Plaza, Apto 15B",
    estimatedDeliveryTime: "2025-10-27T19:30:00.000Z",
    actualDeliveryTime: "2025-10-27T00:09",
    packageDetails: {
      weight: "2.1kg",
      dimensions: "35x35x8cm",
      fragile: false,
      value: "$25.99"
    },
    status: "completed",
    createdBy: 1,
    assignedTo: 2,
    createdAt: "2025-10-27T18:45:00.000Z",
    startedAt: "2025-10-27T04:08:18.857Z",
    completedAt: "2025-10-27T04:09:35.279Z",
    evidenceImages: [
      "https://via.placeholder.com/300x200?text=Ray.jpg"
    ],
    isReconciled: true,
    reconciledAt: "2025-10-27T13:56:54.256Z",
    reconciledBy: 1,
    deliveryFee: 25.99
  },
  {
    id: 2,
    title: "Smartphone Samsung Galaxy",
    description: "Teléfono celular nuevo con auriculares incluidos",
    deliveryZone: "Norte",
    pickupLocation: "TechStore - Centro Comercial Norte",
    deliveryLocation: "Conjunto Residencial Los Pinos, Casa 23",
    estimatedDeliveryTime: "2025-10-27T16:00:00.000Z",
    actualDeliveryTime: "2025-10-27T11:03",
    packageDetails: {
      weight: "0.8kg",
      dimensions: "18x10x6cm",
      fragile: true,
      value: "$899.00"
    },
    status: "completed",
    createdBy: 1,
    assignedTo: 2,
    createdAt: "2025-10-27T14:30:00.000Z",
    startedAt: "2025-10-27T14:01:13.286Z",
    completedAt: "2025-10-27T14:02:21.363Z",
    evidenceImages: [
      "https://via.placeholder.com/300x200?text=photo_2025-09-12_22-35-54.jpg"
    ],
    isReconciled: true,
    reconciledAt: "2025-10-27T14:03:35.038Z",
    reconciledBy: 1,
    deliveryFee: 899
  },
  {
    id: 3,
    title: "Medicamentos Urgentes",
    description: "Antibióticos y medicamentos para tratamiento médico",
    deliveryZone: "Sur",
    pickupLocation: "Farmacia 24 Horas - Av. Sur 789",
    deliveryLocation: "Clínica Médica Central, Consultorio 5",
    estimatedDeliveryTime: "2025-10-27T15:15:00.000Z",
    actualDeliveryTime: null,
    packageDetails: {
      weight: "0.3kg",
      dimensions: "15x10x5cm",
      fragile: true,
      value: "$45.50"
    },
    status: "assigned",
    createdBy: 1,
    assignedTo: 2,
    createdAt: "2025-10-27T14:00:00.000Z",
    startedAt: "2025-10-27T16:09:49.835Z",
    completedAt: null,
    evidenceImages: [],
    isReconciled: false,
    reconciledAt: null,
    reconciledBy: null,
    deliveryFee: 45.5
  },
  {
    id: 4,
    title: "Libros Universitarios - Ingeniería",
    description: "Textos de Cálculo Avanzado y Física Cuántica",
    deliveryZone: "Oeste",
    pickupLocation: "Librería Técnica Universitaria - Campus Oeste",
    deliveryLocation: "Residencias Estudiantiles Torre 3, Habitación 412",
    estimatedDeliveryTime: "2025-10-28T10:30:00.000Z",
    actualDeliveryTime: null,
    packageDetails: {
      weight: "4.2kg",
      dimensions: "30x25x15cm",
      fragile: false,
      value: "$180.00"
    },
    status: "available",
    createdBy: 1,
    assignedTo: null,
    createdAt: "2025-10-27T09:00:00.000Z",
    startedAt: null,
    completedAt: null,
    evidenceImages: [],
    isReconciled: false,
    reconciledAt: null,
    reconciledBy: null,
    deliveryFee: 180
  },
  {
    id: 5,
    title: "Ropa Deportiva - Zapatillas",
    description: "Zapatillas deportivas Nike Air Max talla 42",
    deliveryZone: "Este",
    pickupLocation: "Sports Center - Mall del Este",
    deliveryLocation: "Urbanización Jardines del Sol, Casa 18",
    estimatedDeliveryTime: "2025-10-27T17:45:00.000Z",
    actualDeliveryTime: null,
    packageDetails: {
      weight: "1.5kg",
      dimensions: "32x20x12cm",
      fragile: false,
      value: "$120.00"
    },
    status: "available",
    createdBy: 1,
    assignedTo: null,
    createdAt: "2025-10-27T16:20:00.000Z",
    startedAt: null,
    completedAt: null,
    evidenceImages: [],
    isReconciled: false,
    reconciledAt: null,
    reconciledBy: null,
    deliveryFee: 120
  },
  {
    id: 6,
    title: "Supermercado Express",
    description: "Compra semanal: frutas, verduras, lácteos y productos de limpieza",
    deliveryZone: "Centro",
    pickupLocation: "SuperMarket Central - Plaza Mayor",
    deliveryLocation: "Edificio Corporativo Torre A, Oficina 1205",
    estimatedDeliveryTime: "2025-10-27T12:00:00.000Z",
    actualDeliveryTime: null,
    packageDetails: {
      weight: "8.5kg",
      dimensions: "45x35x25cm",
      fragile: false,
      value: "$95.75"
    },
    status: "available",
    createdBy: 1,
    assignedTo: null,
    createdAt: "2025-10-27T10:30:00.000Z",
    startedAt: null,
    completedAt: null,
    evidenceImages: [],
    isReconciled: false,
    reconciledAt: null,
    reconciledBy: null,
    deliveryFee: 95.75
  },
  {
    id: 7,
    title: "Documentos Legales - Notaría",
    description: "Contratos y documentos notariales para firma urgente",
    deliveryZone: "Norte",
    pickupLocation: "Notaría Pública Central - Edificio Norte",
    deliveryLocation: "Despacho Jurídico Asociados, Piso 8",
    estimatedDeliveryTime: "2025-10-27T14:30:00.000Z",
    actualDeliveryTime: null,
    packageDetails: {
      weight: "0.4kg",
      dimensions: "25x18x3cm",
      fragile: false,
      value: "$15.00"
    },
    status: "available",
    createdBy: 1,
    assignedTo: null,
    createdAt: "2025-10-27T13:15:00.000Z",
    startedAt: null,
    completedAt: null,
    evidenceImages: [],
    isReconciled: false,
    reconciledAt: null,
    reconciledBy: null,
    deliveryFee: 15
  },
  {
    id: 8,
    title: "Pastelería - Torta de Cumpleaños",
    description: "Torta personalizada de chocolate con decoración temática",
    deliveryZone: "Sur",
    pickupLocation: "Pastelería Dulce Sueño - Av. Sur 321",
    deliveryLocation: "Casa Familiar Los Álamos, Calle Principal 45",
    estimatedDeliveryTime: "2025-10-27T18:00:00.000Z",
    actualDeliveryTime: null,
    packageDetails: {
      weight: "2.8kg",
      dimensions: "28x28x12cm",
      fragile: true,
      value: "$65.00"
    },
    status: "available",
    createdBy: 1,
    assignedTo: null,
    createdAt: "2025-10-27T15:30:00.000Z",
    startedAt: null,
    completedAt: null,
    evidenceImages: [],
    isReconciled: false,
    reconciledAt: null,
    reconciledBy: null,
    deliveryFee: 65
  },
  {
    id: 9,
    title: "Electrónica - Laptop Gaming",
    description: "Laptop para gaming con mouse y mochila incluida",
    deliveryZone: "Oeste",
    pickupLocation: "GameTech Store - Centro Comercial Oeste",
    deliveryLocation: "Residencias Universitarias Campus, Bloque C-205",
    estimatedDeliveryTime: "2025-10-28T11:00:00.000Z",
    actualDeliveryTime: null,
    packageDetails: {
      weight: "3.2kg",
      dimensions: "40x30x8cm",
      fragile: true,
      value: "$1250.00"
    },
    status: "available",
    createdBy: 1,
    assignedTo: null,
    createdAt: "2025-10-27T08:45:00.000Z",
    startedAt: null,
    completedAt: null,
    evidenceImages: [],
    isReconciled: false,
    reconciledAt: null,
    reconciledBy: null,
    deliveryFee: 1250
  },
  {
    id: 10,
    title: "Farmacia - Productos de Cuidado",
    description: "Cosméticos, cremas y productos de higiene personal",
    deliveryZone: "Este",
    pickupLocation: "Beauty & Care Pharmacy - Mall Plaza Este",
    deliveryLocation: "Condominio Vista Hermosa, Torre 2, Apto 8A",
    estimatedDeliveryTime: "2025-10-27T16:30:00.000Z",
    actualDeliveryTime: null,
    packageDetails: {
      weight: "1.8kg",
      dimensions: "25x15x10cm",
      fragile: false,
      value: "$78.90"
    },
    status: "available",
    createdBy: 1,
    assignedTo: null,
    createdAt: "2025-10-27T15:00:00.000Z",
    startedAt: null,
    completedAt: null,
    evidenceImages: [],
    isReconciled: false,
    reconciledAt: null,
    reconciledBy: null,
    deliveryFee: 78.9
  }
];

/**
 * Service for managing delivery operations
 * Handles CRUD operations for deliveries and delivery assignments
 * Falls back to mock data if JSON server is not available
 */
@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = environment.apiUrl;
  private useMockData = false;

  constructor(private http: HttpClient) {
    // Check if server is available
    this.checkServerAvailability();
  }

  /**
   * Check if JSON server is available
   */
  private checkServerAvailability(): void {
    this.http.get(`${this.apiUrl}/users`).subscribe({
      next: () => {
        this.useMockData = false;
        console.log('JSON Server is available');
      },
      error: () => {
        this.useMockData = true;
        console.warn('JSON Server not available, using mock data');
      }
    });
  }

  /**
   * Get a single delivery by ID
   * @param id - Delivery ID
   * @returns Observable<Delivery> - Single delivery object
   */
  getDelivery(id: number): Observable<Delivery> {
    if (this.useMockData) {
      const delivery = MOCK_DELIVERIES.find(d => d.id === id);
      if (delivery) {
        return of(delivery);
      } else {
        return throwError(() => new Error(`Delivery with ID ${id} not found`));
      }
    }
    return this.http.get<Delivery>(`${this.apiUrl}/deliveries/${id}`);
  }

  /**
   * Get all deliveries from the API
   * @returns Observable<Delivery[]> - Array of all deliveries
   */
  getDeliveries(): Observable<Delivery[]> {
    if (this.useMockData) {
      return of(MOCK_DELIVERIES);
    }
    return this.http.get<Delivery[]>(`${this.apiUrl}/deliveries`);
  }


  /**
   * Create a new delivery
   * @param delivery - Delivery data to create
   * @returns Observable<Delivery> - Created delivery
   */
  createDelivery(delivery: Partial<Delivery>): Observable<Delivery> {
    return this.http.post<Delivery>(`${this.apiUrl}/deliveries`, delivery);
  }

  /**
   * Update an existing delivery
   * @param id - Delivery ID to update
   * @param delivery - Updated delivery data
   * @returns Observable<Delivery> - Updated delivery
   */
  updateDelivery(id: number, delivery: Partial<Delivery>): Observable<Delivery> {
    return this.http.patch<Delivery>(`${this.apiUrl}/deliveries/${id}`, delivery);
  }

  /**
   * Delete a delivery
   * @param id - Delivery ID to delete
   * @returns Observable<any> - Deletion response
   */
  deleteDelivery(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deliveries/${id}`);
  }

  /**
   * Assign a delivery to a delivery person
   * @param deliveryId - ID of the delivery to assign
   * @param deliveryPersonId - ID of the delivery person
   * @returns Observable<Delivery> - Updated delivery with assignment
   */
  assignDelivery(deliveryId: number, deliveryPersonId: number): Observable<Delivery> {
    return this.http.patch<Delivery>(`${this.apiUrl}/deliveries/${deliveryId}`, {
      status: 'assigned',
      assignedTo: deliveryPersonId,
      startedAt: new Date().toISOString()
    });
  }

  /**
   * Mark a delivery as in transit (when delivery person starts the trip)
   * @param id - Delivery ID
   * @returns Observable<Delivery> - Updated delivery
   */
  startDelivery(id: number): Observable<Delivery> {
    return this.http.patch<Delivery>(`${this.apiUrl}/deliveries/${id}`, {
      status: 'in_transit'
    });
  }

  /**
   * Complete a delivery with evidence images
   * @param id - Delivery ID
   * @param evidenceImages - Array of evidence image URLs
   * @returns Observable<Delivery> - Completed delivery
   */
  completeDelivery(id: number, evidenceImages: string[]): Observable<Delivery> {
    return this.http.patch<Delivery>(`${this.apiUrl}/deliveries/${id}`, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      evidenceImages: evidenceImages,
      actualDeliveryTime: new Date().toISOString(),
      isReconciled: false,
      reconciledAt: null,
      reconciledBy: null
    });
  }

  /**
   * Get available deliveries (not assigned)
   * @returns Observable<Delivery[]> - Array of available deliveries
   */
  getAvailableDeliveries(): Observable<Delivery[]> {
    if (this.useMockData) {
      const availableDeliveries = MOCK_DELIVERIES.filter(d => d.status === 'available');
      return of(availableDeliveries);
    }
    return this.http.get<Delivery[]>(`${this.apiUrl}/deliveries?status=available`);
  }

  /**
   * Get deliveries assigned to a specific delivery person
   * @param deliveryPersonId - ID of the delivery person
   * @returns Observable<Delivery[]> - Array of assigned deliveries
   */
  getMyDeliveries(deliveryPersonId: number): Observable<Delivery[]> {
    if (this.useMockData) {
      const myDeliveries = MOCK_DELIVERIES.filter(d =>
        d.assignedTo === deliveryPersonId && (d.status === 'assigned' || d.status === 'in_transit' || d.status === 'completed')
      );
      return of(myDeliveries);
    }
    return this.http.get<Delivery[]>(`${this.apiUrl}/deliveries?assignedTo=${deliveryPersonId}&status=assigned,in_transit,completed`);
  }

  /**
   * Get deliveries created by a specific moderator
   * @param moderatorId - ID of the moderator
   * @returns Observable<Delivery[]> - Array of deliveries created by moderator
   */
  getDeliveriesByModerator(moderatorId: number): Observable<Delivery[]> {
    if (this.useMockData) {
      const moderatorDeliveries = MOCK_DELIVERIES.filter(d => d.createdBy === moderatorId);
      return of(moderatorDeliveries);
    }
    return this.http.get<Delivery[]>(`${this.apiUrl}/deliveries?createdBy=${moderatorId}`);
  }

  /**
   * Cancel a delivery (mark as cancelled and clear assignment)
   * @param id - Delivery ID
   * @returns Observable<Delivery> - Cancelled delivery
   */
  cancelDelivery(id: number): Observable<Delivery> {
    return this.http.patch<Delivery>(`${this.apiUrl}/deliveries/${id}`, {
      status: 'cancelled',
      assignedTo: null,
      startedAt: null,
      actualDeliveryTime: null
    });
  }

  /**
   * Get completed deliveries for a specific delivery person (for reconciliation)
   * @param deliveryPersonId - ID of the delivery person
   * @returns Observable<Delivery[]> - Array of completed deliveries
   */
  getCompletedDeliveriesByPerson(deliveryPersonId: number): Observable<Delivery[]> {
    if (this.useMockData) {
      const completedDeliveries = MOCK_DELIVERIES.filter(d =>
        d.assignedTo === deliveryPersonId && d.status === 'completed'
      );
      return of(completedDeliveries);
    }
    return this.http.get<Delivery[]>(`${this.apiUrl}/deliveries?assignedTo=${deliveryPersonId}&status=completed`);
  }

  /**
   * Get reconciliation summary for a delivery person
   * @param deliveryPersonId - ID of the delivery person
   * @returns Observable<ConciliationSummary> - Reconciliation summary
   */
  getConciliationSummary(deliveryPersonId: number): Observable<ConciliationSummary> {
    return this.getCompletedDeliveriesByPerson(deliveryPersonId).pipe(
      map((deliveries: Delivery[]) => {
        const totalDeliveries = deliveries.length;
        const totalEarnings = deliveries.reduce((sum: number, d: Delivery) => sum + (d.deliveryFee || 0), 0);
        const platformCommission = totalEarnings * 0.1; // 10% commission
        const amountToPay = platformCommission;

        const pendingDeliveries = deliveries.filter((d: Delivery) => !d.isReconciled).length;
        const pendingValue = deliveries
          .filter((d: Delivery) => !d.isReconciled)
          .reduce((sum: number, d: Delivery) => sum + (d.deliveryFee || 0), 0);

        return {
          totalDeliveries,
          totalEarnings,
          platformCommission,
          amountToPay,
          pendingDeliveries,
          pendingValue
        };
      })
    );
  }

  /**
   * Get all deliveries for reconciliation (moderator view)
   * @param filter - Optional filter parameters
   * @returns Observable<DeliveryConciliation[]> - Array of deliveries for reconciliation
   */
  getAllConciliations(filter?: ConciliationFilter): Observable<DeliveryConciliation[]> {
    if (this.useMockData) {
      const deliveries = filter?.isReconciled !== undefined
        ? MOCK_DELIVERIES.filter(d => d.status === 'completed' && d.isReconciled === filter.isReconciled)
        : MOCK_DELIVERIES.filter(d => d.status === 'completed');

      return of(deliveries.map(d => ({
        deliveryId: d.id,
        deliveryPersonId: d.assignedTo || 0,
        deliveryPersonName: d.assignedTo === 2 ? 'María García' : 'Carlos Rodríguez',
        deliveryTitle: d.title,
        deliveryFee: d.deliveryFee || 0,
        platformCommission: (d.deliveryFee || 0) * 0.1,
        deliveryPersonEarnings: (d.deliveryFee || 0) * 0.9,
        completedAt: d.completedAt || '',
        isReconciled: d.isReconciled || false,
        reconciledAt: d.reconciledAt || undefined,
        reconciledBy: d.reconciledBy || undefined,
        reconciledByName: d.reconciledBy === 1 ? 'Admin' : undefined
      })));
    }

    let query = `${this.apiUrl}/deliveries?status=completed`;
    if (filter?.isReconciled !== undefined) {
      query += `&isReconciled=${filter.isReconciled}`;
    }

    return this.http.get<Delivery[]>(query).pipe(
      map((deliveries: Delivery[]) => deliveries.map((d: Delivery) => ({
        deliveryId: d.id,
        deliveryPersonId: d.assignedTo || 0,
        deliveryPersonName: 'Unknown', // Would need to join with users table
        deliveryTitle: d.title,
        deliveryFee: d.deliveryFee || 0,
        platformCommission: (d.deliveryFee || 0) * 0.1,
        deliveryPersonEarnings: (d.deliveryFee || 0) * 0.9,
        completedAt: d.completedAt || '',
        isReconciled: d.isReconciled || false,
        reconciledAt: d.reconciledAt || undefined,
        reconciledBy: d.reconciledBy || undefined,
        reconciledByName: undefined
      })))
    );
  }

  /**
   * Reconcile a delivery (mark as settled)
   * @param deliveryId - ID of the delivery to reconcile
   * @param moderatorId - ID of the moderator performing reconciliation
   * @returns Observable<Delivery> - Reconciled delivery
   */
  reconcileDelivery(deliveryId: number, moderatorId: number): Observable<Delivery> {
    return this.http.patch<Delivery>(`${this.apiUrl}/deliveries/${deliveryId}`, {
      isReconciled: true,
      reconciledAt: new Date().toISOString(),
      reconciledBy: moderatorId
    });
  }

  /**
   * Get unreconciled deliveries (for both delivery person and moderator)
   * @param deliveryPersonId - Optional: filter by delivery person
   * @returns Observable<Delivery[]> - Array of unreconciled deliveries
   */
  getUnreconciledDeliveries(deliveryPersonId?: number): Observable<Delivery[]> {
    if (this.useMockData) {
      let deliveries = MOCK_DELIVERIES.filter(d =>
        d.status === 'completed' && !d.isReconciled
      );

      if (deliveryPersonId) {
        deliveries = deliveries.filter(d => d.assignedTo === deliveryPersonId);
      }

      return of(deliveries);
    }

    let query = `${this.apiUrl}/deliveries?status=completed&isReconciled=false`;
    if (deliveryPersonId) {
      query += `&assignedTo=${deliveryPersonId}`;
    }

    return this.http.get<Delivery[]>(query);
  }
}