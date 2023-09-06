import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const BACKEND_URL = 'http://localhost:3000/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Component({
  selector: 'app-group-admin',
  templateUrl: './group-admin.component.html',
  styleUrls: ['./group-admin.component.css']
})
export class GroupAdminComponent implements OnInit {
  newGroup = {
    groupid: null as number | null, 
    groupname: '',
    channels: 0
  };

  selectedUser: any; // Added this property
  selectedGroup: any = {}; // initialize as an empty object
  selectedChannel: string = "";

  users: any[] = [];
  groups: any[] = [];

  // Add the new properties:
  newChannelName: string = '';
  selectedGroupForChannel: any;

  

  constructor(private userService: UserService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.fetchAllUsers();
    this.fetchAllGroups();
  }

  fetchAllUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  fetchAllGroups(): void {
    this.httpClient.get<any>(BACKEND_URL + 'groups', httpOptions).subscribe(data => {
      this.groups = data;
    });
  }

  addGroup(): void {
    if (this.newGroup.groupname) {
      this.newGroup.groupid = this.groups.length + 1;
      this.httpClient.post<any>(BACKEND_URL + 'addGroup', this.newGroup, httpOptions).subscribe(response => {
        if (response.success) {
          this.groups.push(this.newGroup);
          this.newGroup = {
            groupid: null,
            groupname: '',
            channels: 0
          };
          alert('Group added successfully!');
        }
      }, error => {
        console.error('Error adding group:', error);
      });
    }
  }

  addUserToGroup(user: any, group: any): void {
    const payload = {
      userId: user.userid || user,
      groupId: group.groupid || group
    };
    console.log(payload)
    this.httpClient.put<any>(BACKEND_URL + 'addUserToGroup', payload, httpOptions).subscribe(response => {
      if (response.success) {
        // Avoid mutating the original user object
        this.users = this.users.map(u => {
          if (u.userid === user.userid) {
            return { ...u, groupid: group.groupid || group };
          }
          return u;
        });
      }
    }, error => {
      console.error('Error adding user to group:', error);
    });
}

// Method to add channel to a group
// Method to add channel to a group
addChannelToGroup(): void {
  if (this.newChannelName && this.selectedGroupForChannel) {
      const payload = {
          groupName: this.newChannelName,
          groupId: this.selectedGroupForChannel
      };
      
      this.httpClient.post<any>(BACKEND_URL + 'addChannel', payload, httpOptions).subscribe(response => {
          if (response.success) {
              this.fetchAllGroups();
              alert('Channel added successfully!');
          }
      }, error => {
          console.error('Error adding channel to group:', error);
      });
  }
}

removeUserFromGroup(user: any, group: any): void {
  const payload = {
      userId: user.userid || user,
      groupId: group.groupid || group
  };

  this.httpClient.delete<any>(`${BACKEND_URL}removeUserFromGroup/${payload.userId}/${payload.groupId}`, httpOptions).subscribe(response => {
      if (response.success) {
          this.users = this.users.map(u => {
              if (u.userid === user.userid) {
                  return { ...u, groupid: null };  // Resetting the groupid to null for the user
              }
              return u;
          });
          alert('User removed from group!');
      }
  }, error => {
      console.error('Error removing user from group:', error);
  });
}



deleteChannelFromGroup(channel: string, group: any): void {
  const payload = {
      channelId: channel,
      groupId: group.groupid
  };

  this.httpClient.delete<any>(`${BACKEND_URL}deleteChannelFromGroup/${payload.channelId}/${payload.groupId}`, httpOptions).subscribe(response => {
      if (response.success) {
          const groupIndex = this.groups.findIndex(g => g.groupid === group.groupid);
          const channelIndex = this.groups[groupIndex].channels.indexOf(channel);
          this.groups[groupIndex].channels.splice(channelIndex, 1);  // Remove channel from local data
          alert('Channel removed from group!');
      }
  }, error => {
      console.error('Error removing channel from group:', error);
  });
}



}
