import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeService } from '../../services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { UserDetailsDialogComponent } from '../user-details-dialog/user-details-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { UserDTO } from '../../api';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    TitleCasePipe,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  profile$!: Observable<UserDTO | null>;

  constructor(
    public themeService: ThemeService, 
    private authService: AuthService, 
    private api: ApiService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.profile$ = this.authService.currentUser$;
  }

  logout() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Выход',
        message: 'Вы уверены, что хотите выйти из аккаунта?',
        confirmText: 'Выйти',
        cancelText: 'Отмена'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Выход из аккаунта")
        this.authService.logout();
      }
    });
  }

  openProfileDialog(user: UserDTO) {
    const dialogRef = this.dialog.open(UserDetailsDialogComponent, {
      data: { user: user }
    });

    dialogRef.afterClosed().subscribe((profile: UserDTO) => {
      if (profile) {
        this.authService.setUser(profile);
      }
    });
  }
}
