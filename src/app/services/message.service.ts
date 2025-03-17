import { Injectable } from "@angular/core";
import { environment } from "../../environment";
import { HttpClient } from "@angular/common/http";
import { MessageDTO } from "../models/message.dto";
import { Observable } from "rxjs";

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

  deleteMessage(chatId: number, msgId: number): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/chat/${chatId}/msg/${msgId}`);
  }
}