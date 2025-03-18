import { Injectable } from "@angular/core";
import { environment } from "../../environment";
import { HttpClient } from "@angular/common/http";
import { MessageDTO } from "../models/message.dto";
import { Observable } from "rxjs";
import { MessageUpdateRequest } from "../models/message.update.request";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly API_URL = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) {}

  sendMessage(message: MessageDTO): Observable<MessageDTO> {
    return this.http.post<MessageDTO>(this.API_URL, message);
  }

  getMessagesByChat(chatId: number): Observable<MessageDTO[]> {
    return this.http.get<MessageDTO[]>(`${this.API_URL}/chat/${chatId}`);
  }

  updateMessage(chatId: number, msgId: number, messageUpdateRequest: MessageUpdateRequest): Observable<MessageDTO> {
    return this.http.put<MessageDTO>(`${this.API_URL}/chat/${chatId}/msg/${msgId}`, messageUpdateRequest);
  }

  deleteMessage(chatId: number, msgId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/chat/${chatId}/msg/${msgId}`);
  }
}