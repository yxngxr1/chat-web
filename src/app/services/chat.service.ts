import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service'; // Сервис для API-запросов
import { ChatDTO, UserDTO } from '../api';
import { ChatUnreadDto } from '../models/chat.unread';
import { WebSocketService } from './WebSocket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private chatsSubject = new BehaviorSubject<ChatUnreadDto[]>([]); 
  chats$ = this.chatsSubject.asObservable(); 

  constructor(
    private api: ApiService,
    private wsService: WebSocketService,
  ) {
    this.loadChats();
    this.subscribeToMessages();
  }

  loadChats(): void {
    this.api.apiService.getAllChatsByUser().subscribe(chats => {
        const chatsWithUnreadCount = chats.map(chat => ({
          ...chat,
          unreadCount: 0,  // Изначально у чата нет непрочитанных сообщений
        }));
        this.chatsSubject.next(chatsWithUnreadCount);
      });
  }

  loadChat(chatId: number): Observable<ChatDTO> {
    return this.api.apiService.getChatById(chatId);
  }

  addChat(newChat: ChatDTO): void {
    const currentChats = this.chatsSubject.getValue();
    this.chatsSubject.next([newChat, ...currentChats]); 
  }

  deleteChat(chatId: number): void {
    const currentChats = this.chatsSubject.getValue();
    const updatedChats = currentChats.filter(chat => chat.id !== chatId);
    this.chatsSubject.next(updatedChats);
  }

  updateChats(chats: ChatUnreadDto[]) {
    this.chatsSubject.next(chats);
  }

  private subscribeToMessages() {
    this.wsService.getMessages().subscribe(message => {
      const currentChats = this.chatsSubject.getValue();
      const chatExists = currentChats.some(chat => chat.id === message.chatId);
  
      if (!chatExists) {
        this.loadChat(message.chatId).subscribe({
          next: (chat) => {
            this.addChat(chat);
          }
        });
      }

      this.updateUnreadCount(message.chatId);
    });
  }

  private updateUnreadCount(chatId: number) {
    const currentChats = this.chatsSubject.getValue();
    const chatIndex = currentChats.findIndex(chat => chat.id === chatId);

    if (chatIndex !== -1) {
      currentChats[chatIndex].unreadCount = (currentChats[chatIndex].unreadCount || 0) + 1;
      this.chatsSubject.next([...currentChats]); 
    }
  }

  public resetUnreadCount(chatId: number) {
    const currentChats = this.chatsSubject.getValue();
    const chatIndex = currentChats.findIndex(chat => chat.id === chatId);
  
    if (chatIndex !== -1) {
      currentChats[chatIndex].unreadCount = 0;
      this.updateChats([...currentChats]);
    }
  }
  
}
