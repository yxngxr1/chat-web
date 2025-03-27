import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { BehaviorSubject, Observable, Subscription, SubscriptionLike } from 'rxjs';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ChatDTO } from '../../api';
import { ApiService } from '../../services/api.service';
import { WebSocketService } from '../../services/WebSocket.service';
import { ChatUnreadDto } from '../../models/chat.unread';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    MatListModule, 
    MatButtonModule, 
    CommonModule,
    MatRippleModule,
    MatIconModule,
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {
  chats$!: Observable<ChatUnreadDto[] | null>;

  constructor(
    private router: Router,
    private chatService: ChatService,
  ) {}

  ngOnInit(): void {
    this.chats$ = this.chatService.chats$;
  }

  isActive(chatId: number): boolean {
    return this.router.url === `/chat/${chatId}`;
  }

  navigateToChat(chatId: number) {
    this.router.navigate(['/chat', chatId]);
    this.chatService.resetUnreadCount(chatId);
  } 
}