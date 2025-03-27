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
import { ChatCreateRequest, ChatDTO } from '../../api';

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
    MatRipple
  ],
  templateUrl: './create-chat-dialog.component.html',
  styleUrl: './create-chat-dialog.component.scss'
})
export class CreateChatDialogComponent {
  searchQuery = '';
  users: UserWithSelection[] = [];
  filteredUsers: UserWithSelection[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateChatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isGroup: boolean },
    private api: ApiService,
    private authService: AuthService
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
      }
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  createChat() {
    const selectedUsers = this.users.filter(user => user.selected);
    // if (!selectedUsers.length) {
    //   console.warn('Выберите хотя бы одного пользователя');
    //   return;
    // }
    
    let chatType: 'PRIVATE' | 'GROUP' | 'SELF' = this.data.isGroup ? 'GROUP' : 'PRIVATE';
    if (!this.data.isGroup && selectedUsers.length === 1 && selectedUsers[0].id === Number(this.authService.getUserId())) {
      chatType = 'SELF'; 
    }

    const createChatRequest: ChatCreateRequest = {
      userIds: selectedUsers.map(user => user.id),
      chatType: chatType
    };
  
    this.api.apiService.createChat(createChatRequest).subscribe({
      next: (chat: ChatDTO) => {
        console.log('Чат создан:', chat);
        this.dialogRef.close(chat);
      }
    });
  }

  toggleUserSelection(user: UserWithSelection) {
    if (this.data.isGroup) {
      user.selected = !user.selected; // Переключаем выбор только для группового чата
    } else {
      this.users.forEach(u => u.selected = (u === user)); // Для приватного чата выбираем только одного
      this.filteredUsers = [...this.users]; // Обновляем отфильтрованный список
    }
  }
}
