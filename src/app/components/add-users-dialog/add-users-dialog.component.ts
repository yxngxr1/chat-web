import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRipple } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { UserWithSelection } from '../../models/user.selection';
import { ChatDTO } from '../../api';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-add-users-dialog',
  imports: [
    MatDialogModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    CommonModule,
    FormsModule,
    MatRipple
  ],
  templateUrl: './add-users-dialog.component.html',
  styleUrl: './add-users-dialog.component.scss'
})
export class AddUsersDialogComponent {

  searchQuery = '';
  users: UserWithSelection[] = [];
  filteredUsers: UserWithSelection[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddUsersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { chat: ChatDTO },
    private api: ApiService,
  ) {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.api.apiService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.map(user => ({
          ...user,
          selected: false 
        })) as UserWithSelection[];
        this.filteredUsers = [...this.users];
      },
      error: (err) => {
        console.error('Ошибка загрузки пользователей:', err);
      }
    });
  }
  
  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleUserSelection(user: UserWithSelection) {
    this.users.forEach(u => u.selected = (u === user)); // Для приватного чата выбираем только одного
    this.filteredUsers = [...this.users]; // Обновляем отфильтрованный список
  }

  addPerson() {
    const selectedUsers = this.filteredUsers.filter(user => user.selected);
    if (selectedUsers.length > 0) {
      console.log('Adding users to chat:', selectedUsers);
  
      // Перебираем всех выбранных пользователей и вызываем joinUserInChat для каждого
      selectedUsers.forEach(user => {
        this.api.apiService.joinUserInChat(this.data.chat.id, user.id).subscribe({
          next: (response) => {
            console.log(`User ${user.username} added to chat successfully.`);
          },
          error: (error) => {
            console.error(`Error adding user ${user.username}:`, error);
          }
        });
      });
  
      this.dialogRef.close(selectedUsers);
    } else {
      console.log('No users selected to add.');
    }
  }
  
}
