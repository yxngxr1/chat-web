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
import { ChatDTO, ChatUserCreateRequest, ChatUserCreateResponse, UserDTO } from '../../api';
import { ApiService } from '../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatRipple,
    MatCardModule,

  ],
  templateUrl: './add-users-dialog.component.html',
  styleUrl: './add-users-dialog.component.scss'
})
export class AddUsersDialogComponent {

  searchQuery = '';
  users: UserDTO[] = [];
  selectedUsers: UserDTO[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddUsersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { chat: ChatDTO },
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {
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

  toggleUserSelection(user: UserWithSelection) {
    user.selected = !user.selected;
  }

  addPerson() {
    if (this.selectedUsers.length > 0) {
      const createUsersRequest: ChatUserCreateRequest = {
        userIds: this.selectedUsers.map(user => user.id)
      }
      
      console.log('Adding users to chat:', createUsersRequest.userIds);
      this.api.apiService.joinUserInChat(this.data.chat.id, createUsersRequest).subscribe({
        next: (createUsersResponse: ChatUserCreateResponse) => {
          console.log(`Users ${createUsersRequest.userIds} added to chat successfully.`);
          this.dialogRef.close(createUsersResponse);
        }
      });
  
    } else {
      console.log('No users selected to add.');
    }
  }

  removeUserFromSelection(user: UserDTO) {
    const index = this.selectedUsers.indexOf(user);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    }
  }

  addUserToSelection(user: UserDTO) {
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
