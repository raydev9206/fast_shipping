/**
 * User model representing a system user
 * Contains user information and role-based access control
 */
export interface User {
  /** Unique identifier for the user */
  id: number;

  /** User's login username */
  username: string;

  /** User's password (plain text for demo purposes) */
  password: string;

  /** User's role in the system (moderator or delivery) */
  role: 'moderator' | 'delivery';

  /** User's display name */
  name: string;
}
