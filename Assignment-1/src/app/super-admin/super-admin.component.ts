import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Make sure to import this in your module for two-way data binding
const BACKEND_URL = 'http://localhost:3000/'; // Replace with your backend URL
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {
  newUser = {
    username: '',
    email: '',
    password: ''
  };
  
  users: any[] = []; // Initialize the users list with data from users.json

  constructor(private userService: UserService, private httpClient: HttpClient) { }

  ngOnInit() {
    this.fetchUserGroups();
  }
  

  onSubmit() {
    this.userService.registerUser(this.newUser).subscribe(
      data => {
        // Handle response from server
        if(data && data.valid) {
          // Add the new user to the users array
          this.users.push({
            ...this.newUser,
            userid: this.users.length + 1, 
            role: 'user', 
            groups: 0
          });
          // Reset the newUser object
          this.newUser = {
            username: '',
            email: '',
            password: ''
          };
        } else {
          alert('Adding failed.');
        }
      },
      error => {
        // Handle error from server
        alert('An error occurred during the process.');
      }
    );
  }
  fetchUserGroups(): void {
    const requestPayload = { action: "listUser" };
    // Send request to /loginafter endpoint
    console.log("dsuds")
    this.httpClient.post<any>(BACKEND_URL + 'register', requestPayload, httpOptions).subscribe(
      (response: any) => {
        console.log(response.users); // if users is the array property in the response object
        this.users = response.users;
      },
      (error) => {
        console.error('Error fetching user groups:', error);
      }
    );
    
  }
  // Modify roles
  upgradeToSuperAdmin(user: any) {
    user.role = 'superadmin';
    // Make an API call if needed to save changes on the backend
  }

  upgradeToGroupAdmin(user: any) {
    user.role = 'groupadmin';
    // Make an API call if needed to save changes on the backend
  }

  degradeToUser(user: any) {
    user.role = 'user';
    // Make an API call if needed to save changes on the backend
  }

  deleteUser(user: any) {
    const index = this.users.indexOf(user);
    if (index > -1) {
      this.users.splice(index, 1);
      // Make an API call if needed to save changes on the backend
    }
  }
}

