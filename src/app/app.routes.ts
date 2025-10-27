import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component';
import { DeliveryDetailComponent } from './components/delivery-detail/delivery-detail.component';
import { CreateDeliveryComponent } from './components/create-delivery/create-delivery.component';
import { DeliveryPersonConciliationComponent } from './components/delivery-person-conciliation/delivery-person-conciliation.component';
import { ModeratorConciliationComponent } from './components/moderator-conciliation/moderator-conciliation.component';
import { AuthGuard } from './guards/auth.guard';

/**
 * Application routes configuration
 * Defines the navigation structure of the Fast shipping application
 */
export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Protected routes - require authentication
  {
    path: 'deliveries',
    component: DeliveryListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'delivery/:id',
    component: DeliveryDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create-delivery',
    component: CreateDeliveryComponent,
    canActivate: [AuthGuard],
    data: { roles: ['moderator'] } // Only moderators can create deliveries
  },
  {
    path: 'my-conciliations',
    component: DeliveryPersonConciliationComponent,
    canActivate: [AuthGuard],
    data: { roles: ['delivery'] } // Only delivery personnel can access their conciliations
  },
  {
    path: 'conciliations',
    component: ModeratorConciliationComponent,
    canActivate: [AuthGuard],
    data: { roles: ['moderator'] } // Only moderators can access all conciliations
  },

  // Fallback route
  { path: '**', redirectTo: '/login' }
];
