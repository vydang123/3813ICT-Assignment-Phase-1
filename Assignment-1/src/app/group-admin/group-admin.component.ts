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
  selectedGroup: any; // Added this property
  users: any[] = [];
  groups: any[] = [];

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

}
