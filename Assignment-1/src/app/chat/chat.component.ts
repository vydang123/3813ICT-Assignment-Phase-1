import { Component } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  message: string = '';
  messages: string[] = [];

  constructor(private chatService: ChatService) {}

  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.message);
      // Emit the message to the server using a service (to be implemented)
      this.messages.push(this.message);
      this.message = '';
    }
  }
}
