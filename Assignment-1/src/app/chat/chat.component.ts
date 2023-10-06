import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

    message: string = '';
    messages: string[] = [];

    constructor(private chatService: ChatService, private router: Router) { }

    ngOnInit() {
        if (!sessionStorage.getItem('isLoggedin')) {
            this.router.navigate(['/login']);
        }

        // Connect to the socket server and listen for messages
        this.chatService.connectToChatServer();
        this.chatService.onMessage().subscribe((message: string) => {
            this.messages.push(message);
        });
    }

    sendMessage(): void {
      if (this.message.trim()) {
          this.chatService.sendMessage(this.message);
          this.message = ''; // Clear the input field after sending
      }
  }
  
}
