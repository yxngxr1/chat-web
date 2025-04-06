import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { UserWithSelection } from '../../models/user.selection';
import { MatRipple } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ChatCreateRequest, ChatDTO, UserDTO } from '../../api';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-create-chat-dialog',
  imports: [
    MatDialogModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    CommonModule,
    FormsModule,
    MatRipple,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './create-chat-dialog.component.html',
  styleUrl: './create-chat-dialog.component.scss'
})
export class CreateChatDialogComponent {
  searchQuery = '';
  users: UserDTO[] = [];
  selectedUsers: UserDTO[] = [];
  isGroup?: boolean;

  constructor(
    public dialogRef: MatDialogRef<CreateChatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isGroup: boolean },
    private api: ApiService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.isGroup = data.isGroup;
    this.loadUsers();
  }

  loadUsers(): void {
    this.api.apiService.searchUsers(this.searchQuery).subscribe({
      next: (users) => {
        this.users = users.map(user => ({
          ...user
        }));
      }
    });
  }

  createChat() {
    if (!this.selectedUsers.length) {
      console.warn('Выберите хотя бы одного пользователя');
      return;
    }
    
    let chatType: 'PRIVATE' | 'GROUP' | 'SELF' = this.data.isGroup ? 'GROUP' : 'PRIVATE';
    if (!this.data.isGroup && this.selectedUsers.length === 1 && this.selectedUsers[0].id === Number(this.authService.getUserId())) {
      chatType = 'SELF'; 
    }

    const createChatRequest: ChatCreateRequest = {
      userIds: this.selectedUsers.map(user => user.id),
      chatType: chatType
    };
  
    this.api.apiService.createChat(createChatRequest).subscribe({
      next: (chat: ChatDTO) => {
        console.log('Чат создан:', chat);
        this.dialogRef.close(chat);
      }
    });
  }

  removeUserFromSelection(user: UserDTO) {
    const index = this.selectedUsers.indexOf(user);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    }
  }

  addUserToSelection(user: UserDTO) {
    if (!this.isGroup && this.selectedUsers.length === 1) {
      return
    }

    if (!this.selectedUsers.includes(user)) {
      this.selectedUsers.push(user);
    }
    else {
      this.snackBar.open('Пользователь уже выбран', 'Закрыть', {
        duration: 500, 
        verticalPosition: 'top',
      });
    }
  }
}
