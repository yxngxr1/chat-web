// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/login.request';
import { RegistrationRequest } from '../models/registration-request.dto';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

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
  registrationRequest: RegistrationRequest = { username: '', email: '', password: ''};

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  onLoginSubmit() {
    this.authService.login(this.loginRequest).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error) => console.error('Login failed', error)
    });
  }

  onRegisterSubmit() {
    this.userService.createUser(this.registrationRequest).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (error) => console.error('Registration failed', error)
    });
  }
}