// src/app/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from "sockjs-client"
import { Subject, Subscription } from 'rxjs';
import { environment } from '../../environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageDTO } from '../api';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client | undefined;
  private messageSubject = new Subject<MessageDTO>();
  private token: string | null = null;
  private messageSubscription: StompSubscription | null | undefined = undefined;

  audio = new Audio();
  constructor(
    private snackBar: MatSnackBar,
    private storageService: StorageService,
  ) { }

  private loadToken() {
    this.token = this.storageService.getItem('accessToken') || null;
    if (!this.token) {
      console.warn('⚠️ Токен не найден! Убедись, что пользователь аутентифицирован.');
    }
  }

  connect(userId: number) {
    this.loadToken();

    const socket = new SockJS(`${environment.apiUrl}/ws`);

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${this.token}`,
      },
      debug: () => {},
      onConnect: () => {
        console.log('Connected to WebSocket');
        this.messageSubscription = this.stompClient?.subscribe(`/user/${userId}/queue/messages`, (message) => {
          this.handleIncomingMessage(message, userId);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      }
    });

    this.stompClient.activate();
  }

  private handleIncomingMessage(message: any, userId: number): void {
    const receivedData = JSON.parse(message.body);

    if (receivedData.error) {
        console.error("Ошибка от сервера:", receivedData.error);
        this.snackBar.open(`${receivedData.error}`, 'Закрыть', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
        });
        return;
    }

    const receivedMessage: MessageDTO = receivedData;
    this.messageSubject.next(receivedMessage);
    // console.log(receivedMessage);

    if (receivedMessage.senderId !== Number(userId)) {
        this.snackBar.open(`${receivedMessage.senderId}: ${receivedMessage.content}`, 'Закрыть', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
        });
    }
  }

  disconnect() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
      this.messageSubscription = null;
    }
    this.stompClient?.deactivate();
  }

  sendMessage(_destination: string, payload: any) {
    // @ts-ignore
    if (this.stompClient.connected) {
      // @ts-ignore
      this.stompClient.publish({
        destination: `/app/chat`,  // Путь для сообщения
        body: JSON.stringify(payload),  // Тело сообщения
        headers: {}  // Дополнительные заголовки (если необходимо)
      });
    } else {
      console.error('Cannot send message, WebSocket not connected');
    }
  }

  getMessages() {
    return this.messageSubject.asObservable();
  }
}
