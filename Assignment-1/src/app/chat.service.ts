import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private socket: any;

    constructor() {}

    connectToChatServer() {
        // Connect to the socket server
        this.socket = io('http://localhost:3000'); // Replace with your server URL

        // Handle any additional socket events here
    }

    sendMessage(message: string) {
        // Send a message to the server
        this.socket.emit('message', message);
    }

    onMessage(): Observable<string> {
        // Listen for incoming messages
        return new Observable<string>((observer) => {
            this.socket.on('message', (data: string) => {
                observer.next(data);
            });
        });
    }
}
