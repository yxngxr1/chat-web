// src/app/services/websocket.service.ts
import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from "sockjs-client"
import { Subject } from 'rxjs';
import { environment } from '../../environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageDTO } from '../api';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Stomp.Client | null = null;
  private messageSubject = new Subject<MessageDTO>();

  constructor(private snackBar: MatSnackBar) {}

  connect(userId: string) {
    const socket = new SockJS(`${environment.apiUrl}/ws`);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      console.log('Connected to WebSocket');
      this.stompClient?.subscribe(`/user/${userId}/queue/messages`, (message) => {
        const receivedMessage: MessageDTO = JSON.parse(message.body);
        this.messageSubject.next(receivedMessage);
        console.log(receivedMessage);
        if (receivedMessage.senderId !== Number(userId)) {
          this.snackBar.open(`Новое сообщение: ${receivedMessage.content}`, 'Закрыть', {
            duration: 3000, // Длительность отображения 3 секунды
            verticalPosition: 'top', // Позиция Snackbar
            horizontalPosition: 'center'
          });
        }
      });
    });
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
