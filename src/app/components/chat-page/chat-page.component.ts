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
  ) {}

  ngOnInit(): void {
    this.curId = this.authService.getUserId();
    if (this.curId !== null) {
      this.wsService.connect(this.curId.toString());
    } else {
      console.error("curId is null");
    }
  }

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
