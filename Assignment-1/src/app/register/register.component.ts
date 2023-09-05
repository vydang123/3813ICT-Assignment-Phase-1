import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  newUser = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private userService: UserService) { }

  ngOnInit() {}

  onSubmit() {
    this.userService.registerUser(this.newUser).subscribe(
      data => {
        // Handle response from server
        if(data && data.valid) {
          alert('Registration successful!');
        } else {
          alert('Registration failed.');
        }
      },
      error => {
        // Handle error from server
        alert('An error occurred during registration.');
      }
    );
  }
}
