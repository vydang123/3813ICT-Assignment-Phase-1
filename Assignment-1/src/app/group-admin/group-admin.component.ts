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
  username: any;
  groupname: any; 
  channelname: string = '';

  users: any[] = [];
  userGroups: string[] = [];
  groupChannels: string[] = [];
  groups: any[] = [];
  channels: any[] = []; // Populate with available channels

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

  //get all users
  fetchAllUsers(): void {
    this.httpClient.get<any[]>(BACKEND_URL + 'getUsers', httpOptions).subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
        // Handle error appropriately (e.g., show an error message)
      }
    );
  }

  //get all groups
  fetchAllGroups(): void {
    this.httpClient.get<any[]>(BACKEND_URL + 'getGroups', httpOptions).subscribe(
      (groups) => {
        this.groups = groups;
      },
      (error) => {
        console.error('Error fetching groups:', error);
        // Handle error appropriately (e.g., show an error message)
      }
    );
  }


//add group function
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

  // Add this method to add a user to a group
  addUserToGroup(username: any, groupname: any): void {
    console.log("aaa")
    if (username && groupname) {
      console.log("bbb")
      // Prepare the request body
      const requestBody = {
        username: username,
        groupname: groupname
      };

      // Make a POST request to the backend API
      this.httpClient.post<any>(BACKEND_URL + 'addUserToGroup', requestBody, httpOptions).subscribe(
        (response) => {
          console.log("ccc")
          if (response.success) {
            alert('User added to the group successfully!');
            this.fetchAllUsers
          } else {
            alert('Failed to add user to the group.');
          }
        },
        (error) => {
          console.error('Error adding user to group:', error);
        }
      );
    } else {
      alert('Please select a user and a group to add.');
    }
  }



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

//remove a user from a group
filteredUsers: any[] = []; // Store filtered users here
filterUsersByGroup(): void {
  if (this.selectedGroup) {
    this.filteredUsers = this.users.filter(user => user.groupnames.includes(this.selectedGroup));
    this.selectedUser = ''; // Clear the selected user when a new group is selected.
  } else {
    this.filteredUsers = [];
  }
}

//function to remove user
removeUserFromGroup(): void {
  if (this.selectedGroup && this.selectedUser) {
    const requestBody = {
      groupname: this.selectedGroup,
      username: this.selectedUser
    };

    this.httpClient.post<any>(BACKEND_URL + 'removeUserFromGroup', requestBody, httpOptions).subscribe(response => {
      if (response.success) {
        alert('User removed from the group successfully!');
        this.fetchAllUsers
      } else {
        alert('Failed to remove user from the group: ' + response.message);
      }
    }, error => {
      console.error('Error removing user from the group:', error);
    });
  } else {
    alert('Please select a group and a user to remove.');
  }
}

//delete channel from group
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

// Add this method to filter groups based on user's groupnames
filterGroups(username: string): void {
  console.log("aaa")
  const user = this.users.find((u) => u.username === username);

  if (user) {
    console.log("bbb")
    // Filter available groups based on user's groupnames
    this.groups = this.groups.filter((group) => user.groupnames.includes(group.groupname));
  }
}

// Add this method to filter channels based on selected group
filterChannels(groupname: string): void {
  console.log("ccc")
  const selectedGroup = this.groups.find((group) => group.groupname === groupname);

  if (selectedGroup) {
    console.log("ddd")
    // Filter available channels based on the selected group
    this.channels = selectedGroup.channels;
  }
}

// Add this method to add a user to a channel within a group
addUserToChannel(username: any, groupname: any, channelname: any): void {
  console.log("eee")
  if (username && groupname && channelname) {
    // Prepare the request body
    const requestBody = {
      username: username,
      groupname: groupname,
      channelname: channelname
    };

    // Make a POST request to the backend API
    this.httpClient.post<any>(BACKEND_URL + 'addUserToChannel', requestBody, httpOptions).subscribe(
      (response) => {
        console.log("fff")
        if (response.success) {
          console.log("bbb")
          alert('User added to the channel successfully!');
        } else {
          console.log("ggg")
          alert('Failed to add user to the channel.');
        }
      },
      (error) => {
        console.log("hhh")
        console.error('Error adding user to channel:', error);
      }
    );
  } else {
    alert('Please select a user, a group, and a channel to add.');
  }
}

//delete group
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