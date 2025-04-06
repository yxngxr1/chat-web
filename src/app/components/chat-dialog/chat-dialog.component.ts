import { Component, OnInit, ViewChild } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, forkJoin, Observable, of, Subscription, SubscriptionLike } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatRipple } from '@angular/material/core';
import { ChatDetailsDialogComponent } from '../chat-details-dialog/chat-details-dialog.component';
import {CdkMenu, CdkMenuItem, CdkContextMenuTrigger} from '@angular/cdk/menu';
import { EditMessageDialogComponent } from '../edit-message-dialog/edit-message-dialog.component';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { ChatDTO, MessageCreateRequest, MessageDTO, UserDTO } from '../../api';
import { ApiService } from '../../services/api.service';
import { AddUsersDialogComponent } from '../add-users-dialog/add-users-dialog.component';
import { MatFormFieldModule, MatHint } from '@angular/material/form-field';
import { WebSocketService } from '../../services/WebSocket.service';
import { ChatService } from '../../services/chat.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-chat-dialog',
  standalone: true,
  imports: [
    MatListModule, 
    MatInputModule, 
    MatButtonModule, 
    CommonModule, 
    FormsModule, 
    MatIconModule,
    MatRipple,
    MatMenuModule,
    CdkContextMenuTrigger,
    CdkMenu, 
    CdkMenuItem,
    FormsModule,
    MatFormFieldModule,
    MatHint
  ],
  templateUrl: './chat-dialog.component.html',
  styleUrl: './chat-dialog.component.scss'
})
export class ChatDialogComponent implements OnInit {
  @ViewChild(MatMenuTrigger) messageMenu!: MatMenuTrigger;

  chatId: number | null = null;
  chat: ChatDTO | null = null;
  users: UserDTO[] | null = null;
  usersMap: Map<number, UserDTO> = new Map();
  messages$ = new BehaviorSubject<MessageDTO[]>([]);
  messageSubscription: Subscription | null = null;
  selectedMessage: MessageDTO | null = null;
  newMessage = '';
  curId: number | null = null;
  showErrorHint = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private api: ApiService,
    private dialog: MatDialog,
    private router: Router,
    private wsService: WebSocketService,
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.curId = this.authService.getUserId();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      this.chatId = id !== null ? +id : null;
      if (this.chatId !== null) {
        // Загружаем все данные параллельно
        forkJoin({
          chatInfo: this.loadChatInfo(),
          messages: this.loadMessages(),
          users: this.loadUsers()
        }).subscribe({
          next: (response) => {
            // Доступ к данным по ключам
            this.chat = response.chatInfo;
            this.users = response.users;
            this.usersMap = new Map(response.users.map(user => [user.id, user]));
            this.messages$.next(response.messages); // сохраняем сообщения в subjects
            console.log('Chat Info:', response.chatInfo);
            console.log('Messages:', response.messages);
            console.log('Users:', response.users);
          },
          error: (error) => {
            // Обработка ошибок
            console.error('Ошибка при загрузке данных:', error);
          },
          complete: () => {
            console.log('Загрузка завершена');
          }
        });
      }
    });
    this.subscribeToMessages();
  }

  
  private subscribeToMessages() {
    console.log("Подписался на сообщения");
    this.messageSubscription = this.messageService.newMessage$.subscribe(message => {
      if (message.chatId === this.chatId) {
        const currentMessages = this.messages$.getValue();
        this.messages$.next([message, ...currentMessages]);
      }
    });
  }

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
  }

  private loadMessages() {
    if (this.chatId !== null) {
      return this.api.apiService.getMessagesBefore(this.chatId); // возвращаем Observable
    }
    return of([]); // возвращаем пустой Observable, если chatId не задан
  }

  loadMoreMessages() {
    const currentMessages = this.messages$.getValue();
    
    // Если уже есть сообщения — берём дату самого раннего
    const oldestMessage = currentMessages.length > 0
      ? currentMessages.reduce((min, m) => m.sentAt < min.sentAt ? m : min, currentMessages[0])
      : null;
  
    const beforeTime: string | undefined = oldestMessage?.sentAt;

    if (this.chatId !== null) {
      this.api.apiService.getMessagesBefore(this.chatId, beforeTime).subscribe((newMessages) => {
        const updatedMessages = [...currentMessages, ...newMessages];
        this.messages$.next(updatedMessages);
      });
    }
  }

  private loadChatInfo() {
    if (this.chatId !== null) {
      return this.api.apiService.getChatById(this.chatId); // возвращаем Observable
    }
    return of(null);
  }

  private loadUsers() {
    if (this.chatId !== null) {
      return this.api.apiService.getUsersByChatId(this.chatId); // возвращаем Observable
    }
    return of([]);
  }

  sendMessage() {
    if (!this.newMessage || this.newMessage.trim().length === 0) {
      this.showErrorHint = true;
      setTimeout(() => {
        this.showErrorHint = false;
      }, 100); // Подсветка пропадёт через 2 секунды
      return;
    }

    const messagePayload = {
      chatId: this.chatId,
      senderId: this.curId,
      content: this.newMessage
    };
    this.wsService.sendMessage('/app/chat', messagePayload);
    this.newMessage = ''
  }

  onDeleteChat(event: Event) {
    
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Удаление чата',
        message: 'Вы уверены, что хотите удалить этот чат?',
        confirmText: 'Удалить',
        cancelText: 'Отмена'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Delete Chat", this.chatId)
        if (this.chatId){
          this.api.apiService.deleteChat(this.chatId).subscribe({
            next: () => {
              if (this.chatId){
                this.chatService.deleteChat(this.chatId);
                this.router.navigate(['/']); 
              }
            }
          });
        }
      }
    });
  }

  openChatDetails(event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ChatDetailsDialogComponent, {
      data: { chat: this.chat, users: this.users }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chat = { ...result };
      }
    });
  }

  openAddPerson(event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddUsersDialogComponent, {
      data: { chat: this.chat }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  setCurrentMessage(event: Event, message: MessageDTO) {
    event.stopPropagation();
    this.selectedMessage = message;
  }


  editMessage() {
    const dialogRef = this.dialog.open(EditMessageDialogComponent, {
      data: {
        message: this.selectedMessage,
        chat: this.chat
      },
      width: '50%'
    });

    dialogRef.afterClosed().subscribe((updatedMessage: MessageDTO) => {
      if (updatedMessage) {
        const messages = this.messages$.getValue(); 
        const index = messages.findIndex(msg => msg.id === updatedMessage.id);
  
        if (index !== -1) {
          messages[index] = updatedMessage;
          this.messages$.next([...messages]);
        }
      }
    });
  }
  
  deleteMessage() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Удаление сообщения',
        message: 'Вы уверены, что хотите удалить это сообщение?',
        confirmText: 'Удалить',
        cancelText: 'Отмена'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.chatId && this.selectedMessage?.id){
          
          this.api.apiService.deleteMessage(this.chatId, this.selectedMessage.id).subscribe({
            next: () => {
              const messages = this.messages$.getValue();
              const updatedMessages = messages.filter(msg => msg.id !== this.selectedMessage?.id);
              this.messages$.next(updatedMessages);
              console.log(`Message with ID ${this.selectedMessage?.id} deleted.`);
            },
          });
        }
      }
    });
  }

  goToLink(url: string){
    window.open(url, "_blank");
}
}

