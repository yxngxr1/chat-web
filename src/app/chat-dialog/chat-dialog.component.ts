import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat-dialog',
  standalone: true,
  imports: [MatListModule, MatInputModule, MatButtonModule, CommonModule, FormsModule, MatIconModule],
  templateUrl: './chat-dialog.component.html',
  styleUrl: './chat-dialog.component.scss'
})
export class ChatDialogComponent implements OnInit {
  chatId: number | null = null;
  messages: string[] = [];
  newMessage = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.chatId = id !== null ? +id : null;
      this.messages = this.chatId ? [`Message in chat ${this.chatId}`] : [];
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push(this.newMessage);
      this.newMessage = '';
    }
  }
}