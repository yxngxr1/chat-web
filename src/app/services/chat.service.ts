// chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { CreateChatRequest } from '../models/create-chat-request.dto';
import { ChatDTO } from '../models/chat.dto';
import { UserDTO } from '../models/user.dto';
import { ChatUserJoinResponse } from '../models/chat-user-join-response.dto';
import { UpdateChatRequest } from '../models/chat.update.request';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly API_URL = `${environment.apiUrl}/chats`;

  constructor(private http: HttpClient) {}

  createChat(createChatRequest: CreateChatRequest): Observable<ChatDTO> {
    return this.http.post<ChatDTO>(this.API_URL, createChatRequest);
  }

  updateChat(id: number, updateChatRequest: UpdateChatRequest): Observable<ChatDTO> {
    return this.http.put<ChatDTO>(`${this.API_URL}/${id}`, updateChatRequest);
  }

  deleteChat(id: number): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/${id}`);
  }

  getChatById(id: number): Observable<ChatDTO> {
    return this.http.get<ChatDTO>(`${this.API_URL}/${id}`);
  }

  getAllChats(): Observable<ChatDTO[]> {
    return this.http.get<ChatDTO[]>(this.API_URL);
  }

  getAllChatsByUser(): Observable<ChatDTO[]> {
    return this.http.get<ChatDTO[]>(this.API_URL);
  }

  getUsersByChatId(id: number): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.API_URL}/${id}/users`);
  }

  joinUserInChat(chatId: number, userId: number): Observable<ChatUserJoinResponse> {
    return this.http.post<ChatUserJoinResponse>(
      `${this.API_URL}/${chatId}/join/${userId}`,
      {}
    );
  }

  leaveUserFromChat(chatId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${chatId}/leave/${userId}`);
  }
}