import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-create-chat-dialog',
  imports: [
    MatDialogModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-chat-dialog.component.html',
  styleUrl: './create-chat-dialog.component.scss'
})
export class CreateChatDialogComponent {
  searchQuery = '';
  users = [
    { id: 1, nickname: 'alex123', selected: false },
    { id: 2, nickname: 'john_doe', selected: false },
    { id: 3, nickname: 'mary', selected: false }
  ];
  filteredUsers = [...this.users];

  constructor(
    public dialogRef: MatDialogRef<CreateChatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isGroup: boolean }
  ) {}

  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.nickname.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  createChat() {
    const selectedUsers = this.data.isGroup
      ? this.users.filter(user => user.selected)
      : this.filteredUsers.slice(0, 1); // Для приватного берем первого
    console.log('Creating chat with:', selectedUsers);
    this.dialogRef.close(selectedUsers);
  }
}
