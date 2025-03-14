import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatListComponent } from '../chat-list/chat-list.component';
import { ChatDialogComponent } from '../chat-dialog/chat-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateChatDialogComponent } from '../create-chat-dialog/create-chat-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    MatSidenavModule,
    ChatListComponent,
    ChatDialogComponent,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {
  constructor(private dialog: MatDialog) {}

  openPrivateChatDialog() {
    this.dialog.open(CreateChatDialogComponent, {
      data: { isGroup: false },
      width: '400px'
    });
  }

  openGroupChatDialog() {
    this.dialog.open(CreateChatDialogComponent, {
      data: { isGroup: true },
      width: '400px'
    });
  }
}
