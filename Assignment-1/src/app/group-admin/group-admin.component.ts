import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

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

  

  constructor(private userService: UserService, private httpClient: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchAllUsers();
    this.fetchAllGroups();
    const userRole = sessionStorage.getItem('role');

        if (userRole !== 'groupadmin' && userRole !== 'superadmin') {
            alert('You don\'t have permission to access this page.');
            this.router.navigateByUrl('dashboard');
        }
  }

  fetchAllUsers(): void {
    this.httpClient.get<any>(BACKEND_URL + 'getUsers', httpOptions).subscribe(data => {
      this.users = data;
    });
  }

  fetchAllGroups(): void {
    this.httpClient.get<any>(BACKEND_URL + 'getGroups', httpOptions).subscribe(data => {
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
  console.log('aaa')
    const payload = {
      username: user.username || user,
      groupname: group.groupname || group
    };

    this.httpClient.put<any>(BACKEND_URL + 'addUserToGroup', payload, httpOptions).subscribe(response => {
      console.log("bbb")
      if (response.success) {
        // Avoid mutating the original user object
        this.users = this.users.map(u => {
          console.log("ccc")  
          if (u.username === user.username) {
            return { ...u, groupnames: [...u.groupnames, group.groupname || group] };
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
  console.log('aaa')
  if (this.newChannelName && this.selectedGroupForChannel) {
    console.log("bbb")
      const payload = {
          groupName: this.newChannelName,
          groupId: this.selectedGroupForChannel
      };
      
      this.httpClient.post<any>(BACKEND_URL + 'addChannel', payload, httpOptions).subscribe(response => {
        console.log("ccc")  
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

  this.httpClient.delete<any>(`${BACKEND_URL}removeUser/${payload.userId}/${payload.groupId}`, httpOptions).subscribe(response => {
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
          this.fetchAllGroups();
      }
  }, error => {
      console.error('Error removing channel from group:', error);
  });
}

async deleteGroup(selectedGroup: any): Promise<void> {
  if (!selectedGroup || !selectedGroup.groupname) {
    alert("Please select a group to delete.");
    return;
  }

  const groupName = selectedGroup.groupname;

  try {
    // Send a DELETE request to your server to delete the group by name
    await this.httpClient.delete(`${BACKEND_URL}api/deleteGroup/${groupName}`, httpOptions).toPromise();
    alert(`Group ${groupName} deleted successfully.`);
    // Refresh the groups list or remove the deleted group from 'groups' array
    this.fetchAllGroups();
  } catch (error) {
    console.error("Error deleting group:", error);
    alert("An error occurred while deleting the group.");
  }
}



}