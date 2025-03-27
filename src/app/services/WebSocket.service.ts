// src/app/services/websocket.service.ts
import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from "sockjs-client"
import { Subject } from 'rxjs';
import { environment } from '../../environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageDTO } from '../api';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Stomp.Client | null = null;
  private messageSubject = new Subject<MessageDTO>();
  private token: string | null = null;

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
    this.stompClient = Stomp.over(socket);

    this.stompClient.debug = function () {}; // отключение логирования (убрать для появления)

    this.stompClient.connect(
      {
        Authorization: `Bearer ${this.token}`, 
      }, () => {
      console.log('Connected to WebSocket');
      this.stompClient?.subscribe(`/user/${userId}/queue/messages`, (message) => {
        this.handleIncomingMessage(message, userId);
      });
    });
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
    console.log(receivedMessage);

    if (receivedMessage.senderId !== Number(userId)) {
        this.snackBar.open(`${receivedMessage.senderId}: ${receivedMessage.content}`, 'Закрыть', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
        });
    }
  }

  disconnect() {
    this.stompClient?.disconnect(() => {
      console.log('Disconnected from WebSocket');
    });
  }

  sendMessage(destination: string, payload: any) {
    this.stompClient?.send(`/app/chat`, {}, JSON.stringify(payload));
  }

  getMessages() {
    return this.messageSubject.asObservable();
  }
}
