import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

/**
 * Mock users for testing when JSON server is not available
 */
const MOCK_USERS: User[] = [
  {
    id: 1,
    username: "moderator1",
    password: "mod123",
    role: "moderator",
    name: "Admin User"
  },
  {
    id: 2,
    username: "delivery1",
    password: "del123",
    role: "delivery",
    name: "John Delivery"
  },
  {
    id: 3,
    username: "delivery2",
    password: "del456",
    role: "delivery",
    name: "Jane Courier"
  }
];

/**
 * Authentication service for managing user login/logout
 * Handles user authentication state and API communication
 * Falls back to mock data if JSON server is not available
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private useMockData = false;

  constructor(private http: HttpClient) {
    // Check if server is available
    this.checkServerAvailability();
    // Check if user is already logged in on service initialization
    this.loadUserFromStorage();
  }

  /**
   * Check if JSON server is available
   */
  private checkServerAvailability(): void {
    this.http.get(`${this.apiUrl}/users`).subscribe({
      next: () => {
        this.useMockData = false;
        console.log('JSON Server is available for auth');
      },
      error: () => {
        this.useMockData = true;
        console.warn('JSON Server not available for auth, using mock data');
      }
    });
  }

  /**
   * Authenticate user with username and password
   * @param credentials - User login credentials
   * @returns Observable<User | null> - User data if authenticated, null otherwise
   */
  login(credentials: { username: string; password: string }): Observable<User | null> {
    if (this.useMockData) {
      const user = MOCK_USERS.find(u =>
        u.username === credentials.username &&
        u.password === credentials.password
      );

      if (user) {
        this.setCurrentUser(user);
        return of(user);
      } else {
        this.clearCurrentUser();
        return of(null);
      }
    }

    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        // Find user with matching credentials
        const user = users.find(u =>
          u.username === credentials.username &&
          u.password === credentials.password
        );

        if (user) {
          this.setCurrentUser(user);
          return user;
        } else {
          this.clearCurrentUser();
          return null;
        }
      })
    );
  }

  /**
   * Log out current user and clear authentication state
   */
  logout(): void {
    this.clearCurrentUser();
  }

  /**
   * Get current authenticated user
   * @returns User | null - Current user or null if not authenticated
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if current user has specific role
   * @param role - Role to check for
   * @returns boolean - True if user has the specified role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  /**
   * Check if user is authenticated
   * @returns boolean - True if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Set current user and store in localStorage
   * @param user - User to set as current
   */
  private setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Clear current user from memory and localStorage
   */
  private clearCurrentUser(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Load user from localStorage on service initialization
   */
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.clearCurrentUser();
      }
    }
  }
}
