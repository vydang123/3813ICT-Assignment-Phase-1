import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any = {}; // Define the type of user object

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {

    if (!sessionStorage.getItem('isLoggedin')) {
      this.router.navigate(['/login']);
    }
    
    this.userProfile.username = sessionStorage.getItem("username");
    this.userProfile.userid = sessionStorage.getItem("userid");

  }
  saveChanges() {
    sessionStorage.setItem('username', this.userProfile.username);
    sessionStorage.setItem('userid', this.userProfile.userid)
  }
  
}

