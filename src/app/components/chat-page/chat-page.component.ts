import { Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { HeaderStateService } from '../../services/header-state.service';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    ChatListComponent,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private curId: number | null = null;
  sidenavMode: 'over' | 'side' = 'side';
  sidenavOpened = true;

  constructor(
    private dialog: MatDialog,
    private wsService: WebSocketService,
    private authService: AuthService,
    private chatService: ChatService,
    private breakpointObserver: BreakpointObserver,
    private headerStateService: HeaderStateService,
    private sidenavService: SidenavService
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        if (result.matches) {
          this.sidenavMode = 'over';
          this.sidenavOpened = false;
        } else {
          this.sidenavMode = 'side';
          this.sidenavOpened = true;
        }
        this.headerStateService.setShowSidebarButton(this.sidenavOpened); // Обновляем состояние кнопки
      });
  }

  ngOnInit(): void {
    this.curId = this.authService.getUserId();
    if (this.curId !== null) {
      this.wsService.connect(this.curId);
    } 
  }

  ngAfterViewInit() {
    this.sidenavService.setSidenav(this.sidenav);
  }

  ngOnDestroy(): void {
    this.wsService.disconnect();
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
