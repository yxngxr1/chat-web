import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MessageDTO } from '../models/message.dto';
import { Observable } from 'rxjs';
import { MessageService } from '../services/message.service';
import localeRu from '@angular/common/locales/ru';

@Component({
  selector: 'app-chat-dialog',
  standalone: true,
  imports: [MatListModule, MatInputModule, MatButtonModule, CommonModule, FormsModule, MatIconModule],
  templateUrl: './chat-dialog.component.html',
  styleUrl: './chat-dialog.component.scss'
})
export class ChatDialogComponent implements OnInit {
  chatId: number | null = null;
  messages$!: Observable<MessageDTO[]>; // Observable для сообщений
  currentId: number = 4;
  newMessage = '';

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.chatId = id !== null ? +id : null;
      if (this.chatId !== null) {
        this.loadMessages();
      } else {
        this.messages$ = new Observable(observer => observer.next([])); // Пустой Observable, если нет chatId
      }
    });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.chatId !== null) {
      const message: MessageDTO = {
        chatId: this.chatId,
        content: this.newMessage
      };
      this.messageService.sendMessage(message).subscribe({
        next: () => {
          this.newMessage = '';
          this.loadMessages(); 
        },
        error: (err) => console.error('Error sending message:', err)
      });
    }
  }

  private loadMessages() {
    if (this.chatId !== null) {
      this.messages$ = this.messageService.getMessagesByChat(this.chatId);
    }
  }
}