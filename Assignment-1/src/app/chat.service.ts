import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
   }

   sendMessage(message: string) {
    this.socket.emit('newMessage', message);
  }
  
  getMessages(): Observable<string> {
    return new Observable<string>((observer: any) => {
      this.socket.on('broadcastMessage', (message: string) => {
        observer.next(message);
      });
    });
  }
}
