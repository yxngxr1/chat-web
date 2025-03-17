import { Component, inject, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeService } from '../services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UserDTO } from '../models/user.dto';
import { UserService } from '../services/user.service';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    TitleCasePipe,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  profile$!: Observable<UserDTO>;

  constructor(
    public themeService: ThemeService, // Предполагаемый сервис тем
    private authService: AuthService,   // Сервис авторизации
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    const userId = this.authService.getUserId();
    this.profile$ = this.userService.getUserById(userId) 
  }

  logout() {
    this.authService.logout();
  }
}
