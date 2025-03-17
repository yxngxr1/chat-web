import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { ChatService } from '../services/chat.service';
import { ChatDTO } from '../models/chat.dto';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    MatListModule, 
    MatButtonModule, 
    CommonModule,
    MatRippleModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {
  chats$!: Observable<ChatDTO[]>; // Observable для списка чатов

  constructor(
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.chats$ = this.chatService.getAllChats(); // Загружаем чаты при инициализации
  }

  isActive(chatId: number): boolean {
    return this.router.url === `/chat/${chatId}`;
  }

  navigateToChat(chatId: number) {
    this.router.navigate(['/chat', chatId]);
  }
}