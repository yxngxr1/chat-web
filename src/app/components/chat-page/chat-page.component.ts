import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatListComponent } from '../chat-list/chat-list.component';
import { ChatDialogComponent } from '../chat-dialog/chat-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateChatDialogComponent } from '../create-chat-dialog/create-chat-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { WebSocketService } from '../../services/WebSocket.service';
import { AuthService } from '../../services/auth.service';
import { ChatDTO } from '../../api';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    ChatListComponent,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {
  private curId: number | null = null;

  constructor(
    private dialog: MatDialog,
    private wsService: WebSocketService,
    private authService: AuthService,
    private chatService: ChatService,
  ) {}

  ngOnInit(): void {
    this.curId = this.authService.getUserId();
    if (this.curId !== null) {
      this.wsService.connect(this.curId.toString());
    } 
  }

  openPrivateChatDialog() {
    const dialogRef = this.dialog.open(CreateChatDialogComponent, {
      data: { isGroup: false },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((newChat: ChatDTO) => {
      if (newChat) {
        this.chatService.addChat(newChat);
      }
    })
  }

  openGroupChatDialog() {
    const dialogRef = this.dialog.open(CreateChatDialogComponent, {
      data: { isGroup: true },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((newChat: ChatDTO) => {
      if (newChat) {
        this.chatService.addChat(newChat);
      }
    })
  }
}
