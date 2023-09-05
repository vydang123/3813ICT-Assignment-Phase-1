import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html'
})
export class SuperAdminComponent implements OnInit {
  users: any[] = [];
  newUser = {
    username: '',
    password: '',
    roles: ''
  };

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  addUser() {
    this.newUser.roles = 'user';  // Set default role
    this.userService.registerUser(this.newUser).subscribe(data => {
      if (data.valid) {
        this.getUsers(); // Refresh the list
      } else {
        alert('Failed to add the user.');
      }
    });
  }

  updateUserRole(user: any, role: any): void  {
    user.roles = role;
    this.userService.updateUser(user).subscribe(data => {
      if (data.valid) {
        this.getUsers(); // Refresh the list
      } else {
        alert('Failed to update the user.');
      }
    });
  }

  deleteUser(user: any): void  {
    this.userService.deleteUser(user).subscribe(data => {
      if (data.valid) {
        this.getUsers(); // Refresh the list
      } else {
        alert('Failed to delete the user.');
      }
    });
  }
}
