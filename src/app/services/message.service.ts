import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { MessageDTO } from "../api";
import { WebSocketService } from "./WebSocket.service";

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    private newMessageSubject = new Subject<MessageDTO>();
    newMessage$ = this.newMessageSubject.asObservable();

    constructor(
        private wsService: WebSocketService,
    ) {
        this.subscribeToMessages();
        console.log("кажется началось")
    }

    private subscribeToMessages(): void {
        this.wsService.getMessages().subscribe(message => {
            this.newMessageSubject.next(message);
        });
    }
}
