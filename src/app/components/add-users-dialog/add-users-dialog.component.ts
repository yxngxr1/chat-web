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
import { ChatDTO, ChatUserCreateRequest } from '../../api';
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
    user.selected = !user.selected;
  }

  addPerson() {
    const selectedUsers = this.filteredUsers.filter(user => user.selected);
    if (selectedUsers.length > 0) {
      const createUsersRequest: ChatUserCreateRequest = {
        userIds: selectedUsers.map(user => user.id)
      }
      
      console.log('Adding users to chat:', createUsersRequest.userIds);
      this.api.apiService.joinUserInChat(this.data.chat.id, createUsersRequest).subscribe({
        next: (response) => {
          console.log(`Users ${response.userIds} added to chat successfully.`);
        },
        error: (error) => {
          console.error(`Error adding users`, error);
        }
      });
  
      this.dialogRef.close(selectedUsers);
    } else {
      console.log('No users selected to add.');
    }
  }
  
}
