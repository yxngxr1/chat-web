import { Component, OnInit, ViewChild } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Observable, SubscriptionLike } from 'rxjs';
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
  selectedMessage: MessageDTO | null = null;
  newMessage = '';
  curId: number | null = null;
  private messageSub: SubscriptionLike | undefined;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private api: ApiService,
    private dialog: MatDialog,
    private router: Router,
    private wsService: WebSocketService
  ) {}

  ngOnInit() {
    this.curId = this.authService.getUserId();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.chatId = id !== null ? +id : null;
      if (this.chatId !== null) {
        this.loadChatInfo();
        this.loadMessages();
        this.subscribeMessages();
        this.loadUsers();
      } 
    });
  }

  private subscribeMessages() {
    this.messageSub = this.wsService.getMessages().subscribe(message => {
      if (message.chatId == this.chatId) {
        const currentMessages = this.messages$.getValue();
        this.messages$.next([...currentMessages, message]);
      }
    });
  }

  // ngOnDestroy() {
  //   this.messageSub?.unsubscribe();
  //   this.wsService.disconnect();
  // }
  
  private loadChatInfo() {
    if (this.chatId !== null) {
      this.api.apiService.getChatById(this.chatId).subscribe({
        next: (chat) => {
          this.chat = chat;
        },
        error: (err) => console.error('Error loading chat info:', err)
      });
    }
  }

  private loadUsers() {
    if (this.chatId !== null) {
      this.api.apiService.getUsersByChatId(this.chatId).subscribe({
        next: (users) => {
          this.users = users;
          this.usersMap = new Map(users.map(user => [user.id, user]));
        },
        error: (err) => console.error('Error loading users info:', err)
      })
    }
  }

  sendMessage() {
    const messagePayload = {
      chatId: this.chatId,
      senderId: this.curId,
      content: this.newMessage
    };
    this.wsService.sendMessage('/app/chat', messagePayload);
    this.newMessage = ''
  }

  private loadMessages() {
    if (this.chatId !== null) {
      this.api.apiService.getAllMessagesByChatId(this.chatId).subscribe({
        next: (messages) => this.messages$.next(messages),
        error: (err) => console.error('Ошибка при загрузке сообщений:', err)
      });
    }
  }

  onDeleteProject(event: Event) {
    
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
        console.log("Delete project (from list)", this.chatId)
        if (this.chatId){
          this.api.apiService.deleteChat(this.chatId).subscribe({
            next: () => {
              this.router.navigate(['/']);
            },
            error: (err) => console.error('Ошибка удаления чата:', err)
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
        console.log('Updated chat:', result);
        // TODO: отправить обновления на сервер
      }
    });
  }

  openAddPerson(event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddUsersDialogComponent, {
      data: { chat: this.chat }
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
              //
            },
            error: (err) => console.error('Ошибка удаления сообщения:', err)
          });
        }
      }
    });
  }

  goToLink(url: string){
    window.open(url, "_blank");
}
}

