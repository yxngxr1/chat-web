import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatService } from '../services/chat.service';
import { UpdateChatRequest } from '../models/chat.update.request';
import { ChatDTO } from '../models/chat.dto';
import { UserDTO } from '../models/user.dto';
import { MatListModule } from '@angular/material/list';
import { MatRipple } from '@angular/material/core';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-chat-details-dialog',
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
    MatListModule,
    MatRipple,
    
  ],
  templateUrl: './chat-details-dialog.component.html',
  styleUrl: './chat-details-dialog.component.scss'
})
export class ChatDetailsDialogComponent {
  chat: ChatDTO;
  users: UserDTO[];
  isEditing = false;
  isSaving = false;

  constructor(
    public dialogRef: MatDialogRef<ChatDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { chat: ChatDTO; users: UserDTO[] },
    private chatService: ChatService,
    private dialog: MatDialog,
  ) {
    this.chat = { ...data.chat };
    this.users = data.users;  
    
  }

  saveChanges() {
    if (!this.isEditing) return;
    const updateRequest: UpdateChatRequest = {
      name: this.chat.name,
      description: this.chat.description
    };
    this.isSaving = true;

    this.chatService.updateChat(this.chat.id, updateRequest).subscribe({
      next: (updatedChat) => {
        this.isSaving = false;
        this.dialogRef.close(updatedChat); 
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Ошибка обновления чата:', error);
      }
    });
    
    this.isEditing = false;
  }

  toggleEditing() {
      this.isEditing = !this.isEditing;
  }

  deleteUser(user: UserDTO): void {
    console.log('User:', user);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Удаление пользователя',
        message: `Вы уверены, что хотите выгнать ${ user.username }?`,
        confirmText: 'Выгнать',
        cancelText: 'Отмена'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("User: ", user.id, " leave from:", this.chat.id)
        this.chatService.leaveUserFromChat(this.chat.id, user.id).subscribe({
          next: () => {
            console.log(`Пользователь ${user.username} покинул чат`);
            this.users = this.users.filter(u => u.id !== user.id);
          },
          error: (error) => {
            console.error('Ошибка при удалении пользователя из чата:', error);
          }
        });
      }
    });
    
    
  }
}
