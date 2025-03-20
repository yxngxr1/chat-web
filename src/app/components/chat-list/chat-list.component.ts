import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { Observable } from 'rxjs';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ChatDTO } from '../../api';
import { ApiService } from '../../services/api.service';

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
  chats$!: Observable<ChatDTO[]>; 

  constructor(
    private router: Router,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    this.chats$ = this.api.apiService.getAllChatsByUser(); 
  }

  isActive(chatId: number): boolean {
    return this.router.url === `/chat/${chatId}`;
  }

  navigateToChat(chatId: number) {
    this.router.navigate(['/chat', chatId]);
  }
}