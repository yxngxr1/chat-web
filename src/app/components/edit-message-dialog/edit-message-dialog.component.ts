import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRipple } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ChatDTO, MessageDTO, MessageUpdateRequest } from '../../api';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-edit-message-dialog',
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
  templateUrl: './edit-message-dialog.component.html',
  styleUrl: './edit-message-dialog.component.scss'
})
export class EditMessageDialogComponent {
  message: MessageDTO;
  chat: ChatDTO;

  constructor(
    public dialogRef: MatDialogRef<EditMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: MessageDTO, chat: ChatDTO },
    private api: ApiService,
  ) {
    this.message = { ...data.message };
    this.chat = { ...data.chat }
  }

  saveChanges() {
    const messageUpdateRequest: MessageUpdateRequest = {
      content: this.message.content
    };

    if (this.data.message.id){
      this.api.apiService.updateMessage(this.data.chat.id, this.data.message.id, messageUpdateRequest).subscribe({
        next: (updatedChat) => {
          this.dialogRef.close(updatedChat); 
        },
        error: (error) => {
          console.error('Ошибка обновления чата:', error);
        }
      });
    }
  }
}
