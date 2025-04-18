// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiModule, LoginRequest, UserCreateRequest } from '../../api';
import { ApiService } from '../../services/api.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginRequest: LoginRequest = { username: '', password: '' };
  registrationRequest: UserCreateRequest = { username: '', email: '', password: ''};

  loginError: string = '';
  registrationError: string = '';

  constructor(
    private authService: AuthService,
    private api: ApiService
  ) {}

  onLoginSubmit() {
    this.api.apiService.login(this.loginRequest).subscribe({
      next: (response) => {
        console.log(response);
        this.authService.login(response);
      },
      error: (error) => {
        this.loginError = error.error || 'Registration failed.';
      }
    });
  }

  onRegisterSubmit() {
    this.api.apiService.createUser(this.registrationRequest).subscribe({
      next: (response) => {
        this.authService.login(response);
      },
      error: (error) => {
        this.registrationError = error.error || 'Registration failed.';
      }
    });
  }
}