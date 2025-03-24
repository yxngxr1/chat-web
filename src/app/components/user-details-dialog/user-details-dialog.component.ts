import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { UserDTO, UserUpdateRequest } from '../../api';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-details-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    DatePipe,
    MatButtonModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './user-details-dialog.component.html',
  styleUrl: './user-details-dialog.component.scss'
})
export class UserDetailsDialogComponent {
  user: UserDTO;
  password: string = '';
  isEditing = false;
  isSaving = false;

  constructor(
    public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserDTO },
    private api: ApiService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.user = data.user;  
    console.log(this.user.username)
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    if (!this.isEditing) return;
      const updateRequest: UserUpdateRequest = {
        username: this.user.username,
        email: this.user.email,
        password: this.password
      };
      this.isSaving = true;
  
      this.api.apiService.updateUser(updateRequest).subscribe({
        next: (jwtResponse) => {
          this.authService.login(jwtResponse)
          this.isSaving = false;
          this.dialogRef.close(); 
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Ошибка обновления пользователя:', error);
        }
      });
      
      this.isEditing = false;
  }
}
