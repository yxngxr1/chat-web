// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { RegistrationRequest } from '../models/registration-request.dto';
import { UserDTO } from '../models/user.dto';
import { ChatDTO } from '../models/chat.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  createUser(registrationRequest: RegistrationRequest): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.API_URL, registrationRequest);
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/${id}`);
  }

  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.API_URL}/${id}`);
  }

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.API_URL);
  }

  getAllChatsById(id: number): Observable<ChatDTO[]> {
    return this.http.get<ChatDTO[]>(`${this.API_URL}/${id}/chats`);
  }
}