import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Make sure to import this in your module for two-way data binding
import { Router } from '@angular/router';


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

  constructor(private userService: UserService, private httpClient: HttpClient, private router: Router) { }

  ngOnInit() {
    // const userRole = sessionStorage.getItem('role');
    // console.log('User Role:', userRole);
  
    // if (userRole !== 'superadmin') {
    //   alert('You don\'t have permission to access this page.');
    //   this.router.navigateByUrl('dashboard');
    // }
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
          alert('User added successfully.');
        } else {
          // Check if the backend provided a message and display it
          alert(data.message || 'Adding failed.');
        }
      },
      error => {
        // Handle error from server
        if (error.error && error.error.message) {
          alert(error.error.message); // Display the error message from the backend
        } else {
          alert('An unknown error occurred during the process.');
        }
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
  upgradeToSuperAdmin(user: any) {
    this.updateUserRole(user, 'superadmin');
}

upgradeToGroupAdmin(user: any) {
    this.updateUserRole(user, 'groupadmin');
}

degradeToUser(user: any) {
    this.updateUserRole(user, 'user');
}

private updateUserRole(user: any, newRole: string) {
    this.userService.updateUserRole(user.userid, newRole).subscribe(
        response => {
            console.log(response.message);
            // Update the role of the user locally
            user.role = newRole;
            console.log(user.role);
        },
        error => {
            console.error("Error updating user role:", error);
        }
    );
}

  deleteUser(user: any) {
    this.userService.deleteUser(user.userid).subscribe(
        response => {
            console.log(response.message);

            // Remove the user from the local users array
            const index = this.users.indexOf(user);
            if (index > -1) {
                this.users.splice(index, 1);
            }
        },
        error => {
            console.error("Error deleting user:", error);
        }
    );
}
}