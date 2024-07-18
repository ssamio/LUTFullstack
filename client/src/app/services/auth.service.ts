import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  token: string;
}

export interface User {
  username: string;
  budget: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = `${environment.authUrl}`;
  private userUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  // User registration
  register(
    username: string,
    password: string,
    email: string,
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/register`, {
      username,
      password,
      email,
    });
  }

  // User login
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, {
      email,
      password,
    });
  }

  // Check login status
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // User logout
  logout(): void {
    localStorage.removeItem('access_token');
  }

  // Get current user data
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.userUrl);
  }

  // Update user
  updateUser(
    username: string,
    budget: number,
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.userUrl, {
      username,
      budget,
    });
  }

  // Delete user
  deleteUser(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(this.userUrl);
  }
}
