import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from "./storage.service";
import { ApiService } from "./api.service";
import { LoginRequest, LoginResponse, UserDTO } from "../api";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  isAuthenticated$: Observable<boolean>;

  private currentUserSubject = new BehaviorSubject<UserDTO | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(
    private router: Router,
    private storage: StorageService,
    private api: ApiService
  ) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    // console.log('AuthService created');
    this.isAuthenticated$.subscribe((isAuth) => {
      if (isAuth) this.getUser(); // Запрашиваем данные пользователя только при авторизации
    });
  }

  login(jwt: LoginResponse): void {
    const decodedToken = this.decodeToken(jwt.accessToken);
    // console.log('токен:', decodedToken);
    this.setTokens(jwt.accessToken, jwt.refreshToken);
    this.isAuthenticatedSubject.next(true);
    this.router.navigate(['/']);
  }

  logout(): void {
    this.clearTokens();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return this.storage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return this.storage.getItem('refreshToken');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    this.storage.setItem('accessToken', accessToken);
    this.storage.setItem('refreshToken', refreshToken);
  }
  
  private clearTokens(): void {
    this.storage.removeItem('accessToken');
    this.storage.removeItem('refreshToken');
  }

  private hasToken(): boolean {
    return !!this.getAccessToken();
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  getUserId(): number {
    const token = this.getAccessToken();
    if (!token) {
      this.logout();
      throw new Error('Токен отсутствует, выполнен logout');
    }

    const decoded = this.decodeToken(token);
    if (!decoded?.id) {
      this.logout();
      throw new Error('ID пользователя не найден в токене, выполнен logout');
    }

    return decoded.id;
  }

  getUser(): void {
    const userId = this.getUserId();
    if (userId) {
      this.api.apiService.getMe().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
          // console.log(`Получен юзер: ${this.currentUser$}`)
        }
      })
    }
  }

  setUser(user: UserDTO): void {
    this.currentUserSubject.next(user);
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