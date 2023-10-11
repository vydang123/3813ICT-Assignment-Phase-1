import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const BACKEND_URL = 'http://localhost:3000/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  selectedGroup: string = '';
  selectedChannel: string = '';
  userGroups: string[] = [];
  selectedGroupChannels: string[] = [];
  message: string = '';
  messages: string[] = [];

  constructor(
    private chatService: ChatService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUserGroups(); // Fetch the user's groups when the component initializes.
  }

  loadUserGroups(): void {
    // Make an HTTP request to fetch the user's groups from your backend.
    this.httpClient.get(BACKEND_URL + 'user/groups', httpOptions).subscribe((data: any) => {
      this.userGroups = data.groupnames;
      if (this.userGroups.length > 0) {
        this.selectedGroup = this.userGroups[0];
        this.loadChannelsForGroup(this.selectedGroup);
      }
    });
  }

  loadChannelsForGroup(group: string): void {
    // Make an HTTP request to fetch channels for the selected group from your backend.
    this.httpClient.get(BACKEND_URL + `group/${group}/channels`, httpOptions).subscribe((data: any) => {
      this.selectedGroupChannels = data.channels;
    });
  }

  onGroupSelected(): void {
    this.loadChannelsForGroup(this.selectedGroup);
  }

  onChannelSelected(): void {
    // You can perform any additional actions when the channel is selected.
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage({
        group: this.selectedGroup,
        channel: this.selectedChannel,
        message: this.message
      });
      this.message = '';
    }
  }
}