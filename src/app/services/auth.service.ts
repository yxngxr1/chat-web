import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest } from "../models/login.request";
import { JwtAuthenticationResponse } from "../models/jwt.response";
import { environment } from "../../environment";
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth/login`;
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  login(loginRequest: LoginRequest): Observable<JwtAuthenticationResponse> {
    return this.http.post<JwtAuthenticationResponse>(this.API_URL, loginRequest)
      .pipe(
        tap(response => {
          const decodedToken = this.decodeToken(response.accessToken); 
          console.log('токен:', decodedToken);
          this.setTokens(response.accessToken, response.refreshToken);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  refreshToken(): Observable<JwtAuthenticationResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<JwtAuthenticationResponse>(
      `${environment.apiUrl}/auth/refresh_token`, 
      { refreshToken }
    ).pipe(
      tap(response => {
        this.setTokens(response.accessToken, response.refreshToken);
      })
    );
  }

  getUserId(): number {
    const token = this.getAccessToken();
    if (!token) {
      this.logout();
      this.router.navigate(['/login']);
      throw new Error('Токен отсутствует, выполнен logout');
    }

    const decoded = this.decodeToken(token);
    if (!decoded?.id) {
      this.logout();
      this.router.navigate(['/login']);
      throw new Error('ID пользователя не найден в токене, выполнен logout');
    }

    return decoded.id; // Теперь всегда возвращаем number
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1]; // Берем payload (вторая часть токена)
      const decodedPayload = atob(payload); // Декодируем из base64
      return JSON.parse(decodedPayload); // Преобразуем в объект
    } catch (e) {
      console.error('Ошибка декодирования токена:', e);
      return null;
    }
  }
}