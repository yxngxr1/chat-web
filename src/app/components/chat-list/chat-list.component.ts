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
  chats$ = new BehaviorSubject<ChatUnreadDto[]>([]);
  private messageSub: Subscription | undefined;

  constructor(
    private router: Router,
    private api: ApiService,
    private wsService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.api.apiService.getAllChatsByUser().subscribe(chats => {
      this.chats$.next(chats);
    });
    this.subscribeMessages(); 
  }

  
  private subscribeMessages() {
    this.messageSub = this.wsService.getMessages().subscribe(message => {
      const currentChats = this.chats$.getValue();
      const chatIndex = currentChats.findIndex(chat => chat.id === message.chatId);

      if (chatIndex !== -1) {
        // Добавляем непрочитанные сообщения к нужному чату
        currentChats[chatIndex].unreadCount = (currentChats[chatIndex].unreadCount || 0) + 1;
        this.chats$.next([...currentChats]);
      }
    });
  }

  isActive(chatId: number): boolean {
    return this.router.url === `/chat/${chatId}`;
  }

  navigateToChat(chatId: number) {
    this.router.navigate(['/chat', chatId]);
    this.resetUnreadCount(chatId);
  }

  private resetUnreadCount(chatId: number) {
    const currentChats = this.chats$.getValue();
    const chatIndex = currentChats.findIndex(chat => chat.id === chatId);

    if (chatIndex !== -1) {
      currentChats[chatIndex].unreadCount = 0;
      this.chats$.next([...currentChats]);
    }
  }
}