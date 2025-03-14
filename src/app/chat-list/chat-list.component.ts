import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    MatListModule, 
    RouterLink, 
    MatButtonModule, 
    CommonModule,
    MatRippleModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {
  chats = [
    { id: 1, name: 'Chat with Alex' },
    { id: 2, name: 'Group Chat' }
  ];

  constructor(private router: Router) {}

  isActive(chatId: number): boolean {
    return this.router.url === `/chat/${chatId}`;
  }

  navigateToChat(chatId: number) {
    this.router.navigate(['/chat', chatId]);
  }
}